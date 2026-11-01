import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require_admin";
import { getDashboardStats } from "@/services/admin/user_management_service";

export async function GET() {
  const guard = await requireAdmin();

  if (guard.response) return guard.response;

  try {
    return NextResponse.json(await getDashboardStats());
  } catch (error) {
    console.error("Failed to load dashboard statistics:", error);

    return NextResponse.json(
      { error: "Unable to load dashboard statistics" },
      { status: 500 },
    );
  }
}
