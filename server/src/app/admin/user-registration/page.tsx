import getSession from "@/server_actions/getSession";
import { AdminSidebar } from "@/components/Asidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "@/components/admin/AdministrativeBreadcrumb";
import { PageHeader } from "@/components/admin/pageHeader";
import UserRegistrationForm from "./UserRegistrationForm";

export default async function AdminStaffRegistrationPage() {
  const session = await getSession();

  let content: React.ReactNode;
  if (!session) {
    content = (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Please sign in to continue.
      </div>
    );
  } else if (session.role !== "ADMIN" && session.role !== "SUPER_STAFF") {
    content = (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        You do not have access to user registration.
      </div>
    );
  } else {
    content = (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="border-b border-slate-300 pb-6">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl">
            User Registration
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Create accounts for students, staff, and administrators.
          </p>
        </div>
        <div className="mt-6">
          <UserRegistrationForm />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-6 py-4">
            <PageHeader
              title="Administration Dashboard"
              subtitle="User Registration"
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
          <AdminBreadcrumb />
          <div className="min-w-0 w-full">{content}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
