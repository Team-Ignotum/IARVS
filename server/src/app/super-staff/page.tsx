"use client";

import { AdminSidebar } from "@/components/Asidebar 1";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";

export default function StaffPage() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Super Staff Dashboard
            </h2>

            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}