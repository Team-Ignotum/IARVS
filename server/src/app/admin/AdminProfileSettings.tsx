
"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
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

type ToggleKey =
  | "email"
  | "system"
  | "override"
  | "registration"
  | "profile"
  | "communication"
  | "statistics"
  | "analytics";

// ================= SAMPLE DATA =================

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

// ================= MAIN COMPONENT =================

export function AdminProfileSettings() {
  // Shared theme from AdminThemeProvider
  const { theme, setTheme } = useAdminTheme();

  // Profile
  const [profile, setProfile] =
    useState<Profile>(initialProfile);

  const [editedProfile, setEditedProfile] =
    useState<Profile>(initialProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Photo
  const [profilePhoto, setProfilePhoto] =
    useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preferences
  const [toggles, setToggles] = useState(initialToggles);
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");
  const [saved, setSaved] = useState(false);

  // ================= PROFILE ACTIONS =================

  const handleEditProfile = () => {
    setEditedProfile({ ...profile });
    setProfileError("");
    setIsEditing(true);
  };

  const updateProfile = (
    key: keyof Profile,
    value: string
  ) => {
    setEditedProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSaveProfile = () => {
    const fullName = editedProfile.fullName.trim();
    const email = editedProfile.email.trim();

    if (!fullName) {
      setProfileError("Full name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setProfileError("Enter a valid email address.");
      return;
    }

    setProfile({
      ...editedProfile,
      fullName,
      email,
    });

    setIsEditing(false);
    setProfileError("");
  };

  const handleCancelEdit = () => {
    setEditedProfile({ ...profile });
    setProfileError("");
    setIsEditing(false);
  };

  // ================= PHOTO PREVIEW =================

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
      setProfileError("Choose a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
        setProfileError("");
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // ================= PREFERENCES =================

  const handleToggle = (key: ToggleKey) => {
    setToggles((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setSaved(false);
  };

  // ================= STYLES =================

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm " +
    "dark:border-slate-700 dark:bg-slate-900";

  const secondaryButtonClass =
    "rounded-lg border border-slate-200 px-4 py-2 text-xs " +
    "font-medium transition-colors hover:bg-slate-50 " +
    "dark:border-slate-700 dark:text-slate-200 " +
    "dark:hover:bg-slate-800";

  const selectedOptionClass =
    "border-blue-500 bg-blue-50 text-blue-700 " +
    "dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200";

  const unselectedOptionClass =
    "border-slate-200 text-slate-600 hover:bg-slate-50 " +
    "dark:border-slate-700 dark:text-slate-300 " +
    "dark:hover:bg-slate-800";

  // ================= PAGE =================

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-[#14213d] transition-colors sm:px-7 lg:px-9 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-5">

        {/* ================= PAGE HEADER ================= */}

        <header className="mb-7">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold">
            Profile Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your administrator account, preferences and
            security settings.
          </p>
        </header>

        {/* ================= PROFILE INFORMATION ================= */}

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
                className={`flex items-center gap-2 ${secondaryButtonClass}`}
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row">

            {/* Profile Photo */}

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
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                <Camera size={13} />
                Change Photo
              </button>
            </div>

            {/* Profile Details */}

            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditableField
                    label="Full Name"
                    value={editedProfile.fullName}
                    onChange={(value) =>
                      updateProfile("fullName", value)
                    }
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
                    label="Phone"
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(value) =>
                      updateProfile("phone", value)
                    }
                  />

                  <EditableField
                    label="Email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(value) =>
                      updateProfile("email", value)
                    }
                  />

                  {profileError && (
                    <p
                      role="alert"
                      className="text-sm text-red-600 sm:col-span-2 dark:text-red-400"
                    >
                      {profileError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Save Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-slate-300 px-5 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
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

          {!isEditing && profileError && (
            <p
              role="alert"
              className="mt-4 text-sm text-red-600 dark:text-red-400"
            >
              {profileError}
            </p>
          )}
        </section>

        {/* ================= SETTINGS GRID ================= */}

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

                <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <span className="truncate text-slate-600 dark:text-slate-200">
                    {profile.email}
                  </span>

                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Demo
                  </span>
                </div>
              </div>

              <div>
                <FieldLabel>Password</FieldLabel>

                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                    ••••••••••
                  </div>

                  <span className="flex items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-400 dark:border-slate-700 dark:text-slate-500">
                    Not connected
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <FieldLabel>
                    Two-Factor Authentication
                  </FieldLabel>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Add an extra layer of security to your account
                  </p>
                </div>

                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Not configured
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Last Login
                </p>

                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Session information will appear here.
                </p>
              </div>
            </div>
          </section>

          {/* NOTIFICATION PREFERENCES */}

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
                    checked={toggles[item.key]}
                    onChange={() => handleToggle(item.key)}
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ================= APPEARANCE ================= */}

          <section className={cardClass}>
            <SectionHeading
              icon={<Sun size={17} />}
              title="Appearance"
            />

            <div className="mt-7 space-y-6">

              {/* Shared Light/Dark Theme */}

              <div>
                <FieldLabel>Theme</FieldLabel>

                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                  Choose your preferred dashboard appearance.
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(["light", "dark"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      aria-pressed={theme === value}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
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

                      {value === "light" ? "Light" : "Dark"}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Theme changes apply immediately and are saved
                  in this browser.
                </p>
              </div>

              {/* Language */}

              <div>
                <FieldLabel>Language</FieldLabel>

                <select
                  aria-label="Language"
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    setSaved(false);
                  }}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Sinhala">Sinhala</option>
                </select>
              </div>

              {/* Font Size */}

              <div>
                <FieldLabel>Font Size</FieldLabel>

                <div className="mt-2 flex flex-wrap gap-2">
                  {["Small", "Medium", "Large"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setFontSize(value);
                        setSaved(false);
                      }}
                      aria-pressed={fontSize === value}
                      className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                        fontSize === value
                          ? selectedOptionClass
                          : unselectedOptionClass
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* PRIVACY SETTINGS */}

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
                    checked={toggles[item.key]}
                    onChange={() => handleToggle(item.key)}
                    label={item.label}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ================= SAVE PREFERENCES ================= */}

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
          <div className="flex items-center gap-3">
            <ShieldCheck
              className="text-blue-600 dark:text-blue-400"
              size={20}
            />

            <div>
              <p className="text-sm font-semibold">
                Your data is secure with us.
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Preferences are currently stored in frontend state
                only, except the browser-saved theme.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSaved(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Check size={16} />
            {saved ? "Selected" : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}

// ================= REUSABLE UI =================

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
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `admin-profile-${label
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

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
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400"
      />
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
