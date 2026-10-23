import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { registrationSchema } from "./register.schema";
import { registerUser } from "@/services/auth/register_service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const validatedData = registrationSchema.parse(body);

    const user = await registerUser(validatedData);

    return NextResponse.json(
      {
        message: "Registration successful",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON request body" },
        { status: 400 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
