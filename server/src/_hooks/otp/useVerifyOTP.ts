"use client";

import { useMutation } from "@tanstack/react-query";

// ==========================================
// TYPES
// ==========================================

interface VerifyOTPInput {
  challenge: string;
  code: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
  redirectUrl: string;
}

// ==========================================
// VERIFY LOGIN OTP HOOK
// ==========================================

export function useVerifyOTP() {
  return useMutation<VerifyOTPResponse, Error, VerifyOTPInput>({
    mutationFn: async ({ challenge, code }) => {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          challenge,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      if (data.success !== true || typeof data.redirectUrl !== "string") {
        throw new Error("Invalid OTP verification response");
      }

      return data as VerifyOTPResponse;
    },

    // Avoid retrying failed OTP verification
    // because the backend limits attempts.
    retry: false,
  });
}
