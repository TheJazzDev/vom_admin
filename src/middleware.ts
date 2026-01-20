import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout"];

  // Allow API routes and public paths
  if (pathname.startsWith("/api") || publicPaths.includes(pathname)) {
    // For API routes other than auth, check session
    if (
      pathname.startsWith("/api") &&
      !pathname.startsWith("/api/auth") &&
      pathname !== "/api/init-collections" &&
      pathname !== "/api/notifications/debug" &&
      pathname !== "/api/notifications/check-receipts"
    ) {
      const session = request.cookies.get("session");
      if (!session) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        );
      }
    }
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get("session");

  // Redirect to login if no session
  if (!session && pathname !== "/login") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if already logged in and trying to access login
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
