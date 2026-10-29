"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBreadcrumb } from "@/components/admin/AdministrativeBreadcrumb";
import AdminPagination from "@/components/admin/AdminPagination";
import StatsGrid from "@/components/admin-dashboard/StatsGrid";
import { Button } from "@/components/ui/button";

import { BadgeCheck, Download, Hourglass, Plus, Users } from "lucide-react";

import TableActionMenu from "@/components/admin/TableActionMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminStats } from "@/_hooks/admin/useAdminDashboard";
import { useUsers } from "@/_hooks/admin/useUsers";
import { useDebouncedValue } from "@/_hooks/core/useDebouncedValue";

import { UserStatus } from "@/components/admin/users/types";
import {
  mapAdminUserToStudent,
  toDbStatus,
} from "@/components/admin/users/utils";

import StudentFilters from "@/components/admin/students/StudentFilters";

const PAGE_SIZE = 5;

// STUDENT PAGE

export default function StudentPage() {
  const { stats } = useAdminStats();

  // FILTER STATES

  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  // STUDENT LIST (server-side filtering + pagination)

  const { users, total, totalPages, isLoading, error } = useUsers({
    role: "STUDENT",
    status: toDbStatus(statusFilter),
    search: debouncedSearch.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const students = users.map(mapAdminUserToStudent);

  // SUMMARY CARDS

  const summaryCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      iconClass: "bg-[#eef2ff] text-[#4f46e5]",
    },
    {
      label: "Active Students",
      value: stats.activeStudents,
      icon: BadgeCheck,
      iconClass: "bg-[#ecfdf5] text-[#10b981]",
    },
    {
      label: "Inactive Students",
      value: stats.inactiveStudents,
      icon: Hourglass,
      iconClass: "bg-[#fff7ed] text-[#f59e0b]",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <AdminHeader />

        <div className="flex flex-1 flex-col gap-4 bg-gray-100 p-6">
          <AdminBreadcrumb currentPage="Students" />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* TITLE + BUTTONS */}

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Student Management
                </h1>

                <p className="mt-1 text-sm text-[#5E6A7A]">
                  Manage student registration process.
                </p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                {/* Export CSV */}

                <Button
                  type="button"
                  className="bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>

                {/* Add Student */}

                <Button
                  type="button"
                  className="bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>

            {/* STAT CARDS */}

            <div className="mt-5">
              <StatsGrid
                stats={summaryCards.map(
                  ({ label, value, icon: Icon, iconClass }) => ({
                    label,
                    value,
                    icon: (
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    ),
                  }),
                )}
              />
            </div>

            {/* FILTER COMPONENT */}

            <div className="mt-6">
              <StudentFilters
                statusFilter={statusFilter}
                search={search}
                onStatusChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                onSearchChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
              />
            </div>

            {/* STUDENT TABLE */}

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
                      <TableHead className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Student Name
                      </TableHead>
                      <TableHead className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Student ID
                      </TableHead>
                      <TableHead className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Registered Center
                      </TableHead>
                      <TableHead className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Reg.No
                      </TableHead>
                      <TableHead className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Status
                      </TableHead>
                      <TableHead className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm text-slate-500"
                        >
                          Loading students...
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm text-red-600"
                        >
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : students.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm text-slate-500"
                        >
                          No students found for the selected filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow
                          key={student.id}
                          className="border-b border-slate-200 bg-white transition-colors last:border-b-0 hover:bg-slate-50"
                        >
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                {student.name
                                  .split(/[\s,]+/)
                                  .filter(Boolean)
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-medium text-slate-900">
                                  {student.name}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-5 py-4 text-sm font-medium text-slate-700">
                            {student.studentId ?? "—"}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-sm text-slate-700">
                            {student.centerName ?? "—"}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-sm font-medium text-slate-700">
                            {student.registrationNo ?? "—"}
                          </TableCell>

                          <TableCell className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${
                                student.status === "Active"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                  : "border-amber-200 bg-amber-50 text-amber-600"
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>

                          <TableCell className="px-5 py-4 text-center">
                            <TableActionMenu
                              ariaLabel={`Actions for ${student.name}`}
                              items={[
                                {
                                  label: "View Details",
                                  onSelect: () => console.log("view", student),
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <AdminPagination
                page={page}
                totalPages={totalPages}
                total={total}
                itemsPerPage={PAGE_SIZE}
                itemLabel="students"
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
