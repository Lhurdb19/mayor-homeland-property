import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  // Admin routes
  if (url.pathname.startsWith("/dashboard/admin")) {
    if (!token || token.role !== "admin") {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // User routes
  if (url.pathname.startsWith("/dashboard/user")) {
    if (!token || token.role !== "user") {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/user/:path*"],
};
