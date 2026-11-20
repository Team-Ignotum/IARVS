import type { RegistrationWindow, WindowStatus } from "./types";

export function shiftDateTimeLocal(value: string, minutes: number): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + minutes);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function currentDateTimeLocal(): string {
  const date = new Date();
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function laterDateTimeLocal(first?: string, second?: string): string | undefined {
  if (!first) return second;
  if (!second) return first;
  return new Date(first).getTime() >= new Date(second).getTime() ? first : second;
}

export function getWindowStatus(window: RegistrationWindow, now: number): WindowStatus {
  if (window.manuallyClosed) return "CLOSED";

  const start = new Date(window.startAt).getTime();
  const end = new Date(window.endAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= now) {
    return "CLOSED";
  }
  if (start > now) return "SCHEDULED";
  return "OPEN";
}

export function formatRange(startAt?: string, endAt?: string): string {
  if (!startAt || !endAt) return "Not scheduled yet";
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const start = new Date(startAt).toLocaleString("en-US", opts);
  const end = new Date(endAt).toLocaleString("en-US", opts);
  return `${start} \u2192 ${end}`;
}
