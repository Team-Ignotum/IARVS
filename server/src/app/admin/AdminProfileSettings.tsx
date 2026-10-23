
"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactNode, CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  LockKeyhole,
  Moon,
  Pencil,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";

import { useAdminTheme } from "./AdminThemeProvider";

// ================= TYPES =================

type Profile = {
  fullName: string;
  role: string;
  department: string;
  studyCentre: string;
  phone: string;
  email: string;
};

type ProfileErrors = Partial<
  Record<"fullName" | "phone" | "email", string>
>;

type ToggleKey =
  | "email"
  | "system"
  | "override"
  | "registration"
  | "profile"
  | "communication"
  | "statistics"
  | "analytics";

type Language = "English" | "Tamil" | "Sinhala";
type FontSize = "Small" | "Medium" | "Large";

type Preferences = {
  toggles: Record<ToggleKey, boolean>;
  language: Language;
  fontSize: FontSize;
};

// ================= INITIAL DATA =================

const initialProfile: Profile = {
  fullName: "Admin Registry",
  role: "Administrator",
  department: "University Administration",
  studyCentre: "WP10 - Colombo",
  phone: "07XXXXXXXX",
  email: "admin@university.edu",
};

const initialToggles: Record<ToggleKey, boolean> = {
  email: true,
  system: true,
  override: true,
  registration: true,
  profile: true,
  communication: true,
  statistics: false,
  analytics: false,
};

const defaultPreferences: Preferences = {
  toggles: { ...initialToggles },
  language: "English",
  fontSize: "Medium",
};

const STORAGE_KEY = "iarvs-admin-profile-preferences";

const notificationItems: {
  key: ToggleKey;
  label: string;
}[] = [
  { key: "email", label: "Email Notifications" },
  { key: "system", label: "System Updates" },
  { key: "override", label: "Override Request Alerts" },
  { key: "registration", label: "Registration Updates" },
];

const privacyItems: {
  key: ToggleKey;
  label: string;
  description: string;
}[] = [
  {
    key: "profile",
    label: "Profile Visibility",
    description: "Allow authorized staff to view your profile",
  },
  {
    key: "communication",
    label: "Allow Email Communications",
    description: "Receive important administrative emails",
  },
  {
    key: "statistics",
    label: "Usage Statistics",
    description: "Share anonymous usage statistics",
  },
  {
    key: "analytics",
    label: "Share Data for Analytics",
    description: "Help improve system performance",
  },
];

// ================= VALIDATION =================

function validateProfile(values: Profile): ProfileErrors {
  const errors: ProfileErrors = {};

  const name = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.replace(/[\s-]/g, "");

  if (!name) {
    errors.fullName = "Full name is required.";
  } else if (name.length < 3) {
    errors.fullName =
      "Full name must contain at least 3 characters.";
  } else if (name.length > 100) {
    errors.fullName =
      "Full name cannot exceed 100 characters.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (
    !/^(?:0[1-9]\d{8}|\+94[1-9]\d{8})$/.test(phone)
  ) {
    errors.phone = "Enter a valid Sri Lankan phone number.";
  }

  return errors;
}

function loadPreferences(): Preferences {
  const defaults: Preferences = {
    toggles: { ...initialToggles },
    language: "English",
    fontSize: "Medium",
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return defaults;

    const parsed = JSON.parse(stored) as Partial<Preferences>;

    const toggles = { ...initialToggles };

    for (const key of Object.keys(initialToggles) as ToggleKey[]) {
      if (typeof parsed.toggles?.[key] === "boolean") {
        toggles[key] = parsed.toggles[key];
      }
    }

    return {
      toggles,
      language:
        parsed.language === "Tamil" ||
        parsed.language === "Sinhala"
          ? parsed.language
          : "English",
      fontSize:
        parsed.fontSize === "Small" ||
        parsed.fontSize === "Large"
          ? parsed.fontSize
          : "Medium",
    };
  } catch {
    return defaults;
  }
}

// ================= MAIN COMPONENT =================

