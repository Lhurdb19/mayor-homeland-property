import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/user/:path*"],
};

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // ADMIN PROTECTED ROUTES
  if (pathname.startsWith("/dashboard/admin")) {
    if (!token || token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // USER PROTECTED ROUTES
  if (pathname.startsWith("/dashboard/user")) {
    if (!token || token.role !== "user") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
