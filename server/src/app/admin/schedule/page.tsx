"use client";
// Required: this component uses useState and onClick handlers, so it must
// be a Client Component under the Next.js App Router. Without this
// directive, Next.js renders it as a Server Component and none of the
// interactivity (including the Save & Schedule button) will work.

import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, X, ChevronDown, Check, AlertCircle, Power, CheckCircle2 } from "lucide-react";

type RegistrationType = "NEW_REGISTRATION" | "RE_REGISTRATION" | "ADD_DROP";
type WindowStatus = "OPEN" | "SCHEDULED" | "CLOSED";

type RegistrationWindow = {
  batches: string;
  startAt: string;
  endAt: string;
  status: WindowStatus;
};

type CardMap = Record<RegistrationType, RegistrationWindow>;

type FormState = {
  registrationType: RegistrationType;
  batchIds: string;
  startAt: string;
  endAt: string;
  gracePeriodEndAt: string;
  notifyStudents: boolean;
};

type TypeOption = {
  value: RegistrationType;
  label: string;
};

const TYPES: TypeOption[] = [
  { value: "NEW_REGISTRATION", label: "New Registration" },
  { value: "RE_REGISTRATION", label: "Re-registration" },
  { value: "ADD_DROP", label: "Add / Drop Period" },
];

const STATUS_STYLES: Record<WindowStatus, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
};

// One fixed entry per registration type — saving always updates the
// matching card instead of appending a new one.
const initialCards: CardMap = {
  NEW_REGISTRATION: {
    batches: "2025",
    startAt: "2026-07-01T00:00",
    endAt: "2026-07-15T23:59",
    status: "CLOSED",
  },
  RE_REGISTRATION: {
    batches: "2022, 2023",
    startAt: "2026-09-01T08:00",
    endAt: "2026-09-14T23:59",
    status: "SCHEDULED",
  },
  ADD_DROP: {
    batches: "2024",
    startAt: "2026-08-20T00:00",
    endAt: "2026-08-27T23:59",
    status: "OPEN",
  },
};

const emptyForm: FormState = {
  registrationType: "NEW_REGISTRATION",
  batchIds: "",
  startAt: "",
  endAt: "",
  gracePeriodEndAt: "",
  notifyStudents: true,
};

// Matches tokens like "2023" or "2023,2024" / "2023, 2024"
const BATCHES_PATTERN = /^\d{4}(\s*,\s*\d{4})*$/;

function formatRange(startAt?: string, endAt?: string): string {
  if (!startAt || !endAt) return "Not scheduled yet";
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const s = new Date(startAt).toLocaleString("en-US", opts);
  const e = new Date(endAt).toLocaleString("en-US", opts);
  return `${s} \u2192 ${e}`;
}

