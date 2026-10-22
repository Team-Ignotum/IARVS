import getSession from "@/server_actions/getSession";

export default async function AdminStaffRegistrationPage() {
  const session = await getSession();

  if (!session) {
    return <p>Please sign in to continue.</p>;
  }

  if (session.role !== "ADMIN") {
    return <p>You do not have access to staff registration.</p>;
  }

  return;
}