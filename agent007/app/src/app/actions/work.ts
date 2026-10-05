"use server";
// Agent 007 — project & issue server actions (role-checked, zod-validated, audited)
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireTeam, AuthError } from "@/lib/auth";
import {
  createIssue,
  changeStage,
  updateIssueFields,
  addComment,
} from "@/lib/services/issues";
import type { IssueStage, Priority } from "@prisma/client";

export interface ActionResult {
  ok?: boolean;
  error?: string;
}

const STAGES = ["NEW", "ANALYZING", "WITH_VENDOR", "FOLLOW_UP", "RESOLVED", "CLOSED"] as const;
const PRIOS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const projectSchema = z.object({
  key: z.string().min(2).max(10).regex(/^[A-Z]+$/, "uppercase letters only"),
  nameEn: z.string().min(2).max(80),
  nameAr: z.string().max(80).optional(),
  descEn: z.string().max(280).optional(),
});

export async function createProjectAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const parsed = projectSchema.parse({
      key: String(formData.get("key") ?? "").toUpperCase().trim(),
      nameEn: String(formData.get("nameEn") ?? "").trim(),
      nameAr: String(formData.get("nameAr") ?? "").trim() || undefined,
      descEn: String(formData.get("descEn") ?? "").trim() || undefined,
    });
    await prismaCreateProject(user.id, parsed);
    revalidatePath("/projects");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    if (e instanceof z.ZodError) return { error: "err.required" };
    if (String(e).includes("Unique")) return { error: "projects.keyExists" };
    return { error: "err.generic" };
  }
}

async function prismaCreateProject(
  userId: string,
  data: { key: string; nameEn: string; nameAr?: string; descEn?: string }
) {
  const { prisma } = await import("@/lib/prisma");
  const { audit } = await import("@/lib/audit");
  const project = await prisma.project.create({
    data: {
      key: data.key,
      nameEn: data.nameEn,
      nameAr: data.nameAr ?? data.nameEn,
      descEn: data.descEn ?? null,
      members: { create: { userId, role: "ADMIN" } },
    },
  });
  await audit({ id: userId } as never, "project.create", `project:${project.id}`, data.key);
  return project;
}

const quickIssueSchema = z.object({
  projectId: z.string().min(1),
  titleEn: z.string().min(3).max(160),
  priority: z.enum(PRIOS).default("MEDIUM"),
});

export async function quickAddIssueAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    const parsed = quickIssueSchema.parse({
      projectId: String(formData.get("projectId") ?? ""),
      titleEn: String(formData.get("titleEn") ?? "").trim(),
      priority: String(formData.get("priority") ?? "MEDIUM"),
    });
    const issue = await createIssue(user, {
      projectId: parsed.projectId,
      titleEn: parsed.titleEn,
      priority: parsed.priority as Priority,
    });
    revalidatePath("/projects");
    revalidatePath(`/projects/[key]`, "page");
    return { ok: true, ...({ code: issue.code } as object) };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function moveStageAction(issueId: string, stage: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    if (!STAGES.includes(stage as (typeof STAGES)[number])) return { error: "err.generic" };
    await changeStage(user, issueId, stage as IssueStage);
    revalidatePath("/projects/[key]", "page");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function updateIssueAction(
  issueId: string,
  data: {
    titleEn?: string; titleAr?: string | null; descEn?: string | null;
    priority?: Priority; assigneeId?: string | null; applicationId?: string | null;
    dueDate?: string | null;
  }
): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    await updateIssueFields(user, issueId, {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
    revalidatePath("/projects/[key]", "page");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}

export async function addCommentAction(issueId: string, text: string): Promise<ActionResult> {
  try {
    const user = await requireTeam();
    if (!text.trim()) return { error: "err.required" };
    await addComment(user, issueId, text.trim());
    revalidatePath("/projects/[key]", "page");
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: "err.forbidden" };
    return { error: "err.generic" };
  }
}