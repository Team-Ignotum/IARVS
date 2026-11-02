"use client";

import { useMutation } from "@tanstack/react-query";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  requiresOTP: boolean;
  challenge: string;
  expiresIn: number;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async ({ email, password }) => {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (
        data.requiresOTP !== true ||
        typeof data.challenge !== "string" ||
        typeof data.expiresIn !== "number"
      ) {
        throw new Error("Invalid authentication response");
      }

      return data as LoginResponse;
    },

    // Authentication mutations should not
    // automatically retry.
    retry: false,
  });
}