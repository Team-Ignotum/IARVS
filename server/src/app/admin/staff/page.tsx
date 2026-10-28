"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Activity,
  Briefcase,
  Download,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import { useAdminStats } from "@/_hooks/admin/useAdminDashboard";
import { useUsers } from "@/_hooks/admin/useUsers";
import { useDebouncedValue } from "@/_hooks/core/useDebouncedValue";
import UsersTable from "@/components/admin/users/userTable";
import {
  UserCenterFilter,
  UserRole,
  UserStatus,
} from "@/components/admin/users/types";
import {
  mapAdminUserToRecord,
  toCenterParam,
  toDbRole,
  toDbStatus,
} from "@/components/admin/users/utils";
import UsersFilters from "@/components/admin/users/UsersFilters";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import UserRegistrationForm from "@/app/admin/user-registration/UserRegistrationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

export default function StaffPage() {
  const { stats } = useAdminStats();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("Staff");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [centerFilter, setCenterFilter] = useState<UserCenterFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const { users, total, totalPages, isLoading, error } = useUsers({
    role: toDbRole(roleFilter),
    status: toDbStatus(statusFilter),
    center: toCenterParam(centerFilter),
    search: debouncedSearch.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const rows = users.map(mapAdminUserToRecord);

  // These cards intentionally reflect people-focused admin stats instead of project metrics.
  const summaryCards = [
    {
      label: "Total Staff",
      value: stats.totalStaff,
      icon: Users,
      iconClass: "bg-[#eef2ff] text-[#4f46e5]",
    },
    {
      label: "Centers",
      value: stats.totalCenters,
      icon: GraduationCap,
      iconClass: "bg-[#ecfeff] text-[#0891b2]",
    },
    {
      label: "Active",
      value: stats.activeStaff,
      icon: Activity,
      iconClass: "bg-[#ecfdf5] text-[#10b981]",
    },
    {
      label: "Inactive",
      value: stats.inactiveStaff,
      icon: Briefcase,
      iconClass: "bg-[#fff7ed] text-[#f59e0b]",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />

        <div className="flex flex-1 flex-col gap-6 bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <AdminBreadcrumb />
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Title  layout*/}
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl">
                  Staff Management
                </h1>
                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Manage university staff records, roles, and status
                </p>
              </div>
              {/* Buttons*/}
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>

                <Dialog
                  open={registrationOpen}
                  onOpenChange={setRegistrationOpen}
                >
                  <DialogTrigger asChild>
                    <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#183b68] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#102d52]">
                      <Plus className="h-4 w-4" />
                      Add Staff
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Register staff</DialogTitle>
                    </DialogHeader>
                    <UserRegistrationForm />
                  </DialogContent>
                </Dialog>
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

            <div className="mt-6">
              <UsersFilters
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                centerFilter={centerFilter}
                search={search}
                onRoleChange={(value) => {
                  setRoleFilter(value);
                  setPage(1);
                }}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                onCenterChange={(value) => {
                  setCenterFilter(value);
                  setPage(1);
                }}
                onSearchChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
              />
              <div className="mt-4">
                <UsersTable
                  users={rows}
                  isLoading={isLoading}
                  fetchError={error}
                  page={page}
                  totalPages={totalPages}
                  totalUsers={total}
                  itemsPerPage={PAGE_SIZE}
                  onPageChange={setPage}
                  onViewUser={(user) => console.log("view", user)}
                  onChangeStatus={(user) => console.log("change", user)}
                  onDeleteUser={(id) => console.log("delete", id)}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
