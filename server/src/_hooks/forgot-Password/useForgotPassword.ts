"use client";

import { useMutation } from "@tanstack/react-query";

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  challenge: string;
  expiresIn: number;
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponse, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      const response = await fetch("/api/forgot-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to request password reset");
      }

      if (
        typeof data.challenge !== "string" ||
        typeof data.expiresIn !== "number"
      ) {
        throw new Error("Unexpected recovery response");
      }

      return data as ForgotPasswordResponse;
    },
    retry: false,
  });
}
