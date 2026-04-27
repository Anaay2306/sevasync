"use client";

import { startTransition, useState } from "react";
import { AudioLines, CircleAlert, Clock3, Crosshair, Mic, ShieldCheck, Siren, Sparkles, Users } from "lucide-react";
import { Badge, Card, Metric } from "@/components/ui";
import { useCommunity, reliabilityByArea } from "@/components/community-shell";
import { buildIssuesFromSignals, filterByLocation, parseSignal, type SeverityLevel } from "@/lib/community-os";

const quickReports = [
  "Water tanker not coming for 4 days",
  "No doctor available at camp",
  "Food packets finished in this zone",
  "Flood water entered homes again",
  "Streetlight failure feels unsafe"
];

const severityTone: Record<SeverityLevel, "leaf" | "river" | "saffron" | "rose"> = {
  Low: "leaf",
  Medium: "river",
  High: "saffron",
  Critical: "rose"
};

export function CommunityHome() {
  const { role, location, signals } = useCommunity();
  const localSignals = filterByLocation(signals, location);
  const issues = filterByLocation(buildIssuesFromSignals(signals), location);
  const criticalCount = issues.filter((issue) => issue.severity === "Critical").length;

  return (
    <main className="min-h-screen px-3 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="border-b border-ink/15 pb-6">
          <p className="text-sm font-semibold uppercase text-leaf">Live community system</p>
          <h1 className="headline mt-2 text-4xl font-semibold sm:text-6xl">Signals are turning into action.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60">
            {location.zone} is now operating as a fixed responsibility zone. Signals, issues, tasks, and escalation all stay local to this area.
          </p>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Signals" value={localSignals.length} trend="live" tone="river" />
          <Metric label="Clusters" value={issues.length} trend="forming" tone="leaf" />
          <Metric label="Critical" value={criticalCount} trend="escalation" tone="rose" />
          <Metric label="Role" value={role.toUpperCase()} trend="active" tone="saffron" />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase text-river"><Sparkles size={16} /> System behavior</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {issues.map((issue, index) => (
                <div key={issue.id} className="border border-ink/15 bg-white/75 p-4 dark:bg-[#11201c]">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge tone={severityTone[issue.severity]}>{issue.severity}</Badge>
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping bg-rose/50" />
                      <span className="relative inline-flex h-3 w-3 bg-rose" />
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-ink">{issue.title}</p>
                  <p className="mt-2 text-xs uppercase text-ink/55">Cluster forming #{index + 1}</p>
                  <div className="mt-3 h-2 border border-ink/10 bg-field dark:bg-[#142621]">
                    <div className="h-full bg-ink" style={{ width: `${issue.responseReadiness}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase text-rose"><CircleAlert size={16} /> Transparency feed</p>
            <div className="mt-4 space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{issue.issueType}</p>
                    <Badge tone={severityTone[issue.severity]}>{issue.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{issue.location.zone}</p>
                  <p className="mt-2 text-xs text-ink/55">Signals {issue.signalsCount} · Response {issue.elapsedMinutes}m</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </section>
    </main>
  );
}

export function CommunityReport() {
  const { addSignal, role, location } = useCommunity();
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const interpreted = text ? parseSignal(text) : null;

  const submit = (payload: string, source: "text" | "voice" | "ngo_report" = "text") => {
    if (!payload.trim()) return;
    startTransition(() => {
      addSignal(payload, source);
      setSubmitted(payload);
      setText("");
    });
  };

  return (
    <main className="min-h-screen px-3 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="border-b border-ink/15 pb-6">
          <p className="text-sm font-semibold uppercase text-leaf">Community signal input</p>
          <h1 className="headline mt-2 text-4xl font-semibold sm:text-6xl">Report what is happening right now.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60">
            No forms, no rigid categories. Type the issue naturally and SevaSync will tag it, attach {location.zone}, and push it into clustering.
          </p>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase text-river"><AudioLines size={16} /> Primary input</p>
              <Badge tone="river">{role}</Badge>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={6}
              className="mt-4 w-full border border-ink/15 bg-white/80 p-4 text-sm text-ink outline-none dark:bg-[#11201c]"
              placeholder="Example: Water tanker not coming for 4 days in this area"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <button onClick={() => submit(text, "text")} className="border border-ink bg-ink px-4 py-3 text-sm font-semibold uppercase text-white">Submit signal</button>
              <button onClick={() => submit(text || "Voice report captured from local resident", "voice")} className="flex items-center justify-center gap-2 border border-ink/15 bg-white/80 px-4 py-3 text-sm font-semibold uppercase text-ink dark:bg-[#11201c]"><Mic size={15} /> Voice input</button>
              {role === "ngo" && <button onClick={() => submit(text || "NGO uploaded verified field note with supporting photo", "ngo_report")} className="border border-ink/15 bg-white/80 px-4 py-3 text-sm font-semibold uppercase text-ink dark:bg-[#11201c]">Add NGO report</button>}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {quickReports.map((report) => (
                <button key={report} onClick={() => submit(report)} className="border border-ink/15 bg-field px-3 py-3 text-left text-sm font-semibold text-ink dark:bg-[#142621]">
                  {report}
                </button>
              ))}
            </div>
            {submitted && <p className="mt-4 text-sm font-semibold text-leaf">Signal submitted: {submitted}</p>}
          </Card>

          <Card>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase text-saffron"><Crosshair size={16} /> Auto interpretation</p>
            {interpreted ? (
              <div className="mt-4 grid gap-3">
                <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-xs uppercase text-ink/50">Issue type</p>
                  <p className="mt-1 text-lg font-semibold">{interpreted.issueType}</p>
                </div>
                <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-xs uppercase text-ink/50">Urgency clues</p>
                  <p className="mt-1 text-sm">{interpreted.urgencyClues.length ? interpreted.urgencyClues.join(", ") : "No explicit urgency clues yet"}</p>
                </div>
                <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-xs uppercase text-ink/50">Time indicators</p>
                  <p className="mt-1 text-sm">{interpreted.timeIndicators.length ? interpreted.timeIndicators.join(", ") : "No time delay extracted"}</p>
                </div>
                <div className="border border-ink/15 bg-field p-3 dark:bg-[#142621]">
                  <p className="text-xs uppercase text-ink/50">Location tagging</p>
                  <p className="mt-1 text-sm font-semibold">{location.district} / {location.taluka} / {location.zone}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink/60">Start typing and the system will infer issue type, urgency, and time clues.</p>
            )}
          </Card>
        </section>
      </section>
    </main>
  );
}

export function CommunityIssues() {
  const { location, signals, role } = useCommunity();
  const issues = filterByLocation(buildIssuesFromSignals(signals), location);

  return (
    <main className="min-h-screen px-3 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="border-b border-ink/15 pb-6">
          <p className="text-sm font-semibold uppercase text-leaf">Signal clustering engine</p>
          <h1 className="headline mt-2 text-4xl font-semibold sm:text-6xl">Verified issues generated automatically.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60">
            Multiple reports from the same zone and issue type are clustered into one actionable issue with dynamic severity and escalation pressure.
          </p>
        </div>

        <section className="mt-6 grid gap-4">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={severityTone[issue.severity]}>{issue.severity}</Badge>
                    <Badge tone={issue.escalationLevel === "authority" ? "rose" : issue.escalationLevel === "ngo" ? "saffron" : "leaf"}>{issue.escalationLevel === "none" ? "Local handling" : `Escalate to ${issue.escalationLevel}`}</Badge>
                  </div>
                  <h2 className="headline mt-3 text-3xl font-semibold">{issue.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    {issue.signalsCount} signals clustered in {issue.location.zone}. Confidence {issue.confidenceScore} and readiness {issue.responseReadiness}%.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:w-[360px]">
                  <div className="border border-ink/15 bg-field p-3 dark:bg-[#142621]"><p className="text-xs uppercase text-ink/50">Signals</p><p className="mt-1 text-2xl font-semibold">{issue.signalsCount}</p></div>
                  <div className="border border-ink/15 bg-field p-3 dark:bg-[#142621]"><p className="text-xs uppercase text-ink/50">Elapsed</p><p className="mt-1 text-2xl font-semibold">{issue.elapsedMinutes}m</p></div>
                  <div className="border border-ink/15 bg-field p-3 dark:bg-[#142621]"><p className="text-xs uppercase text-ink/50">Status</p><p className="mt-1 text-lg font-semibold">{issue.status}</p></div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_0.8fr]">
                <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-xs uppercase text-ink/50">Owner</p>
                  <p className="mt-1 text-sm font-semibold">{issue.ownerId}</p>
                </div>
                <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-xs uppercase text-ink/50">Support unit</p>
                  <p className="mt-1 text-sm">{issue.supportIds.join(", ") || "Awaiting assignment"}</p>
                </div>
                <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-xs uppercase text-ink/50">Action</p>
                  <p className="mt-1 text-sm font-semibold">
                    {role === "volunteer" ? "Accept Task" : role === "ngo" ? "Add Report" : role === "authority" ? "Escalation view" : "Track updates"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </section>
    </main>
  );
}

export function CommunityTasks() {
  const { location, signals, role } = useCommunity();
  const issues = filterByLocation(buildIssuesFromSignals(signals), location);
  const [accepted, setAccepted] = useState<string[]>([]);

  return (
    <main className="min-h-screen px-3 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="border-b border-ink/15 pb-6">
          <p className="text-sm font-semibold uppercase text-leaf">Execution layer</p>
          <h1 className="headline mt-2 text-4xl font-semibold sm:text-6xl">Response units with ownership and escalation.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/60">
            Every issue gets a small unit: one owner, support volunteers, optional NGO validation, and an escalation ladder if delays continue.
          </p>
        </div>

        <section className="mt-6 grid gap-4">
          {issues.map((issue) => {
            const isAccepted = accepted.includes(issue.id);
            const currentStatus = issue.escalationLevel === "authority" ? "Volunteer -> NGO -> Authority" : issue.escalationLevel === "ngo" ? "Volunteer -> NGO" : "Volunteer only";
            return (
              <Card key={issue.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={severityTone[issue.severity]}>{issue.severity}</Badge>
                      <Badge tone="river">{issue.responseReadiness}% ready</Badge>
                    </div>
                    <h2 className="headline mt-3 text-3xl font-semibold">{issue.title}</h2>
                    <p className="mt-2 text-sm text-ink/60">Owner {issue.ownerId}. Support {issue.supportIds.length}. NGO attached {issue.ngoAttached ? "Yes" : "Optional"}.</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => !isAccepted && setAccepted((current) => [...current, issue.id])}
                      className="border border-ink bg-ink px-4 py-3 text-sm font-semibold uppercase text-white"
                    >
                      {role === "volunteer" ? (isAccepted ? "Assigned" : "Accept Task") : role === "ngo" ? "Add Report" : role === "authority" ? "Review Escalation" : "Track Task"}
                    </button>
                    <div className="border border-ink/15 bg-field px-4 py-3 text-sm font-semibold uppercase text-ink/65 dark:bg-[#142621]">
                      {isAccepted ? "In Progress" : issue.status}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
                  <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                    <p className="flex items-center gap-2 text-xs uppercase text-ink/50"><Users size={14} /> Response unit</p>
                    <p className="mt-2 text-sm font-semibold">{issue.ownerId}</p>
                    <p className="mt-1 text-sm text-ink/60">{issue.supportIds.join(", ")}</p>
                  </div>
                  <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                    <p className="flex items-center gap-2 text-xs uppercase text-ink/50"><Clock3 size={14} /> Task lifecycle</p>
                    <p className="mt-2 text-sm font-semibold">Pending {"->"} Assigned {"->"} In Progress</p>
                    <p className="mt-1 text-sm text-ink/60">Elapsed {issue.elapsedMinutes} minutes</p>
                  </div>
                  <div className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                    <p className="flex items-center gap-2 text-xs uppercase text-ink/50"><Siren size={14} /> Escalation path</p>
                    <p className="mt-2 text-sm font-semibold">{currentStatus.replaceAll("->", "->")}</p>
                    <p className="mt-1 text-sm text-ink/60">Auto pressure when no response is recorded.</p>
                  </div>
                </div>
              </Card>
            );
          })}

          <Card>
            <p className="text-sm font-semibold uppercase text-river">Response reliability score</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {reliabilityByArea.filter((item) => item.area.zone === location.zone || item.area.district === location.district).map((record) => (
                <div key={record.name} className="border border-ink/15 bg-white/75 p-3 dark:bg-[#11201c]">
                  <p className="text-sm font-semibold">{record.name}</p>
                  <p className="mt-1 text-xs uppercase text-ink/50">{record.role}</p>
                  <p className="headline mt-3 text-3xl font-semibold">{record.score}</p>
                  <p className="mt-1 text-xs text-ink/60">Acceptance {record.acceptanceRate}% · Completion {record.completionRate}%</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </section>
    </main>
  );
}
