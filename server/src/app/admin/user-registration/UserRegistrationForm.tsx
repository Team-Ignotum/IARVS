"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONAL_CENTRES, STUDY_CENTRES } from "@/lib/centres";
import { ChevronDown, X } from "lucide-react";

type Role = "STUDENT" | "ADMIN" | "STAFF" | "SUPER_STAFF";
type Values = {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  center: string;
  regNumber: string;
  stNumber: string;
  intake: string;
};
type Errors = Partial<Record<keyof Values | "form", string>>;

const ROLES: { value: Role; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "SUPER_STAFF", label: "Super staff" },
];

const EMPTY: Values = {
  userId: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "STAFF",
  center: "",
  regNumber: "",
  stNumber: "",
  intake: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = (invalid: boolean) =>
  `mt-1.5 block h-10 w-full rounded-lg bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#183b68] focus:bg-white focus:ring-2 focus:ring-[#183b68]/10 ${
    invalid ? "border-2 border-red-700" : "border border-slate-200"
  }`;
const selectTriggerClass = (invalid: boolean) =>
  `mt-1.5 h-10 !w-full rounded-lg bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#183b68] focus:bg-white focus:ring-2 focus:ring-[#183b68]/10 ${
    invalid ? "border-2 border-red-700" : "border border-slate-200"
  }`;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.userId.trim()) errors.userId = "User ID is required.";
  if (!EMAIL.test(values.email.trim().toLowerCase())) {
    errors.email = "Enter a valid work email.";
  }
  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";
  if (!values.center.trim()) errors.center = "Center is required.";
  if (values.regNumber && !/^\d{9}$/.test(values.regNumber)) {
    errors.regNumber = "Registration number must be exactly 9 digits.";
  }
  if (values.stNumber && values.stNumber.trim().length < 9) {
    errors.stNumber = "Student number must be at least 9 characters.";
  }
  if (
    values.intake &&
    !/^(?:\d{2}[/-]\d{2}|\d{4}-\d{4})$/.test(values.intake)
  ) {
    errors.intake = "Use 21/22, 21-22, or 2021-2022.";
  }

  return errors;
}

