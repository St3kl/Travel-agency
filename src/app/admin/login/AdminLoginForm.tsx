"use client";

import { useActionState } from "react";

import { loginAdminAction } from "@/app/admin/login/actions";
import { initialAdminLoginFormState } from "@/app/admin/login/form-state";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAdminAction,
    initialAdminLoginFormState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-navy"
        >
          Admin email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-2xl border border-navy/10 px-4 py-3 text-navy outline-none transition focus:border-gold"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-navy"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-navy/10 px-4 py-3 text-navy outline-none transition focus:border-gold"
        />
      </div>

      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Enter admin"}
      </button>
    </form>
  );
}
