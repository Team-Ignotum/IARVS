import {
  AdminUser,
  DbRole,
  DbStatus,
  StudentRecord,
  UserCenterFilter,
  UserRecord,
  UserRole,
  UserStatus,
} from "./types";

export function toUserRole(role: DbRole): UserRole {
  switch (role) {
    case "STUDENT":
      return "Student";
    case "STAFF":
      return "Staff";
    case "ADMIN":
      return "Admin";
    case "SUPER_STAFF":
      return "SuperStaff";
  }
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function mapAdminUserToRecord(user: AdminUser): UserRecord {
  return {
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: toUserRole(user.role),
    status: user.status === "ACTIVE" ? "Active" : "Inactive",
    center: user.centerId,
    centerName: user.centerName,
    createdAt: formatDate(user.createdAt),
  };
}

export function mapAdminUserToStudent(user: AdminUser): StudentRecord {
  return {
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    studentId: user.stNumber,
    centerName: user.centerName,
    registrationNo: user.regNumber,
    status: user.status === "ACTIVE" ? "Active" : "Inactive",
  };
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function toDbRole(role: "all" | UserRole): DbRole | undefined {
  switch (role) {
    case "Student":
      return "STUDENT";
    case "Staff":
      return "STAFF";
    case "Admin":
      return "ADMIN";
    case "SuperStaff":
      return "SUPER_STAFF";
    default:
      return undefined;
  }
}

export function toDbStatus(status: "all" | UserStatus): DbStatus | undefined {
  if (status === "Active") return "ACTIVE";
  if (status === "Inactive") return "INACTIVE";
  return undefined;
}

/** "all" means no filter; "none" is forwarded so the API matches users without a centre. */
export function toCenterParam(center: UserCenterFilter): string | undefined {
  return center === "all" ? undefined : center;
}
