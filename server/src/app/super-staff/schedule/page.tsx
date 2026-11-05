"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  X,
  ChevronDown,
  Check,
  AlertCircle,
  Power,
  CheckCircle2,
  Layers,
  DoorOpen,
  Hourglass,
  Lock,
} from "lucide-react";
import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "@/components/admin/AdministrativeBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";

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
  initials: string;
};

const TYPES: TypeOption[] = [
  { value: "NEW_REGISTRATION", label: "New Registration", initials: "NR" },
  { value: "RE_REGISTRATION", label: "Re-registration", initials: "RR" },
  { value: "ADD_DROP", label: "Add / Drop Period", initials: "AD" },
];

const STATUS_STYLES: Record<WindowStatus, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
};

// One fixed entry per registration type â€” saving always updates the
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
  const [justUpdatedType, setJustUpdatedType] =
    useState<RegistrationType | null>(null);
  const [toast, setToast] = useState("");
  const typeMenuRef = useRef<HTMLDivElement | null>(null);

  // Close the type dropdown on any click outside it, so it can never be
  // left open and overlap/intercept clicks on fields rendered below it
  // (including the Save & Schedule button).
  useEffect(() => {
    if (!typeMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        typeMenuRef.current &&
        !typeMenuRef.current.contains(e.target as Node)
      ) {
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

  // Opens the generic "Manage Registration Window" flow â€” type stays
  // editable via the dropdown.
  function openGenericModal() {
    setForm(emptyForm);
    setLockType(false);
    setFormError("");
    setOpen(true);
  }

  // Triggered by a card's "Open now" switch â€” navigates straight into the
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

  // Direct close â€” no form needed to shut a window down.
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
      new Date(form.gracePeriodEndAt).getTime() <=
        new Date(form.endAt).getTime()
    ) {
      return "Grace period must end after the close date.";
    }
    return "";
  }

  // Triggered directly by the Save & Schedule button's onClick rather than
  // the form's onSubmit. Sandboxed preview iframes (this artifact preview
  // included) can silently block the native `submit` event, so we avoid
  // depending on it entirely â€” the button calls this straight away.
  function handleSave() {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setSaving(true);

    // Mock async save â€” in the real app this calls
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
      flashUpdated(
        type,
        `${TYPES.find((t) => t.value === type)?.label} window scheduled.`,
      );
    }, 500);
  }

  const typeLabel = TYPES.find((t) => t.value === form.registrationType)?.label;
  const windowValues = Object.values(cards);
  const summaryCards = [
    {
      label: "Total Windows",
      value: windowValues.length,
      icon: Layers,
      tile: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Open",
      value: windowValues.filter((window) => window.status === "OPEN").length,
      icon: DoorOpen,
      tile: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Scheduled",
      value: windowValues.filter((window) => window.status === "SCHEDULED").length,
      icon: Hourglass,
      tile: "bg-amber-50 text-amber-600",
    },
    {
      label: "Closed",
      value: windowValues.filter((window) => window.status === "CLOSED").length,
      icon: Lock,
      tile: "bg-slate-100 text-slate-500",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-h-screen bg-slate-50 font-sans">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
          <div className="mb-1">
            <AdminBreadcrumb currentPage="Schedule" />
          </div>

          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 pt-5 sm:px-9 sm:pt-9">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Registration Windows
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Control when the student portal accepts registrations. Each
                    type has one window.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openGenericModal}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1e3a6e] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#182f59] focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <Calendar size={16} strokeWidth={2} />
                  Manage Registration Window
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 px-5 py-6 sm:grid-cols-2 sm:gap-4 sm:px-9 sm:py-8 lg:grid-cols-4">
              {summaryCards.map(({ label, value, icon: Icon, tile }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${tile}`}>
                      <Icon size={20} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:text-xs">
                      {label}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-slate-900 sm:mt-5 sm:text-4xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200">
              <h2 className="px-5 py-5 text-xl font-medium text-slate-900 sm:px-9 sm:py-7">
                Window Schedule
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                      <th className="px-5 py-4 sm:px-9">Registration Type</th>
                      <th className="px-4 py-4">Schedule</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-5 py-4 text-right sm:px-9">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TYPES.map((t) => {
                      const w = cards[t.value];
                      const isOpen = w.status === "OPEN";

                      return (
                    <tr
                      key={t.value}
                      className={`border-b border-slate-100 transition-colors duration-700 last:border-b-0 ${justUpdatedType === t.value ? "bg-slate-50" : "bg-white"}`}
                    >
                      <td className="px-5 py-5 sm:px-9">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b1224] text-sm font-semibold text-white">
                            {t.initials}
                          </span>
                          <div className="leading-tight">
                            <p className="text-sm font-medium text-slate-900">{t.label}</p>
                            <p className="mt-0.5 text-sm text-slate-500">
                              {w.batches ? `Batches ${w.batches}` : "No batches set"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm text-slate-500">
                        {formatRange(w.startAt, w.endAt)}
                      </td>
                      <td className="px-4 py-5">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${STATUS_STYLES[w.status]}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 sm:px-9">
                        <div className="flex items-center justify-end gap-2">
                          {isOpen && (
                            <button
                              type="button"
                              onClick={() => openModalForType(t.value)}
                              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => (isOpen ? closeNow(t.value) : openModalForType(t.value))}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${isOpen ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-[#1e3a6e] text-white hover:bg-[#182f59]"}`}
                          >
                            <Power size={14} />
                            {isOpen ? "Close now" : "Open now"}
                          </button>
                        </div>
                      </td>
                    </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
              onClick={closeModal}
            />
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
                      <span className="text-[11px] font-medium text-slate-400">
                        Fixed
                      </span>
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
                    Grace Period End{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-[#183b68] rounded-lg hover:bg-[#183b68]/80 active:bg-[#183b68]/95 disabled:opacity-50 transition-colors"
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}