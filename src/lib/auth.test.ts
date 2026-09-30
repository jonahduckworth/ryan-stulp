import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  createClient: vi.fn(),
  getUser: vi.fn(),
  signOut: vi.fn(),
  profile: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: (destination: string) => { throw new Error(`redirect:${destination}`); },
}));
vi.mock("@/lib/supabase/env", () => ({ hasPublicSupabaseEnv: mocks.configured }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mocks.createClient }));

import { verifyAdmin } from "./auth";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.configured.mockReturnValue(true);
  mocks.getUser.mockResolvedValue({ data: { user: { id: "synthetic-user", email: "admin@example.test" } } });
  mocks.createClient.mockResolvedValue({
    auth: { getUser: mocks.getUser, signOut: mocks.signOut },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.profile }) }) }),
  });
});

describe("admin authorization with isolated synthetic sessions", () => {
  it("requires setup before creating a service client", async () => {
    mocks.configured.mockReturnValue(false);
    await expect(verifyAdmin()).rejects.toThrow("redirect:/admin/login?setup=required");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("rejects an anonymous session before loading a profile", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    await expect(verifyAdmin()).rejects.toThrow("redirect:/admin/login");
    expect(mocks.profile).not.toHaveBeenCalled();
  });

  it.each([null, { role: "user", display_name: "Synthetic user" }])(
    "signs out a session without an administrator profile (%j)",
    async (profile) => {
      mocks.profile.mockResolvedValue({ data: profile });
      await expect(verifyAdmin()).rejects.toThrow("redirect:/admin/login?error=unauthorized");
      expect(mocks.signOut).toHaveBeenCalledOnce();
    },
  );

  it("accepts a verified administrator profile", async () => {
    mocks.profile.mockResolvedValue({ data: { role: "admin", display_name: "Synthetic admin" } });
    await expect(verifyAdmin()).resolves.toEqual({
      id: "synthetic-user", email: "admin@example.test", displayName: "Synthetic admin", role: "admin",
    });
    expect(mocks.signOut).not.toHaveBeenCalled();
  });
});
