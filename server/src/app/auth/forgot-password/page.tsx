"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

import crest from "../favicon.ico.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import OTPDialog from "@/components/auth/otpDialog";

import { useForgotPassword } from "@/_hooks/forgot-Password/useForgotPassword";

import { useVerifyResetOTP } from "@/_hooks/forgot-Password/useVerifyResetOTP";

import { useResetPassword } from "@/_hooks/forgot-Password/useResetPassword";

type RecoveryStage = "request" | "reset" | "complete";

export default function ForgotPasswordPage() {
  // ==========================================
  // TANSTACK QUERY HOOKS
  // ==========================================

  const forgotMutation = useForgotPassword();
  const verifyMutation = useVerifyResetOTP();
  const resetMutation = useResetPassword();

  // ==========================================
  // RECOVERY STATE
  // ==========================================

  const [stage, setStage] = useState<RecoveryStage>("request");

  const [email, setEmail] = useState("");

  const [otpOpen, setOtpOpen] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [expiresIn, setExpiresIn] = useState(300);

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // STEP 1: REQUEST PASSWORD RESET OTP
  // ==========================================

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      const result = await forgotMutation.mutateAsync({
        email: normalizedEmail,
      });

      verifyMutation.reset();

      setEmail(normalizedEmail);
      setChallenge(result.challenge);
      setExpiresIn(result.expiresIn);
      setOtpOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to request a verification code.",
      );
    }
  };

  // ==========================================
  // STEP 2: VERIFY RESET OTP
  // ==========================================

  const handleVerifyOTP = async (code: string) => {
    const result = await verifyMutation.mutateAsync({
      challenge,
      code,
    });

    setResetToken(result.resetToken);
    setOtpOpen(false);
    setStage("reset");
    setError("");
  };

  // ==========================================
  // STEP 3: RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 12) {
      setError("Password must contain at least 12 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      setError(
        "Your password reset session is invalid. Please request a new code.",
      );
      return;
    }

    try {
      await resetMutation.mutateAsync({
        resetToken,
        newPassword,
      });

      setResetToken("");
      setChallenge("");
      setNewPassword("");
      setConfirmPassword("");

      setStage("complete");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reset your password.",
      );
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ======================================
          LEFT: UNIVERSITY BRANDING
      ====================================== */}

      <section className="relative flex min-h-[520px] flex-col overflow-hidden bg-[#00152f] px-7 py-9 text-white sm:px-12 lg:min-h-screen lg:px-14">
        {/* University identity */}

        <div className="flex flex-wrap items-center gap-5">
          <Image
            src={crest}
            alt="Open University of Sri Lanka crest"
            width={110}
            height={110}
            priority
            className="h-24 w-24 object-contain sm:h-28 sm:w-28"
          />

          <div className="space-y-1">
            <p className="text-sm">ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලය</p>
            <p className="text-sm">இலங்கை திறந்த பல்கலைக்கழகம்</p>
            <p className="text-base font-medium">
              The Open University of Sri Lanka
            </p>
          </div>
        </div>

        {/* Main heading */}

        <div className="relative z-10 my-14 max-w-[460px]">
          <h1 className="text-4xl font-light leading-[1.12] tracking-tight sm:text-5xl xl:text-[54px]">
            Learning that
            <br />
            reaches
            <br />
            <span className="italic text-[#f6b81c]">
              anyone,
              <br />
              anywhere,
            </span>{" "}
            at
            <br />
            any time.
          </h1>

          <p className="mt-5 max-w-[370px] text-sm leading-6 text-slate-300">
            One account for your courses, results, library and campus services.
          </p>
        </div>

        {/* Decorative network */}

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-28 right-8 hidden h-48 w-36 opacity-60 sm:block"
          viewBox="0 0 110 170"
          fill="none"
        >
          <path
            d="M55 8L85 53L44 75L90 89L53 98L81 148L43 112L28 76L55 8Z"
            stroke="#60728B"
          />
          <circle cx="55" cy="8" r="3" fill="#F6B81C" />
          <circle cx="44" cy="75" r="3" fill="#F6B81C" />
          <circle cx="90" cy="89" r="3" fill="#60728B" />
          <circle cx="53" cy="98" r="3" fill="#60728B" />
          <circle cx="81" cy="148" r="3" fill="#60728B" />
        </svg>

        {/* University statistics */}

        <div className="relative z-10 mt-auto border-t border-white/15 pt-6">
          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div>
              <p className="text-2xl font-bold">40,000+</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                Learners
              </p>
            </div>

            <div>
              <p className="text-xl font-semibold">9</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                Regional Centres
              </p>
            </div>

            <div>
              <p className="text-xl font-semibold">6</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                Faculties
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          RIGHT: PASSWORD RECOVERY
      ====================================== */}

      <section className="flex min-h-[650px] items-center justify-center bg-white px-6 py-14 sm:px-12 lg:min-h-screen lg:px-16">
        <div className="w-full max-w-[490px]">
          {/* ==================================
              STEP 1: REQUEST OTP
          ================================== */}

          {stage === "request" && (
            <>
              <h2 className="text-3xl font-semibold tracking-tight text-[#071936] sm:text-[34px]">
                Forgot Your Password?
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Enter your registered email address to receive a verification
                code for resetting your password.
              </p>

              <form onSubmit={handleRequestReset} className="mt-9 space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold uppercase tracking-wide text-neutral-800"
                  >
                    Registered Email Address
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="e.g. student@ousl.lk"
                    autoComplete="email"
                    required
                    disabled={forgotMutation.isPending}
                    className="h-12 rounded-lg border-slate-300 bg-[#fafafa] px-4 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Link
                    href="/auth/login"
                    className="inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-[#20395f] transition-colors hover:bg-slate-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>

                  <Button
                    type="submit"
                    disabled={forgotMutation.isPending}
                    className="h-11 min-w-[145px] rounded-lg bg-[#1d3a66] text-white hover:bg-[#152e53]"
                  >
                    {forgotMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>
              </form>

              <p className="mt-12 text-center text-sm leading-6 text-neutral-500">
                If the email address is associated with an account, you will
                receive a verification code.
              </p>
            </>
          )}

          {/* ==================================
              STEP 3: CREATE NEW PASSWORD
          ================================== */}

          {stage === "reset" && (
            <>
              <h2 className="text-3xl font-semibold tracking-tight text-[#071936] sm:text-[34px]">
                Create New Password
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Your email verification was successful. Enter and confirm your
                new password.
              </p>

              <form onSubmit={handleResetPassword} className="mt-9 space-y-7">
                {/* New password */}

                <div className="space-y-3">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-semibold uppercase tracking-wide text-neutral-800"
                  >
                    New Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      minLength={12}
                      maxLength={128}
                      required
                      disabled={resetMutation.isPending}
                      className="h-12 rounded-lg border-slate-300 bg-[#fafafa] px-4 pr-12 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#20395f]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Use at least 12 characters.
                  </p>
                </div>

                {/* Confirm password */}

                <div className="space-y-3">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold uppercase tracking-wide text-neutral-800"
                  >
                    Confirm New Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      minLength={12}
                      maxLength={128}
                      required
                      disabled={resetMutation.isPending}
                      className="h-12 rounded-lg border-slate-300 bg-[#fafafa] px-4 pr-12 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#20395f]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="h-12 w-full rounded-lg bg-[#1d3a66] text-white hover:bg-[#152e53]"
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
          )}

          {/* ==================================
              STEP 4: SUCCESS
          ================================== */}

          {stage === "complete" && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-[#071936]">
                Password Updated
              </h2>

              <p className="text-sm leading-6 text-neutral-600">
                Your password has been changed successfully. You can now sign in
                with your new password.
              </p>

              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-[#1d3a66] px-8 text-sm font-medium text-white transition-colors hover:bg-[#152e53]"
              >
                Return to Login
              </Link>
            </div>
          )}

          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {/* ==================================
              IT HELPDESK
          ================================== */}

          <div className="mt-12 text-sm leading-6 text-neutral-600">
            <p>Trouble signing in? Contact the IT Helpdesk.</p>

            <p>
              <a href="tel:0112881378" className="underline">
                0112 881 378
              </a>
              {" or "}
              <a href="tel:0112881055" className="underline">
                0112 881 055
              </a>
              , ext. 1175 / 1176
            </p>

            <a href="mailto:ithelpdesk@ou.ac.lk" className="underline">
              ithelpdesk@ou.ac.lk
            </a>
          </div>
        </div>
      </section>

      {/* ======================================
          STEP 2: OTP VERIFICATION POPUP
      ====================================== */}

      <OTPDialog
        open={otpOpen}
        onOpenChange={setOtpOpen}
        email={email}
        challenge={challenge}
        expiresIn={expiresIn}
        loading={verifyMutation.isPending}
        error={verifyMutation.error?.message}
        onVerify={handleVerifyOTP}
      />
    </main>
  );
}
