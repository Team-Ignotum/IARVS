export type UserRole = "Student" | "Staff" | "Admin" | "SuperStaff";
export type UserStatus = "Active" | "Inactive";

/**
 * Centre filter value: "all" disables the filter, "none" matches users without
 * a centre, anything else is a centre code (e.g. "WP10").
 */
export type UserCenterFilter = "all" | "none" | (string & {});

export type DbRole = "STUDENT" | "STAFF" | "ADMIN" | "SUPER_STAFF";
export type DbStatus = "ACTIVE" | "INACTIVE";

/** Shape returned by GET /api/admin/users */
export interface AdminUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: DbRole;
  status: DbStatus;
  centerId: string | null;
  centerName: string | null;
  stNumber: string | null;
  regNumber: string | null;
  intake: string | null;
  createdAt: string;
}

export interface UserListResponse {
  users: AdminUser[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  center: string | null;
  centerName: string | null;
  createdAt: string;
  avatar?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  centerName: string | null;
  registrationNo: string | null;
  status: UserStatus;
  avatar?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (user: UserRecord) => React.ReactNode;
}
