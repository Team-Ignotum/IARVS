
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AdminPagination from "@/components/admin/AdminPagination";
import TableActionMenu from "../TableActionMenu";
import TableStateRows from "../TableStateRows";

import type { UserRecord } from "./types";
import { userColumns } from "./columns";

interface UsersTableProps {
  users: UserRecord[];
  isLoading: boolean;
  fetchError: string | null;
  page: number;
  totalPages: number;
  totalUsers: number;
  itemsPerPage: number;

  onPageChange: (page: number) => void;
  onViewUser: (user: UserRecord) => void;
  onChangeStatus: (user: UserRecord) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersTable({
  users,
  isLoading,
  fetchError,
  page,
  totalPages,
  totalUsers,
  itemsPerPage,
  onPageChange,
  onViewUser,
  onChangeStatus,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div
      className="
        overflow-hidden rounded-lg
        border border-[#e4e7ed]
        bg-white
        transition-colors duration-200
        dark:border-slate-700
        dark:bg-[#1E293B]
      "
    >
      <Table>
        {/* TABLE HEADER */}

        <TableHeader>
          <TableRow
            className="
              border-b border-slate-200
              bg-[#f8fafc]
              hover:bg-[#f8fafc]
              dark:border-slate-700
              dark:bg-[#0F172A]
              dark:hover:bg-[#0F172A]
            "
          >
            {userColumns.map((column) => (
              <TableHead
                key={column.key}
                className="
                  px-4 text-[11px]
                  font-bold uppercase tracking-wider
                  text-slate-500
                  dark:text-slate-300
                "
              >
                {column.label}
              </TableHead>
            ))}

            <TableHead
              className="
                px-4 text-right
                text-[11px] font-bold
                uppercase tracking-wider
                text-slate-500
                dark:text-slate-300
              "
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* TABLE BODY */}

        <TableBody>
          {/* LOADING, ERROR, AND EMPTY STATES */}

          <TableStateRows
            colSpan={userColumns.length + 1}
            loading={isLoading}
            error={fetchError}
            empty={
              !isLoading &&
              !fetchError &&
              users.length === 0
            }
            loadingMessage="Loading users..."
            emptyMessage="No users found for the selected filters."
          />

          {/* USER ROWS */}

          {!isLoading &&
            !fetchError &&
            users.map((user) => (
              <TableRow
                key={user.id}
                className="
                  border-b border-slate-200
                  bg-white
                  text-slate-700
                  transition-colors
                  hover:bg-[#fbfcff]
                  dark:border-slate-700
                  dark:bg-[#1E293B]
                  dark:text-slate-200
                  dark:hover:bg-slate-700/50
                "
              >
                {/* DYNAMIC COLUMNS */}

                {userColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    className="
                      px-4 py-3
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    {column.render
                      ? column.render(user)
                      : user[column.key as keyof UserRecord]}
                  </TableCell>
                ))}

                {/* ACTIONS */}

                <TableCell className="px-4 py-3 text-right dark:text-slate-300">
                  <TableActionMenu
                    ariaLabel={`Actions for ${user.name}`}
                    items={[
                      {
                        label: "View Details",
                        onSelect: () =>
                          onViewUser(user),
                      },
                      {
                        label: "Change Status",
                        onSelect: () =>
                          onChangeStatus(user),
                      },
                      {
                        label: "Delete User",
                        variant: "danger",
                        separator: true,
                        onSelect: () =>
                          onDeleteUser(user.id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}

      <div
        className="
          border-t border-slate-200
          bg-white
          dark:border-slate-700
          dark:bg-[#0F172A]
          dark:text-slate-300
        "
      >
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={totalUsers}
          itemsPerPage={itemsPerPage}
          itemLabel="users"
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
