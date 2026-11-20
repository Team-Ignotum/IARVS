"use client";

import { useState } from "react";
import { Power } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRange, getWindowStatus } from "./date-time";
import {
  STATUS_STYLES,
  TYPES,
  type RegistrationWindow,
  type WindowStatusFilter,
} from "./types";

const WINDOWS_PER_PAGE = 5;
const selectItemClass = "cursor-pointer focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 dark:text-slate-100 dark:focus:bg-slate-700 dark:focus:text-white dark:data-[state=checked]:bg-slate-700";

type RegistrationWindowsTableProps = {
  windows: RegistrationWindow[];
  currentTime: number;
  justUpdatedId: string | null;
  onEdit: (window: RegistrationWindow) => void;
  onClose: (window: RegistrationWindow) => void;
};

export function RegistrationWindowsTable({
  windows,
  currentTime,
  justUpdatedId,
  onEdit,
  onClose,
}: RegistrationWindowsTableProps) {
  const [statusFilter, setStatusFilter] = useState<WindowStatusFilter>("DEFAULT");
  const [tablePage, setTablePage] = useState(1);
  const filteredWindows = statusFilter === "DEFAULT"
    ? windows
    : windows.filter((item) => getWindowStatus(item, currentTime) === statusFilter);
  const tablePageCount = Math.max(1, Math.ceil(filteredWindows.length / WINDOWS_PER_PAGE));
  const activeTablePage = Math.min(tablePage, tablePageCount);
  const visibleWindows = filteredWindows.slice(
    (activeTablePage - 1) * WINDOWS_PER_PAGE,
    activeTablePage * WINDOWS_PER_PAGE,
  );

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-9 sm:py-6">
        <h2 className="text-xl font-medium text-slate-900">All Registration Windows</h2>
        <label className="space-y-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Status
          </span>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as WindowStatusFilter);
              setTablePage(1);
            }}
          >
            <SelectTrigger className="h-10 min-w-[170px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-[#0F172A] dark:text-slate-100 dark:hover:bg-slate-800">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              side="bottom"
              className="border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-100"
            >
              <SelectItem value="DEFAULT" className={selectItemClass}>Default</SelectItem>
              <SelectItem value="OPEN" className={selectItemClass}>Open</SelectItem>
              <SelectItem value="SCHEDULED" className={selectItemClass}>Scheduled</SelectItem>
              <SelectItem value="CLOSED" className={selectItemClass}>Closed</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <th className="px-5 py-4 sm:px-9">Registration Type</th>
              <th className="px-4 py-4">Schedule</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-5 py-4 text-right sm:px-9">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleWindows.map((window) => {
              const type = TYPES.find((item) => item.value === window.type)!;
              const status = getWindowStatus(window, currentTime);
              const isOpen = status === "OPEN";

              return (
                <tr
                  key={window.id}
                  className={`border-b border-slate-100 transition-colors duration-700 last:border-b-0 ${justUpdatedId === window.id ? "bg-slate-50" : "bg-white"}`}
                >
                  <td className="px-5 py-5 sm:px-9">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b1224] text-sm font-semibold text-white">
                        {type.initials}
                      </span>
                      <div className="leading-tight">
                        <p className="text-sm font-medium text-slate-900">{type.label}</p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {window.batches ? `Batches ${window.batches}` : "No batches set"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm text-slate-500">
                    {formatRange(window.startAt, window.endAt)}
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${STATUS_STYLES[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-5 sm:px-9">
                    <div className="flex items-center justify-end gap-2">
                      {isOpen && (
                        <button
                          type="button"
                          onClick={() => onEdit(window)}
                          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => (isOpen ? onClose(window) : onEdit(window))}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${isOpen ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-[#1e3a6e] text-white hover:bg-[#182f59]"}`}
                      >
                        <Power size={14} />
                        {isOpen ? "Close now" : "Open now"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filteredWindows.length && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                  {statusFilter === "DEFAULT" ? "No registration windows." : `No ${statusFilter.toLowerCase()} registration windows.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {(statusFilter !== "DEFAULT" || tablePageCount > 1) && (
        <AdminPagination
          page={activeTablePage}
          totalPages={tablePageCount}
          total={filteredWindows.length}
          itemsPerPage={WINDOWS_PER_PAGE}
          itemLabel="windows"
          onPageChange={setTablePage}
        />
      )}
    </div>
  );
}

