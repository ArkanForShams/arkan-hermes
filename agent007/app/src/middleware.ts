// Agent 007 — edge middleware: session gate (jose JWT verify, edge-safe)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "agent007_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  let authed = false;
  if (token && (process.env.SESSION_SECRET ?? "").length >= 32) {
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.SESSION_SECRET!)
      );
      authed = true;
    } catch {
      authed = false;
    }
  }

  if (pathname === "/login") {
    if (authed) return NextResponse.redirect(new URL("/projects", req.url));
    return NextResponse.next();
  }

  if (!authed) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};