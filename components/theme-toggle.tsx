"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { clsx } from "clsx";

type ThemeMode = "light" | "dark";

const storageKey = "sevasync:theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
    applyTheme(initial);
  }, []);

  const applyTheme = (next: ThemeMode) => {
    setTheme(next);
    window.localStorage.setItem(storageKey, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const options: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon }
  ];

  return (
    <div className="grid min-w-52 grid-cols-2 border border-ink/15 bg-white/80 p-1 shadow-sm">
      {options.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => applyTheme(option.value)}
            className={clsx(
              "flex items-center justify-center gap-2 border px-3 py-2 text-sm font-semibold uppercase tracking-normal transition",
              active ? "border-ink bg-ink text-white" : "border-transparent text-ink/62 hover:border-ink/30 hover:text-ink"
            )}
          >
            <Icon size={15} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
