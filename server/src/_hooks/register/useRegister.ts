"use client";

import { useMutation } from "@tanstack/react-query";
import type { UserRole } from "@/generated/enums";

// These are the values collected by the registration form and sent to the API.
export interface RegisterInput {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  center: string;
  regNumber: string;
  stNumber: string;
  intake: string;
}

// This is the successful response returned after the account is created.
export interface RegisterResponse {
  message: string;
  redirectUrl: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// The API uses this shape when registration fails, for example when validation fails.
interface RegisterErrorResponse {
  error?: string;
  details?: unknown;
}

// Keeping the status and validation details makes it easier for the form to
// distinguish between errors such as invalid input and an existing account.
export class RegisterError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "RegisterError";
    this.status = status;
    this.details = details;
  }
}

async function register(input: RegisterInput): Promise<RegisterResponse> {
  // The registration route validates a JSON request body with its Zod schema.
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  // Both successful and failed responses are returned as JSON by the API.
  const data = (await response.json()) as
    | RegisterResponse
    | RegisterErrorResponse;

  if (!response.ok) {
    // Turn the API response into a mutation error so the form can show useful feedback.
    const errorMessage =
      "error" in data && data.error
        ? data.error
        : "Registration failed";

    throw new RegisterError(
      response.status,
      errorMessage,
      "details" in data ? data.details : undefined,
    );
  }

  // Returning the parsed response makes it available through mutation.data.
  return data as RegisterResponse;
}

export function useRegister() {
  // TanStack Query manages the request lifecycle, including pending and error states.
  return useMutation({
    mutationFn: register,
  });
}