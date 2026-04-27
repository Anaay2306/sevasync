"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Banknote, Clock, HeartHandshake, TrendingUp, Users } from "lucide-react";
import { Card, Metric } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { getDashboardMetrics } from "@/lib/analytics";

const metrics = getDashboardMetrics();
const impactTrend = [
  { week: "W1", people: 3100, response: 46, savings: 4.2 },
  { week: "W2", people: 4200, response: 39, savings: 6.8 },
  { week: "W3", people: 5100, response: 31, savings: 10.5 },
  { week: "W4", people: 6900, response: 27, savings: 18.4 }
];

const outcomes = [
  { label: "People helped", value: metrics.peopleHelped.toLocaleString("en-IN"), icon: Users },
  { label: "Average response time", value: `${metrics.responseTimeMinutes}m`, icon: Clock },
  { label: "Volunteer utilization", value: `${metrics.utilizationRate}%`, icon: TrendingUp },
  { label: "Optimization savings", value: `Rs ${metrics.costSavedLakhs}L`, icon: Banknote }
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="Impact Analytics" title="Measure response quality, NGO efficiency, and donor transparency">
        Track people helped, response time, utilization, recurring needs, cost saved, and field proof across every mission.
      </PageHero>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="People helped" value={metrics.peopleHelped.toLocaleString("en-IN")} trend="active cases" tone="leaf" />
        <Metric label="Response time" value={`${metrics.responseTimeMinutes}m`} trend="-34%" tone="river" />
        <Metric label="Utilization" value={`${metrics.utilizationRate}%`} trend="+12%" tone="saffron" />
        <Metric label="Cost saved" value={`Rs ${metrics.costSavedLakhs}L`} trend="optimized" tone="rose" />
      </section>

      <section className="mx-auto mt-4 grid max-w-7xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="flex items-center gap-2 text-sm font-medium text-leaf"><HeartHandshake size={16} /> Weekly social impact</p>
          <div className="mt-4 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impactTrend}>
                <defs>
                  <linearGradient id="impactPeople" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="people" stroke="#0f766e" strokeWidth={3} fill="url(#impactPeople)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold">Outcome scorecard</h2>
          <div className="mt-5 space-y-3">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <div key={outcome.label} className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/75 p-4">
                  <span className="flex items-center gap-3 text-sm font-medium"><Icon size={18} /> {outcome.label}</span>
                  <span className="text-xl font-semibold">{outcome.value}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </main>
  );
}
