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

import {
  BadgeCheck,
  Download,
  Hourglass,
  Plus,
  Users,
} from "lucide-react";

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

import {
  StudentRecord,
  StudentStatus,
} from "@/components/admin/users/types";

import StudentFilters from "@/components/admin/students/StudentFilters";

// SAMPLE STUDENT DATA

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

// STUDENT PAGE

export default function StudentPage() {
  const { stats } = useStudentDashboard();

  // FILTER STATES

  const [statusFilter, setStatusFilter] =
    useState<"all" | StudentStatus>("all");

  const [batchFilter, setBatchFilter] =
    useState<"all" | string>("all");

  const [search, setSearch] = useState("");

  const batchOptions = ["2023", "2024", "2025"];

  // FILTER STUDENTS

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

    return matchesSearch && matchesStatus;
  });

  // PAGINATION

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

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

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const endIndex =
    startIndex + studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    endIndex
  );

  // SUMMARY CARDS

  const summaryCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      iconClass: "bg-[#eef2ff] text-[#4f46e5]",
    },
    {
      label: "Approved Students",
      value: stats.approvedStudents,
      icon: BadgeCheck,
      iconClass: "bg-[#ecfdf5] text-[#10b981]",
    },
    {
      label: "Pending Students",
      value: stats.pendingStudents,
      icon: Hourglass,
      iconClass: "bg-[#fff7ed] text-[#f59e0b]",
    },
  ];

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        {
        // PAGE HEADER
        }

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-6 py-4">
            <PageHeader title="Administration Dashboard" />
          </div>
        </header>

        {/* PAGE CONTENT */}

        <div className="flex flex-1 flex-col gap-4 bg-gray-100 p-6">

          {/* BREADCRUMB */}

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
                stats={summaryCards.map(({ label, value, icon: Icon, iconClass }) => ({
                  label,
                  value,
                  icon: <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}><Icon className="h-5 w-5" /></div>,
                }))}
              />
            </div>

            {/* FILTER COMPONENT */}

            <div className="mt-6">

              <StudentFilters
                statusFilter={statusFilter}
                batchFilter={batchFilter}
                batchOptions={batchOptions}
                search={search}
                onStatusChange={(value) => {
                  setStatusFilter(value as "all" | StudentStatus);
                  setCurrentPage(1);
                }}
                onBatchChange={(value) => {
                  setBatchFilter(value);
                  setCurrentPage(1);
                }}
                onSearchChange={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
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
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <TableRow
                          key={student.id}
                          className={`border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50 ${
                            student.status === "Expired"
                              ? "bg-red-50/40"
                              : "bg-white"
                          }`}
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
                            {student.studentId}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-sm text-slate-700">
                            {student.registeredCenter}
                          </TableCell>

                          <TableCell
                            className={`px-5 py-4 text-sm font-medium ${
                              student.status === "Expired"
                                ? "text-red-600"
                                : "text-slate-700"
                            }`}
                          >
                            {student.registrationNo}
                          </TableCell>

                          <TableCell className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${
                                student.status === "Approved"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                  : student.status === "Pending"
                                  ? "border-amber-200 bg-amber-50 text-amber-500"
                                  : "border-red-200 bg-red-50 text-red-600"
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
                                {
                                  label: "Change Status",
                                  onSelect: () => console.log("change", student),
                                },
                                {
                                  label: "Delete User",
                                  variant: "danger",
                                  separator: true,
                                  onSelect: () => console.log("delete", student.id),
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="px-5 py-10 text-center text-sm text-slate-500"
                        >
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/*  PAGINATION */}
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
      </SidebarInset>
    </SidebarProvider>
  );
}