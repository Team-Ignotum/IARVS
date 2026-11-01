
"use client";

import { useEffect, useState } from "react";

import { AdminSidebar } from "@/components/Asidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { PageHeader } from "@/components/admin/pageHeader";
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

import { useStudentDashboard } from "@/_hooks/admin/useAdminDashboard";
import type { StudentStatus } from "@/components/admin/users/types";
import StudentFilters from "@/components/admin/students/StudentFilters";

// ---------------------------------------
// STUDENT TYPES
// ---------------------------------------

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  studentId: string;
  registeredCenter: string;
  registrationNo: string;
  status: StudentStatus;
  avatar?: string;
}

// ---------------------------------------
// SAMPLE STUDENT DATA
// ---------------------------------------

const sampleStudents: StudentRecord[] = [
  {
    id: "1",
    name: "Chen, Wei",
    email: "s92068709@ousl.lk",
    studentId: "STU-882910",
    registeredCenter: "Colombo Regional Center",
    registrationNo: "REG-882910",
    status: "Approved",
    avatar: "",
  },
  {
    id: "2",
    name: "Rodriguez, Elena",
    email: "s92068710@ousl.lk",
    studentId: "STU-994032",
    registeredCenter: "Jaffna Regional Center",
    registrationNo: "REG-994032",
    status: "Pending",
    avatar: "",
  },
  {
    id: "3",
    name: "Smith, Marcus",
    email: "s92068711@ousl.lk",
    studentId: "STU-120934",
    registeredCenter: "Kandy Regional Center",
    registrationNo: "REG-120934",
    status: "Expired",
    avatar: "",
  },
  {
    id: "4",
    name: "Thompson, David",
    email: "s92068712@ousl.lk",
    studentId: "STU-554210",
    registeredCenter: "Colombo Regional Center",
    registrationNo: "REG-554210",
    status: "Approved",
    avatar: "",
  },
];

// ---------------------------------------
// STUDENT MANAGEMENT PAGE
// ---------------------------------------

