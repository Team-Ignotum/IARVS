
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { AdminSidebar } from "@/components/Asidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { PageHeader } from "@/components/admin/pageHeader";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import UsersFilters from "@/components/admin/users/UsersFilters";

import type {
  UserRecord,
  UserRole,
  UserStatus,
  UserCenterFilter,
} from "@/components/admin/users/types";

import {
  Activity,
  Briefcase,
  Download,
  GraduationCap,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

// ---------------------------------------
// CONFIGURATION
// ---------------------------------------

const PAGE_SIZE = 10;

// Temporary sample records.
// Replace these with API records when
// backend integration is restored.

const initialUsers: UserRecord[] = [
  {
    id: "OUSL-ST-001",
    name: "Aisha Rahman",
    email: "aisha@university.edu",
    role: "Staff",
    status: "Active",
    center: "WP10",
    centerName: "Colombo Regional Centre",
    createdAt: "2025-08-01",
    avatar: "",
  },
  {
    id: "OUSL-ST-002",
    name: "Daniel Smith",
    email: "daniel@university.edu",
    role: "Staff",
    status: "Inactive",
    center: "UP82",
    centerName: "UP82",
    createdAt: "2025-07-15",
    avatar: "",
  },
];

// ---------------------------------------
// STAFF MANAGEMENT PAGE
// ---------------------------------------

export default function StaffPage() {
  const [roleFilter, setRoleFilter] =
    useState<"all" | UserRole>("all");

  const [statusFilter, setStatusFilter] =
    useState<"all" | UserStatus>("all");

  const [centerFilter, setCenterFilter] =
    useState<UserCenterFilter>("all");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // ---------------------------------------
  // FILTER STAFF RECORDS
  // ---------------------------------------

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialUsers.filter((user) => {
      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        user.status === statusFilter;

      const matchesCenter =
        centerFilter === "all" ||
        (centerFilter === "none"
          ? !user.center
          : user.center === centerFilter);

      const matchesSearch =
        query === "" ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        String(user.id).toLowerCase().includes(query) ||
        (user.centerName ?? "")
          .toLowerCase()
          .includes(query);

      return (
        matchesRole &&
        matchesStatus &&
        matchesCenter &&
        matchesSearch
      );
    });
  }, [roleFilter, statusFilter, centerFilter, search]);

  // ---------------------------------------
  // PAGINATION
  // ---------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ---------------------------------------
  // STATISTICS
  // ---------------------------------------

  const totalStaff = initialUsers.length;

  const activeStaff = initialUsers.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveStaff = initialUsers.filter(
    (user) => user.status === "Inactive"
  ).length;

  const totalCenters = new Set(
    initialUsers
      .map((user) => user.center)
      .filter(Boolean)
  ).size;

  const summaryCards = [
    {
      label: "Total Staff",
      value: totalStaff,
      icon: Users,
      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
    },
    {
      label: "Centers",
      value: totalCenters,
      icon: GraduationCap,
      iconClass:
        "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300",
    },
    {
      label: "Active",
      value: activeStaff,
      icon: Activity,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      label: "Inactive",
      value: inactiveStaff,
      icon: Briefcase,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    },
  ];

  // ---------------------------------------
  // EXPORT CSV
  // ---------------------------------------

  const handleExportCSV = () => {
    const escapeCSV = (value: unknown) => {
      const text = String(value ?? "");
      const safeText = /^[\s]*[=+\-@\t\r]/.test(text)
        ? `'${text}`
        : text;

      return `"${safeText.replace(/"/g, '""')}"`;
    };

    const rows = [
      [
        "ID",
        "Name",
        "Email",
        "Role",
        "Status",
        "Center Code",
        "Center Name",
        "Created At",
      ],
      ...filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.role,
        user.status,
        user.center ?? "",
        user.centerName ?? "",
        user.createdAt ?? "",
      ]),
    ];

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "staff-records.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="min-h-screen bg-[#f4f5f7] text-slate-900 transition-colors dark:bg-[#020817] dark:text-slate-100">
        {/* HEADER */}

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-[#0F172A]/95">
          <div className="px-6 py-4">
          </div>
        </header>

        {/* MAIN CONTENT */}

        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <AdminBreadcrumb />

          <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A] sm:p-7">
            {/* TITLE AND ACTIONS */}

            <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-700 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  Staff Management
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Manage university staff records, roles, and status.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-[#1E293B] dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>

                <Link
                  href="/admin/user-registration"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[#183b68] px-4 text-sm font-medium text-white transition hover:bg-[#102d52] dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Staff
                </Link>
              </div>
            </div>

            {/* STATISTICS CARDS */}

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(
                ({ label, value, icon: Icon, iconClass }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1E293B]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {label}
                      </span>
                    </div>

                    <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                      {value.toLocaleString()}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* FILTERS */}

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
            </div>

            {/* STAFF TABLE */}

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-[#1E293B] dark:text-slate-300">
                    <tr>
                      {[
                        "Staff",
                        "Staff ID",
                        "Role",
                        "Center",
                        "Status",
                        "Created",
                      ].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-4 font-semibold"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-[#0F172A]">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {user.name}
                          </div>

                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          {user.id}
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          {user.role}
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          {user.centerName ||
                            user.center ||
                            "No Center"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                          {user.createdAt || "—"}
                        </td>
                      </tr>
                    ))}

                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-14 text-center"
                        >
                          <Search className="mx-auto mb-3 h-8 w-8 text-slate-400" />

                          <p className="font-medium text-slate-700 dark:text-slate-200">
                            No staff records found
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Try adjusting your filters or search.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#0F172A] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  {filteredUsers.length === 0
                    ? 0
                    : (currentPage - 1) * PAGE_SIZE + 1}
                  {" - "}
                  {Math.min(
                    currentPage * PAGE_SIZE,
                    filteredUsers.length
                  )}{" "}
                  of {filteredUsers.length} staff
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setPage((previous) =>
                        Math.max(1, previous - 1)
                      )
                    }
                    className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="px-2 text-sm text-slate-600 dark:text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setPage((previous) =>
                        Math.min(totalPages, previous + 1)
                      )
                    }
                    className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
