import { NextResponse } from "next/server";
import { CenterRepository } from "@/repositories/center_repository_impl";

// Reference data for the pre-login registration form, so it is intentionally public.
// Only the centre code and name are exposed.
export async function GET() {
  try {
    const centers = await new CenterRepository().getActiveOptions();

    return NextResponse.json({ centers });
  } catch (error) {
    console.error("Failed to load centers:", error);

    return NextResponse.json(
      { error: "Unable to load centers" },
      { status: 500 },
    );
  }
}
