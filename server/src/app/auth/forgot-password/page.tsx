
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import crest from "../favicon.ico.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [account, setAccount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!account.trim()) return;

    // TODO: Connect password reset request API.
    setSubmitted(true);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT: UNIVERSITY BRANDING */}
      <section className="relative flex min-h-[520px] flex-col overflow-hidden bg-[#00152f] px-7 py-9 text-white sm:px-12 lg:min-h-screen lg:px-14">
        <div className="flex flex-wrap items-center gap-5">
          <Image
            src={crest}
            alt="Open University of Sri Lanka crest"
            width={110}
            height={110}
            priority
            className="h-24 w-24 object-contain sm:h-28 sm:w-28"
          />

          <div className="space-y-1">
            <p className="text-base font-medium">
              The Open University of Sri Lanka
            </p>
            <p className="text-sm">
              இலங்கை திறந்த பல்கலைக்கழகம்
            </p>
            <p className="text-sm">
              ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලය
            </p>
          </div>
        </div>

        <div className="relative z-10 my-14 max-w-[460px]">
          <h1 className="text-4xl font-light leading-[1.12] tracking-tight sm:text-5xl xl:text-[54px]">
            Learning that
            <br />
            reaches
            <br />
            <span className="italic text-[#f6b81c]">
              anyone,
              <br />
              anywhere,
            </span>{" "}
            at
            <br />
            any time.
          </h1>

          <p className="mt-5 max-w-[370px] text-sm leading-6 text-slate-300">
            One account for your courses, results, library
            and campus services.
          </p>
        </div>

        {/* DECORATIVE NETWORK */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-28 right-8 hidden h-48 w-36 opacity-60 sm:block"
          viewBox="0 0 110 170"
          fill="none"
        >
          <path
            d="M55 8L85 53L44 75L90 89L53 98L81 148L43 112L28 76L55 8Z"
            stroke="#60728B"
          />
          <circle cx="55" cy="8" r="3" fill="#F6B81C" />
          <circle cx="44" cy="75" r="3" fill="#F6B81C" />
          <circle cx="90" cy="89" r="3" fill="#60728B" />
          <circle cx="53" cy="98" r="3" fill="#60728B" />
          <circle cx="81" cy="148" r="3" fill="#60728B" />
        </svg>

        <div className="relative z-10 mt-auto border-t border-white/15 pt-6">
          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div>
              <p className="text-2xl font-bold">40,000+</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                Learners
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold">9</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                Regional Centres
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold">6</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                Faculties
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: FORGOT PASSWORD FORM */}
      <section className="flex min-h-[650px] items-center justify-center bg-white px-6 py-14 sm:px-12 lg:min-h-screen lg:px-16">
        <div className="w-full max-w-[490px]">
          <h2 className="text-3xl font-semibold tracking-tight text-[#071936] sm:text-[34px]">
            Forgot Your Password?
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Enter your account details to request a password reset.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="account"
                className="text-sm font-semibold uppercase tracking-wide text-neutral-800"
              >
                Student S-Number or Staff Account
              </Label>

              <Input
                id="account"
                name="account"
                type="text"
                value={account}
                onChange={(event) => {
                  setAccount(event.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g. s20007000 or jperera"
                autoComplete="username"
                required
                className="h-12 rounded-lg border-slate-300 bg-[#fafafa] px-4 text-sm"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-[#20395f] transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>

              <Button
                type="submit"
                className="h-11 min-w-[145px] rounded-lg bg-[#1d3a66] text-white hover:bg-[#152e53]"
              >
                Submit
              </Button>
            </div>
          </form>

          {submitted && (
            <div
              role="status"
              className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900"
            >
              This is a frontend preview. No reset email has been sent.
              <Link
                href="/auth/reset-email"
                className="ml-1 font-semibold underline"
              >
                View email design
              </Link>
            </div>
          )}

          <p className="mt-12 text-center text-sm leading-6 text-neutral-500">
            Enter your username or email address and we will send
            you instructions on how to create a new password.
          </p>

          <div className="mt-12 text-sm leading-6 text-neutral-600">
            <p>Trouble signing in? Contact the IT Helpdesk.</p>
            <p>
              <a href="tel:0112881378" className="underline">
                0112 881 378
              </a>
              {" or "}
              <a href="tel:0112881055" className="underline">
                0112 881 055
              </a>
              , ext. 1175 / 1176
            </p>
            <a
              href="mailto:ithelpdesk@ou.ac.lk"
              className="underline"
            >
              ithelpdesk@ou.ac.lk
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
