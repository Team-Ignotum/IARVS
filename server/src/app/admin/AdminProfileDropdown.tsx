
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";

import { useAdminTheme } from "./AdminThemeProvider";

export function AdminProfileDropdown() {
  // Dropdown state
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Shared theme state
  const { theme, setTheme } = useAdminTheme();

  // Current route
  const pathname = usePathname();
  const router = useRouter();
  const isProfilePage = pathname === "/admin/profile";

  // Dropdown reference
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setOpen(false);
      router.replace("/auth/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* Admin Profile Button */}
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Admin profile menu"
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {/* Admin Information */}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Admin Registry
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administrator
          </p>
        </div>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          <UserRound size={19} />
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform dark:text-slate-400 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          {/* Account Header */}
          <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Admin Registry
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Administrator Account
            </p>
          </div>

          {/* My Profile */}
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            aria-current={isProfilePage ? "page" : undefined}
            className={`mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isProfilePage
                ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <UserRound size={17} />
            My Profile
          </Link>

          {/* Theme Settings */}
          <div className="px-3 py-3">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Moon size={17} />
              Theme
            </p>

            <div className="grid grid-cols-2 gap-2">
              {/* Light Theme */}
              <button
                type="button"
                aria-pressed={theme === "light"}
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Sun size={14} />
                Light
              </button>

              {/* Dark Theme */}
              <button
                type="button"
                aria-pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Moon size={14} />
                Dark
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 pt-2 dark:border-slate-700">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-busy={loggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950"
            >
              <LogOut size={17} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
