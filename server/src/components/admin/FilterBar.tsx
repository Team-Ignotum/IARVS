
"use client";

import React from "react";
import { Search } from "lucide-react";

// ---------------------------------------
// FILTER FIELD
// ---------------------------------------

interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function FilterField({
  label,
  children,
  className,
}: FilterFieldProps) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <p
        className="
          text-[10px] font-bold uppercase
          tracking-wider text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </p>

      {children}
    </div>
  );
}

// ---------------------------------------
// FILTER SEARCH
// ---------------------------------------

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function FilterSearch({
  value,
  onChange,
  placeholder = "Search...",
}: FilterSearchProps) {
  return (
    <FilterField
      label="Search"
      className="ml-auto w-full sm:w-auto"
    >
      <div className="relative">
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            h-9 w-full rounded-lg
            border border-[#dbe0e8]
            bg-white pl-9 pr-3
            text-sm text-slate-700
            placeholder:text-slate-400
            outline-none transition-colors
            focus:border-indigo-500
            focus:ring-1 focus:ring-indigo-500/20
            sm:w-90
            dark:border-slate-600
            dark:bg-[#0F172A]
            dark:text-slate-100
            dark:placeholder:text-slate-500
            dark:focus:border-indigo-400
          "
        />
      </div>
    </FilterField>
  );
}

// ---------------------------------------
// FILTER BAR
// ---------------------------------------

interface FilterBarProps {
  children: React.ReactNode;
}

function FilterBar({ children }: FilterBarProps) {
  return (
    <div
      className="
        flex flex-wrap items-end gap-3
        rounded-lg border
        border-[#e4e7ed]
        bg-[#f8fafc] p-3
        transition-colors duration-200
        dark:border-slate-700
        dark:bg-[#1E293B]
      "
    >
      {children}
    </div>
  );
}

// ---------------------------------------
// COMPOUND COMPONENTS
// ---------------------------------------

FilterBar.Field = FilterField;
FilterBar.Search = FilterSearch;

export default FilterBar;
