import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require_admin";
import { listUsers } from "@/services/admin/user_management_service";
import { userListQuerySchema } from "./users.schema";

export async function GET(request: Request) {
  const guard = await requireAdmin();

  if (guard.response) return guard.response;

  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const validation = userListQuerySchema.safeParse(params);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: validation.error.issues },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await listUsers(validation.data));
  } catch (error) {
    console.error("Failed to list users:", error);

    return NextResponse.json(
      { error: "Unable to load users" },
      { status: 500 },
    );
  }
}
