import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "discovery", "source-assets");
const outputRoot = path.join(projectRoot, "public", "brand");

const BLACK = [7, 10, 11];
const PANEL_BLACK = [4, 7, 7];
const RED = [207, 32, 58];
const WHITE = [255, 255, 255];

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function visibleBounds(data, width, height, alphaThreshold = 4) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha <= alphaThreshold) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right < left || bottom < top) {
    throw new Error("The processed asset contains no visible pixels.");
  }

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function writeTrimmed(data, width, height, outputName, padding = 36) {
  const input = sharp(data, {
    raw: { width, height, channels: 4 },
  });
  const bounds = visibleBounds(data, width, height);

  await input
    .extract(bounds)
    .extend({
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputRoot, outputName));
}

function matteToTransparent(data, background, foregroundPalette) {
  const output = Buffer.alloc(data.length);
  const backgroundVector = background.map(Number);

  for (let offset = 0; offset < data.length; offset += 4) {
    const colour = [data[offset], data[offset + 1], data[offset + 2]];
    let best = null;

    for (const foreground of foregroundPalette) {
      const direction = foreground.map(
        (channel, index) => channel - backgroundVector[index],
      );
      const relative = colour.map(
        (channel, index) => channel - backgroundVector[index],
      );
      const denominator = direction.reduce(
        (sum, channel) => sum + channel * channel,
        0,
      );
      const alpha = clamp(
        relative.reduce(
          (sum, channel, index) => sum + channel * direction[index],
          0,
        ) / denominator,
        0,
        1,
      );
      const error = colour.reduce((sum, channel, index) => {
        const reconstructed =
          backgroundVector[index] + alpha * direction[index];
        return sum + (channel - reconstructed) ** 2;
      }, 0);

      if (!best || error < best.error) {
        best = { foreground, alpha, error };
      }
    }

    const alphaByte = Math.round(best.alpha * 255);
    output[offset] = best.foreground[0];
    output[offset + 1] = best.foreground[1];
    output[offset + 2] = best.foreground[2];
    output[offset + 3] = alphaByte <= 2 ? 0 : alphaByte;
  }

  return output;
}

async function extractTransparentVariant({
  source,
  region,
  background,
  foregroundPalette,
  outputName,
  padding,
}) {
  const { data, info } = await sharp(source)
    .extract(region)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const processed = matteToTransparent(
    data,
    background,
    foregroundPalette,
  );
  await writeTrimmed(
    processed,
    info.width,
    info.height,
    outputName,
    padding,
  );
}

function distanceFromBackground(data, offset, background) {
  return Math.hypot(
    data[offset] - background[0],
    data[offset + 1] - background[1],
    data[offset + 2] - background[2],
  );
}

function removeEdgeConnectedBackground(data, width, height, background) {
  const output = Buffer.from(data);
  const visited = new Uint8Array(width * height);
  const queue = [];
  const reachThreshold = 245;

  function enqueue(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const offset = pixel * 4;
    if (distanceFromBackground(data, offset, background) > reachThreshold) {
      return;
    }
    visited[pixel] = 1;
    queue.push(pixel);
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const pixel = queue[cursor];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  for (let pixel = 0; pixel < visited.length; pixel += 1) {
    if (!visited[pixel]) continue;
    const offset = pixel * 4;
    const distance = distanceFromBackground(data, offset, background);
    output[offset + 3] = Math.round(
      255 * clamp(distance / reachThreshold, 0, 1),
    );
  }

  return output;
}

async function extractIcon({ source, region, outputName }) {
  const { data, info } = await sharp(source)
    .extract(region)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const processed = removeEdgeConnectedBackground(
    data,
    info.width,
    info.height,
    WHITE,
  );
  await writeTrimmed(processed, info.width, info.height, outputName, 24);
}

async function copyOptimized(source, outputName) {
  await sharp(source)
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputRoot, outputName));
}

await mkdir(outputRoot, { recursive: true });

const horizontalSheet = path.join(sourceRoot, "Extra Logo.png");
const logoSheet = path.join(sourceRoot, "Logo.png");

const variants = [
  {
    source: horizontalSheet,
    region: { left: 410, top: 460, width: 2790, height: 500 },
    background: WHITE,
    foregroundPalette: [BLACK, RED],
    outputName: "ryan-stulp-horizontal-color.png",
  },
  {
    source: horizontalSheet,
    region: { left: 410, top: 1908, width: 2790, height: 500 },
    background: BLACK,
    foregroundPalette: [WHITE, RED],
    outputName: "ryan-stulp-horizontal-light.png",
  },
  {
    source: horizontalSheet,
    region: { left: 410, top: 3196, width: 2790, height: 500 },
    background: RED,
    foregroundPalette: [WHITE],
    outputName: "ryan-stulp-horizontal-white.png",
  },
  {
    source: logoSheet,
    region: { left: 630, top: 220, width: 1260, height: 840 },
    background: WHITE,
    foregroundPalette: [BLACK, RED],
    outputName: "ryan-stulp-stacked-color.png",
  },
  {
    source: logoSheet,
    region: { left: 140, top: 1378, width: 940, height: 650 },
    background: PANEL_BLACK,
    foregroundPalette: [WHITE, RED],
    outputName: "ryan-stulp-stacked-light.png",
  },
  {
    source: logoSheet,
    region: { left: 1411, top: 1378, width: 940, height: 650 },
    background: RED,
    foregroundPalette: [WHITE],
    outputName: "ryan-stulp-stacked-white.png",
  },
  {
    source: logoSheet,
    region: { left: 200, top: 2990, width: 930, height: 195 },
    background: WHITE,
    foregroundPalette: [BLACK, RED],
    outputName: "ryan-stulp-wordmark-color.png",
    padding: 20,
  },
  {
    source: logoSheet,
    region: { left: 1315, top: 2990, width: 930, height: 195 },
    background: WHITE,
    foregroundPalette: [RED],
    outputName: "ryan-stulp-wordmark-red.png",
    padding: 20,
  },
];

for (const variant of variants) {
  await extractTransparentVariant(variant);
}

const icons = [
  {
    region: { left: 230, top: 2436, width: 430, height: 430 },
    outputName: "ryan-stulp-icon-black-circle.png",
  },
  {
    region: { left: 692, top: 2436, width: 430, height: 430 },
    outputName: "ryan-stulp-icon-red-circle.png",
  },
  {
    region: { left: 1335, top: 2436, width: 430, height: 430 },
    outputName: "ryan-stulp-icon-black-square.png",
  },
  {
    region: { left: 1794, top: 2436, width: 430, height: 430 },
    outputName: "ryan-stulp-icon-red-square.png",
  },
];

for (const icon of icons) {
  await extractIcon({ source: logoSheet, ...icon });
}

await copyOptimized(
  path.join(sourceRoot, "brokerage-logo-lrg-horizontal.png"),
  "real-estate-district-horizontal.png",
);
await copyOptimized(
  path.join(sourceRoot, "brokerage-logo-lrg-vertical.png"),
  "real-estate-district-vertical.png",
);
await copyOptimized(
  path.join(sourceRoot, "brokerage-logo-lrg-ex-horizontal.png"),
  "real-estate-district-extended-horizontal.png",
);

await copyOptimized(
  path.join(outputRoot, "ryan-stulp-horizontal-color.png"),
  "ryan-stulp-logo.png",
);

console.log("Processed Ryan Stulp brand assets into public/brand/.");
