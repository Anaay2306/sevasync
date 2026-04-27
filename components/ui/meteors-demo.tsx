"use client";

import type { ReactNode } from "react";
import { Meteors } from "@/registry/magicui/meteors";

export function MeteorDemo({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex h-[560px] w-full flex-col items-center justify-center overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_28%),linear-gradient(180deg,#050505_0%,#0d1110_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <Meteors number={30} />
      {children ?? (
        <span className="pointer-events-none bg-linear-to-b from-white to-white/10 bg-clip-text text-center text-7xl leading-none font-semibold whitespace-pre-wrap text-transparent sm:text-8xl">
          SevaSync
        </span>
      )}
    </div>
  );
}
