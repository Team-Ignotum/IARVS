"use client";

import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  FieldLabel,
  PasswordField,
  SectionHeading,
} from "./fields";
import { cardClass, primaryButtonClass } from "./styles";

export function AccountSecurityCard({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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
    <section className={cardClass}>
      <SectionHeading
        icon={<LockKeyhole size={17} />}
        title="Account & Security"
      />

      <div className="mt-6">
        <FieldLabel>Email Address</FieldLabel>

        <div className="break-words rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-[#1E293B]">
          {email}
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
          {showPasswords ? "Hide Passwords" : "Show Passwords"}
        </button>

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Minimum 8 characters, including uppercase, lowercase, a
          number and a special character.
        </p>

        {passwordError && (
          <p role="alert" className="text-sm text-red-500">
            {passwordError}
          </p>
        )}

        {passwordSuccess && (
          <p
            role="status"
            className="text-sm text-green-600 dark:text-green-400"
          >
            {passwordSuccess}
          </p>
        )}

        <button
          type="submit"
          disabled={passwordLoading}
          className={primaryButtonClass}
        >
          <ShieldCheck size={16} />
          {passwordLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}
