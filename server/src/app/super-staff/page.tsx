"use client";

import { SuperStaffHeader } from "@/components/super-staff/superStaffHeader";
import { SuperStaffSidebar } from "@/components/superStaffSideBar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function StaffPage() {
  return (
    <SidebarProvider>
      <SuperStaffSidebar />

      <SidebarInset>
        <SuperStaffHeader />
      </SidebarInset>
    </SidebarProvider>
  );
}
