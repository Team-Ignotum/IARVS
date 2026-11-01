
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Moon,
  Pencil,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";

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
  | "registration";

type FontSize = "Small" | "Medium" | "Large";

type Preferences = {
  toggles: Record<ToggleKey, boolean>;
  fontSize: FontSize;
};

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
};

const defaultPreferences: Preferences = {
  toggles: { ...initialToggles },
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

const cardClass =
  "min-w-0 rounded-2xl border border-slate-200 " +
  "bg-white p-5 shadow-sm transition-colors " +
  "sm:p-6 dark:border-slate-700 dark:bg-[#0F172A]";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white " +
  "px-3 py-2.5 text-sm text-slate-900 outline-none " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 " +
  "dark:border-slate-600 dark:bg-[#1E293B] dark:text-white";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg " +
  "border border-slate-300 px-4 py-2 text-sm font-medium " +
  "hover:bg-slate-50 dark:border-slate-600 " +
  "dark:text-slate-200 dark:hover:bg-slate-800";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg " +
  "bg-blue-600 px-5 py-2.5 text-sm font-medium text-white " +
  "hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";

function validateProfile(values: Profile): ProfileErrors {
  const errors: ProfileErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName =
      "Full name must contain at least 3 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const phone = values.phone.replace(/[\s-]/g, "");

  if (!/^(?:0[1-9]\d{8}|\+94[1-9]\d{8})$/.test(phone)) {
    errors.phone = "Enter a valid Sri Lankan phone number.";
  }

  return errors;
}

function loadPreferences(): Preferences {
  const defaults: Preferences = {
    toggles: { ...initialToggles },
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

export function AdminProfileSettings() {
  const { theme, setTheme } = useAdminTheme();

  // PROFILE
  const [profile, setProfile] = useState(initialProfile);
  const [editedProfile, setEditedProfile] =
    useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [profileErrors, setProfileErrors] =
    useState<ProfileErrors>({});

  // PHOTO
  const [profilePhoto, setProfilePhoto] =
    useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PREFERENCES
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [savedPreferences, setSavedPreferences] =
    useState<Preferences>(defaultPreferences);
  const [preferencesLoaded, setPreferencesLoaded] =
    useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState("");

  // PASSWORD
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const restored = loadPreferences();
    setPreferences(restored);
    setSavedPreferences(restored);
    setPreferencesLoaded(true);
  }, []);

  const hasUnsavedChanges =
    JSON.stringify(preferences) !==
    JSON.stringify(savedPreferences);

  const fontScale =
    preferences.fontSize === "Small"
      ? 0.9
      : preferences.fontSize === "Large"
        ? 1.2
        : 1;

  const pageStyle = {
    "--profile-font-scale": fontScale,
  } as CSSProperties;

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

    if (Object.keys(errors).length > 0) return;

    setProfile({
      ...editedProfile,
      fullName: editedProfile.fullName.trim(),
      phone: editedProfile.phone.trim(),
      email: editedProfile.email.trim(),
    });

    setIsEditing(false);
  };

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setPhotoError("Only JPG, PNG or WebP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be 5 MB or smaller.");
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
  };

  const handleToggle = (key: ToggleKey) => {
    setPreferences((previous) => ({
      ...previous,
      toggles: {
        ...previous.toggles,
        [key]: !previous.toggles[key],
      },
    }));
    setPreferenceMessage("");
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

      setPreferenceMessage("Preferences saved successfully.");
    } catch {
      setPreferenceMessage("Unable to save preferences.");
    }
  };

  const handleDiscardPreferences = () => {
    setPreferences({
      ...savedPreferences,
      toggles: { ...savedPreferences.toggles },
    });
    setPreferenceMessage("");
  };

  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/\d/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setPasswordError(
        "Use at least 8 characters with uppercase, lowercase, " +
        "a number and a special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must differ from the current password."
      );
      return;
    }

    setPasswordLoading(true);

    try {
      // This requires an authenticated backend endpoint.
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
          result?.detail ||
          "Unable to change password. Check the backend connection."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password changed successfully.");
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Password change failed."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main
      id="admin-profile-settings"
      style={pageStyle}
      className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-[#14213d] sm:px-7 lg:px-9 dark:bg-[#020817] dark:text-slate-100"
    >
      <style>{`
        #admin-profile-settings .text-xs {
          font-size: calc(0.75rem * var(--profile-font-scale));
        }
        #admin-profile-settings .text-sm {
          font-size: calc(0.875rem * var(--profile-font-scale));
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* PAGE HEADER */}

        <header>
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold">
            Profile Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your administrator account, preferences and security.
          </p>
        </header>

        {/* PROFILE INFORMATION — FULL WIDTH */}

        <section className={cardClass}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <SectionHeading
              icon={<UserRound size={17} />}
              title="Profile Information"
            />

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setEditedProfile({ ...profile });
                  setProfileErrors({});
                  setIsEditing(true);
                }}
                className={secondaryButtonClass}
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-col gap-8 sm:flex-row">
            {/* PHOTO */}

            <div className="flex shrink-0 flex-col items-center gap-3">
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
                    className="text-slate-400"
                  />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Upload profile photo"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Camera size={14} />
                Change Photo
              </button>

              <p className="max-w-44 text-center text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG or WebP — maximum 5 MB
              </p>

              {photoError && (
                <p role="alert" className="max-w-44 text-center text-xs text-red-500">
                  {photoError}
                </p>
              )}
            </div>

            {/* PROFILE DETAILS */}

            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditableField
                    label="Full Name"
                    value={editedProfile.fullName}
                    onChange={(value) =>
                      updateProfile("fullName", value)
                    }
                    error={profileErrors.fullName}
                  />

                  <ProfileField label="Role" value={profile.role} />

                  <ProfileField
                    label="Department"
                    value={profile.department}
                  />

                  <ProfileField
                    label="Study Centre"
                    value={profile.studyCentre}
                  />

                  <EditableField
                    label="Phone"
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(value) =>
                      updateProfile("phone", value)
                    }
                    error={profileErrors.phone}
                  />

                  <EditableField
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
                      className={primaryButtonClass}
                    >
                      Save Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditedProfile({ ...profile });
                        setProfileErrors({});
                        setIsEditing(false);
                      }}
                      className={secondaryButtonClass}
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

        {/* BALANCED TWO-COLUMN SETTINGS LAYOUT */}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {/* LEFT COLUMN — ACCOUNT & SECURITY */}

          <div className="min-w-0">
            <section className={cardClass}>
              <SectionHeading
                icon={<LockKeyhole size={17} />}
                title="Account & Security"
              />

              <div className="mt-6">
                <FieldLabel>Email Address</FieldLabel>

                <div className="break-words rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-[#1E293B]">
                  {profile.email}
                </div>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="mt-6 space-y-4"
              >
                <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
                  <h3 className="text-sm font-semibold">
                    Change Password
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Keep your account secure with a strong password.
                  </p>
                </div>

                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  visible={showPasswords}
                  autoComplete="current-password"
                />

                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  visible={showPasswords}
                  autoComplete="new-password"
                />

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  visible={showPasswords}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((previous) => !previous)
                  }
                  className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  {showPasswords ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                  {showPasswords
                    ? "Hide Passwords"
                    : "Show Passwords"}
                </button>

                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Minimum 8 characters, including uppercase,
                  lowercase, a number and a special character.
                </p>

                {passwordError && (
                  <p role="alert" className="text-sm text-red-500">
                    {passwordError}
                  </p>
                )}

                {passwordSuccess && (
                  <p role="status" className="text-sm text-green-600 dark:text-green-400">
                    {passwordSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={primaryButtonClass}
                >
                  <ShieldCheck size={16} />
                  {passwordLoading
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </form>
            </section>
          </div>

          {/* RIGHT COLUMN — STACKED CARDS */}

          <div className="min-w-0 space-y-5">
            {/* NOTIFICATIONS */}

            <section className={cardClass}>
              <SectionHeading
                icon={<Bell size={17} />}
                title="Notification Preferences"
              />

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Choose which administrative notifications you
                would like to receive.
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
                      checked={preferences.toggles[item.key]}
                      onChange={() => handleToggle(item.key)}
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

              <div className="mt-6 space-y-6">
                {/* THEME */}

                <div>
                  <FieldLabel>Theme</FieldLabel>

                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    Choose your preferred dashboard appearance.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(["light", "dark"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-pressed={theme === value}
                        className={
                          "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors " +
                          (theme === value
                            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800")
                        }
                      >
                        {value === "light" ? (
                          <Sun size={14} />
                        ) : (
                          <Moon size={14} />
                        )}
                        {value === "light" ? "Light" : "Dark"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 dark:border-slate-700">
                  <FieldLabel>Font Size</FieldLabel>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["Small", "Medium", "Large"] as FontSize[]).map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setPreferences((previous) => ({
                              ...previous,
                              fontSize: value,
                            }));
                            setPreferenceMessage("");
                          }}
                          aria-pressed={
                            preferences.fontSize === value
                          }
                          className={
                            "rounded-lg border px-4 py-2 text-xs font-medium transition-colors " +
                            (preferences.fontSize === value
                              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800")
                          }
                        >
                          {value}
                        </button>
                      )
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    Text size changes immediately on this page.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* SAVE PREFERENCES — FULL WIDTH */}

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

              {preferenceMessage && (
                <p role="status" className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  {preferenceMessage}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={
                !hasUnsavedChanges || !preferencesLoaded
              }
              onClick={handleDiscardPreferences}
              className={`${secondaryButtonClass} disabled:opacity-50`}
            >
              Discard Changes
            </button>

            <button
              type="button"
              disabled={
                !hasUnsavedChanges || !preferencesLoaded
              }
              onClick={handleSavePreferences}
              className={primaryButtonClass}
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

// REUSABLE COMPONENTS

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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={inputClass}
      />

      {error && (
        <p role="alert" className="mt-1 text-xs text-red-500">
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

function PasswordField({
  label,
  value,
  onChange,
  visible,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  autoComplete: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        className={inputClass}
      />
    </div>
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
      className={
        "relative h-5 w-9 shrink-0 rounded-full transition-colors " +
        (checked
          ? "bg-blue-600"
          : "bg-slate-200 dark:bg-slate-700")
      }
    >
      <span
        className={
          "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform " +
          (checked ? "translate-x-4" : "")
        }
      />
    </button>
  );
}
