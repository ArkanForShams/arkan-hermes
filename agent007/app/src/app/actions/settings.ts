"use server";
// Agent 007 — meetings & settings server actions
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireTeam, requireAdmin, AuthError } from "@/lib/auth";
import {
  createMeeting,
  summarizeMeeting,
  actionToIssue,
} from "@/lib/services/meetings";
import {
  upsertVendor,
  upsertApplication,
  importMappingCsv,
  createUser,
  setUserActive,
} from "@/lib/services/vendors";

export interface ActionResult {
  ok?: boolean;
  error?: string;
  data?: unknown;
}

const meetingSchema = z.object({
  title: z.string().min(2).max(120),
  type: z.enum(["STANDUP", "VENDOR", "ADHOC"]),
  projectId: z.string().optional(),
  rawNotes: z.string().max(50_000).optional(),
  heldOn: z.string().optional(),
});

export async function createMeetingAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const parsed = meetingSchema.parse({
      title: String(formData.get("title") ?? "").trim(),
      type: String(formData.get("type") ?? "STANDUP"),
      projectId: String(formData.get("projectId") ?? "") || undefined,
      rawNotes: String(formData.get("rawNotes") ?? "") || undefined,
    });
    const m = await createMeeting(user, {
      ...parsed,
      projectId: parsed.projectId || null,
      heldOn: new Date(),
    });
    revalidatePath("/meetings");
    return { ok: true, data: { id: m.id } };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (e instanceof z.ZodError) return { error: "err.required" };
    return { error: "err.generic" };
  }
}

export async function summarizeMeetingAction(meetingId: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const m = await summarizeMeeting(user, meetingId);
    revalidatePath("/meetings");
    return { ok: true, data: { id: m.id } };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (String(e).includes("NO_NOTES")) return { error: "meet.noNotes" };
    return { error: "err.generic" };
  }
}

export async function actionToIssueAction(
  meetingId: string,
  actionText: string,
  projectId: string
): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const issue = await actionToIssue(user, meetingId, actionText, projectId);
    revalidatePath("/meetings");
    return { ok: true, data: { code: issue.code } };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

// ---- Settings (admin) ----
const vendorSchema = z.object({
  name: z.string().min(1).max(80),
  supportEmail: z.string().max(120).optional(),
  escalationEmail: z.string().max(120).optional(),
  notesEn: z.string().max(500).optional(),
});

export async function saveVendorAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = vendorSchema.parse({
      name: String(formData.get("name") ?? "").trim(),
      supportEmail: String(formData.get("supportEmail") ?? "").trim() || undefined,
      escalationEmail: String(formData.get("escalationEmail") ?? "").trim() || undefined,
      notesEn: String(formData.get("notesEn") ?? "").trim() || undefined,
    });
    await upsertVendor(admin, parsed);
    revalidatePath("/settings");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (e instanceof z.ZodError) return { error: "err.required" };
    return { error: "err.generic" };
  }
}

export async function importCsvAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const csv = String(formData.get("csv") ?? "");
    const r = await importMappingCsv(admin, csv);
    revalidatePath("/settings");
    return { ok: true, data: r };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function saveApplicationAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = z
      .object({
        name: z.string().min(1).max(80),
        vendorId: z.string().min(1),
        contextEn: z.string().max(2000).optional(),
      })
      .parse({
        name: String(formData.get("name") ?? "").trim(),
        vendorId: String(formData.get("vendorId") ?? ""),
        contextEn: String(formData.get("contextEn") ?? "").trim() || undefined,
      });
    await upsertApplication(admin, parsed);
    revalidatePath("/settings");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (e instanceof z.ZodError) return { error: "err.required" };
    return { error: "err.generic" };
  }
}

export async function createUserAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = z
      .object({
        username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9._-]+$/),
        displayName: z.string().min(2).max(80),
        role: z.enum(["ADMIN", "TEAM", "VIEWER"]),
        tempPassword: z.string().min(10).max(64),
      })
      .parse({
        username: String(formData.get("username") ?? "").trim(),
        displayName: String(formData.get("displayName") ?? "").trim(),
        role: String(formData.get("role") ?? "TEAM"),
        tempPassword: String(formData.get("tempPassword") ?? ""),
      });
    await createUser(admin, parsed);
    revalidatePath("/settings");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (e instanceof z.ZodError) return { error: "err.required" };
    if (String(e).includes("Unique")) return { error: "set.userExists" };
    return { error: "err.generic" };
  }
}

export async function setUserActiveAction(userId: string, active: boolean): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    await setUserActive(admin, userId, active);
    revalidatePath("/settings");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}