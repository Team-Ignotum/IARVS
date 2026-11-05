import type { ReactNode } from "react";

import { inputClass } from "./styles";

export function SectionHeading({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
        {icon}
      </div>

      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
    </div>
  );
}

export function FieldLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </p>
  );
}

export function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export function EditableField({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={inputClass}
      />

      {error && (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  visible,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  autoComplete: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        className={inputClass}
      />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={
        "relative h-5 w-9 shrink-0 rounded-full transition-colors " +
        (checked
          ? "bg-blue-600"
          : "bg-slate-200 dark:bg-slate-700")
      }
    >
      <span
        className={
          "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform " +
          (checked ? "translate-x-4" : "")
        }
      />
    </button>
  );
}
