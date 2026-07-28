import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GONE_PATHS = new Set([
  "/blog",
  "/cart",
  "/checkout",
  "/my-account",
  "/wishlist",
  "/author/a2beb",
  "/category/real-estate",
  "/category/mendetories",
  "/category/construction",
  "/category/business",
  "/category/mortgage-loan",
  "/tag/house",
  "/tag/luxury",
  "/tag/real-estate",
  "/tag/xstore",
  "/2021/05/30/skills-you-learn-in-real-estate-market",
  "/2021/06/08/sell-a-home-in-london",
  "/2021/06/08/new-yorks-real-estate",
  "/2021/06/08/skills-learn-in-real-estate",
  "/2021/06/08/learn-the-truth-real-estate",
  "/2021/06/08/10-quick-tips-about-business",
  "/2021/02/08/4-com-misconcept-business",
  "/2021/04/08/competitors-teach-real-estate",
  "/2021/05/12/why-we-love-real-estate",
]);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (GONE_PATHS.has(pathname)) {
    return new NextResponse(
      "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><title>Content removed</title><body><main><h1>This content has been removed.</h1><p>The old page was unrelated or obsolete and has no direct replacement.</p><p><a href=\"/\">Visit the Ryan Stulp website</a></p></main></body></html>",
      {
        status: 410,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=3600",
          "x-robots-tag": "noindex, nofollow",
        },
      },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const isPasswordSetup =
    request.nextUrl.pathname === "/admin/set-password";

  if (isAdminRoute && !isLogin && !isPasswordSetup && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/blog",
    "/cart",
    "/checkout",
    "/my-account",
    "/wishlist",
    "/author/:path*",
    "/category/:path*",
    "/tag/:path*",
    "/2021/:path*",
  ],
};
