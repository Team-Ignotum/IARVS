
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  X,
  ChevronDown,
  Check,
  AlertCircle,
  Power,
  CheckCircle2,
} from "lucide-react";

type RegistrationType =
  | "NEW_REGISTRATION"
  | "RE_REGISTRATION"
  | "ADD_DROP";

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
  OPEN:
    "border-emerald-200 bg-emerald-50 text-emerald-700 " +
    "dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  SCHEDULED:
    "border-amber-200 bg-amber-50 text-amber-700 " +
    "dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  CLOSED:
    "border-slate-200 bg-slate-100 text-slate-600 " +
    "dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200",
};

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

const BATCHES_PATTERN = /^\d{4}(\s*,\s*\d{4})*$/;

const INPUT_CLASS =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 " +
  "text-sm text-slate-900 placeholder:text-slate-400 " +
  "outline-none transition-colors " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 " +
  "dark:border-slate-600 dark:bg-[#1E293B] dark:text-slate-100 " +
  "dark:placeholder:text-slate-400 dark:focus:border-blue-400";

const LABEL_CLASS =
  "mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300";

const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-1.5 rounded-lg " +
  "border border-slate-200 px-3 py-1.5 text-xs font-medium " +
  "text-slate-600 transition-colors " +
  "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 " +
  "dark:border-slate-600 dark:text-slate-300 " +
  "dark:hover:border-slate-500 dark:hover:bg-[#1E293B] dark:hover:text-white";

