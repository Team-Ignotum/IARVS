export type UserRole = "Student" | "Staff" | "SuperAdmin";
export type UserStatus = "Active" | "Inactive";

export type ApiUserRole = "student" | "staff" | "superAdmin";

export type StudentStatus = "Approved" | "Pending" | "Expired";

export interface ApiUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiUserRole;
  isActive: boolean;
  batchNo: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  center: string | null;
  createdAt: string;
  avatar?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (user: UserRecord) => React.ReactNode;
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  studentId: string;
  registeredCenter: string;
  registrationNo: string;
  status: StudentStatus;
  avatar?: string;
}

export interface StudentColumnConfig {
  key: string;
  label: string;
  render?: (student: StudentRecord) => React.ReactNode;
}