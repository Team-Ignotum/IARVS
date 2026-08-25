"use client";

import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Briefcase,
  Building,
  Download,
  GraduationCap,
  Plus,
  Users,
  Bell,
} from "lucide-react";
import { useAdminDashboard } from "@/_hooks/admin/useAdminDashboard";
import { AdminBreadcrumb } from "@/components/admin/AdministrativeBreadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminPage() {
  const { stats } = useAdminDashboard();

  // These cards intentionally reflect people-focused admin stats instead of project metrics.
  const summaryCards = [
    {
      label: "Total users",
      value: stats.totalUsers,
      icon: Users,
      iconClass: "bg-[#eef2ff] text-[#4f46e5]",
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      iconClass: "bg-[#fef3c7] text-[#f59e0b]",
    },
    {
      label: "Total Staff",
      value: stats.totalStaff,
      icon: Briefcase,
      iconClass: "bg-[#fff7ed] text-[#f59e0b]",
    },
    {
      label: "Total Centers",
      value: stats.centers,
      icon: Building,
      iconClass: "bg-[#ecfeff] text-[#0891b2]",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Administration Dashboard</h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors">
                <span className="text-sm font-medium text-slate-700">Admin Registry</span>
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">A</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <AdminBreadcrumb />
          </div>
          <div className="w-full rounded-t-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Title  layout*/}
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl">
                  Administrative Dashboard
                </h1>
              </div>
              {/* Buttons*/}
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50">
                  <Download className="h-4 w-4" />
                  Schedule
                </button>

                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#183b68] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#102d52]">
                  <Plus className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>
            {/* Stat card representation*/}
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(({ label, value, icon: Icon, iconClass }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        {label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inquiries Section */}
          <div className="w-full overflow-hidden rounded-b-2xl border-x border-b border-slate-200 bg-white">
            <div className="p-5 sm:p-7 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-950">Recent Inquiries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">History</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Initiator</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-slate-200 hover:bg-[#fbfcff]">
                    <td className="px-4 py-4 text-sm text-slate-900">Application batch verified</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarFallback className="bg-[#000053] text-xs font-semibold text-white">DA</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Dr. Admin Silva</p>
                          <p className="text-xs text-slate-500">admin@university.edu</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">VERIFIED</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">10:24 AM</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-200 hover:bg-[#fbfcff]">
                    <td className="px-4 py-4 text-sm text-slate-900">Transcript request</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarFallback className="bg-[#000053] text-xs font-semibold text-white">SP</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Student Portal System</p>
                          <p className="text-xs text-slate-500">system@university.edu</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">PENDING</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">08:15 AM</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-200 hover:bg-[#fbfcff]">
                    <td className="px-4 py-4 text-sm text-slate-900">New staff profile created</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarFallback className="bg-[#000053] text-xs font-semibold text-white">SA</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">System Admin</p>
                          <p className="text-xs text-slate-500">admin@university.edu</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">VERIFIED</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">08:41 AM</td>
                  </tr>
                  <tr className="bg-white hover:bg-[#fbfcff]">
                    <td className="px-4 py-4 text-sm text-slate-900">System update failed</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarFallback className="bg-[#000053] text-xs font-semibold text-white">AT</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Automation Task</p>
                          <p className="text-xs text-slate-500">automation@university.edu</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">FAILED</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">03:23 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
