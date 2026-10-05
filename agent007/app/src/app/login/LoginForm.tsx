"use client";
// Login form — bilingual, corporate-polished
import { useActionState } from "react";
import { signInAction } from "@/app/actions/auth";

export default function LoginForm({ labels }: { labels: Record<string, string> }) {
  const [state, action, pending] = useActionState(signInAction, undefined);
  const err = state?.error ? labels[state.error] ?? labels["auth.error"] : null;

  return (
    <form action={action} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1 text-ink-soft">
          {labels["auth.username"]}
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="focus-ring w-full rounded-lg border border-line bg-white px-3 py-2.5 text-ink"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1 text-ink-soft">
          {labels["auth.password"]}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="focus-ring w-full rounded-lg border border-line bg-white px-3 py-2.5 text-ink"
        />
      </div>
      {err && (
        <p role="alert" className="text-sm text-[var(--crimson)] bg-[var(--crimson)]/10 rounded-lg px-3 py-2">
          {err}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary focus-ring w-full py-2.5 font-medium disabled:opacity-60"
      >
        {pending ? labels["common.loading"] : labels["auth.submit"]}
      </button>
    </form>
  );
}