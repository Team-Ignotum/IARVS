"use client";

import Image from "next/image";

import crest from "../favicon.ico.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Front-end only for now
    console.log("Sign in clicked");
  };

  return (
    <main className="min-h-screen w-full">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#00152f] px-8 py-8 text-white sm:px-12 lg:px-14 lg:py-10">
          {/* University Branding */}
          <div className="flex items-start gap-5 sm:gap-7">
            <Image
              src={crest}
              alt="The Open University of Sri Lanka"
              width={120}
              height={120}
              priority
              className="h-[115px] w-[115px] shrink-0 object-contain sm:h-[125px] sm:w-[125px]"
            />

            <div className="pt-3 sm:pt-5">
              <p className="text-[16px] font-medium leading-6">
                The Open University of Sri Lanka
              </p>

              <p className="mt-1 text-[17px] leading-6">
                இலங்கை திறந்த பல்கலைக்கழகம்
              </p>

              <p className="mt-1 text-[17px] leading-6">
                ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලය
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mt-12 max-w-[450px] lg:mt-14">
            <h1 className="text-[44px] font-light leading-[1] tracking-tight sm:text-[48px] lg:text-[52px]">
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

            <p className="mt-4 max-w-[390px] text-[15px] leading-[1.25] text-slate-300">
              One account for your courses, results, library
              <br />
              and campus services.
            </p>
          </div>

          {/* Decorative Network */}
          <div className="pointer-events-none absolute bottom-[165px] left-[55%] hidden -translate-x-1/2 md:block">
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
                <p className="text-[24px] font-bold leading-none">
                  40,000+
                </p>

                <p className="mt-2 text-[7px] uppercase tracking-[0.16em] text-slate-400">
                  Learners
                </p>
              </div>

              <div>
                <p className="text-[17px] font-semibold leading-none">
                  9
                </p>

                <p className="mt-2 text-[6px] uppercase tracking-[0.14em] text-slate-400">
                  Regional Centres
                </p>
              </div>

              <div>
                <p className="text-[17px] font-semibold leading-none">
                  6
                </p>

                <p className="mt-2 text-[6px] uppercase tracking-[0.14em] text-slate-400">
                  Faculties
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}
        <section className="flex min-h-screen items-start justify-center bg-white px-8 pt-24 sm:px-12 lg:px-16 lg:pt-[155px]">
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
                  autoComplete="current-password"
                  className="h-[52px] rounded-lg border-[#d9dee6] bg-[#fafafa] px-5 text-[15px] shadow-sm focus-visible:border-[#21385f] focus-visible:ring-2 focus-visible:ring-[#21385f]/20"
                />

                {/* Forgot Password */}
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-[15px] font-normal text-[#20395f]"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </div>

              {/* Sign In */}
              <Button
                type="submit"
                className="mt-9 h-[48px] w-full rounded-lg bg-[#1d3a66] text-[15px] font-medium text-white hover:bg-[#152e53]"
              >
                Sign in
              </Button>
            </form>

            {/* Helpdesk */}
            <div className="mt-12 text-[14px] leading-6 text-neutral-600">
              <p>
                Trouble signing in? Contact the IT Helpdesk.
              </p>

              <p>
                <a
                  href="tel:0112881378"
                  className="text-[#20395f] underline"
                >
                  0112 881 378
                </a>

                {" "}or{" "}

                <a
                  href="tel:0112881055"
                  className="text-[#20395f] underline"
                >
                  0112 881 055
                </a>

                , ext. 1175 / 1176
              </p>

              <a
                href="mailto:ithelpdesk@ou.ac.lk"
                className="text-[#20395f] underline"
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