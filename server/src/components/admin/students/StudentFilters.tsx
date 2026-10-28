"use client";

import { Search, RotateCcw } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserStatus } from "@/components/admin/users/types";

interface StudentFiltersProps {
  statusFilter: "all" | UserStatus;
  search: string;
  onStatusChange: (value: "all" | UserStatus) => void;
  onSearchChange: (value: string) => void;
}

export default function StudentFilters({
  statusFilter,
  search,
  onStatusChange,
  onSearchChange,
}: StudentFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Filter by name or ID..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusChange(value as "all" | UserStatus)}
        >
          <SelectTrigger className="h-10 min-w-[170px] bg-white text-sm text-slate-700">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        aria-label="Clear filters"
        onClick={() => {
          onStatusChange("all");
          onSearchChange("");
        }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
