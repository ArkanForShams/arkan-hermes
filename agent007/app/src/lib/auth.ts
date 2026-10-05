// Agent 007 — auth: bcryptjs hashes + jose JWT httpOnly session (plan.md §2)
import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "agent007_session";
const SESSION_DAYS = 7;

function secretKey(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (>=32 chars)");
  return new TextEncoder().encode(s);
}

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  locale: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    sub: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    locale: user.locale,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Returns the session user, or null. Verifies JWT then re-checks user is active. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const user = await prisma.user.findUnique({
      where: { id: String(payload.sub) },
    });
    if (!user || !user.active) return null;
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      locale: user.locale,
    };
  } catch {
    return null;
  }
}

// ---- Server-side role guards (Constitution: enforced beyond UI hiding) ----
export class AuthError extends Error {}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new AuthError("UNAUTHENTICATED");
  return s;
}

export async function requireRole(...allowed: Role[]): Promise<SessionUser> {
  const s = await requireSession();
  if (!allowed.includes(s.role)) throw new AuthError("FORBIDDEN");
  return s;
}

export const requireAdmin = () => requireRole("ADMIN");
export const requireTeam = () => requireRole("ADMIN", "TEAM");
export const requireViewer = () => requireRole("ADMIN", "TEAM", "VIEWER");