function formatRange(startAt?: string, endAt?: string): string {
  if (!startAt || !endAt) {
    return "Not scheduled yet";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  const start = new Date(startAt).toLocaleString("en-US", options);
  const end = new Date(endAt).toLocaleString("en-US", options);

  return `${start} → ${end}`;
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
  const feedbackTimers = useRef<
    ReturnType<typeof setTimeout>[]
  >([]);

  // Close the registration type dropdown when clicking outside.
  useEffect(() => {
    if (!typeMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        typeMenuRef.current &&
        !typeMenuRef.current.contains(event.target as Node)
      ) {
        setTypeMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [typeMenuOpen]);

  // Clean up feedback timers when leaving the page.
  useEffect(() => {
    return () => {
      feedbackTimers.current.forEach(clearTimeout);
    };
  }, []);

  function update<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function closeModal() {
    if (saving) return;

    setOpen(false);
    setFormError("");
    setTypeMenuOpen(false);
  }

  function openGenericModal() {
    setForm({ ...emptyForm });
    setLockType(false);
    setFormError("");
    setTypeMenuOpen(false);
    setOpen(true);
  }

  function openModalForType(type: RegistrationType) {
    const existing = cards[type];

    setForm({
      registrationType: type,
      batchIds: existing.batches,
      startAt: existing.startAt,
      endAt: existing.endAt,
      gracePeriodEndAt: "",
      notifyStudents: true,
    });

    setLockType(true);
    setFormError("");
    setTypeMenuOpen(false);
    setOpen(true);
  }

  function flashUpdated(
    type: RegistrationType,
    message: string
  ) {
    setJustUpdatedType(type);
    setToast(message);

    const updatedTimer = setTimeout(() => {
      setJustUpdatedType(null);
    }, 2200);

    const toastTimer = setTimeout(() => {
      setToast("");
    }, 3000);

    feedbackTimers.current.push(updatedTimer, toastTimer);
  }

  function closeNow(type: RegistrationType) {
    setCards((previous) => ({
      ...previous,
      [type]: {
        ...previous[type],
        status: "CLOSED",
      },
    }));

    const label = TYPES.find(
      (item) => item.value === type
    )?.label;

    flashUpdated(type, `${label} closed.`);
  }

  function validate(): string {
    const batches = form.batchIds.trim();

    if (!batches) {
      return "Enter at least one batch, e.g. 2023, 2024.";
    }

    if (!BATCHES_PATTERN.test(batches)) {
      return "Batches must be 4-digit years separated by commas, e.g. 2023, 2024.";
    }

    if (!form.startAt) {
      return "Choose when the portal opens.";
    }

    if (!form.endAt) {
      return "Choose when the portal closes.";
    }

    if (
      new Date(form.endAt).getTime() <=
      new Date(form.startAt).getTime()
    ) {
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

  function handleSave() {
    if (saving) return;

    const validationError = validate();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setSaving(true);

    // Frontend demonstration: replace with the backend mutation
    // when the registration-window API is integrated.
    setTimeout(() => {
      const type = form.registrationType;
      const now = Date.now();
      const start = new Date(form.startAt).getTime();
      const end = new Date(form.endAt).getTime();

      const status: WindowStatus =
        now >= end
          ? "CLOSED"
          : now >= start
            ? "OPEN"
            : "SCHEDULED";

      setCards((previous) => ({
        ...previous,
        [type]: {
          batches: form.batchIds.trim(),
          startAt: form.startAt,
          endAt: form.endAt,
          status,
        },
      }));

      setSaving(false);
      setOpen(false);
      setForm({ ...emptyForm });

      const label = TYPES.find(
        (item) => item.value === type
      )?.label;

      flashUpdated(
        type,
        `${label} window scheduled.`
      );
    }, 500);
  }

  const typeLabel = TYPES.find(
    (item) => item.value === form.registrationType
  )?.label;

  return (
    <div
      className="
        min-h-screen bg-slate-50 p-6 font-sans text-slate-900
        transition-colors duration-200
        dark:bg-[#020817] dark:text-slate-100
        sm:p-10
      "
    >
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-1 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-400">
              IARVS Admin
            </p>

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Registration Windows
            </h1>
          </div>

          <button
            type="button"
            onClick={openGenericModal}
            className="
              inline-flex shrink-0 items-center gap-2 rounded-lg
              bg-[#183b68] px-4 py-2.5 text-sm font-medium text-white
              transition-colors hover:bg-[#102d50]
              dark:bg-blue-600 dark:hover:bg-blue-500
            "
          >
            <Calendar size={16} strokeWidth={2} />
            <span>Manage Registration Window</span>
          </button>
        </div>

        <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
          Control when the student portal accepts registration and
          re-registration requests. Each type has exactly one window.
        </p>

        {/* Registration window cards */}
        <div className="space-y-3">
          {TYPES.map((item) => {
            const windowData = cards[item.value];
            const isOpen = windowData.status === "OPEN";
            const wasUpdated =
              justUpdatedType === item.value;

            return (
              <div
                key={item.value}
                className={`
                  flex flex-wrap items-center justify-between gap-4
                  rounded-xl border p-4 transition-colors duration-300
                  ${
                    wasUpdated
                      ? "border-slate-900 bg-slate-50 dark:border-blue-500 dark:bg-[#172554]"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0F172A]"
                  }
                `}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.label}
                    </span>

                    <span
                      className={`
                        rounded-full border px-2 py-0.5
                        text-[11px] font-medium
                        ${STATUS_STYLES[windowData.status]}
                      `}
                    >
                      {windowData.status}
                    </span>

                    {wasUpdated && (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-blue-300">
                        Updated
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatRange(
                        windowData.startAt,
                        windowData.endAt
                      )}
                    </span>

                    {windowData.batches && (
                      <span>
                        Batches {windowData.batches}
                      </span>
                    )}
                  </div>

                <div className="flex shrink-0 items-center gap-2">
                  {isOpen && (
                    <button
                      type="button"
                      onClick={() =>
                        openModalForType(item.value)
                      }
                      className={SECONDARY_BUTTON_CLASS}
                    >
                      <Power size={12} />
                      {isOpen ? "Close now" : "Open now"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      isOpen
                        ? closeNow(item.value)
                        : openModalForType(item.value)
                    }
                    className={SECONDARY_BUTTON_CLASS}
                  >
                    <Power size={12} />
                    {isOpen ? "Close now" : "Open now"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manage registration modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-black/70"
            onClick={closeModal}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-modal-title"
            className="
              relative max-h-[90vh] w-full max-w-md overflow-y-auto
              rounded-2xl border border-slate-200 bg-white shadow-xl
              dark:border-slate-700 dark:bg-[#0F172A]
            "
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 pb-4 pt-5 dark:border-slate-700">
              <h2
                id="registration-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-white"
              >
                Schedule{" "}
                {lockType
                  ? typeLabel
                  : "Registration Window"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="
                  text-slate-400 transition-colors
                  hover:text-slate-600
                  dark:text-slate-400 dark:hover:text-white
                  disabled:opacity-50
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal fields */}
            <div className="space-y-4 px-6 py-5">
              {/* Registration type */}
              <div className="relative">
                <label className={LABEL_CLASS}>
                  Registration Type
                </label>

                {lockType ? (
                  <div
                    className="
                      flex w-full items-center justify-between
                      rounded-lg border border-slate-200
                      bg-slate-50 px-3 py-2 text-sm text-slate-900
                      dark:border-slate-600 dark:bg-[#1E293B]
                      dark:text-slate-100
                    "
                  >
                    {typeLabel}

                    <span className="text-[11px] font-medium text-slate-400">
                      Fixed
                    </span>
                  </div>
                ) : (
                  <div ref={typeMenuRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setTypeMenuOpen((previous) => !previous)
                      }
                      aria-expanded={typeMenuOpen}
                      className={`
                        flex items-center justify-between
                        ${INPUT_CLASS}
                      `}
                    >
                      {typeLabel}
                      <ChevronDown
                        size={14}
                        className="text-slate-400"
                      />
                    </button>

                    {typeMenuOpen && (
                      <div
                        className="
                          absolute z-10 mt-1 w-full rounded-lg
                          border border-slate-200 bg-white py-1 shadow-lg
                          dark:border-slate-600 dark:bg-[#1E293B]
                        "
                      >
                        {TYPES.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              update(
                                "registrationType",
                                option.value
                              );
                              setTypeMenuOpen(false);
                            }}
                            className="
                              flex w-full items-center justify-between
                              px-3 py-2 text-left text-sm
                              text-slate-700 hover:bg-slate-50
                              dark:text-slate-100
                              dark:hover:bg-slate-700
                            "
                          >
                            {option.label}

                            {form.registrationType ===
                              option.value && (
                              <Check
                                size={14}
                                className="text-slate-900 dark:text-blue-400"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Applicable batches */}
              <div>
                <label className={LABEL_CLASS}>
                  Applicable Batches
                </label>

                <input
                  type="text"
                  placeholder="e.g. 2023, 2024"
                  value={form.batchIds}
                  onChange={(event) =>
                    update("batchIds", event.target.value)
                  }
                  className={INPUT_CLASS}
                />
              </div>

              {/* Date and time fields */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>
                    Open From
                  </label>

                  <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(event) =>
                      update("startAt", event.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    Close At
                  </label>

                  <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(event) =>
                      update("endAt", event.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>

              {/* Grace period */}
              <div>
                <label className={LABEL_CLASS}>
                  Grace Period End{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  type="datetime-local"
                  value={form.gracePeriodEndAt}
                  onChange={(event) =>
                    update(
                      "gracePeriodEndAt",
                      event.target.value
                    )
                  }
                  className={INPUT_CLASS}
                />
              </div>

              {/* Notify students */}
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.notifyStudents}
                  onChange={(event) =>
                    update(
                      "notifyStudents",
                      event.target.checked
                    )
                  }
                  className="
                    h-4 w-4 rounded border-slate-300
                    accent-blue-600
                    dark:border-slate-600
                  "
                />

                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Notify students when portal opens/closes
                </span>
              </label>

              {/* Validation message */}
              {formError && (
                <div
                  role="alert"
                  className="
                    flex items-start gap-2 rounded-lg
                    border border-rose-100 bg-rose-50
                    px-3 py-2 text-sm text-rose-600
                    dark:border-rose-900
                    dark:bg-rose-950/40
                    dark:text-rose-300
                  "
                >
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0"
                  />
                  {formError}
                </div>
              )}

              {/* Modal buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    rounded-lg px-4 py-2 text-sm font-medium
                    text-slate-600 transition-colors
                    hover:bg-slate-50
                    dark:text-slate-300
                    dark:hover:bg-[#1E293B]
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="
                    rounded-lg bg-[#183b68] px-4 py-2
                    text-sm font-medium text-white
                    transition-colors hover:bg-[#102d50]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:bg-blue-600
                    dark:hover:bg-blue-500
                  "
                >
                  {saving
                    ? "Saving…"
                    : "Save & Schedule"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Success notification */}
      {toast && (
        <div
          role="status"
          className="
            fixed bottom-6 left-1/2 z-50 flex
            -translate-x-1/2 items-center gap-2
            rounded-lg bg-slate-900 px-4 py-2.5
            text-sm font-medium text-white shadow-lg
            dark:border dark:border-slate-600
            dark:bg-[#1E293B]
          "
        >
          <CheckCircle2
            size={16}
            className="text-emerald-400"
          />
          {toast}
        </div>
      )}
    </div>
  );
}