export default function StudentPage() {
  const { stats } = useAdminStats();

  const [statusFilter, setStatusFilter] =
    useState<"all" | StudentStatus>("all");

  const [batchFilter, setBatchFilter] =
    useState<"all" | string>("all");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const batchOptions = ["2023", "2024", "2025"];
  const studentsPerPage = 5;

  // ---------------------------------------
  // FILTER STUDENTS
  // ---------------------------------------

  const filteredStudents = sampleStudents.filter((student) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      searchValue === "" ||
      student.name.toLowerCase().includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue) ||
      student.studentId.toLowerCase().includes(searchValue) ||
      student.registrationNo.toLowerCase().includes(searchValue) ||
      student.registeredCenter.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      student.status === statusFilter;

  const { users, total, totalPages, isLoading, error } = useUsers({
    role: "STUDENT",
    status: toDbStatus(statusFilter),
    search: debouncedSearch.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  // ---------------------------------------
  // PAGINATION
  // ---------------------------------------

  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  useEffect(() => {
    if (filteredStudents.length === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredStudents.length, totalPages]);

  const startIndex = (currentPage - 1) * studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  // ---------------------------------------
  // SUMMARY CARDS
  // ---------------------------------------

  const summaryCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
    },
    {
      label: "Active Students",
      value: stats.activeStudents,
      icon: BadgeCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      label: "Inactive Students",
      value: stats.inactiveStudents,
      icon: Hourglass,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset
        className="
          min-h-screen
          bg-gray-100 text-slate-900
          transition-colors duration-200
          dark:bg-[#020817]
          dark:text-slate-100
        "
      >
        {/* HEADER */}

        <header
          className="
            sticky top-0 z-20
            border-b border-slate-200
            bg-white/95 backdrop-blur
            dark:border-slate-700
            dark:bg-[#0F172A]/95
          "
        >
          <div className="px-6 py-4">
            <PageHeader title="Administration Dashboard" />
          </div>
        </header>

        {/* MAIN CONTENT */}

        <div
          className="
            flex flex-1 flex-col gap-4
            bg-gray-100 p-6
            dark:bg-[#020817]
          "
        >
          <div
            className="
              rounded-2xl border
              border-slate-200 bg-white
              p-5 shadow-sm
              dark:border-slate-700
              dark:bg-[#0F172A]
            "
          >
            {/* TITLE AND BUTTONS */}

            <div
              className="
                flex flex-wrap items-start
                justify-between gap-4
                border-b border-slate-200 pb-4
                dark:border-slate-700
              "
            >
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Student Management
                </h1>

                <p className="mt-1 text-sm text-[#5E6A7A] dark:text-slate-400">
                  Manage student registration process.
                </p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <Button
                  type="button"
                  className="
                    bg-[#4f46e5] text-white
                    hover:bg-[#4338ca]
                    dark:bg-indigo-600
                    dark:text-white
                    dark:hover:bg-indigo-500
                  "
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>

                <Button
                  type="button"
                  className="
                    bg-[#4f46e5] text-white
                    hover:bg-[#4338ca]
                    dark:bg-indigo-600
                    dark:text-white
                    dark:hover:bg-indigo-500
                  "
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>

            {/* STATISTICS */}

            <div className="mt-5">
              <StatsGrid
                stats={summaryCards.map(
                  ({ label, value, icon: Icon, iconClass }) => ({
                    label,
                    value,
                    icon: (
                      <div
                        className={`
                          flex h-10 w-10 items-center
                          justify-center rounded-xl
                          ${iconClass}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    ),
                  })
                )}
              />
            </div>

            {/* FILTERS */}

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

            <div
              className="
                mt-4 overflow-hidden rounded-xl
                border border-slate-200
                bg-white
                dark:border-slate-700
                dark:bg-[#1E293B]
              "
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      className="
                        border-b border-slate-200
                        bg-slate-50 hover:bg-slate-50
                        dark:border-slate-700
                        dark:bg-[#0F172A]
                        dark:hover:bg-[#0F172A]
                      "
                    >
                      {[
                        "Student Name",
                        "Student ID",
                        "Registered Center",
                        "Reg.No",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <TableHead
                          key={heading}
                          className={`
                            px-5 py-4 text-xs font-semibold
                            uppercase tracking-wide
                            text-slate-600
                            dark:text-slate-300
                            ${
                              heading === "Actions"
                                ? "text-center"
                                : "text-left"
                            }
                          `}
                        >
                          {heading}
                        </TableHead>
                      ))}
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
                          className={`
                            border-b border-slate-200
                            transition-colors last:border-b-0
                            hover:bg-slate-50
                            dark:border-slate-700
                            dark:hover:bg-slate-700/50
                            ${
                              student.status === "Expired"
                                ? "bg-red-50/40 dark:bg-red-950/20"
                                : "bg-white dark:bg-[#1E293B]"
                            }
                          `}
                        >
                          {/* STUDENT NAME */}

                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex h-10 w-10 shrink-0
                                  items-center justify-center
                                  rounded-full bg-slate-100
                                  text-xs font-semibold text-slate-600
                                  dark:bg-slate-700
                                  dark:text-slate-200
                                "
                              >
                                {student.name
                                  .split(/[\s,]+/)
                                  .filter(Boolean)
                                  .map((word: string) => word[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  {student.name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* STUDENT ID */}

                          <TableCell className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {student.studentId}
                          </TableCell>

                          {/* CENTER */}

                          <TableCell className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                            {student.registeredCenter}
                          </TableCell>

                          {/* REGISTRATION NUMBER */}

                          <TableCell
                            className={`
                              px-5 py-4 text-sm font-medium
                              ${
                                student.status === "Expired"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-slate-700 dark:text-slate-200"
                              }
                            `}
                          >
                            {student.registrationNo}
                          </TableCell>

                          {/* STATUS */}

                          <TableCell className="px-5 py-4">
                            <span
                              className={`
                                inline-flex rounded-full border
                                px-3 py-1 text-[11px]
                                font-semibold uppercase
                                ${
                                  student.status === "Approved"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                    : student.status === "Pending"
                                    ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                    : "border-red-200 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-500/15 dark:text-red-300"
                                }
                              `}
                            >
                              {student.status}
                            </span>
                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell className="px-5 py-4 text-center">
                            <TableActionMenu
                              ariaLabel={`Actions for ${student.name}`}
                              items={[
                                {
                                  label: "View Details",
                                  onSelect: () =>
                                    console.log("view", student),
                                },
                                {
                                  label: "Change Status",
                                  onSelect: () =>
                                    console.log("change", student),
                                },
                                {
                                  label: "Delete User",
                                  variant: "danger",
                                  separator: true,
                                  onSelect: () =>
                                    console.log("delete", student.id),
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="bg-white dark:bg-[#1E293B]">
                        <TableCell
                          colSpan={6}
                          className="
                            px-5 py-10 text-center
                            text-sm text-slate-500
                            dark:text-slate-400
                          "
                        >
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}

              <div className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1E293B]">
                <AdminPagination
                  page={currentPage}
                  totalPages={totalPages || 1}
                  total={filteredStudents.length}
                  itemsPerPage={studentsPerPage}
                  itemLabel="students"
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
