import { UserRecord, UserRole, UserStatus, UserCenterFilter } from "./types";

interface FilterUsersParams {
  users: UserRecord[];
  roleFilter: "all" | UserRole;
  statusFilter: "all" | UserStatus;
  centerFilter: UserCenterFilter;
  search: string;
}

export function filterUsers({
  users,
  roleFilter,
  statusFilter,
  centerFilter,
  search,
}: FilterUsersParams): UserRecord[] {
  const searchValue = search.trim().toLowerCase();

  return users.filter((user) => {
    // Role
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false;
    }

    // Status
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false;
    }

    // Center
    if (centerFilter !== "all") {
      if (centerFilter === "none") {
        if (user.center !== null) {
          return false;
        }
      } else if (user.center !== centerFilter) {
        return false;
      }
    }

    // Search
    if (searchValue) {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.id.toLowerCase().includes(searchValue);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}
