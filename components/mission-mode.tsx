"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Siren } from "lucide-react";
import { clsx } from "clsx";

export type MissionMode = "crisis" | "planning";

const storageKey = "sevasync:mission-mode";

export function useMissionMode() {
  const [mode, setModeState] = useState<MissionMode>("crisis");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "planning" || stored === "crisis") {
      setModeState(stored);
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey && (event.newValue === "planning" || event.newValue === "crisis")) {
        setModeState(event.newValue);
      }
    };

    const onMode = (event: Event) => {
      const next = (event as CustomEvent<MissionMode>).detail;
      if (next === "planning" || next === "crisis") {
        setModeState(next);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("sevasync:mission-mode", onMode);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("sevasync:mission-mode", onMode);
    };
  }, []);

  const setMode = (next: MissionMode) => {
    setModeState(next);
    window.localStorage.setItem(storageKey, next);
    window.dispatchEvent(new CustomEvent("sevasync:mission-mode", { detail: next }));
  };

  return { mode, setMode };
}

export function MissionModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useMissionMode();
  const options: Array<{ value: MissionMode; label: string; icon: typeof Siren }> = [
    { value: "crisis", label: "Crisis", icon: Siren },
    { value: "planning", label: "Planning", icon: CalendarClock }
  ];

  return (
    <div className={clsx("grid grid-cols-2 border border-ink/15 bg-white/80 p-1 shadow-sm", compact ? "min-w-52" : "w-full sm:w-72")}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setMode(option.value)}
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
