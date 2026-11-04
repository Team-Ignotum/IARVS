"use client";

import { Moon, Sun } from "lucide-react";

import { useAdminTheme } from "@/app/admin/AdminThemeProvider";
import { FieldLabel, SectionHeading } from "./fields";
import {
  cardClass,
  optionButtonActiveClass,
  optionButtonClass,
  optionButtonInactiveClass,
  pillButtonClass,
} from "./styles";
import type { FontSize } from "./types";

const fontSizes: FontSize[] = ["Small", "Medium", "Large"];

export function AppearanceCard({
  fontSize,
  onFontSizeChange,
}: {
  fontSize: FontSize;
  onFontSizeChange: (fontSize: FontSize) => void;
}) {
  const { theme, setTheme } = useAdminTheme();

  return (
    <section className={cardClass}>
      <SectionHeading
        icon={<Sun size={17} />}
        title="Appearance"
      />

      <div className="mt-6 space-y-6">
        {/* THEME */}

        <div>
          <FieldLabel>Theme</FieldLabel>

          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred dashboard appearance.
          </p>

          <div className="flex flex-wrap gap-2">
            {(["light", "dark"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={
                  optionButtonClass +
                  (theme === value
                    ? optionButtonActiveClass
                    : optionButtonInactiveClass)
                }
              >
                {value === "light" ? (
                  <Sun size={14} />
                ) : (
                  <Moon size={14} />
                )}
                {value === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 dark:border-slate-700">
          <FieldLabel>Font Size</FieldLabel>

          <div className="mt-3 flex flex-wrap gap-2">
            {fontSizes.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onFontSizeChange(value)}
                aria-pressed={fontSize === value}
                className={
                  pillButtonClass +
                  (fontSize === value
                    ? optionButtonActiveClass
                    : optionButtonInactiveClass)
                }
              >
                {value}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Text size changes immediately on this page.
          </p>
        </div>
      </div>
    </section>
  );
}
