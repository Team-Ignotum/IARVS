"use client";

import { Bell } from "lucide-react";
import { AdminProfileDropdown } from "@/app/admin/AdminProfileDropdown";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Administration Dashboard
        </h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          <AdminProfileDropdown />
        </div>
      </div>
    </header>
  );
}
