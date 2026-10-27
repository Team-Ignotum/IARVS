"use client";

import { useState, type FormEvent } from "react";

const MIN_PASSWORD = 12;

export default function AcceptInviteForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD) return setError(`Use at least ${MIN_PASSWORD} characters.`);
    if (password !== confirm) return setError("Passwords do not match.");
    setError("");
    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setDone(true);
      else setError(data.error ?? "This invite is invalid or has expired. Ask an admin to resend it.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
  }

  if (done) {
    return (
      <div className="mx-auto min-w-0 w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p role="status" className="text-emerald-800">Password set. Your account is active.</p>
        <a href="/login" className="mt-4 inline-block text-[#183b68] underline">Log in</a>
      </div>
    );
  }

  const input = "mt-1.5 block h-11 w-full rounded-md border border-slate-400 bg-white px-3 text-base text-slate-900";
  return (
    <form onSubmit={handleSubmit} className="mx-auto flex min-w-0 w-full max-w-xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-950">Set your password</h1>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <label className="text-[15px] font-medium text-slate-900">
        New password ({MIN_PASSWORD}+ characters)
        <input type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      </label>
      <label className="text-[15px] font-medium text-slate-900">
        Confirm password
        <input type="password" className={input} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      </label>
      <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-[#183b68] px-3.5 font-sans text-sm font-medium text-white transition-colors hover:bg-[#102d52]">
        Activate account
      </button>
    </form>
  );
}
