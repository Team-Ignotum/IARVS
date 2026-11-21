"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Layers,
  DoorOpen,
  Hourglass,
  Lock,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SuperStaffSidebar } from "@/components/superStaffSideBar";
import { SuperStaffHeader } from "@/components/super-staff/superStaffHeader";
import { SuperStaffBreadcrumb } from "@/components/super-staff/superStaffBreadcrumb";
import { RegistrationWindowModal } from "./RegistrationWindowModal";
import { RegistrationWindowsTable } from "./RegistrationWindowsTable";
import { getWindowStatus } from "./date-time";
import {
  BATCHES_PATTERN,
  EMPTY_FORM,
  TYPES,
  type FormState,
  type RegistrationWindow,
} from "./types";

// Creates sample windows to show the available registration types.
function localDateTimeOffset(dayOffset: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function createInitialCards(): RegistrationWindow[] {
  return [
    {
      id: "initial-new-registration",
      type: "NEW_REGISTRATION",
      batches: "2025",
      startAt: localDateTimeOffset(-20, 8),
      endAt: localDateTimeOffset(-10, 18),
    },
    {
      id: "initial-re-registration",
      type: "RE_REGISTRATION",
      batches: "2022, 2023",
      startAt: localDateTimeOffset(5, 8),
      endAt: localDateTimeOffset(12, 18),
    },
    {
      id: "initial-add-drop",
      type: "ADD_DROP",
      batches: "2024",
      startAt: localDateTimeOffset(-1, 8),
      endAt: localDateTimeOffset(5, 18),
    },
  ];
}

export default function RegistrationWindowMock() {
  const [cards, setCards] = useState<RegistrationWindow[]>(createInitialCards);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lockType, setLockType] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [editingWindowId, setEditingWindowId] = useState<string | null>(null);
  const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  function closeModal() {
    if (saving) return;
    setOpen(false);
    setFormError("");
  }

  // Opens the generic "Manage Registration Window" flow Ã¢â‚¬â€ type stays
  // editable via the dropdown.
  function openGenericModal() {
    setForm(EMPTY_FORM);
    setLockType(false);
    setEditingWindowId(null);
    setFormError("");
    setOpen(true);
  }

  // Triggered by a card's "Open now" switch Ã¢â‚¬â€ navigates straight into the
  // form, pre-selected and pre-filled for that specific registration type.
  function openModalForWindow(existing: RegistrationWindow) {
    setForm({
      registrationType: existing.type,
      batchIds: existing.batches,
      startAt: existing.startAt,
      endAt: existing.endAt,
      gracePeriodEndAt: "",
      notifyStudents: true,
    });
    setEditingWindowId(existing.id);
    setLockType(true);
    setFormError("");
    setOpen(true);
  }

  // Direct close Ã¢â‚¬â€ no form needed to shut a window down.
  function closeNow(windowToClose: RegistrationWindow) {
    setCards((prev) => prev.map((item) =>
      item.id === windowToClose.id ? { ...item, manuallyClosed: true } : item,
    ));
    flashUpdated(windowToClose.id, `${TYPES.find((t) => t.value === windowToClose.type)?.label} closed.`);
  }

  function flashUpdated(id: string, message: string) {
    setJustUpdatedId(id);
    setToast(message);
    window.setTimeout(() => setJustUpdatedId(null), 2200);
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
    if (new Date(form.startAt).getTime() <= Date.now()) {
      return "The open date and time must be after the present date and time.";
    }
    if (new Date(form.endAt).getTime() <= Date.now()) {
      return "The close date and time must be after the present date and time.";
    }
    if (new Date(form.endAt).getTime() <= new Date(form.startAt).getTime()) {
      return "The close date and time must be after the open date and time.";
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
  // depending on it entirely Ã¢â‚¬â€ the button calls this straight away.
  function handleSave() {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setSaving(true);

    // Mock async save Ã¢â‚¬â€ in the real app this calls
    // useSaveRegistrationWindow().mutate(form)
    window.setTimeout(() => {
      const type = form.registrationType;
      const updatedWindow: RegistrationWindow = {
        id: editingWindowId ?? crypto.randomUUID(),
        type,
        batches: form.batchIds.trim(),
        startAt: form.startAt,
        endAt: form.endAt,
        manuallyClosed: false,
      };
      setCards((prev) => editingWindowId
        ? prev.map((item) => item.id === editingWindowId ? updatedWindow : item)
        : [...prev, updatedWindow]);
      setSaving(false);
      setOpen(false);
      setForm(EMPTY_FORM);
      setEditingWindowId(null);
      flashUpdated(
        updatedWindow.id,
        `${TYPES.find((t) => t.value === type)?.label} window scheduled.`,
      );
    }, 500);
  }

  const windowValues = cards;
  const summaryCards = [
    {
      label: "Total Windows",
      value: windowValues.length,
      icon: Layers,
      tile: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Open",
      value: windowValues.filter((window) => getWindowStatus(window, currentTime) === "OPEN").length,
      icon: DoorOpen,
      tile: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Scheduled",
      value: windowValues.filter((window) => getWindowStatus(window, currentTime) === "SCHEDULED").length,
      icon: Hourglass,
      tile: "bg-amber-50 text-amber-600",
    },
    {
      label: "Closed",
      value: windowValues.filter((window) => getWindowStatus(window, currentTime) === "CLOSED").length,
      icon: Lock,
      tile: "bg-slate-100 text-slate-500",
    },
  ];
  return (
    <SidebarProvider>
      <SuperStaffSidebar />
      <SidebarInset className="min-h-screen bg-slate-50 font-sans">
        <SuperStaffHeader />
        <main className="flex flex-1 flex-col gap-4 bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
          <div className="mb-1">
            <SuperStaffBreadcrumb currentPage="Schedule" />
          </div>

          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 pt-5 sm:px-9 sm:pt-9">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Registration Windows
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Control when the student portal accepts registrations. You
                    can schedule multiple windows for each registration type.
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
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left sm:p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${tile}`}>
                        <Icon size={20} />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:text-xs">
                        {label}
                      </span>
                    </div>
                    <span className="mt-4 block text-3xl font-semibold text-slate-900 sm:mt-5 sm:text-4xl">
                      {value}
                    </span>
                  </div>
              ))}
            </div>

            <RegistrationWindowsTable
              windows={cards}
              currentTime={currentTime}
              justUpdatedId={justUpdatedId}
              onEdit={openModalForWindow}
              onClose={closeNow}
            />
          </section>

        <RegistrationWindowModal
          open={open}
          saving={saving}
          lockType={lockType}
          form={form}
          formError={formError}
          onFormChange={setForm}
          onClose={closeModal}
          onSave={handleSave}
        />
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
