
import type { ReactNode } from "react";
import { AdminThemeProvider } from "./AdminThemeProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AdminThemeProvider>
      <div className="min-h-screen bg-white text-slate-900 dark:bg-[#020817] dark:text-slate-100">
        {children}
      </div>
    </AdminThemeProvider>
  );
}
