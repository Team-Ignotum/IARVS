export type Profile = {
  fullName: string;
  role: string;
  department: string;
  studyCentre: string;
  phone: string;
  email: string;
};

export type ProfileErrors = Partial<
  Record<"fullName" | "phone" | "email", string>
>;

export type ToggleKey =
  | "email"
  | "system"
  | "override"
  | "registration";

export type FontSize = "Small" | "Medium" | "Large";

export type Preferences = {
  toggles: Record<ToggleKey, boolean>;
  fontSize: FontSize;
};

export const initialProfile: Profile = {
  fullName: "Admin Registry",
  role: "Administrator",
  department: "University Administration",
  studyCentre: "WP10 - Colombo",
  phone: "07XXXXXXXX",
  email: "admin@university.edu",
};

export const initialToggles: Record<ToggleKey, boolean> = {
  email: true,
  system: true,
  override: true,
  registration: true,
};

export const defaultPreferences: Preferences = {
  toggles: { ...initialToggles },
  fontSize: "Medium",
};

export const preferencesStorageKey =
  "iarvs-admin-profile-preferences";

export const notificationItems: {
  key: ToggleKey;
  label: string;
}[] = [
  { key: "email", label: "Email Notifications" },
  { key: "system", label: "System Updates" },
  { key: "override", label: "Override Request Alerts" },
  { key: "registration", label: "Registration Updates" },
];
