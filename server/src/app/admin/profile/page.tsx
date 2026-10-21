
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
      <SidebarInset>
        <AdminProfileSettings />
      </SidebarInset>
    </SidebarProvider>
  );
}
