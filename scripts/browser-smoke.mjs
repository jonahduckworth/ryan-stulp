import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createWriteStream, existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
assert.equal(process.versions.node.split(".")[0], "22", "Use scripts/cloud/run.sh with Node 22");
// Next loads these files independently of the child process environment.
for (const name of [".env", ".env.local", ".env.development", ".env.development.local"]) {
  assert(!existsSync(path.join(root, name)), `Use a credential-free checkout without ${name} for this smoke check`);
}
const output = path.join(root, "output", "browser-smoke");
await mkdir(output, { recursive: true });
const env = { ...process.env, NODE_ENV: "development", NEXT_TELEMETRY_DISABLED: "1" };
for (const name of Object.keys(env)) {
  if (/^(NEXT_PUBLIC_|SUPABASE_|RESEND_|TURNSTILE_|LEAD_|NEWSLETTER_|NEXT_SERVER_ACTIONS_)/.test(name)) delete env[name];
}
const origin = "http://127.0.0.1:3131";
const log = createWriteStream(path.join(output, "server.log"));
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3131"], {
  cwd: root, env, detached: true, stdio: ["ignore", "pipe", "pipe"],
});
let ready = false;
let serverError;
server.on("error", (error) => { serverError = error; });
server.stdout.on("data", (chunk) => { if (chunk.toString().includes("Ready in")) ready = true; });
server.stdout.pipe(log, { end: false });
server.stderr.pipe(log, { end: false });
let browser;
try {
  for (let attempt = 0; !ready && attempt < 120; attempt++) {
    if (serverError) throw serverError;
    assert(server.exitCode === null && server.signalCode === null, `Development server exited; see ${output}/server.log`);
    await delay(500);
  }
  assert(ready, `Development server did not become ready; see ${output}/server.log`);
  browser = await chromium.launch();
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const context = await browser.newContext({ viewport, recordVideo: { dir: output }, serviceWorkers: "block" });
    try {
      // Browser requests stay local; no external analytics, forms, or providers.
      await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const route of ["/", "/listings", "/market-updates", "/contact", "/admin"]) {
        const response = await page.goto(origin + route, { waitUntil: "networkidle", timeout: 90_000 });
        assert.equal(response.status(), 200, `${name} ${route}`);
        assert.equal(await page.locator("h1").count(), 1, `${name} ${route} heading`);
        if (route === "/admin") {
          assert.equal(new URL(page.url()).pathname, "/admin/login");
          assert((await page.locator("body").innerText()).includes("has not been connected yet"));
        }
        await page.screenshot({ path: path.join(output, `${name}-${route === "/" ? "home" : route.slice(1)}.png`), fullPage: true });
        console.log(`PASS ${name} ${route}: HTTP 200`);
      }
      assert.deepEqual(errors, [], `${name} browser errors`);
      const video = page.video();
      await context.close();
      await video.saveAs(path.join(output, `${name}.webm`));
      await video.delete();
      assert((await stat(path.join(output, `${name}.webm`))).size > 0);
      console.log(`PASS ${name}: screenshots and video saved`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser?.close();
  if (server.pid && server.exitCode === null && server.signalCode === null) {
    const exited = once(server, "exit");
    process.kill(-server.pid, "SIGTERM");
    await Promise.race([exited, delay(5000)]);
    if (server.exitCode === null && server.signalCode === null) process.kill(-server.pid, "SIGKILL");
  }
  log.end();
}
