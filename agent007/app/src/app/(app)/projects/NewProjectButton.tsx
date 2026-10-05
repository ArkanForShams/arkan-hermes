"use client";
import { useActionState, useState } from "react";
import { createProjectAction } from "@/app/actions/work";

type ActionState = { ok?: boolean; error?: string } | undefined;

export default function NewProjectButton({ labels }: { labels: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createProjectAction as (prev: ActionState, fd: FormData) => Promise<ActionState>,
    undefined
  );

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary focus-ring px-4 py-2 text-sm font-medium">
        + {labels["projects.new"]}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/30 p-4" onClick={() => setOpen(false)}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-ink">{labels["projects.new"]}</h2>
        <form action={action} className="space-y-3">
          <input name="key" required placeholder={labels["projects.key"]} className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm uppercase" />
          <input name="nameEn" required placeholder={labels["projects.nameEn"]} className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <input name="nameAr" placeholder={labels["projects.nameAr"]} dir="rtl" className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <input name="descEn" placeholder={labels["projects.descEn"]} className="focus-ring w-full rounded-lg border border-line px-3 py-2 text-sm" />
          {state?.error && (
            <p className="text-sm text-[var(--crimson)]">{labels[state.error] ?? labels["err.generic"]}</p>
          )}
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={pending} className="btn-primary focus-ring flex-1 py-2 text-sm font-medium disabled:opacity-60">
              {labels["common.create"]}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost focus-ring px-4 py-2 text-sm">
              {labels["common.cancel"]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}