import { NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";

const ADMIN_ROLES = ["ADMIN", "SUPER_STAFF"];

type GuardResult =
  | { session: NonNullable<Awaited<ReturnType<typeof getSession>>>; response?: undefined }
  | { session?: undefined; response: NextResponse };

// Admin data must never be reachable by a student or staff session, so every
// admin route handler resolves the caller from the signed cookie instead of
// trusting anything the client sends.
export async function requireAdmin(): Promise<GuardResult> {
  const session = await getSession();

  if (!session) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!ADMIN_ROLES.includes(session.role)) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session };
}
