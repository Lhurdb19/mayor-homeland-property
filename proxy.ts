import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/user/:path*"],
};

export default async function proxy(req: Request) {
  const url = new URL(req.url);

  // Fix TS errors by typing as 'any'
  const token = await getToken({
    req: {
      headers: Object.fromEntries(req.headers),
      cookies: req.headers.get("cookie") ?? "",
    } as any,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  // ADMIN ROUTES
  if (url.pathname.startsWith("/dashboard/admin")) {
    if (!token || token.role !== "admin") {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // USER ROUTES
  if (url.pathname.startsWith("/dashboard/user")) {
    if (!token || token.role !== "user") {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
