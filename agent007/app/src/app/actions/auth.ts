"use server";
// Agent 007 — auth server actions
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createSession,
  destroySession,
  getSession,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { isLocale } from "@/lib/i18n";

const creds = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

export async function signInAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = creds.safeParse({
    username: String(formData.get("username") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: "auth.error" };

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (!user) {
    await audit(null, "login.fail", `username:${parsed.data.username}`);
    return { error: "auth.error" };
  }
  if (!user.active) return { error: "auth.inactive" };

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    await audit(null, "login.fail", `username:${user.username}`);
    return { error: "auth.error" };
  }

  await createSession({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    locale: user.locale,
  });
  await audit({ id: user.id }, "login.success", `user:${user.id}`);
  redirect("/projects");
}

export async function signOutAction(): Promise<void> {
  const s = await getSession();
  if (s) await audit(s, "logout", `user:${s.id}`);
  await destroySession();
  redirect("/login");
}

export async function setLocaleAction(locale: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const { revalidatePath } = await import("next/cache");
  if (!isLocale(locale)) return;
  const store = await cookies();
  store.set("locale", locale, { path: "/", maxAge: 365 * 24 * 3600 });
  const s = await getSession();
  if (s) {
    await prisma.user.update({ where: { id: s.id }, data: { locale } });
  }
  // Re-render the whole authenticated tree so <html dir/lang> and all labels flip
  revalidatePath("/", "layout");
}