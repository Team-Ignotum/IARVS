
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import type { ColumnConfig } from "./types";
import { getInitials } from "./utils";
import AdminStatusBadge from "../AdminStatusBadge";
import RoleBadge from "../RoleBadge";

export const userColumns: ColumnConfig[] = [
  // ---------------------------------------
  // STAFF NAME AND EMAIL
  // ---------------------------------------
  {
    key: "name",
    label: "Name",

    render: (user) => (
      <div className="flex items-center gap-3">
        <Avatar
          className="
            h-9 w-9
            border border-slate-200
            dark:border-slate-600
          "
        >
          {user.avatar ? (
            <AvatarImage
              src={user.avatar}
              alt={user.name}
            />
          ) : null}

          <AvatarFallback
            className="
              bg-[#000053]
              text-xs font-semibold
              text-white
              dark:bg-indigo-500/20
              dark:text-indigo-200
            "
          >
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p
            className="
              text-sm font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            {user.name}
          </p>

          <p
            className="
              text-xs text-slate-500
              dark:text-slate-400
            "
          >
            {user.email}
          </p>
        </div>
      </div>
    ),
  },

  // ---------------------------------------
  // STAFF ID
  // ---------------------------------------
  {
    key: "id",
    label: "Staff ID",

    render: (user) => (
      <span
        className="
          text-sm font-medium
          text-slate-700
          dark:text-slate-200
        "
      >
        {user.id}
      </span>
    ),
  },

  // ---------------------------------------
  // CENTER
  // ---------------------------------------
  {
    key: "center",
    label: "Center",

    render: (user) =>
      user.center ? (
        <span
          className="
            inline-flex items-center
            rounded-full
            bg-indigo-50
            px-2.5 py-0.5
            text-[11px] font-semibold
            text-indigo-600
            dark:bg-indigo-500/15
            dark:text-indigo-300
          "
        >
          {user.center}
        </span>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          —
        </span>
      ),
  },

  // ---------------------------------------
  // ROLE
  // ---------------------------------------
  {
    key: "role",
    label: "Role",

    render: (user) => (
      <RoleBadge role={user.role} />
    ),
  },

  // ---------------------------------------
  // STATUS
  // ---------------------------------------
  {
    key: "status",
    label: "Status",

    render: (user) => (
      <AdminStatusBadge status={user.status} />
    ),
  },
];
