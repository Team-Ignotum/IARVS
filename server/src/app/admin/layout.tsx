
import type { ReactNode } from "react";
import { AdminThemeProvider } from "./AdminThemeProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AdminThemeProvider>
      {children}
    </AdminThemeProvider>
  );
}
