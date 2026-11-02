"use client";

import { useMutation } from "@tanstack/react-query";

interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export function useResetPassword() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordInput>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Password reset failed");
      }

      return data as ResetPasswordResponse;
    },
    retry: false,
  });
}
