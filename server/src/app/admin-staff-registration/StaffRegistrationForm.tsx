"use client";

import { useState, type FormEvent } from "react";

type Role = "STAFF" | "SUPER_STAFF";

type FormValues = {
  fullName: string;
  email: string;
  role: Role;
};

const INITIAL_FORM: FormValues = {
  fullName: "",
  email: "",
  role: "STAFF",
};

export default function StaffRegistrationForm() {
  const [form, setForm] = useState<FormValues>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const fullName = form.fullName.trim();
    const email = form.email.trim();

    if (fullName.length < 2) {
      setError("Enter the staff member’s full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid work email.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fullName, email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not send the invite. Try again.");
        return;
      }

      setSentTo(email);
      setForm(INITIAL_FORM);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sentTo) {
    return (
      <div className="max-w-md space-y-4">
        <p role="status">Invite sent to {sentTo}.</p>
        <button
          type="button"
          onClick={() => setSentTo("")}
          className="rounded bg-slate-900 px-4 py-2 text-white"
        >
          Add another staff member
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Register staff</h1>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="block">
        <span>Full name</span>
        <input
          className="mt-1 block w-full rounded border p-2"
          value={form.fullName}
          onChange={(event) =>
            setForm({ ...form, fullName: event.target.value })
          }
          maxLength={100}
          required
        />
      </label>

      <label className="block">
        <span>Work email</span>
        <input
          className="mt-1 block w-full rounded border p-2"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      </label>

      <label className="block">
        <span>Role</span>
        <select
          className="mt-1 block w-full rounded border p-2"
          value={form.role}
          onChange={(event) =>
            setForm({ ...form, role: event.target.value as Role })
          }
        >
          <option value="STAFF">Staff</option>
          <option value="SUPER_STAFF">Super staff</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={busy}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? "Sending…" : "Send invite"}
      </button>
    </form>
  );
}
