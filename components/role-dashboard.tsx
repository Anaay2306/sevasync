"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, CheckCircle2, ClipboardList, HeartHandshake, ShieldAlert, UserRound } from "lucide-react";
import { Card, Metric, Badge } from "@/components/ui";
import { getCurrentUser, roleLabels, type UserRole, type StoredUser } from "@/lib/auth";

const roleContent: Record<UserRole, { title: string; description: string; icon: typeof UserRound; metrics: Array<[string, string, string]> }> = {
  volunteer: {
    title: "Volunteer Dashboard",
    description: "Assigned tasks, nearby needs, profile score, and mission history.",
    icon: UserRound,
    metrics: [["Assigned Tasks", "3", "today"], ["Nearby Needs", "12", "5 km"], ["Profile Score", "91", "trusted"]]
  },
  ngo_admin: {
    title: "NGO Dashboard",
    description: "Requests, volunteers, analytics, resources, and approval status.",
    icon: Building2,
    metrics: [["Requests", "28", "open"], ["Volunteers", "214", "active"], ["Analytics", "4.8", "score"]]
  },
  field_worker: {
    title: "Field Worker Dashboard",
    description: "Mobile reporting, assigned survey zones, offline queue, and proof uploads.",
    icon: ClipboardList,
    metrics: [["Reports", "18", "synced"], ["Offline Queue", "4", "pending"], ["Zones", "3", "assigned"]]
  },
  super_admin: {
    title: "Super Admin Console",
    description: "All NGOs, fraud checks, global stats, and platform controls.",
    icon: ShieldAlert,
    metrics: [["Pending NGOs", "7", "review"], ["Fraud Checks", "3", "flagged"], ["Cities", "12", "live"]]
  },
  donor: {
    title: "Donor Impact Dashboard",
    description: "Sponsored work, verified outcomes, transparency reports, and cost savings.",
    icon: HeartHandshake,
    metrics: [["People Helped", "1,765", "verified"], ["Reports", "9", "ready"], ["Savings", "18.4L", "optimized"]]
  }
};

export function RoleDashboard({ role }: { role: UserRole }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const content = roleContent[role];
  const Icon = content.icon;

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <main className="min-h-screen px-3 pb-10 pt-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="border-b border-ink/15 pb-6">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase text-leaf"><Icon size={16} /> {roleLabels[role]}</p>
          <h1 className="headline mt-2 text-4xl font-semibold sm:text-6xl">{content.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">{content.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone={user?.status === "pending_approval" ? "saffron" : "leaf"}>{user?.status ?? "demo session"}</Badge>
            {user?.name && <Badge tone="river">{user.name}</Badge>}
          </div>
        </div>
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {content.metrics.map(([label, value, trend]) => <Metric key={label} label={label} value={value} trend={trend} />)}
        </section>
        <Card className="mt-6">
          <p className="text-sm font-semibold uppercase text-river">Next actions</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Review queue", "Open maps", "View reports"].map((item) => (
              <Link key={item} href={item === "Open maps" ? "/maps" : item === "View reports" ? "/impact" : "/data-hub"} className="flex items-center gap-2 border border-ink/15 bg-white/70 p-3 text-sm font-semibold text-ink transition hover:border-ink">
                <CheckCircle2 size={16} />
                {item}
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
