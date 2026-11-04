
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { AdminSidebar } from "@/components/Asidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { PageHeader } from "@/components/admin/pageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import StatsGrid from "@/components/admin-dashboard/StatsGrid";
import StudentFilters from "@/components/admin/students/StudentFilters";
import TableActionMenu from "@/components/admin/TableActionMenu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  BadgeCheck,
  Download,
  Hourglass,
  Plus,
  Users,
} from "lucide-react";

// ---------------------------------------
// TYPES
// ---------------------------------------

// Defined locally because users/types.ts
// does not export StudentStatus.

type StudentStatus = "Approved" | "Pending" | "Expired";

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
// CONFIGURATION
// ---------------------------------------

const STUDENTS_PER_PAGE = 5;

// Temporary sample records.
// Replace with backend records after
// restoring the student API integration.

const initialStudents: StudentRecord[] = [
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
// COMPONENT
// ---------------------------------------

export default function StudentPage() {
  const [students, setStudents] =
    useState<StudentRecord[]>(initialStudents);

  const [statusFilter, setStatusFilter] =
    useState<"all" | StudentStatus>("all");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedStudent, setSelectedStudent] =
    useState<StudentRecord | null>(null);

  // ---------------------------------------
  // FILTER STUDENTS
  // ---------------------------------------

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "all" ||
        student.status === statusFilter;

      const matchesSearch =
        query === "" ||
        [
          student.name,
          student.email,
          student.studentId,
          student.registrationNo,
          student.registeredCenter,
        ].some((value) =>
          value.toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [students, statusFilter, search]);

  // ---------------------------------------
  // PAGINATION
  // ---------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredStudents.length / STUDENTS_PER_PAGE
    )
  );

  const page = Math.min(currentPage, totalPages);

  const currentStudents = filteredStudents.slice(
    (page - 1) * STUDENTS_PER_PAGE,
    page * STUDENTS_PER_PAGE
  );

  // ---------------------------------------
  // STATISTICS
  // ---------------------------------------

  const approvedStudents = students.filter(
    (student) => student.status === "Approved"
  ).length;

  const pendingStudents = students.filter(
    (student) => student.status === "Pending"
  ).length;

  const expiredStudents = students.filter(
    (student) => student.status === "Expired"
  ).length;

  const summaryCards = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
    },
    {
      label: "Approved Students",
      value: approvedStudents,
      icon: BadgeCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      label: "Pending Students",
      value: pendingStudents,
      icon: Hourglass,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    },
    {
      label: "Expired Students",
      value: expiredStudents,
      icon: Hourglass,
      iconClass:
        "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-300",
    },
  ];

  // ---------------------------------------
  // EXPORT CSV
  // ---------------------------------------

  const handleExportCSV = () => {
    const escapeCSV = (value: string) => {
      const safeValue = /^[\s]*[=+\-@\t\r]/.test(value)
        ? `'${value}`
        : value;

      return `"${safeValue.replace(/"/g, '""')}"`;
    };

    const rows = [
      [
        "Student Name",
        "Email",
        "Student ID",
        "Registered Center",
        "Registration Number",
        "Status",
      ],
      ...filteredStudents.map((student) => [
        student.name,
        student.email,
        student.studentId,
        student.registeredCenter,
        student.registrationNo,
        student.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "students.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  // ---------------------------------------
  // DELETE STUDENT (LOCAL STATE)
  // ---------------------------------------

  const handleDeleteStudent = (
    student: StudentRecord
  ) => {
    const confirmed = window.confirm(
      `Delete ${student.name} from this demo list?`
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter(
        (item) => item.id !== student.id
      )
    );

    setCurrentPage(1);
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="min-h-screen bg-gray-100 text-slate-900 transition-colors dark:bg-[#020817] dark:text-slate-100">
        {/* HEADER */}

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-[#0F172A]/95">
          <div className="px-6 py-4">
            <PageHeader title="Administration Dashboard" />
          </div>
        </header>

        {/* MAIN CONTENT */}

        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]">
            {/* TITLE */}

            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Student Management
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage student registration process.
                </p>
              </div>

              {/* ACTION BUTTONS */}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>

                <Link
                  href="/admin/user-registration"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Link>
              </div>
            </div>

            {/* STATISTICS */}

            <div className="mt-5">
              <StatsGrid
                stats={summaryCards.map(
                  ({
                    label,
                    value,
                    icon: Icon,
                    iconClass,
                  }) => ({
                    label,
                    value,
                    icon: (
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
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
                  setCurrentPage(1);
                }}
                onSearchChange={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* TABLE */}

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1E293B]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#0F172A] dark:hover:bg-[#0F172A]">
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
                          className={`px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 ${
                            heading === "Actions"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {heading}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <TableRow
                          key={student.id}
                          className={`border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 ${
                            student.status === "Expired"
                              ? "bg-red-50/40 dark:bg-red-950/20"
                              : "bg-white dark:bg-[#1E293B]"
                          }`}
                        >
                          {/* NAME */}

                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                {student.name
                                  .split(/[\s,]+/)
                                  .filter(Boolean)
                                  .map((word) => word[0])
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

                          {/* REGISTRATION NO */}

                          <TableCell
                            className={`px-5 py-4 text-sm font-medium ${
                              student.status === "Expired"
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {student.registrationNo}
                          </TableCell>

                          {/* STATUS */}

                          <TableCell className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${
                                student.status === "Approved"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                  : student.status === "Pending"
                                    ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                    : "border-red-200 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-500/15 dark:text-red-300"
                              }`}
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
                                    setSelectedStudent(student),
                                },
                                {
                                  label: "Delete User",
                                  variant: "danger",
                                  separator: true,
                                  onSelect: () =>
                                    handleDeleteStudent(student),
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
                          className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                          No students found for the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}

              <div className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1E293B]">
                <AdminPagination
                  page={page}
                  totalPages={totalPages}
                  total={filteredStudents.length}
                  itemsPerPage={STUDENTS_PER_PAGE}
                  itemLabel="students"
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </section>
        </main>

        {/* DETAILS DIALOG */}

        {selectedStudent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                setSelectedStudent(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="student-details-title"
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#1E293B]"
            >
              <h2
                id="student-details-title"
                className="text-xl font-semibold text-slate-900 dark:text-white"
              >
                Student Details
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Name", selectedStudent.name],
                  ["Email", selectedStudent.email],
                  ["Student ID", selectedStudent.studentId],
                  [
                    "Center",
                    selectedStudent.registeredCenter,
                  ],
                  [
                    "Registration No",
                    selectedStudent.registrationNo,
                  ],
                  ["Status", selectedStudent.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4"
                  >
                    <dt className="text-slate-500 dark:text-slate-400">
                      {label}
                    </dt>

                    <dd className="text-right font-medium text-slate-900 dark:text-white">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
