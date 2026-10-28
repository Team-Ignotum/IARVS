import type { Center } from "../generated/client";
import prisma from "@/lib/prisma";

export class CenterRepository {
  // Only the fields the client needs; the numeric id and audit columns stay internal.
  getActiveOptions() {
    return prisma.center.findMany({
      where: { isActive: true },
      select: { centerId: true, centerName: true },
      orderBy: { centerName: "asc" },
    });
  }

  findByCenterId(centerId: string): Promise<Center | null> {
    return prisma.center.findUnique({
      where: { centerId },
    });
  }
}
