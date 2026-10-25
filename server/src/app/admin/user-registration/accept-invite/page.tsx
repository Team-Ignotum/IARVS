import AcceptInviteForm from "./AcceptInviteForm";

// Public page: the invited staff member has no account yet, so there is no session check.
export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7] p-4">
      <AcceptInviteForm token={token} />
    </main>
  );
}
