"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AlertCircle, Check, ChevronDown, X } from "lucide-react";
import {
  currentDateTimeLocal,
  laterDateTimeLocal,
  shiftDateTimeLocal,
} from "./date-time";
import { TYPES } from "./types";
import type { FormState } from "./types";

type RegistrationWindowModalProps = {
  open: boolean;
  saving: boolean;
  lockType: boolean;
  form: FormState;
  formError: string;
  onFormChange: Dispatch<SetStateAction<FormState>>;
  onClose: () => void;
  onSave: () => void;
};

export function RegistrationWindowModal({
  open,
  saving,
  lockType,
  form,
  formError,
  onFormChange,
  onClose,
  onSave,
}: RegistrationWindowModalProps) {
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const typeMenuRef = useRef<HTMLDivElement | null>(null);
  const typeLabel = TYPES.find((type) => type.value === form.registrationType)?.label;

  useEffect(() => {
    if (!open || !typeMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target as Node)) {
        setTypeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, typeMenuOpen]);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    onFormChange((previous) => ({ ...previous, [field]: value }));
  }

  function closeDialog() {
    setTypeMenuOpen(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={closeDialog}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            Schedule {lockType ? typeLabel : "Registration Window"}
          </h2>
          <button
            type="button"
            onClick={closeDialog}
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
                  onClick={() => setTypeMenuOpen((isOpen) => !isOpen)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white hover:border-slate-300 transition-colors"
                >
                  {typeLabel}
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                {typeMenuOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                    {TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          update("registrationType", type.value);
                          setTypeMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-50"
                      >
                        {type.label}
                        {form.registrationType === type.value && (
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
              onChange={(event) => update("batchIds", event.target.value)}
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
                min={shiftDateTimeLocal(currentDateTimeLocal(), 1)}
                max={shiftDateTimeLocal(form.endAt, -1)}
                onChange={(event) => update("startAt", event.target.value)}
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
                min={laterDateTimeLocal(
                  shiftDateTimeLocal(form.startAt, 1),
                  shiftDateTimeLocal(currentDateTimeLocal(), 1),
                )}
                onChange={(event) => update("endAt", event.target.value)}
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
              onChange={(event) => update("gracePeriodEndAt", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-shadow"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.notifyStudents}
              onChange={(event) => update("notifyStudents", event.target.checked)}
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
              onClick={closeDialog}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#183b68] rounded-lg hover:bg-[#183b68]/80 active:bg-[#183b68]/95 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save & Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
