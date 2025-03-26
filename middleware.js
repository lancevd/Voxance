// middleware.js
import { NextResponse } from "next/server";

function isAuthenticated(request) {
  const token = request.cookies.get("token");
  return !!token;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If user is trying to access login or register and is already authenticated, redirect them away
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
    isAuthenticated(request)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is trying to access protected routes and is not authenticated, redirect to login
  if (pathname.startsWith("/dashboard") && !isAuthenticated(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Protect all /dashboard routes
    "/login",
    "/register",
  ],
};
