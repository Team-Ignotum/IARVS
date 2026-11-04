
"use client";

import { Search, RotateCcw } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------
// TYPES
// ---------------------------------------

export type StudentStatus =
  | "Approved"
  | "Pending"
  | "Expired";

interface StudentFiltersProps {
  statusFilter: "all" | StudentStatus;
  batchFilter: string;
  search: string;

  onStatusChange: (
    value: "all" | StudentStatus
  ) => void;

  onBatchChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

// Temporary intake options.
// Replace with real intake data when available.
const batchOptions: string[] = [
  "2023",
  "2024",
  "2025",
];

// ---------------------------------------
// COMPONENT
// ---------------------------------------

export default function StudentFilters({
  statusFilter,
  batchFilter,
  search,
  onStatusChange,
  onBatchChange,
  onSearchChange,
}: StudentFiltersProps) {
  const handleReset = () => {
    onStatusChange("all");
    onBatchChange("all");
    onSearchChange("");
  };

  const triggerClassName = `
    h-10 min-w-[170px]
    border border-slate-200
    bg-white text-sm text-slate-700
    transition-colors
    hover:bg-slate-50
    dark:border-slate-600
    dark:bg-[#0F172A]
    dark:text-slate-100
    dark:hover:bg-slate-800
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
  `;

  return (
    <div
      className="
        flex flex-wrap items-end gap-3
        rounded-xl border border-slate-200
        bg-slate-50 p-3
        transition-colors duration-200
        dark:border-slate-700
        dark:bg-[#1E293B]
      "
    >
      {/* SEARCH INPUT */}

      <div className="relative min-w-[220px] flex-1">
        <Search
          className="
            pointer-events-none absolute
            left-3 top-1/2 h-4 w-4
            -translate-y-1/2
            text-slate-400
            dark:text-slate-500
          "
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Filter by name or ID..."
          className="
            h-10 w-full rounded-lg
            border border-slate-200
            bg-white pl-9 pr-3
            text-sm text-slate-700
            placeholder:text-slate-400
            outline-none transition-colors
            focus:border-indigo-500
            focus:ring-1 focus:ring-indigo-500/20
            dark:border-slate-600
            dark:bg-[#0F172A]
            dark:text-slate-100
            dark:placeholder:text-slate-500
            dark:focus:border-indigo-400
          "
        />
      </div>

      {/* APPLICATION STATUS FILTER */}

      <div className="flex items-center gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusChange(
              value as "all" | StudentStatus
            )
          }
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder="All Applications" />
          </SelectTrigger>

          <SelectContent className={contentClassName}>
            <SelectItem
              value="all"
              className={itemClassName}
            >
              All Applications
            </SelectItem>

            <SelectItem
              value="Approved"
              className={itemClassName}
            >
              Approved
            </SelectItem>

            <SelectItem
              value="Pending"
              className={itemClassName}
            >
              Pending
            </SelectItem>

            <SelectItem
              value="Expired"
              className={itemClassName}
            >
              Expired
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INTAKE FILTER */}

      <div className="flex items-center gap-2">
        <Select
          value={batchFilter}
          onValueChange={onBatchChange}
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder="All Intakes" />
          </SelectTrigger>

          <SelectContent className={contentClassName}>
            <SelectItem
              value="all"
              className={itemClassName}
            >
              All Intakes
            </SelectItem>

            {batchOptions.map((batch) => (
              <SelectItem
                key={batch}
                value={batch}
                className={itemClassName}
              >
                {batch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* RESET BUTTON */}

      <button
        type="button"
        aria-label="Clear filters"
        title="Clear filters"
        onClick={handleReset}
        className="
          inline-flex h-10 w-10
          items-center justify-center
          rounded-lg border border-slate-200
          bg-white text-slate-500
          transition-colors
          hover:bg-slate-100
          hover:text-slate-900
          dark:border-slate-600
          dark:bg-[#0F172A]
          dark:text-slate-400
          dark:hover:bg-slate-700
          dark:hover:text-white
        "
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
