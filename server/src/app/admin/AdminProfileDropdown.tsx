
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";

export function AdminProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");
  const menuRef = useRef<HTMLDivElement>(null);

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
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Admin profile menu"
        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            Admin Registry
          </p>

          <p className="text-xs text-slate-500">
            Administrator
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <UserRound size={19} />
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="text-sm font-semibold text-slate-900">
              Admin Registry
            </p>

            <p className="text-xs text-slate-500">
              Administrator Account
            </p>
          </div>

          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            <UserRound size={17} />
            My Profile
          </Link>

          <div className="px-3 py-3">
            <p className="mb-3 flex items-center gap-2 text-sm text-slate-700">
              <Moon size={17} />
              Theme
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(["Light", "Dark"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={theme === value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                    theme === value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {value === "Light" ? (
                    <Sun size={14} />
                  ) : (
                    <Moon size={14} />
                  )}

                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
