
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function ResetEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-5 py-10">
      <Card className="w-full max-w-[390px] rounded-2xl border border-slate-200 bg-white shadow-lg">
        <CardContent className="px-8 py-12 sm:px-10">
          <h1 className="text-[24px] font-bold leading-tight text-[#303030]">
            Password reset
            <br />
            request
          </h1>

          <p className="mt-5 text-sm leading-6 text-neutral-600">
            We noticed that you or someone requested a password
            reset. If it was you, please click the button below
            to set a new password.
          </p>

          <Link
            href="/auth/set-password"
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#1d3459] text-sm font-medium text-white transition-colors hover:bg-[#152b4d]"
          >
            Set Password
          </Link>

          <p className="mt-12 text-sm leading-6 text-neutral-600">
            Thank you!
            <br />
            Team OUSL
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
