"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterBar from "@/components/admin/FilterBar";
import { useCenters } from "@/_hooks/register/useCenters";

import { UserRole, UserStatus, UserCenterFilter } from "./types";

interface UsersFiltersProps {
  roleFilter: "all" | UserRole;
  statusFilter: "all" | UserStatus;
  centerFilter: UserCenterFilter;
  search: string;
  onRoleChange: (value: "all" | UserRole) => void;
  onStatusChange: (value: "all" | UserStatus) => void;
  onCenterChange: (value: UserCenterFilter) => void;
  onSearchChange: (value: string) => void;
}

export default function UsersFilters({
  roleFilter,
  statusFilter,
  centerFilter,
  search,
  onRoleChange,
  onStatusChange,
  onCenterChange,
  onSearchChange,
}: UsersFiltersProps) {
  const { data: centers = [], isLoading: centersLoading } = useCenters();

  return (
    <FilterBar>
      {/* Filter based on Role */}
      <FilterBar.Field label="Role">
        <Select
          value={roleFilter}
          onValueChange={(value: string) =>
            onRoleChange(value as "all" | UserRole)
          }
        >
          <SelectTrigger className="h-8 w-32.5 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="SuperStaff">Super Staff</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      {/* Filter based on Status */}
      <FilterBar.Field label="Status">
        <Select
          value={statusFilter}
          onValueChange={(value: string) =>
            onStatusChange(value as "all" | UserStatus)
          }
        >
          <SelectTrigger className="h-8 w-35 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      {/* Filter based on Center */}
      <FilterBar.Field label="Centers">
        <Select
          value={centerFilter}
          onValueChange={(value: string) =>
            onCenterChange(value as UserCenterFilter)
          }
        >
          <SelectTrigger className="h-8 w-35 bg-white">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Centers</SelectItem>

            {centersLoading ? (
              <SelectItem value="__loading" disabled>
                Loading…
              </SelectItem>
            ) : (
              centers.map((center) => (
                <SelectItem key={center.centerId} value={center.centerId}>
                  {center.centerName}
                </SelectItem>
              ))
            )}

            <SelectItem value="none">No Center</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      <FilterBar.Search
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email, or ID..."
      />
    </FilterBar>
  );
}
