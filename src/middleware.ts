import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROUTES } from "./constants/routes";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-change-me"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // 1. Protected Routes (/dashboard/*)
  if (pathname.startsWith(ROUTES.DASHBOARD.HOME)) {
    if (!token) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    try {
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware: Invalid token", error);
      // Clear invalid token
      const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // 2. Auth Routes (/login) - redirect to dashboard if already authenticated
  if (pathname === ROUTES.LOGIN) {
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD.HOME, request.url));
      } catch {
        // Invalid token, allow access to login page
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
