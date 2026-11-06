"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useProfilePreferences } from "@/_hooks/admin/useProfilePreferences";
import { AccountSecurityCard } from "@/components/admin/profile-settings/AccountSecurityCard";
import { AppearanceCard } from "@/components/admin/profile-settings/AppearanceCard";
import { NotificationPreferencesCard } from "@/components/admin/profile-settings/NotificationPreferencesCard";
import { PreferencesSaveBar } from "@/components/admin/profile-settings/PreferencesSaveBar";
import { ProfileCard } from "@/components/admin/profile-settings/ProfileCard";
import { initialProfile } from "@/components/admin/profile-settings/types";

export function AdminProfileSettings() {
  const {
    preferences,
    hasUnsavedChanges,
    isLoaded,
    message,
    pageStyle,
    toggleNotification,
    changeFontSize,
    savePreferences,
    discardPreferences,
  } = useProfilePreferences();

  const [profile, setProfile] = useState(initialProfile);

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

          <h1 className="text-2xl font-bold">Profile Settings</h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your administrator account, preferences and
            security.
          </p>
        </header>

        <ProfileCard
          profile={profile}
          onSaveProfile={setProfile}
        />

        {/* BALANCED TWO-COLUMN SETTINGS LAYOUT */}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {/* LEFT COLUMN — ACCOUNT & SECURITY */}

          <div className="min-w-0">
            <AccountSecurityCard email={profile.email} />
          </div>

          {/* RIGHT COLUMN — STACKED CARDS */}

          <div className="min-w-0 space-y-5">
            <NotificationPreferencesCard
              toggles={preferences.toggles}
              onToggle={toggleNotification}
            />

            <AppearanceCard
              fontSize={preferences.fontSize}
              onFontSizeChange={changeFontSize}
            />
          </div>
        </div>

        <PreferencesSaveBar
          hasUnsavedChanges={hasUnsavedChanges}
          isLoaded={isLoaded}
          message={message}
          onSave={savePreferences}
          onDiscard={discardPreferences}
        />
      </div>
    </main>
  );
}
