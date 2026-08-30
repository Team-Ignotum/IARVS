"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/Asidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { PageHeader } from "@/components/admin/pageHeader";
import {
  BadgeCheck,
  Download,
  Hourglass,
  MoreVertical,
  Plus,
  Users,
} from "lucide-react";
import { useStudentDashboard } from "@/_hooks/admin/useAdminDashboard";
import { StudentRecord } from "@/components/admin/users/types";

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

//STUDENT PAGE
export default function StudentPage() {
  const { stats } = useStudentDashboard();

  /* ======================================================
     PAGINATION
  ====================================================== */

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const totalPages = Math.ceil(
    sampleStudents.length / studentsPerPage
  );

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const endIndex =
    startIndex + studentsPerPage;

  const currentStudents = sampleStudents.slice(
    startIndex,
    endIndex
  );

  /* ======================================================
     SUMMARY CARDS
  ====================================================== */

  const summaryCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      iconClass:
        "bg-[#eef2ff] text-[#4f46e5]",
    },
    {
      label: "Approved Students",
      value: stats.approvedStudents,
      icon: BadgeCheck,
      iconClass:
        "bg-[#ecfdf5] text-[#10b981]",
    },
    {
      label: "Pending Students",
      value: stats.pendingStudents,
      icon: Hourglass,
      iconClass:
        "bg-[#fff7ed] text-[#f59e0b]",
    },
  ];

  return (
    <SidebarProvider>

      <AdminSidebar />

      <SidebarInset>

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-6 py-4">
            <PageHeader title="Administration Dashboard" />
          </div>
        </header>

        {/* ======================================================
            PAGE CONTENT
        ====================================================== */}

        <div className="flex flex-1 flex-col gap-4 bg-gray-100 p-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* ======================================================
                TITLE + BUTTONS
            ====================================================== */}

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

                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-opacity duration-200 hover:opacity-90"
                  style={{
                    backgroundColor:
                      "oklch(50.8% 0.17 264.5)",
                  }}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>

                {/* Add Student */}

                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-opacity duration-200 hover:opacity-90"
                  style={{
                    backgroundColor:
                      "oklch(50.8% 0.17 264.5)",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </button>

              </div>
            </div>

            {/* ======================================================
                STAT CARDS
            ====================================================== */}

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {summaryCards.map(
                ({
                  label,
                  value,
                  icon: Icon,
                  iconClass,
                }) => (

                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        {label}
                      </span>

                    </div>

                    <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                      {value}
                    </div>

                  </div>

                )
              )}

            </div>

            {/* ======================================================
                STUDENT TABLE
            ====================================================== */}

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  {/* TABLE HEADER */}

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Student Name
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Student ID
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Registered Center
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Reg.No
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Status
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  {/* ======================================================
                      TABLE BODY
                  ====================================================== */}

                  <tbody>

                    {currentStudents.map((student) => (

                      <tr
                        key={student.id}
                        className={`border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50 ${
                          student.status === "Expired"
                            ? "bg-red-50/40"
                            : "bg-white"
                        }`}
                      >

                        {/* STUDENT NAME */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            {/* Avatar */}

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

                        </td>

                        {/* STUDENT ID */}

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {student.studentId}
                        </td>

                        {/* REGISTERED CENTER */}

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {student.registeredCenter}
                        </td>

                        {/* REGISTRATION NUMBER */}

                        <td
                          className={`px-5 py-4 text-sm font-medium ${
                            student.status === "Expired"
                              ? "text-red-600"
                              : "text-slate-700"
                          }`}
                        >
                          {student.registrationNo}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

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

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              console.log(
                                "student action",
                                student
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              {/* ======================================================
                  TABLE FOOTER / PAGINATION
              ====================================================== */}

              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                {/* Showing text */}

                <p className="text-sm text-slate-600">

                  Showing{" "}
                  {sampleStudents.length === 0
                    ? 0
                    : startIndex + 1}
                  -
                  {Math.min(
                    endIndex,
                    sampleStudents.length
                  )}{" "}
                  of {sampleStudents.length} students

                </p>

                {/* Pagination */}

                <div className="flex items-center gap-1">

                  {/* PREVIOUS BUTTON */}

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        currentPage - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    &lt;
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    { length: totalPages },
                    (_, index) => {

                      const pageNumber =
                        index + 1;

                      return (

                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() =>
                            setCurrentPage(
                              pageNumber
                            )
                          }
                          className={`flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition ${
                            currentPage ===
                            pageNumber
                              ? "bg-slate-950 text-white"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pageNumber}
                        </button>

                      );

                    }
                  )}

                  {/* NEXT BUTTON */}

                  <button
                    type="button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    &gt;
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </SidebarInset>

    </SidebarProvider>
  );
}