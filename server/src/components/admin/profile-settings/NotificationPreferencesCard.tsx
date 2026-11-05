import { Bell } from "lucide-react";

import { SectionHeading, Toggle } from "./fields";
import { cardClass } from "./styles";
import {
  notificationItems,
  type ToggleKey,
} from "./types";

export function NotificationPreferencesCard({
  toggles,
  onToggle,
}: {
  toggles: Record<ToggleKey, boolean>;
  onToggle: (key: ToggleKey) => void;
}) {
  return (
    <section className={cardClass}>
      <SectionHeading
        icon={<Bell size={17} />}
        title="Notification Preferences"
      />

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Choose which administrative notifications you would like to
        receive.
      </p>

      <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-700">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {item.label}
            </span>

            <Toggle
              checked={toggles[item.key]}
              onChange={() => onToggle(item.key)}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
