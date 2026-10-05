"use server";
// Agent 007 — ingestion & drafts server actions (Constitution III: review gates everywhere)
import { revalidatePath } from "next/cache";
import { requireTeam, AuthError, requireViewer } from "@/lib/auth";
import { pollInbox, convertToIssue, markNotIssue } from "@/lib/services/ingest";
import {
  generateVendorDraft,
  generateFollowUpDraft,
  handOffToOutlook,
  markManuallySent,
  editDraft,
} from "@/lib/services/drafts";
import { runDailyTick } from "@/lib/services/followups";
import { getLocale } from "@/lib/labels";

export interface ActionResult {
  ok?: boolean;
  error?: string;
  data?: unknown;
}

export async function pollInboxAction(): Promise<ActionResult> {
  try {
    await requireTeam();
    const r = await pollInbox();
    revalidatePath("/triage");
    return { ok: true, data: r };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function convertIssueAction(
  emailId: string,
  projectId: string,
  titleEn: string,
  priority: string,
  applicationId: string | null
): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const issue = await convertToIssue(user.id, emailId, {
      projectId,
      titleEn,
      titleAr: titleEn, // bilingual refinement happens on issue panel
      priority: (["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(priority) ? priority : "MEDIUM") as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      applicationId,
    });
    revalidatePath("/triage");
    revalidatePath("/projects");
    return { ok: true, data: { code: issue.code, id: issue.id } };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function markNotIssueAction(emailId: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    await markNotIssue(user.id, emailId);
    revalidatePath("/triage");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function generateDraftAction(issueId: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const locale = await getLocale();
    const draft = await generateVendorDraft(user, issueId, locale);
    revalidatePath("/projects/[key]", "page");
    return { ok: true, data: { id: draft.id, subject: draft.subject, body: draft.body } };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (String(e).includes("NO_VENDOR_MAPPING")) return { error: "draft.noMapping" };
    return { error: "err.generic" };
  }
}

export async function generateFollowUpDraftAction(issueId: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const locale = await getLocale();
    const draft = await generateFollowUpDraft(user, issueId, locale);
    return { ok: true, data: { id: draft.id, subject: draft.subject, body: draft.body } };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function handoffAction(draftId: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const r = await handOffToOutlook(user, draftId);
    return { ok: true, data: r };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function editDraftAction(draftId: string, subject: string, body: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    await editDraft(user, draftId, subject, body);
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function markSentAction(followUpId: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    await markManuallySent(user, followUpId);
    revalidatePath("/followups");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function runTickAction(): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const locale = await getLocale();
    const r = await runDailyTick(user.id, locale);
    revalidatePath("/followups");
    return { ok: true, data: r };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function viewerGuardAction(): Promise<ActionResult> {
  await requireViewer();
  return { ok: true };
}