export default function UserRegistrationForm() {
  const [form, setForm] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [centreMenuOpen, setCentreMenuOpen] = useState(false);
  const centrePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeCentreMenu(event: PointerEvent) {
      if (
        centrePickerRef.current &&
        !centrePickerRef.current.contains(event.target as Node)
      ) {
        setCentreMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeCentreMenu);
    return () => document.removeEventListener("pointerdown", closeCentreMenu);
  }, []);

  function updateField<K extends keyof Values>(field: K, value: Values[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  }

  const centreSearch = form.center.trim().toLowerCase();
  const filteredRegionalCentres = REGIONAL_CENTRES.filter((centre) =>
    centre.toLowerCase().includes(centreSearch),
  );
  const filteredStudyCentres = STUDY_CENTRES.filter((centre) =>
    centre.toLowerCase().includes(centreSearch),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = {
      ...form,
      userId: form.userId.trim(),
      email: form.email.trim().toLowerCase(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      center: form.center.trim(),
      regNumber: form.regNumber.trim(),
      stNumber: form.stNumber.trim().toUpperCase(),
      intake: form.intake.trim(),
    };
    const found = validate(normalized);
    setErrors(found);
    if (Object.keys(found).length) return;

    setForm(EMPTY);
    setSubmittedEmail(normalized.email);
  }

  if (submittedEmail) {
    return (
      <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
        <p
          role="status"
          className="text-sm font-medium leading-6 text-emerald-800"
        >
          Invite sent to {submittedEmail}. It expires in 48 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedEmail(null);
            setErrors({});
          }}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-100"
        >
          Add another staff member
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex min-w-0 w-full flex-col gap-4"
    >
      <p className="-mt-1 text-xs leading-5 text-slate-500">
        Add the account details below. The user will receive an invitation to
        complete their access setup.
      </p>

      {errors.form && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errors.form}
        </p>
      )}

      <div className="border-b border-slate-100 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Account details
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          First name
          <input
            className={inputClass(!!errors.firstName)}
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <span className="mt-1.5 block text-sm font-normal text-red-700">
              {errors.firstName}
            </span>
          )}
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Last name
          <input
            className={inputClass(!!errors.lastName)}
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <span className="mt-1.5 block text-sm font-normal text-red-700">
              {errors.lastName}
            </span>
          )}
        </label>
      </div>

      <label className="text-sm font-semibold text-slate-700">
        User ID
        <input
          className={inputClass(!!errors.userId)}
          value={form.userId}
          onChange={(event) => updateField("userId", event.target.value)}
          aria-invalid={!!errors.userId}
        />
        {errors.userId && (
          <span className="mt-1.5 block text-sm font-normal text-red-700">
            {errors.userId}
          </span>
        )}
      </label>

      <label className="text-sm font-semibold text-slate-700">
        Work email
        <input
          type="email"
          className={inputClass(!!errors.email)}
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span className="mt-1.5 block text-sm font-normal text-red-700">
            {errors.email}
          </span>
        )}
      </label>

      <label className="text-sm font-semibold text-slate-700">
        Temporary password
        <input
          type="password"
          className={inputClass(!!errors.password)}
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <span className="mt-1.5 block text-sm font-normal text-red-700">
            {errors.password}
          </span>
        )}
      </label>

      <div className="border-b border-slate-100 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Access details
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Role
          <Select
            value={form.role}
            onValueChange={(role) => {
              if (ROLES.some((option) => option.value === role)) {
                updateField("role", role as Role);
              }
            }}
          >
            <SelectTrigger
              className={`${selectTriggerClass(false)} [&>svg]:h-6 [&>svg]:w-6 [&>svg]:rounded [&>svg]:p-1 [&>svg]:text-slate-500 [&>svg]:transition-transform hover:[&>svg]:bg-slate-100 data-[state=open]:[&>svg]:rotate-180`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              sideOffset={4}
              className="min-w-[var(--radix-select-trigger-width)] p-1 [&_[data-position=popper]]:h-auto"
            >
              <SelectGroup>
                <SelectLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User roles
                </SelectLabel>
                {ROLES.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                    className="px-2 py-2 text-base focus:bg-slate-100 focus:text-slate-900"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Center
          <div ref={centrePickerRef} className="relative">
            <input
              className={`${inputClass(!!errors.center)} pr-16`}
              placeholder="Type or select a centre"
              value={form.center}
              onFocus={() => setCentreMenuOpen(true)}
              onChange={(event) => {
                updateField("center", event.target.value);
                setCentreMenuOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setCentreMenuOpen(false);
              }}
              aria-invalid={!!errors.center}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={centreMenuOpen}
              aria-controls="centre-options"
            />
            {form.center && (
              <button
                type="button"
                aria-label="Clear center"
                onClick={() => {
                  updateField("center", "");
                  setCentreMenuOpen(true);
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              aria-label="Show centre options"
              onClick={() => setCentreMenuOpen((open) => !open)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  centreMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {centreMenuOpen && (
              <div
                id="centre-options"
                role="listbox"
                className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-300 bg-white p-1 shadow-lg"
              >
                {filteredRegionalCentres.length > 0 && (
                  <div>
                    <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Regional Centres
                    </p>
                    {filteredRegionalCentres.map((centre) => (
                      <button
                        key={centre}
                        type="button"
                        role="option"
                        aria-selected={form.center === centre}
                        onClick={() => {
                          updateField("center", centre);
                          setCentreMenuOpen(false);
                        }}
                        className="block w-full rounded px-2 py-2 text-left text-base text-slate-900 hover:bg-slate-100"
                      >
                        {centre}
                      </button>
                    ))}
                  </div>
                )}
                {filteredStudyCentres.length > 0 && (
                  <div>
                    <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Study Centres
                    </p>
                    {filteredStudyCentres.map((centre) => (
                      <button
                        key={centre}
                        type="button"
                        role="option"
                        aria-selected={form.center === centre}
                        onClick={() => {
                          updateField("center", centre);
                          setCentreMenuOpen(false);
                        }}
                        className="block w-full rounded px-2 py-2 text-left text-base text-slate-900 hover:bg-slate-100"
                      >
                        {centre}
                      </button>
                    ))}
                  </div>
                )}
                {filteredRegionalCentres.length === 0 &&
                  filteredStudyCentres.length === 0 && (
                    <p className="px-2 py-2 text-sm text-slate-500">
                      No matching centres
                    </p>
                  )}
              </div>
            )}
          </div>
          {errors.center && (
            <span className="mt-1.5 block text-sm font-normal text-red-700">
              {errors.center}
            </span>
          )}
        </label>
      </div>

      <div className="border-b border-slate-100 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Student details
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Registration number (optional)
          <input
            className={inputClass(!!errors.regNumber)}
            value={form.regNumber}
            onChange={(event) => updateField("regNumber", event.target.value)}
            aria-invalid={!!errors.regNumber}
          />
          {errors.regNumber && (
            <span className="mt-1.5 block text-sm font-normal text-red-700">
              {errors.regNumber}
            </span>
          )}
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Student number (optional)
          <input
            className={inputClass(!!errors.stNumber)}
            value={form.stNumber}
            onChange={(event) => updateField("stNumber", event.target.value)}
            aria-invalid={!!errors.stNumber}
          />
          {errors.stNumber && (
            <span className="mt-1.5 block text-sm font-normal text-red-700">
              {errors.stNumber}
            </span>
          )}
        </label>
      </div>

      <label className="text-sm font-semibold text-slate-700">
        Intake (optional)
        <input
          className={inputClass(!!errors.intake)}
          placeholder="21/22"
          value={form.intake}
          onChange={(event) => updateField("intake", event.target.value)}
          aria-invalid={!!errors.intake}
        />
        {errors.intake && (
          <span className="mt-1.5 block text-sm font-normal text-red-700">
            {errors.intake}
          </span>
        )}
      </label>

      <button
        type="submit"
        className="mt-0.5 inline-flex h-10 items-center justify-center rounded-lg bg-[#183b68] px-5 font-sans text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#102d52] focus:outline-none focus:ring-2 focus:ring-[#183b68]/30 disabled:opacity-60"
      >
        Create user
      </button>
    </form>
  );
}