export default function RegistrationWindowMock() {
  const [cards, setCards] = useState<CardMap>(initialCards);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [lockType, setLockType] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [justUpdatedType, setJustUpdatedType] = useState<RegistrationType | null>(null);
  const [toast, setToast] = useState("");
  const typeMenuRef = useRef<HTMLDivElement | null>(null);

  // Close the type dropdown on any click outside it, so it can never be
  // left open and overlap/intercept clicks on fields rendered below it
  // (including the Save & Schedule button).
  useEffect(() => {
    if (!typeMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setTypeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [typeMenuOpen]);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function closeModal() {
    if (saving) return;
    setOpen(false);
    setFormError("");
    setTypeMenuOpen(false);
  }

  // Opens the generic "Manage Registration Window" flow — type stays
  // editable via the dropdown.
  function openGenericModal() {
    setForm(emptyForm);
    setLockType(false);
    setFormError("");
    setOpen(true);
  }

  // Triggered by a card's "Open now" switch — navigates straight into the
  // form, pre-selected and pre-filled for that specific registration type.
  function openModalForType(type: RegistrationType) {
    const existing = cards[type];
    setForm({
      registrationType: type,
      batchIds: existing?.batches ?? "",
      startAt: existing?.startAt ?? "",
      endAt: existing?.endAt ?? "",
      gracePeriodEndAt: "",
      notifyStudents: true,
    });
    setLockType(true);
    setFormError("");
    setOpen(true);
  }

  // Direct close — no form needed to shut a window down.
  function closeNow(type: RegistrationType) {
    setCards((prev) => ({
      ...prev,
      [type]: { ...prev[type], status: "CLOSED" },
    }));
    flashUpdated(type, `${TYPES.find((t) => t.value === type)?.label} closed.`);
  }

  function flashUpdated(type: RegistrationType, message: string) {
    setJustUpdatedType(type);
    setToast(message);
    window.setTimeout(() => setJustUpdatedType(null), 2200);
    window.setTimeout(() => setToast(""), 3000);
  }

  function validate(): string {
    const batches = form.batchIds.trim();

    if (!batches) return "Enter at least one batch, e.g. 2023, 2024.";
    if (!BATCHES_PATTERN.test(batches)) {
      return "Batches must be 4-digit years separated by commas, e.g. 2023, 2024.";
    }
    if (!form.startAt) return "Choose when the portal opens.";
    if (!form.endAt) return "Choose when the portal closes.";
    if (new Date(form.endAt).getTime() <= new Date(form.startAt).getTime()) {
      return "Close date must be after the open date.";
    }
    if (
      form.gracePeriodEndAt &&
      new Date(form.gracePeriodEndAt).getTime() <= new Date(form.endAt).getTime()
    ) {
      return "Grace period must end after the close date.";
    }
    return "";
  }

  // Triggered directly by the Save & Schedule button's onClick rather than
  // the form's onSubmit. Sandboxed preview iframes (this artifact preview
  // included) can silently block the native `submit` event, so we avoid
  // depending on it entirely — the button calls this straight away.
  function handleSave() {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setSaving(true);

    // Mock async save — in the real app this calls
    // useSaveRegistrationWindow().mutate(form)
    window.setTimeout(() => {
      const type = form.registrationType;
      const status: WindowStatus =
        new Date(form.startAt).getTime() <= Date.now() ? "OPEN" : "SCHEDULED";

      setCards((prev) => ({
        ...prev,
        [type]: {
          batches: form.batchIds.trim(),
          startAt: form.startAt,
          endAt: form.endAt,
          status,
        },
      }));

      setSaving(false);
      setOpen(false);
      setForm(emptyForm);
      flashUpdated(type, `${TYPES.find((t) => t.value === type)?.label} window scheduled.`);
    }, 500);
  }

  const typeLabel = TYPES.find((t) => t.value === form.registrationType)?.label;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-1 gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase mb-1">
              IARVS Admin
            </p>
            <h1 className="text-xl font-semibold text-slate-900">Registration Windows</h1>
          </div>
          <button
            type="button"
            onClick={openGenericModal}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 active:bg-slate-950 transition-colors shrink-0"
          >
            <Calendar size={16} strokeWidth={2} />
            Manage Registration Window
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-8">
          Control when the student portal accepts registration and re-registration requests.
          Each type has exactly one window.
        </p>

        <div className="space-y-3">
          {TYPES.map((t) => {
            const w = cards[t.value];
            const isOpen = w.status === "OPEN";

            return (
              <div
                key={t.value}
                className={`bg-white border rounded-xl p-4 flex items-center justify-between gap-4 transition-colors duration-700 ${
                  justUpdatedType === t.value ? "border-slate-900 bg-slate-50" : "border-slate-200"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-slate-900">{t.label}</span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[w.status]}`}
                    >
                      {w.status}
                    </span>
                    {justUpdatedType === t.value && (
                      <span className="text-[11px] font-medium text-slate-500">Updated</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatRange(w.startAt, w.endAt)}
                    </span>
                    {w.batches && <span>Batches {w.batches}</span>}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isOpen && (
                    <button
                      type="button"
                      onClick={() => openModalForType(t.value)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => (isOpen ? closeNow(t.value) : openModalForType(t.value))}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <Power size={12} />
                    {isOpen ? "Close now" : "Open now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                Schedule {lockType ? typeLabel : "Registration Window"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="relative">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Registration Type
                </label>

                {lockType ? (
                  <div className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {typeLabel}
                    <span className="text-[11px] font-medium text-slate-400">Fixed</span>
                  </div>
                ) : (
                  <div ref={typeMenuRef}>
                    <button
                      type="button"
                      onClick={() => setTypeMenuOpen((o) => !o)}
                      className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white hover:border-slate-300 transition-colors"
                    >
                      {typeLabel}
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    {typeMenuOpen && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                        {TYPES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => {
                              update("registrationType", t.value);
                              setTypeMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-50"
                          >
                            {t.label}
                            {form.registrationType === t.value && (
                              <Check size={14} className="text-slate-900" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Applicable Batches
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2023, 2024"
                  value={form.batchIds}
                  onChange={(e) => update("batchIds", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Open From
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => update("startAt", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Close At
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => update("endAt", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Grace Period End <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.gracePeriodEndAt}
                  onChange={(e) => update("gracePeriodEndAt", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-shadow"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.notifyStudents}
                  onChange={(e) => update("notifyStudents", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                />
                <span className="text-sm text-slate-700">
                  Notify students when portal opens/closes
                </span>
              </label>

              {formError && (
                <div className="flex items-start gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving\u2026" : "Save & Schedule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
