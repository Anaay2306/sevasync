"use client";

import { Bike, KeyRound, LocateFixed, MapPin, Navigation2, RadioTower, Route } from "lucide-react";
import { Badge, Card, Metric } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { requests, tasks, volunteers } from "@/lib/seed-data";
import { useMissionMode } from "@/components/mission-mode";

export default function MapsPage() {
  const { mode } = useMissionMode();
  const isPlanning = mode === "planning";
  const visibleTasks = isPlanning ? tasks.slice().sort((a, b) => a.etaMinutes - b.etaMinutes) : tasks;
  const hasOlaMapsKey = Boolean(process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY);

  return (
    <main className="min-h-screen px-3 pb-10 sm:px-6 lg:px-8">
      <PageHero
        eyebrow={isPlanning ? "Planning Mode Active" : "Maps and Location Engine"}
        title={isPlanning ? "Coverage planning for tomorrow's relief operations" : "Hotspots, nearby volunteers, ETA, and route-aware dispatch"}
      >
        {isPlanning
          ? "Balance volunteer coverage, pre-stage inventory, and identify route pressure before field teams go live."
          : "Ola Maps-compatible routing helps coordinators cluster needs, find nearby verified volunteers, and assign the fastest response path."}
      </PageHero>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={isPlanning ? "Forecast zones" : "Need hotspots"} value={requests.length} trend={isPlanning ? "next 24h" : "live"} tone="rose" />
        <Metric label={isPlanning ? "Reserve volunteers" : "Nearby volunteers"} value={volunteers.length} trend={isPlanning ? "scheduled" : "online"} tone="leaf" />
        <Metric label={isPlanning ? "Planned ETA" : "Avg ETA"} value={isPlanning ? "32m" : "21m"} trend={isPlanning ? "buffered" : "fastest"} tone="river" />
        <Metric label="Coverage" value={isPlanning ? "91%" : "82%"} trend={isPlanning ? "target" : "city grid"} tone="saffron" />
      </section>

      <section className="mx-auto mt-4 grid max-w-7xl gap-4 lg:grid-cols-[1.35fr_0.85fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium text-river"><LocateFixed size={16} /> Multi-city heatmap</p>
            <Badge tone={hasOlaMapsKey ? "leaf" : "saffron"}>{hasOlaMapsKey ? "Ola Maps connected" : "Add Ola key"}</Badge>
          </div>
          <div className="mt-4 border border-ink/15 bg-field p-3 text-sm text-ink/65">
            <p className="flex items-center gap-2 font-semibold text-ink"><KeyRound size={15} /> Map provider</p>
            <p className="mt-1">
              {hasOlaMapsKey
                ? "Ola Maps API key is available to the frontend environment. Replace the relief surface with the live map SDK when ready."
                : "Set NEXT_PUBLIC_OLA_MAPS_API_KEY in .env.local, then restart the dev server to enable live Ola Maps."}
            </p>
          </div>
          <div className="relief-surface relative mt-4 min-h-[360px] overflow-hidden border border-ink/15 sm:min-h-[520px]">
            <div className="signal-line absolute left-0 top-0 h-1 w-full" />
            {requests.map((request, index) => (
              <div
                key={request.id}
                className="absolute"
                style={{ left: `${14 + index * 19}%`, top: `${20 + (index % 3) * 20}%` }}
              >
                <div className="relative">
                  <span className="absolute inline-flex h-12 w-12 animate-ping bg-rose/20 sm:h-16 sm:w-16" />
                  <div className="relative flex h-12 w-12 items-center justify-center border-4 border-white bg-rose text-sm font-semibold text-white shadow-soft sm:h-16 sm:w-16 sm:text-base">
                    {isPlanning ? Math.max(35, request.priorityScore - 16) : request.priorityScore}
                  </div>
                </div>
                <div className="mt-2 border border-ink/10 bg-white/90 px-2 py-1 text-xs font-semibold uppercase shadow-sm">{request.city}</div>
              </div>
            ))}
            <div className="absolute bottom-3 left-3 right-3 grid gap-2 border border-ink/10 bg-white/90 p-3 shadow-soft sm:bottom-4 sm:left-4 sm:right-4 sm:grid-cols-3">
              <span className="flex items-center gap-2 text-sm"><Route size={15} /> {isPlanning ? "Route buffers" : "Fastest route"}</span>
              <span className="flex items-center gap-2 text-sm"><RadioTower size={15} /> {isPlanning ? "Risk clusters" : "Cluster alerts"}</span>
              <span className="flex items-center gap-2 text-sm"><Navigation2 size={15} /> {isPlanning ? "Coverage ETA" : "Volunteer ETA"}</span>
            </div>
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 text-sm font-medium text-leaf"><Bike size={16} /> {isPlanning ? "Planned routes" : "Dispatch routes"}</p>
          <div className="mt-5 space-y-3">
            {visibleTasks.map((task) => (
              <div key={task.id} className="border border-ink/15 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink/55"><MapPin size={14} /> {task.city}</p>
                  </div>
                  <Badge tone={task.urgency >= 9 ? "rose" : "saffron"}>{task.etaMinutes} min</Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden border border-ink/10 bg-field">
                  <div className="h-full bg-leaf" style={{ width: `${Math.max(28, 100 - task.etaMinutes)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
