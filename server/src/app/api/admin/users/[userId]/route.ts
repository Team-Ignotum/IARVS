import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require_admin";
import { updateUserStatus } from "@/services/admin/user_management_service";
import { updateUserStatusSchema } from "../users.schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const guard = await requireAdmin();

  if (guard.response) return guard.response;

  const { userId } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const validation = updateUserStatusSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid status", details: validation.error.issues },
      { status: 400 },
    );
  }

  // An admin deactivating their own account would lock themselves out mid-session.
  if (guard.session.id === userId) {
    return NextResponse.json(
      { error: "You cannot change your own account status" },
      { status: 400 },
    );
  }

  try {
    const user = await updateUserStatus(userId, validation.data.status);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to update user status:", error);

    return NextResponse.json(
      { error: "Unable to update user status" },
      { status: 500 },
    );
  }
}
