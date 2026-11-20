export type RegistrationType = "NEW_REGISTRATION" | "RE_REGISTRATION" | "ADD_DROP";
export type WindowStatus = "OPEN" | "SCHEDULED" | "CLOSED";
export type WindowStatusFilter = "DEFAULT" | WindowStatus;

export type RegistrationWindow = {
  id: string;
  type: RegistrationType;
  batches: string;
  startAt: string;
  endAt: string;
  manuallyClosed?: boolean;
};

export type FormState = {
  registrationType: RegistrationType;
  batchIds: string;
  startAt: string;
  endAt: string;
  gracePeriodEndAt: string;
  notifyStudents: boolean;
};

export type TypeOption = {
  value: RegistrationType;
  label: string;
  initials: string;
};

export const TYPES: TypeOption[] = [
  { value: "NEW_REGISTRATION", label: "New Registration", initials: "NR" },
  { value: "RE_REGISTRATION", label: "Re-registration", initials: "RR" },
  { value: "ADD_DROP", label: "Add / Drop Period", initials: "AD" },
];

export const STATUS_STYLES: Record<WindowStatus, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
};

export const EMPTY_FORM: FormState = {
  registrationType: "NEW_REGISTRATION",
  batchIds: "",
  startAt: "",
  endAt: "",
  gracePeriodEndAt: "",
  notifyStudents: true,
};

export const BATCHES_PATTERN = /^\d{4}(\s*,\s*\d{4})*$/;
