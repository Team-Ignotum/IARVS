
import { AdminSidebar } from "@/components/Asidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AdminProfileSettings } from "@/app/admin/AdminProfileSettings";

export default function AdminProfilePage() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset className="min-h-screen bg-gray-100 dark:bg-[#020817]">
        <AdminProfileSettings />
      </SidebarInset>
    </SidebarProvider>
  );
}
