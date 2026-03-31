export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Protect everything except login page, NextAuth API routes, static assets, and home
    "/((?!$|login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
