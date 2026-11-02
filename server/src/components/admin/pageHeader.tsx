
"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;

  // Optional button or element rendered on the right
  action?: ReactNode;

  variant?: "inline" | "banner";
}

export function PageHeader({
  title,
  subtitle,
  action,
  variant = "inline",
}: PageHeaderProps) {
  // ---------------------------------------
  // BANNER VARIANT
  // ---------------------------------------

  if (variant === "banner") {
    return (
      <div
        className="
          flex items-center justify-between
          border-b border-slate-200
          bg-white px-8 py-6
          transition-colors duration-200
          dark:border-slate-700
          dark:bg-[#0F172A]
        "
      >
        <div>
          <h1
            className="
              text-page-title
              text-slate-900
              dark:text-white
            "
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="
                mt-0.5 text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------
  // INLINE VARIANT
  // ---------------------------------------

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1
          className="
            text-page-title
            text-slate-900
            dark:text-white
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="
              mt-0.5 text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
