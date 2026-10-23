"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Matches the mock preview: one form, inline field errors, then an "Invite sent" screen.

type Role = "STUDENT" | "ADMIN" | "STAFF" | "SUPER_STAFF";
type Values = { fullName: string; email: string; role: Role };
type Errors = Partial<Record<keyof Values | "form", string>>;

const ROLES: { value: Role; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "SUPER_STAFF", label: "Super staff" },
];
const EMPTY: Values = { fullName: "", email: "", role: "STAFF" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_HOURS = 48;

function validate(v: Values): Errors {
  const e: Errors = {};
  const normalizedName = v.fullName.trim().replace(/\s+/g, " ");
  const normalizedEmail = v.email.trim().toLowerCase();

  if (normalizedName.length < 2) e.fullName = "Enter the full name.";
  else if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(normalizedName)) {
    e.fullName = "Use letters, spaces, apostrophes, periods, or hyphens only.";
  }
  if (normalizedEmail.length > 254 || !EMAIL.test(normalizedEmail)) {
    e.email = "Enter a valid work email.";
  }
  return e;
}

const inputClass = (invalid: boolean) =>
  `mt-1.5 block h-11 w-full rounded-md bg-white px-3 text-base text-slate-900 ${
    invalid ? "border-2 border-red-700" : "border border-slate-400"
  }`;

export default function StaffRegistrationForm() {
  const [form, setForm] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sanitizedForm: Values = {
      ...form,
      fullName: form.fullName.trim().replace(/\s+/g, " "),
      email: form.email.trim().toLowerCase(),
    };
    const found = validate(sanitizedForm);
    setErrors(found);
    if (Object.keys(found).length) return;

    setForm(sanitizedForm);
    setSentTo(sanitizedForm.email);
  }

  if (sentTo) {
    return (
      <>
        <div className="flex min-w-0 w-full max-w-xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p role="status" className="break-words text-base text-emerald-800">
            Invite sent to {sentTo}. It expires in {INVITE_HOURS} hours.
          </p>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3.5 font-sans text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Add another staff member
          </button>
        </div>
        <Link
          href="/admin-staff-registration/accept-invite"
          className="mt-4 inline-flex h-10 items-center justify-center self-start rounded-md bg-[#183b68] px-3.5 font-sans text-sm font-medium text-white transition-colors hover:bg-[#102d52]"
        >
          Set password
        </Link>
      </>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex min-w-0 w-full max-w-xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {errors.form && (
        <p role="alert" className="text-sm text-red-700">{errors.form}</p>
      )}

      <label className="text-[15px] font-medium text-slate-900">
        Full name
        <input
          className={inputClass(!!errors.fullName)}
          value={form.fullName}
      onChange={(e) => {
        setForm({ ...form, fullName: e.target.value.slice(0, 100) });
        setErrors({ ...errors, fullName: undefined, form: undefined });
      }}
          maxLength={100}
          aria-invalid={!!errors.fullName}
          aria-describedby="err-name"
        />
        {errors.fullName && <span id="err-name" className="mt-1.5 block text-sm font-normal text-red-700">{errors.fullName}</span>}
      </label>

      <label className="text-[15px] font-medium text-slate-900">
        Work email
        <input
          type="email"
          className={inputClass(!!errors.email)}
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value.slice(0, 254) });
            setErrors({ ...errors, email: undefined, form: undefined });
          }}
          aria-invalid={!!errors.email}
          aria-describedby="err-email"
        />
        {errors.email && <span id="err-email" className="mt-1.5 block text-sm font-normal text-red-700">{errors.email}</span>}
      </label>

      <label className="text-[15px] font-medium text-slate-900">
        Role
        <Select
          value={form.role}
          onValueChange={(role) => {
            if (ROLES.some((option) => option.value === role)) {
              setForm({ ...form, role: role as Role });
            }
          }}
        >
          <SelectTrigger className="mt-1.5 h-11 w-full rounded-md border-slate-400 bg-white px-3 text-base text-slate-900 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            sideOffset={4}
            className="min-w-[var(--radix-select-trigger-width)] p-1 [&_[data-position=popper]]:h-auto"
          >
            {ROLES.map((r) => (
              <SelectItem
                key={r.value}
                value={r.value}
                className="px-2 py-2 text-base focus:bg-slate-100 focus:text-slate-900"
              >
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-10 items-center justify-center rounded-md bg-[#183b68] px-3.5 font-sans text-sm font-medium text-white transition-colors hover:bg-[#102d52] disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send invite"}
      </button>
    </form>
  );
}