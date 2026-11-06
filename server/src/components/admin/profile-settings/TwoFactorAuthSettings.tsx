"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

type TwoFactorStatus = {
  enabled: boolean;
};

type ChallengeResponse = {
  challenge: string;
  expiresIn: number;
};

export function TwoFactorAuthSettings() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [challenge, setChallenge] = useState("");
  const [targetEnabled, setTargetEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<"idle" | "password" | "otp">("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch("/api/profile/2fa", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load 2FA status.");
        }

        const result: TwoFactorStatus = await response.json();
        setEnabled(result.enabled);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load 2FA status.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadStatus();
  }, []);

  const beginChange = () => {
    setTargetEnabled(!enabled);
    setPassword("");
    setOtp("");
    setChallenge("");
    setError("");
    setSuccess("");
    setStep("password");
  };

  const requestOTP = async () => {
    if (!password) {
      setError("Enter your current password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/profile/2fa/request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: password,
          enabled: targetEnabled,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send verification code.");
      }

      const data = result as ChallengeResponse;

      setChallenge(data.challenge);
      setPassword("");
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmChange = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid six-digit verification code.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/profile/2fa/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge,
          code: otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed.");
      }

      setEnabled(result.enabled);
      setStep("idle");
      setChallenge("");
      setOtp("");
      setSuccess(
        result.enabled
          ? "Two-factor authentication enabled successfully."
          : "Two-factor authentication disabled successfully.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" />
        Loading security settings...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-blue-600" />
        <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Require an email verification code when signing in to your IARVS
        account.
      </p>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Email OTP Verification</p>
          <p className="text-xs text-slate-500">
            Status: {enabled ? "Enabled" : "Disabled"}
          </p>
        </div>

        {step === "idle" && (
          <button
            type="button"
            onClick={beginChange}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            {enabled ? "Disable 2FA" : "Enable 2FA"}
          </button>
        )}
      </div>

      {step === "password" && (
        <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm font-medium">Confirm your current password</p>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Current password"
            className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={requestOTP}
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Verification Code"}
            </button>

            <button
              type="button"
              onClick={() => setStep("idle")}
              disabled={submitting}
              className="rounded-lg border px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm font-medium">
            Enter the verification code sent to your email
          </p>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            placeholder="6-digit OTP"
            className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm tracking-widest dark:border-slate-600"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={confirmChange}
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Confirm"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("idle");
                setChallenge("");
                setOtp("");
              }}
              disabled={submitting}
              className="rounded-lg border px-4 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-xs text-green-600">
          {success}
        </p>
      )}
    </div>
  );
}
