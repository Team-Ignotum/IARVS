import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: session.userId,
      },
      select: {
        isTwoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      enabled: user.isTwoFactorEnabled,
    });
  } catch (error) {
    console.error("2FA status error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve 2FA status" },
      { status: 500 },
    );
  }
}
