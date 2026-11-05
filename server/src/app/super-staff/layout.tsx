import type { ReactNode } from "react";
import { SuperStaffThemeProvider } from "./SuperStaffThemeProvider";

export default function SuperStaffLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SuperStaffThemeProvider>
      <div className="min-h-screen bg-white text-slate-900 dark:bg-[#020817] dark:text-slate-100">
        {children}
      </div>
    </SuperStaffThemeProvider>
  );
}