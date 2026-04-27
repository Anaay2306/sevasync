"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, RadioTower, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";
import { FiBatteryCharging, FiWifi } from "react-icons/fi";
import { useState } from "react";
import { useMissionMode } from "@/components/mission-mode";
import { requests, tasks, volunteers } from "@/lib/seed-data";
import { Card, Metric } from "@/components/ui";

const focusStats: Array<[string, string, LucideIcon]> = [
  ["Top city", requests[0].city, MapPin],
  ["Ready volunteers", String(volunteers.length), UsersRound],
  ["Trust layer", "Verified", ShieldCheck]
];

export function Dashboard() {
  const [entered, setEntered] = useState(false);
  const { mode } = useMissionMode();
  const isPlanning = mode === "planning";

  if (!entered) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <section className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-300">SevaSync</p>
            <h1 className="headline mt-4 max-w-3xl text-5xl font-semibold tracking-normal sm:text-7xl">
              Minimal command for maximum field impact.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/66">
              A clean mobile-first operating layer for NGOs to see what matters, switch modes, and move from scattered reports to coordinated action.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setEntered(true)}
                className="flex items-center justify-center gap-2 border border-white bg-white px-5 py-3 text-sm font-semibold uppercase text-neutral-950 transition hover:bg-teal-200"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <FloatingPhone onStart={() => setEntered(true)} />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-3 pb-10 pt-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-ink/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-leaf">{isPlanning ? "Planning Mode" : "Crisis Mode"}</p>
            <h1 className="headline mt-2 text-4xl font-semibold tracking-normal sm:text-6xl">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
              {isPlanning
                ? "A minimal overview for coverage planning, reserve capacity, and next-day readiness."
                : "A minimal overview for live response, active need pressure, and field capacity."}
            </p>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={isPlanning ? "Planned missions" : "Active needs"} value={isPlanning ? 9 : requests.length} trend={isPlanning ? "next 24h" : "live"} tone="rose" />
          <Metric label="Volunteers" value={volunteers.length} trend={isPlanning ? "reserve" : "online"} tone="leaf" />
          <Metric label={isPlanning ? "Route buffers" : "Open tasks"} value={tasks.length} trend={isPlanning ? "mapped" : "queued"} tone="river" />
          <Metric label="Coverage" value={isPlanning ? "91%" : "82%"} trend={isPlanning ? "target" : "active"} tone="saffron" />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase text-river"><RadioTower size={16} /> Focus</p>
            <h2 className="headline mt-3 text-3xl font-semibold">
              {isPlanning ? "Pre-stage teams before demand spikes." : "Keep dispatch focused on the highest pressure areas."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              Use the tabs for the full data hub, maps, prioritization, volunteer intelligence, impact analytics, and assistant workflows.
            </p>
          </Card>
          <Card>
            <div className="grid gap-3">
              {focusStats.map(([label, value, Icon]) => (
                <div key={label} className="flex items-center justify-between border border-ink/15 bg-white/70 p-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink/65"><Icon size={16} /> {label}</span>
                  <span className="headline text-2xl font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </section>
    </main>
  );
}

function FloatingPhone({ onStart }: { onStart: () => void }) {
  return (
    <section className="phone-visual grid place-content-center p-8">
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-30deg) rotateX(15deg)"
        }}
        className="phone-shell bg-teal-500"
      >
        <motion.div
          initial={{
            transform: "translateZ(8px) translateY(-2px)"
          }}
          animate={{
            transform: "translateZ(32px) translateY(-8px)"
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
            ease: "easeInOut"
          }}
          className="phone-shell relative h-96 w-56 border-2 border-b-4 border-r-4 border-white border-l-neutral-200 border-t-neutral-200 bg-neutral-900 p-1 pl-[3px] pt-[3px]"
        >
          <HeaderBar />
          <Screen onStart={onStart} />
        </motion.div>
      </div>
    </section>
  );
}

function HeaderBar() {
  return (
    <>
      <div className="phone-pill absolute left-[50%] top-2.5 z-10 h-2 w-16 -translate-x-[50%] bg-neutral-900" />
      <div className="absolute right-3 top-2 z-10 flex gap-2">
        <FiWifi className="text-neutral-600" />
        <FiBatteryCharging className="text-neutral-600" />
      </div>
    </>
  );
}

function Screen({ onStart }: { onStart: () => void }) {
  return (
    <div className="phone-screen relative z-0 grid h-full w-full place-content-center overflow-hidden bg-white">
      <svg
        width="50"
        height="39"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-teal-500"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>

      <button
        type="button"
        onClick={onStart}
        className="phone-action absolute bottom-4 left-4 right-4 z-10 border border-neutral-200 bg-white py-2 text-sm font-semibold uppercase text-teal-600 backdrop-blur"
      >
        Get Started
      </button>

      <div className="absolute -bottom-72 left-[50%] h-96 w-96 -translate-x-[50%] bg-teal-500" />
    </div>
  );
}
