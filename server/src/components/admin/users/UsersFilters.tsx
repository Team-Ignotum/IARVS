
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FilterBar from "@/components/admin/FilterBar";

import {
  OUSL_CENTERS,
  type UserRole,
  type UserStatus,
  type UserCenterFilter,
} from "./types";

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

const triggerClassName = `
  h-9 min-w-[140px]
  border border-slate-200
  bg-white text-sm text-slate-700
  transition-colors
  hover:bg-slate-50
  focus:ring-indigo-500/20
  dark:border-slate-600
  dark:bg-[#0F172A]
  dark:text-slate-100
  dark:hover:bg-slate-800
  dark:focus:ring-indigo-400/20
`;

const contentClassName = `
  border-slate-200
  bg-white text-slate-900
  dark:border-slate-700
  dark:bg-[#1E293B]
  dark:text-slate-100
`;

const itemClassName = `
  cursor-pointer
  dark:text-slate-100
  dark:focus:bg-slate-700
  dark:focus:text-white
  dark:data-[state=checked]:bg-slate-700
`;

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
  return (
    <FilterBar>
      {/* ROLE FILTER */}

      <FilterBar.Field label="Role">
        <Select
          value={roleFilter}
          onValueChange={(value) =>
            onRoleChange(value as "all" | UserRole)
          }
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>

          <SelectContent className={contentClassName}>
            <SelectItem value="all" className={itemClassName}>
              All Roles
            </SelectItem>

            <SelectItem value="Staff" className={itemClassName}>
              Staff
            </SelectItem>

            <SelectItem value="SuperStaff" className={itemClassName}>
              SuperStaff
            </SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      {/* STATUS FILTER */}

      <FilterBar.Field label="Status">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusChange(value as "all" | UserStatus)
          }
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent className={contentClassName}>
            <SelectItem value="all" className={itemClassName}>
              All Statuses
            </SelectItem>

            <SelectItem value="Active" className={itemClassName}>
              Active
            </SelectItem>

            <SelectItem value="Inactive" className={itemClassName}>
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      {/* CENTER FILTER */}

      <FilterBar.Field label="Centers">
        <Select
          value={centerFilter}
          onValueChange={(value) =>
            onCenterChange(value as UserCenterFilter)
          }
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder="All Centers" />
          </SelectTrigger>

          <SelectContent className={contentClassName}>
            <SelectItem value="all" className={itemClassName}>
              All Centers
            </SelectItem>

            {OUSL_CENTERS.map((center) => (
              <SelectItem
                key={center.code}
                value={center.code}
                className={itemClassName}
              >
                {center.name}
              </SelectItem>
            ) : (
              centers.map((center) => (
                <SelectItem key={center.centerId} value={center.centerId}>
                  {center.centerName}
                </SelectItem>
              ))
            )}

            <SelectItem value="none" className={itemClassName}>
              No Center
            </SelectItem>
          </SelectContent>
        </Select>
      </FilterBar.Field>

      {/* SEARCH */}

      <FilterBar.Search
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email, or ID..."
      />
    </FilterBar>
  );
}
