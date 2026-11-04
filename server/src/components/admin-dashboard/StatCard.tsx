
"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type TrendType = "positive" | "negative" | "neutral";

export interface StatCardProps {
  label: string;
  value?: string | number;
  trendLabel?: string;
  trendType?: TrendType;
  icon?: ReactNode;
}

const trendClasses: Record<TrendType, string> = {
  positive:
    "border-emerald-100 bg-emerald-50 text-emerald-700 " +
    "dark:border-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",

  negative:
    "border-rose-100 bg-rose-50 text-rose-700 " +
    "dark:border-rose-700 dark:bg-rose-500/15 dark:text-rose-300",

  neutral:
    "border-slate-200 bg-slate-100 text-slate-700 " +
    "dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200",
};

export default function StatCard({
  label,
  value = "--",
  trendLabel,
  trendType = "neutral",
  icon,
}: StatCardProps) {
  return (
    <Card
      className="
        border border-slate-200
        bg-white p-4 shadow-sm
        transition-colors duration-200
        dark:border-slate-700
        dark:bg-[#1E293B]
        dark:text-slate-100
      "
    >
      <div className="flex items-start justify-between gap-3">
        {/* LABEL AND VALUE */}

        <div>
          <p
            className="
              text-[10px] font-semibold
              uppercase tracking-[0.2em]
              text-slate-500
              dark:text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2 text-3xl font-bold
              text-slate-900
              dark:text-white
            "
          >
            {value}
          </p>
        </div>

        {/* ICON */}

        {icon && (
          <div className="shrink-0 text-slate-400 dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>

      {/* TREND INFORMATION */}

      {trendLabel ? (
        <div className="mt-3 flex items-center gap-2">
          <Badge
            className={`
              rounded-full border
              px-2 py-1 text-[11px]
              font-medium
              ${trendClasses[trendType]}
            `}
          >
            {trendLabel}
          </Badge>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            since last month
          </p>
        </div>
      ) : null}
    </Card>
  );
}
