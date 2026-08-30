export type UserRole = "Student" | "Staff" | "SuperStaff" | "SuperAdmin";
export type UserStatus = "Active" | "Inactive";
export type UserCenter =
  | "WP10"
  | "CP20"
  | "SP30"
  | "NP40"
  | "NC50"
  | "EP60"
  | "NW70"
  | "UP80"
  | "SG90"
  | "SP31"
  | "SP33"
  | "EP61"
  | "UP81"
  | "SP32"
  | "WP11"
  | "CP21"
  | "WP12"
  | "SG91"
  | "NP42"
  | "NP44"
  | "UP82"
  | "NP43"
  | "NC51"
  | "NW71"
  | "NW73"
  | "EP62"
  | "NP41";

export type UserCenterFilter = "all" | "none" | UserCenter;

export type ApiUserRole = "student" | "staff" | "superStaff" | "superAdmin";

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
  center: UserCenter | null;
  createdAt: string;
  avatar?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (user: UserRecord) => React.ReactNode;
}

export const OUSL_CENTERS: { 
  code: UserCenter; 
  name: string }[] = [
  { code: "WP10", name: "Colombo" },
  { code: "CP20", name: "Kandy" },
  { code: "SP30", name: "Matara" },
  { code: "NP40", name: "Jaffna" },
  { code: "NC50", name: "Anuradhapura" },
  { code: "EP60", name: "Batticaloa" },
  { code: "NW70", name: "Kurunegala" },
  { code: "UP80", name: "Badulla" },
  { code: "SG90", name: "Ratnapura" },
  { code: "SP31", name: "Ambalangoda" },
  { code: "SP33", name: "Ambalantota" },
  { code: "EP61", name: "Ampara" },
  { code: "UP81", name: "Bandarawela" },
  { code: "SP32", name: "Galle" },
  { code: "WP11", name: "Gampaha" },
  { code: "CP21", name: "Hatton" },
  { code: "WP12", name: "Kalutara" },
  { code: "SG91", name: "Kegalle" },
  { code: "NP42", name: "Kilinochchi" },
  { code: "NP44", name: "Mannar" },
  { code: "UP82", name: "Monaragala" },
  { code: "NP43", name: "Mullaitivu" },
  { code: "NC51", name: "Polonnaruwa" },
  { code: "NW71", name: "Puttalam" },
  { code: "NW73", name: "Nattandiya" },
  { code: "EP62", name: "Trincomalee" },
  { code: "NP41", name: "Vavuniya" },
];
