"use client";

import { useState } from "react";
import {
  Activity,
  GraduationCap,
  Plus,
  ShieldCheck,
  UserPlus,
  X,
  Users,
} from "lucide-react";
import { useAdminDashboard } from "@/_hooks/admin/useAdminDashboard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UsersFilters from "@/components/admin/users/UsersFilters";
import UsersTable from "@/components/admin/users/userTable";
import { filterUsers } from "@/components/admin/users/filters";
import {
  UserCenterFilter,
  UserRecord,
  UserRole,
  UserStatus,
} from "@/components/admin/users/types";
import UserRegistrationForm from "./UserRegistrationForm";

const sampleUsers: UserRecord[] = [
  {
    id: "OUSL-AD-001",
    name: "Nadeesha Perera",
    email: "nadeesha@university.edu",
    role: "SuperAdmin",
    status: "Active",
    center: null,
    createdAt: "2025-08-01",
  },
  {
    id: "OUSL-ST-001",
    name: "Aisha Rahman",
    email: "aisha@university.edu",
    role: "Staff",
    status: "Active",
    center: "WP10",
    createdAt: "2025-08-01",
  },
  {
    id: "OUSL-ST-002",
    name: "Daniel Smith",
    email: "daniel@university.edu",
    role: "Staff",
    status: "Inactive",
    center: "UP82",
    createdAt: "2025-07-15",
  },
  {
    id: "OUSL-SU-014",
    name: "Kasun Fernando",
    email: "kasun@university.edu",
    role: "Student",
    status: "Active",
    center: "CP20",
    createdAt: "2025-06-20",
  },
];

type UserActionKind = "view" | "status" | "delete";
type UserAction = { kind: UserActionKind; user: UserRecord } | null;

export default function UserRegistrationDashboard() {
  const { stats } = useAdminDashboard();
  const [users, setUsers] = useState<UserRecord[]>(sampleUsers);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [userAction, setUserAction] = useState<UserAction>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [centerFilter, setCenterFilter] = useState<UserCenterFilter>("all");
  const [search, setSearch] = useState("");

  const filteredUsers = filterUsers({
    users,
    roleFilter,
    statusFilter,
    centerFilter,
    search,
  });

  function openUserAction(kind: UserActionKind, user: UserRecord) {
    setUserAction({ kind, user });
  }

  function confirmStatusChange() {
    if (!userAction || userAction.kind !== "status") return;

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userAction.user.id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user,
      ),
    );
    setUserAction(null);
  }

  function confirmDelete() {
    if (!userAction || userAction.kind !== "delete") return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== userAction.user.id),
    );
    setUserAction(null);
  }

  const summaryCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      iconClass: "bg-[#eef2ff] text-[#4f46e5]",
    },
    {
      label: "Students",
      value: stats.totalStudents,
      icon: GraduationCap,
      iconClass: "bg-[#ecfeff] text-[#0891b2]",
    },
    {
      label: "Active Users",
      value: stats.activeStaff,
      icon: Activity,
      iconClass: "bg-[#ecfdf5] text-[#10b981]",
    },
    {
      label: "Administrators",
      value: 4,
      icon: ShieldCheck,
      iconClass: "bg-[#fff7ed] text-[#f59e0b]",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="border-b border-slate-300 pb-6">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl">
          User Management
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Create and manage accounts for students, staff, and administrators.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon, iconClass }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
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
            <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">All users</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review accounts and manage access across all centers.
            </p>
          </div>
          <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#183b68] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#102d52]">
                <Plus className="h-4 w-4" />
                Create a user
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[88vh] max-w-xl gap-3 overflow-y-auto p-5 sm:p-6">
              <DialogHeader className="relative pr-10">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0f172a] text-white">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <DialogTitle>Create a user</DialogTitle>
                    <DialogDescription className="mt-1 text-xs leading-5 text-slate-500">
                      Send an invitation to onboard a new member of your
                      organization.
                    </DialogDescription>
                  </div>
                </div>
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label="Close create user dialog"
                    className="absolute right-0 top-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </DialogClose>
              </DialogHeader>
              <UserRegistrationForm />
            </DialogContent>
          </Dialog>

          <Dialog
            open={userAction !== null}
            onOpenChange={(open) => {
              if (!open) setUserAction(null);
            }}
          >
            <DialogContent className="max-w-md">
              {userAction?.kind === "view" && (
                <>
                  <DialogHeader>
                    <DialogTitle>{userAction.user.name}</DialogTitle>
                    <DialogDescription>
                      User account details and access information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">User ID</span>
                      <span className="font-medium text-slate-900">
                        {userAction.user.id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Email</span>
                      <span className="font-medium text-slate-900">
                        {userAction.user.email}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Role</span>
                      <span className="font-medium text-slate-900">
                        {userAction.user.role}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Center</span>
                      <span className="font-medium text-slate-900">
                        {userAction.user.center ?? "No center assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Status</span>
                      <span className="font-medium text-slate-900">
                        {userAction.user.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <DialogClose asChild>
                      <button className="inline-flex h-9 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Close
                      </button>
                    </DialogClose>
                  </div>
                </>
              )}

              {userAction?.kind === "status" && (
                <>
                  <DialogHeader>
                    <DialogTitle>Change user status?</DialogTitle>
                    <DialogDescription>
                      {userAction.user.name} is currently{" "}
                      {userAction.user.status.toLowerCase()}. This will change
                      the account to{" "}
                      {userAction.user.status === "Active"
                        ? "inactive"
                        : "active"}
                      .
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <button className="inline-flex h-9 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Cancel
                      </button>
                    </DialogClose>
                    <button
                      type="button"
                      onClick={confirmStatusChange}
                      className="inline-flex h-9 items-center rounded-md bg-[#183b68] px-4 text-sm font-medium text-white hover:bg-[#102d52]"
                    >
                      Change status
                    </button>
                  </div>
                </>
              )}

              {userAction?.kind === "delete" && (
                <>
                  <DialogHeader>
                    <DialogTitle>Delete this user?</DialogTitle>
                    <DialogDescription>
                      This will remove {userAction.user.name} from the user
                      list. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <button className="inline-flex h-9 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Cancel
                      </button>
                    </DialogClose>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className="inline-flex h-9 items-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete user
                    </button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <UsersFilters
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          centerFilter={centerFilter}
          search={search}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          onCenterChange={setCenterFilter}
          onSearchChange={setSearch}
        />
        <div className="mt-4">
          <UsersTable
            users={filteredUsers}
            isLoading={false}
            fetchError={null}
            page={1}
            totalPages={1}
            totalUsers={filteredUsers.length}
            itemsPerPage={filteredUsers.length}
            onPageChange={() => {}}
            onViewUser={(user) => openUserAction("view", user)}
            onChangeStatus={(user) => openUserAction("status", user)}
            onDeleteUser={(id) => {
              const user = users.find((candidate) => candidate.id === id);
              if (user) openUserAction("delete", user);
            }}
          />
        </div>
      </div>
    </div>
  );
}
