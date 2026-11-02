"use client";

import { useMutation } from "@tanstack/react-query";

interface VerifyInput {
  challenge: string;
  code: string;
}

interface VerifyResponse {
  success: boolean;
  resetToken: string;
}

export function useVerifyResetOTP() {
  return useMutation<VerifyResponse, Error, VerifyInput>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Invalid or expired OTP");
      }

      if (data.success !== true || typeof data.resetToken !== "string") {
        throw new Error("Invalid verification response");
      }

      return data as VerifyResponse;
    },
    retry: false,
  });
}
