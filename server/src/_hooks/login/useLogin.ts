"use client";

import { useMutation } from "@tanstack/react-query";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  redirectUrl: string;
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      return data as LoginResponse;
    },
  });
}
