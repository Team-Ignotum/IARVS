
"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import crest from "../favicon.ico.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend only — authentication API integration pending.
    console.log("Sign in clicked");
  };

  return (
    <main className="min-h-screen w-full">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* LEFT PANEL — UNIVERSITY BRANDING */}
        <section className="relative flex min-h-[520px] flex-col overflow-hidden bg-[#00152f] px-6 py-8 text-white sm:px-12 lg:min-h-screen lg:px-14 lg:py-10">
          {/* University Identity */}
          <div className="flex items-start gap-4 sm:gap-7">
            <Image
              src={crest}
              alt="The Open University of Sri Lanka crest"
              width={125}
              height={125}
              priority
              className="h-28.75 w-28.75 shrink-0 object-contain sm:h-31.25 sm:w-31.25"
            />

            <div className="pt-3 sm:pt-5">
              <p className="mt-1 text-[17px] leading-6">
                ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලය
              </p>
              <p className="mt-1 text-[17px] leading-6">
                இலங்கை திறந்த பல்கலைக்கழகம்
              </p>

              <p className="text-[16px] font-medium leading-6">
                The Open University of Sri Lanka
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mt-12 max-w-112.5 lg:mt-14">
            <h1 className="text-[44px] font-light leading-none tracking-tight sm:text-[48px] lg:text-[52px]">
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

            <p className="mt-4 max-w-97.5 text-[15px] leading-tight text-slate-300">
              One account for your courses, results, library
              <br className="hidden sm:block" />
              {" "}and campus services.
            </p>
          </div>

          {/* Decorative Network */}
          <div className="pointer-events-none absolute bottom-41.25 left-[55%] hidden -translate-x-1/2 md:block">
            <svg
              width="120"
              height="175"
              viewBox="0 0 110 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M55 8L85 53L44 75L90 89L53 98L81 148L43 112L28 76L55 8Z"
                stroke="#315074"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle cx="55" cy="8" r="2.5" fill="#F6B81C" />
              <circle cx="44" cy="75" r="3" fill="#F6B81C" />
              <circle cx="81" cy="148" r="2.5" fill="#60728B" />
              <circle cx="90" cy="89" r="2.5" fill="#60728B" />
              <circle cx="28" cy="76" r="2.5" fill="#60728B" />
              <circle cx="53" cy="98" r="2.5" fill="#60728B" />
            </svg>
          </div>

          {/* Bottom Statistics */}
          <div className="mt-auto border-t border-[#29415f] pt-5">
            <div className="flex items-end gap-10 sm:gap-14">
              <div>
                <p className="text-[24px] font-bold leading-none">40,000+</p>

                <p className="mt-2 text-[7px] uppercase tracking-[0.16em] text-slate-400">
                  Learners
                </p>
              </div>

              <div>
                <p className="text-[17px] font-semibold leading-none">9</p>

                <p className="mt-2 text-[6px] uppercase tracking-[0.14em] text-slate-400">
                  Regional Centres
                </p>
              </div>

              <div>
                <p className="text-[17px] font-semibold leading-none">6</p>

                <div>
                  <p className="text-[20px] font-semibold leading-none">
                    6
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-slate-400">
                    Faculties
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL — LOGIN FORM */}
        <section className="flex min-h-[600px] items-start justify-center bg-white px-6 py-14 sm:px-12 lg:min-h-screen lg:px-16 lg:pt-[155px]">
          <div className="w-full max-w-[490px]">
            {/* Heading */}
            <h2 className="text-[34px] font-semibold tracking-tight text-[#071936]">
              Sign In
            </h2>

            <p className="mt-3 text-[16px] text-neutral-600">
              Use your OUSL student or staff account
            </p>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-10">
              {/* Account */}
              <div className="space-y-2.5">
                <Label
                  htmlFor="account"
                  className="text-[14px] font-semibold uppercase tracking-wide text-neutral-800"
                >
                  Student S-Number or Staff Account
                </Label>

                <Input
                  id="account"
                  name="account"
                  type="text"
                  placeholder="e.g. s20007000 or jperera"
                  autoComplete="username"
                  required
                  className="h-[52px] rounded-lg border-[#d9dee6] bg-[#fafafa] px-5 text-[15px] shadow-sm focus-visible:border-[#21385f] focus-visible:ring-2 focus-visible:ring-[#21385f]/20"
                />
              </div>

              {/* Password */}
              <div className="mt-8 space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-[14px] font-semibold uppercase tracking-wide text-neutral-800"
                >
                  Password
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-[52px] rounded-lg border-[#d9dee6] bg-[#fafafa] px-5 text-[15px] shadow-sm focus-visible:border-[#21385f] focus-visible:ring-2 focus-visible:ring-[#21385f]/20"
                />

                {/* Forgot Password Navigation */}
                <div className="flex justify-end pt-2">
                  <Link
                    href="/auth/forgot-password"
                    className="rounded-sm text-[15px] font-medium text-[#20395f] transition-colors hover:text-[#10284d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20395f]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="mt-9 h-[48px] w-full rounded-lg bg-[#1d3a66] text-[15px] font-medium text-white transition-colors hover:bg-[#152e53]"
              >
                Sign in
              </Button>
            </form>

            {/* IT Helpdesk */}
            <div className="mt-12 text-[14px] leading-6 text-neutral-600">
              <p>Trouble signing in? Contact the IT Helpdesk.</p>

              <p>
                <a href="tel:0112881378" className="text-[#20395f] underline">
                  0112 881 378
                </a>{" "}
                or{" "}
                <a href="tel:0112881055" className="text-[#20395f] underline">
                  0112 881 055
                </a>
                , ext. 1175 / 1176
              </p>

              <a
                href="mailto:ithelpdesk@ou.ac.lk"
                className="text-[#20395f] underline underline-offset-2 hover:text-[#10284d]"
              >
                ithelpdesk@ou.ac.lk
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
