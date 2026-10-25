import getSession from "@/server_actions/getSession";
import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "@/components/admin/AdministrativeBreadcrumb";
import StaffRegistrationForm from "./StaffRegistrationForm";

export default async function AdminStaffRegistrationPage() {
  const session = await getSession();

  let content: React.ReactNode;
  if (!session) {
    content = <p>Please sign in to continue.</p>;
  } else if (session.role !== "ADMIN") {
    content = <p>You do not have access to staff registration.</p>;
  } else {
    content = (
      <>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-slate-950">
          Register staff
        </h1>
        <StaffRegistrationForm />
      </>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-w-0">
        <div className="flex min-w-0 flex-1 flex-col bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
          <div className="mb-4">
            <AdminBreadcrumb />
          </div>
          <div className="min-w-0 w-full max-w-2xl">
            {content}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
