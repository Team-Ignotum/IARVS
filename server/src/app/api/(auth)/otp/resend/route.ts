import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "OTP resend is not yet enabled",
    },
    { status: 501 },
  );
}
