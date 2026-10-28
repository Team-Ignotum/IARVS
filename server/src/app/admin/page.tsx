"use client";

import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Briefcase,
  Building,
  Download,
  GraduationCap,
  Plus,
  UserPlusIcon,
  Users,
} from "lucide-react";

import { useAdminStats } from "@/_hooks/admin/useAdminDashboard";
import { AdminBreadcrumb } from "@/components/admin/AdministrativeBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminPage() {
  const { stats } = useAdminStats();

  // ================= DASHBOARD SUMMARY CARDS =================

  const summaryCards = [
    {
      label: "Total users",
      value: stats.totalUsers,
      icon: Users,
      iconClass:
        "bg-[#eef2ff] text-[#4f46e5] dark:bg-indigo-950 dark:text-indigo-300",
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      iconClass:
        "bg-[#fef3c7] text-[#f59e0b] dark:bg-amber-950 dark:text-amber-300",
    },
    {
      label: "Total Staff",
      value: stats.totalStaff,
      icon: Briefcase,
      iconClass:
        "bg-[#fff7ed] text-[#f59e0b] dark:bg-orange-950 dark:text-orange-300",
    },
    {
      label: "Total Centers",
      value: stats.totalCenters,
      icon: Building,
      iconClass:
        "bg-[#ecfeff] text-[#0891b2] dark:bg-cyan-950 dark:text-cyan-300",
    },
  ];

  // ================= RECENT INQUIRIES =================

  const recentInquiries = [
    {
      history: "Application batch verified",
      initials: "DA",
      initiator: "Dr. Admin Silva",
      email: "admin@university.edu",
      status: "VERIFIED",
      time: "10:24 AM",
    },
    {
      history: "Transcript request",
      initials: "SP",
      initiator: "Student Portal System",
      email: "system@university.edu",
      status: "PENDING",
      time: "08:15 AM",
    },
    {
      history: "New staff profile created",
      initials: "SA",
      initiator: "System Admin",
      email: "admin@university.edu",
      status: "VERIFIED",
      time: "08:41 AM",
    },
    {
      history: "System update failed",
      initials: "AT",
      initiator: "Automation Task",
      email: "automation@university.edu",
      status: "FAILED",
      time: "03:23 AM",
    },
  ];

  // ================= STATUS STYLES =================

  const getStatusClass = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";

      case "PENDING":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";

      case "FAILED":
        return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";

      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // ================= DASHBOARD PAGE =================

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="bg-[#f4f5f7] dark:bg-slate-950">
        <AdminHeader />

        {/* DASHBOARD CONTENT */}
        <div className="flex flex-1 flex-col bg-[#f4f5f7] p-4 transition-colors sm:p-6 lg:p-8 dark:bg-slate-950">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <AdminBreadcrumb />
          </div>

          {/* DASHBOARD SUMMARY SECTION */}
          <div className="w-full rounded-t-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors sm:p-7 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-5 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-slate-700">
              {/* Dashboard Title */}
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl dark:text-slate-100">
                  Administrative Dashboard
                </h1>
              </div>

              {/* Dashboard Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
                <Link
                  href="/admin/user-registration"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Register
                </Link>

                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#183b68] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#102d52] focus-visible:outline-2 focus-visible:outline-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Download className="h-4 w-4" />
                  <Plus className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* STATISTICS CARDS */}
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(({ label, value, icon: Icon, iconClass }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        {label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                    {Number(value ?? 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT INQUIRIES SECTION */}
          <div className="w-full overflow-hidden rounded-b-2xl border-x border-b border-slate-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-5 sm:p-7 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">
                Recent Inquiries
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#f8fafc] dark:border-slate-700 dark:bg-slate-800">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      History
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Initiator
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentInquiries.map((inquiry, index) => (
                    <tr
                      key={`${inquiry.history}-${index}`}
                      className={`bg-white transition-colors hover:bg-[#fbfcff] dark:bg-slate-900 dark:hover:bg-slate-800 ${
                        index !== recentInquiries.length - 1
                          ? "border-b border-slate-200 dark:border-slate-700"
                          : ""
                      }`}
                    >
                      {/* History */}
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200">
                        {inquiry.history}
                      </td>

                      {/* Initiator */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-600">
                            <AvatarFallback className="bg-[#000053] text-xs font-semibold text-white dark:bg-indigo-900 dark:text-indigo-100">
                              {inquiry.initials}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {inquiry.initiator}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {inquiry.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            inquiry.status,
                          )}`}
                        >
                          {inquiry.status}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {inquiry.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
