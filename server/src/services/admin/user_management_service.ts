import { Prisma } from "@/generated/client";
import { UserRepository } from "@/repositories/user_repository_impl";
import { CenterRepository } from "@/repositories/center_repository_impl";

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalStaff: number;
  totalAdmins: number;
  totalSuperStaff: number;
  totalCenters: number;
  activeUsers: number;
  inactiveUsers: number;
  activeStudents: number;
  inactiveStudents: number;
  activeStaff: number;
  inactiveStaff: number;
}

export interface ListUsersFilters {
  role?: "STUDENT" | "STAFF" | "ADMIN" | "SUPER_STAFF";
  status?: "ACTIVE" | "INACTIVE";
  center?: string;
  intake?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface AdminUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "STUDENT" | "STAFF" | "ADMIN" | "SUPER_STAFF";
  status: "ACTIVE" | "INACTIVE";
  centerId: string | null;
  centerName: string | null;
  stNumber: string | null;
  regNumber: string | null;
  intake: string | null;
  createdAt: string;
}

export interface UserListResult {
  users: AdminUser[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

type AdminUserRow = Awaited<
  ReturnType<UserRepository["findForAdmin"]>
>[number];

function toAdminUser(row: AdminUserRow): AdminUser {
  return {
    userId: row.userId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    role: row.role,
    status: row.status,
    centerId: row.center?.centerId ?? null,
    centerName: row.center?.centerName ?? null,
    stNumber: row.stNumber,
    regNumber: row.regNumber,
    intake: row.intake,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // One grouped query instead of a dozen separate counts.
  const [grouped, totalCenters] = await Promise.all([
    new UserRepository().groupByRoleAndStatus(),
    new CenterRepository().count(),
  ]);

  const stats: DashboardStats = {
    totalUsers: 0,
    totalStudents: 0,
    totalStaff: 0,
    totalAdmins: 0,
    totalSuperStaff: 0,
    totalCenters,
    activeUsers: 0,
    inactiveUsers: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    activeStaff: 0,
    inactiveStaff: 0,
  };

  for (const row of grouped) {
    const count = row._count._all;
    const isActive = row.status === "ACTIVE";

    stats.totalUsers += count;
    if (isActive) {
      stats.activeUsers += count;
    } else {
      stats.inactiveUsers += count;
    }

    switch (row.role) {
      case "STUDENT":
        stats.totalStudents += count;
        if (isActive) stats.activeStudents += count;
        else stats.inactiveStudents += count;
        break;
      case "STAFF":
        stats.totalStaff += count;
        if (isActive) stats.activeStaff += count;
        else stats.inactiveStaff += count;
        break;
      case "ADMIN":
        stats.totalAdmins += count;
        break;
      case "SUPER_STAFF":
        stats.totalSuperStaff += count;
        break;
    }
  }

  return stats;
}

export async function listUsers(
  filters: ListUsersFilters,
): Promise<UserListResult> {
  const { role, status, center, intake, search, page, pageSize } = filters;

  const where: Prisma.UserWhereInput = {};

  if (role) where.role = role;
  if (status) where.status = status;
  if (intake) where.intake = intake;

  if (center === "none") {
    where.centerId = null;
  } else if (center) {
    where.center = { centerId: center };
  }

  if (search) {
    where.OR = [
      { userId: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { stNumber: { contains: search, mode: "insensitive" } },
      { regNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  const userRepository = new UserRepository();
  const [total, rows] = await Promise.all([
    userRepository.countForAdmin(where),
    userRepository.findForAdmin(where, (page - 1) * pageSize, pageSize),
  ]);

  return {
    users: rows.map(toAdminUser),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<AdminUser | null> {
  try {
    return toAdminUser(await new UserRepository().updateStatus(userId, status));
  } catch (error) {
    // P2025 = record to update not found
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }

    throw error;
  }
}
