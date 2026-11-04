"use client";

import { useMutation } from "@tanstack/react-query";

interface LoginInput {
  email: string;
  password: string;
}

export type LoginResponse =
  | {
      success: true;
      message: string;
      requiresOTP: false;
      redirectUrl: string;
    }
  | {
      success: true;
      message: string;
      requiresOTP: true;
      challenge: string;
      expiresIn: number;
    };

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

      const data: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Login failed";

        throw new Error(errorMessage);
      }

      if (
        typeof data !== "object" ||
        data === null ||
        !("success" in data) ||
        data.success !== true ||
        !("requiresOTP" in data)
      ) {
        throw new Error("Invalid authentication response");
      }

      // CASE 1: 2FA DISABLED
      if (data.requiresOTP === false) {
        if (
          !("redirectUrl" in data) ||
          typeof data.redirectUrl !== "string" ||
          !data.redirectUrl.startsWith("/") ||
          data.redirectUrl.startsWith("//")
        ) {
          throw new Error("Invalid login redirect");
        }

        return {
          success: true,
          message: "Login successful",
          requiresOTP: false,
          redirectUrl: data.redirectUrl,
        };
      }

      // CASE 2: 2FA ENABLED
      if (data.requiresOTP === true) {
        if (
          !("challenge" in data) ||
          typeof data.challenge !== "string" ||
          !("expiresIn" in data) ||
          typeof data.expiresIn !== "number" ||
          !Number.isFinite(data.expiresIn) ||
          data.expiresIn <= 0
        ) {
          throw new Error("Invalid OTP authentication response");
        }

        return {
          success: true,
          message: "OTP verification required",
          requiresOTP: true,
          challenge: data.challenge,
          expiresIn: data.expiresIn,
        };
      }

      throw new Error("Invalid authentication response");
    },

    retry: false,
  });
}
