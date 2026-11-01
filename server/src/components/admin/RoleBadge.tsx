export type RoleValue =
  | "student"
  | "staff"
  | "admin"
  | "superStaff"
  | "Student"
  | "Staff"
  | "Admin"
  | "SuperStaff";

interface RoleBadgeProps {
  role: RoleValue | string;
}

const styles: Record<string, string> = {
  student: "bg-slate-100 text-slate-700 border-slate-200",
  Student: "bg-slate-100 text-slate-700 border-slate-200",
  staff: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Staff: "bg-emerald-50 text-emerald-700 border-emerald-200",
  admin: "bg-amber-50 text-amber-700 border-amber-200",
  Admin: "bg-amber-50 text-amber-700 border-amber-200",
  superStaff: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SuperStaff: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const labels: Record<string, string> = {
  student: "Student",
  Student: "Student",
  staff: "Staff",
  Staff: "Staff",
  admin: "Admin",
  Admin: "Admin",
  superStaff: "Super Staff",
  SuperStaff: "Super Staff",
};

/**
 * Colored pill badge for user roles.
 * Accepts both camelCase API values ("student", "superStaff") and
 * display-case values ("Student", "SuperStaff").
 *
 * Usage:
 *   <RoleBadge role={user.role} />
 *   <RoleBadge role="superStaff" />
 */
export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
        styles[role] ?? "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {labels[role] ?? role}
    </span>
  );
}