export function AdminProfileSettings() {
  const { theme, setTheme } = useAdminTheme();

  // Profile state
  const [profile, setProfile] =
    useState<Profile>(initialProfile);

  const [editedProfile, setEditedProfile] =
    useState<Profile>(initialProfile);

  const [isEditing, setIsEditing] = useState(false);

  const [profileErrors, setProfileErrors] =
    useState<ProfileErrors>({});

  // Photo state
  const [profilePhoto, setProfilePhoto] =
    useState<string | null>(null);

  const [photoError, setPhotoError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preferences state
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [savedPreferences, setSavedPreferences] =
    useState<Preferences>(defaultPreferences);

  const [preferencesLoaded, setPreferencesLoaded] =
    useState(false);

  // Restore saved preferences after hydration.
  useEffect(() => {
    const restored = loadPreferences();

    setPreferences(restored);
    setSavedPreferences({
      ...restored,
      toggles: { ...restored.toggles },
    });
    setPreferencesLoaded(true);
  }, []);

  const hasUnsavedChanges =
    JSON.stringify(preferences) !==
    JSON.stringify(savedPreferences);

  // ================= WORKING FONT SIZE =================

  const fontScale =
    preferences.fontSize === "Small"
      ? 0.9
      : preferences.fontSize === "Large"
        ? 1.2
        : 1;

  const pageStyle = {
    "--profile-font-scale": fontScale,
  } as CSSProperties;

  // ================= PROFILE ACTIONS =================

  const handleEditProfile = () => {
    setEditedProfile({ ...profile });
    setProfileErrors({});
    setIsEditing(true);
  };

  const updateProfile = (
    key: "fullName" | "phone" | "email",
    value: string
  ) => {
    setEditedProfile((previous) => ({
      ...previous,
      [key]: value,
    }));

    setProfileErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));
  };

  const handleSaveProfile = () => {
    const errors = validateProfile(editedProfile);

    setProfileErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setProfile({
      ...editedProfile,
      fullName: editedProfile.fullName.trim(),
      email: editedProfile.email.trim(),
      phone: editedProfile.phone.trim(),
    });

    setProfileErrors({});
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile({ ...profile });
    setProfileErrors({});
    setIsEditing(false);
  };

  // ================= PHOTO ACTIONS =================

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Choose a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
        setPhotoError("");
      }
    };

    reader.onerror = () => {
      setPhotoError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // ================= PREFERENCE ACTIONS =================

  const updatePreferences = (
    changes: Partial<Preferences>
  ) => {
    setPreferences((previous) => ({
      ...previous,
      ...changes,
    }));
  };

  const handleToggle = (key: ToggleKey) => {
    setPreferences((previous) => ({
      ...previous,
      toggles: {
        ...previous.toggles,
        [key]: !previous.toggles[key],
      },
    }));
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(preferences)
      );

      setSavedPreferences({
        ...preferences,
        toggles: { ...preferences.toggles },
      });
    } catch {
      window.alert(
        "Unable to save preferences in this browser."
      );
    }
  };

  const handleDiscardPreferences = () => {
    setPreferences({
      ...savedPreferences,
      toggles: { ...savedPreferences.toggles },
    });
  };

  // ================= STYLES =================

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm " +
    "transition-colors sm:p-6 dark:border-slate-700 dark:bg-slate-900";

  const selectedOptionClass =
    "border-blue-500 bg-blue-50 text-blue-700 " +
    "dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200";

  const unselectedOptionClass =
    "border-slate-200 text-slate-600 hover:bg-slate-50 " +
    "dark:border-slate-700 dark:text-slate-300 " +
    "dark:hover:bg-slate-800";

  const secondaryButtonClass =
    "rounded-lg border border-slate-200 px-4 py-2 " +
    "font-medium transition-colors hover:bg-slate-50 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-blue-600 " +
    "dark:border-slate-700 dark:text-slate-200 " +
    "dark:hover:bg-slate-800";

  // ================= PAGE =================

  return (
    <main
      id="admin-profile-settings"
      style={pageStyle}
      className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-[#14213d] transition-colors sm:px-7 lg:px-9 dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Font scaling applies only inside this page. */}
      <style>{`
        #admin-profile-settings .text-xs {
          font-size: calc(0.75rem * var(--profile-font-scale));
        }

        #admin-profile-settings .text-sm {
          font-size: calc(0.875rem * var(--profile-font-scale));
        }

        #admin-profile-settings .text-2xl {
          font-size: calc(1.5rem * var(--profile-font-scale));
        }

        #admin-profile-settings .text-\\[11px\\] {
          font-size: calc(11px * var(--profile-font-scale));
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-5">

        {/* PAGE HEADER */}
        <header className="mb-7">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 rounded-md text-sm text-slate-500 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold">
            Profile Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your administrator account, preferences
            and security settings.
          </p>
        </header>

        {/* PROFILE INFORMATION */}
        <section className={cardClass}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <SectionHeading
              icon={<UserRound size={17} />}
              title="Profile Information"
            />

            {!isEditing && (
              <button
                type="button"
                onClick={handleEditProfile}
                className={`flex items-center gap-2 text-xs ${secondaryButtonClass}`}
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row">

            {/* PROFILE PHOTO */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePhoto}
                    alt="Admin profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={40}
                    className="text-slate-400 dark:text-slate-500"
                  />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Upload profile photo"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-blue-400 dark:hover:bg-slate-800"
              >
                <Camera size={13} />
                Change Photo
              </button>

              <p className="max-w-40 text-center text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG or WebP — maximum 2 MB
              </p>

              {photoError && (
                <p
                  role="alert"
                  className="max-w-40 text-center text-xs text-red-600 dark:text-red-400"
                >
                  {photoError}
                </p>
              )}
            </div>

            {/* PROFILE DETAILS */}
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditableField
                    id="admin-full-name"
                    label="Full Name"
                    value={editedProfile.fullName}
                    onChange={(value) =>
                      updateProfile("fullName", value)
                    }
                    error={profileErrors.fullName}
                  />

                  <ProfileField
                    label="Role"
                    value={profile.role}
                  />

                  <ProfileField
                    label="Department"
                    value={profile.department}
                  />

                  <ProfileField
                    label="Study Centre"
                    value={profile.studyCentre}
                  />

                  <EditableField
                    id="admin-phone"
                    label="Phone"
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(value) =>
                      updateProfile("phone", value)
                    }
                    error={profileErrors.phone}
                  />

                  <EditableField
                    id="admin-email"
                    label="Email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(value) =>
                      updateProfile("email", value)
                    }
                    error={profileErrors.email}
                  />

                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Save Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={`text-sm ${secondaryButtonClass}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  <ProfileField
                    label="Full Name"
                    value={profile.fullName}
                  />

                  <ProfileField
                    label="Role"
                    value={profile.role}
                  />

                  <ProfileField
                    label="Department"
                    value={profile.department}
                  />

                  <ProfileField
                    label="Study Centre"
                    value={profile.studyCentre}
                  />

                  <ProfileField
                    label="Phone"
                    value={profile.phone}
                  />

                  <ProfileField
                    label="Email"
                    value={profile.email}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SETTINGS GRID */}
        <div className="grid gap-5 xl:grid-cols-2">

          {/* ACCOUNT & SECURITY */}
          <section className={cardClass}>
            <SectionHeading
              icon={<LockKeyhole size={17} />}
              title="Account & Security"
            />

            <div className="mt-7 space-y-5">
              <div>
                <FieldLabel>Email Address</FieldLabel>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  {profile.email}
                </div>
              </div>

              <div>
                <FieldLabel>Password</FieldLabel>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                    ••••••••••
                  </div>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Not connected
                  </span>
                </div>
              </div>

              <div>
                <FieldLabel>
                  Two-Factor Authentication
                </FieldLabel>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add an extra layer of security to your account
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Not configured
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
                <FieldLabel>Last Login</FieldLabel>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Session information will appear here.
                </p>
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className={cardClass}>
            <SectionHeading
              icon={<Bell size={17} />}
              title="Notification Preferences"
            />

            <div className="mt-7 space-y-5">
              {notificationItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item.label}
                  </span>

                  <Toggle
                    checked={preferences.toggles[item.key]}
                    onChange={() =>
                      handleToggle(item.key)
                    }
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* APPEARANCE */}
          <section className={cardClass}>
            <SectionHeading
              icon={<Sun size={17} />}
              title="Appearance"
            />

            <div className="mt-7 space-y-6">
              {/* THEME */}
              <div>
                <FieldLabel>Theme</FieldLabel>

                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                  Choose your preferred dashboard appearance.
                </p>

                <div className="flex flex-wrap gap-2">
                  {(["light", "dark"] as const).map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-pressed={theme === value}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                          theme === value
                            ? selectedOptionClass
                            : unselectedOptionClass
                        }`}
                      >
                        {value === "light" ? (
                          <Sun size={14} />
                        ) : (
                          <Moon size={14} />
                        )}

                        {value === "light"
                          ? "Light"
                          : "Dark"}
                      </button>
                    )
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Theme changes apply immediately and are
                  saved in this browser.
                </p>
              </div>

              {/* LANGUAGE — SELECTION ONLY */}
              <div>
                <label
                  htmlFor="admin-language"
                  className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Language
                </label>

                <select
                  id="admin-language"
                  value={preferences.language}
                  onChange={(event) =>
                    updatePreferences({
                      language:
                        event.target.value as Language,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="English">
                    English
                  </option>
                  <option value="Tamil">
                    Tamil
                  </option>
                  <option value="Sinhala">
                    Sinhala
                  </option>
                </select>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Language selection is saved as a preference.
                  Interface translation is not enabled.
                </p>
              </div>

              {/* FONT SIZE — FUNCTIONAL */}
              <div>
                <FieldLabel>Font Size</FieldLabel>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    ["Small", "Medium", "Large"] as FontSize[]
                  ).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        updatePreferences({
                          fontSize: value,
                        })
                      }
                      aria-pressed={
                        preferences.fontSize === value
                      }
                      className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                        preferences.fontSize === value
                          ? selectedOptionClass
                          : unselectedOptionClass
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Text size changes immediately on this page.
                </p>
              </div>
            </div>
          </section>

          {/* PRIVACY */}
          <section className={cardClass}>
            <SectionHeading
              icon={<ShieldCheck size={17} />}
              title="Privacy Settings"
            />

            <div className="mt-7 space-y-5">
              {privacyItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <Toggle
                    checked={preferences.toggles[item.key]}
                    onChange={() =>
                      handleToggle(item.key)
                    }
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SAVE PREFERENCES */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={20}
              className="shrink-0 text-blue-600 dark:text-blue-400"
            />

            <div>
              <p
                role="status"
                aria-live="polite"
                className="text-sm font-semibold"
              >
                {hasUnsavedChanges
                  ? "You have unsaved changes"
                  : "Preferences are up to date"}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Preferences are saved in this browser.
                Profile details remain frontend-only.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDiscardPreferences}
              disabled={
                !hasUnsavedChanges ||
                !preferencesLoaded
              }
              className={`text-sm disabled:cursor-not-allowed disabled:opacity-50 ${secondaryButtonClass}`}
            >
              Discard Changes
            </button>

            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={
                !hasUnsavedChanges ||
                !preferencesLoaded
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ================= REUSABLE COMPONENTS =================

function SectionHeading({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
        {icon}
      </div>

      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function EditableField({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : undefined
        }
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-800 dark:text-slate-100 ${
          error
            ? "border-red-500 dark:border-red-400"
            : "border-slate-300 focus:border-blue-500 dark:border-slate-600"
        }`}
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function FieldLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </p>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        checked
          ? "bg-blue-600"
          : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}
