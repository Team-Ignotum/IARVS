import { Check, ShieldCheck } from "lucide-react";

import {
  primaryButtonClass,
  secondaryButtonClass,
} from "./styles";

export function PreferencesSaveBar({
  hasUnsavedChanges,
  isLoaded,
  message,
  onSave,
  onDiscard,
}: {
  hasUnsavedChanges: boolean;
  isLoaded: boolean;
  message: string;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const disabled = !hasUnsavedChanges || !isLoaded;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
          <ShieldCheck size={20} />
        </div>

        <div>
          <p className="text-sm font-semibold">
            {hasUnsavedChanges
              ? "You have unsaved changes"
              : "Preferences are up to date"}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Preferences are saved in this browser.
          </p>

          {message && (
            <p
              role="status"
              className="mt-2 text-xs text-blue-600 dark:text-blue-400"
            >
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onDiscard}
          className={`${secondaryButtonClass} disabled:opacity-50`}
        >
          Discard Changes
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onSave}
          className={primaryButtonClass}
        >
          <Check size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
