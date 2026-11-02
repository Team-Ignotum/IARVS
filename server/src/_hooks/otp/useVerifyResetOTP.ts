"use client";

import { useMutation } from "@tanstack/react-query";

interface VerifyResetOTPInput {
  challenge: string;
  code: string;
}

interface VerifyResetOTPResponse {
  success: boolean;
  resetToken: string;
  expiresIn: number;
}

export function useVerifyResetOTP() {
  return useMutation<VerifyResetOTPResponse, Error, VerifyResetOTPInput>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/forgot-password/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Invalid or expired OTP");
      }

      if (data.success !== true || typeof data.resetToken !== "string") {
        throw new Error("Unexpected verification response");
      }

      return data as VerifyResetOTPResponse;
    },
    retry: false,
  });
}
