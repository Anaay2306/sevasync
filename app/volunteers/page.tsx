import { Award, CheckCircle2, GraduationCap, Languages, Network, Radar, ShieldCheck, UserCheck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { tasks, volunteers } from "@/lib/seed-data";
import { buildCapabilityGraph, detectCapabilityGaps, recommendTrainingPath } from "@/lib/volunteer-intelligence";
import { getTopMatches } from "@/lib/analytics";

export default function VolunteersPage() {
  const matches = getTopMatches();
  const gaps = detectCapabilityGaps(tasks[1], volunteers);

  return (
    <main className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="Volunteer Intelligence System" title="Credentialed profiles, smart matching, and mission-ready team design">
        Build verified capability graphs, detect gaps, recommend training, and create best-fit teams for medical camps, food drives, education cohorts, and crisis response.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-leaf"><UserCheck size={16} /> Verified volunteer roster</p>
            <Badge>4 online</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="overflow-hidden rounded-xl border border-ink/10 bg-white/80 shadow-sm">
                <div className="signal-line h-1 w-full" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="headline text-2xl font-semibold">{volunteer.name}</p>
                      <p className="mt-1 text-sm text-ink/55">{volunteer.city} - {volunteer.missionsCompleted} missions</p>
                    </div>
                    <Badge tone={volunteer.trustBadge === "Crisis Ready" ? "rose" : "leaf"}>{volunteer.trustBadge}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {volunteer.verifiedSkills.map((skill) => (
                      <span key={skill} className="rounded-full border border-ink/10 bg-field px-2.5 py-1 text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink/60">
                    <span className="flex items-center gap-2"><Languages size={14} /> {volunteer.languages.join(", ")}</span>
                    <span className="flex items-center gap-2"><Award size={14} /> {volunteer.reliabilityScore}% reliable</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 text-sm font-semibold text-river"><Network size={16} /> Capability graph</p>
          <div className="relief-surface relative mt-4 min-h-48 overflow-hidden rounded-xl border border-ink/10 p-4">
            <div className="absolute left-[18%] top-[22%] h-3 w-3 rounded-full bg-leaf" />
            <div className="absolute left-[48%] top-[42%] h-4 w-4 rounded-full bg-river" />
            <div className="absolute left-[72%] top-[20%] h-3 w-3 rounded-full bg-rose" />
            <div className="absolute left-[34%] top-[70%] h-3 w-3 rounded-full bg-saffron" />
            <div className="relative rounded-xl bg-white/80 p-4 shadow-soft">
              <p className="headline text-2xl font-semibold">{volunteers[0].name}</p>
              <p className="mt-1 text-sm text-ink/58">Crisis response profile with verified adjacent capabilities.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {buildCapabilityGraph(volunteers[0]).map((node) => (
              <div key={node.skill} className="rounded-xl border border-ink/10 bg-white/80 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{node.skill}</p>
                  <CheckCircle2 className="text-leaf" size={17} />
                </div>
                <p className="mt-1 text-sm text-ink/58">Connected strengths: {node.adjacent.join(", ")}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-field p-4">
            <p className="flex items-center gap-2 text-sm font-semibold"><GraduationCap size={16} /> Training path</p>
            <p className="mt-2 text-sm leading-6 text-ink/62">
              {gaps.length ? gaps.map((gap) => `${gap}: ${recommendTrainingPath(gap).join(" > ")}`).join("; ") : "No gaps detected for the medical task."}
            </p>
          </div>
        </Card>
      </section>

      <section className="mx-auto mt-4 max-w-7xl">
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="headline text-3xl font-semibold">Smart role assignment</h2>
            <Badge tone="river">Live scoring</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {matches.map(({ task, matches: ranked }) => (
              <div key={task.id} className="rounded-xl border border-ink/10 bg-white/80 p-4 shadow-sm">
                <p className="flex items-center gap-2 font-semibold"><Radar size={16} /> {task.title}</p>
                <p className="mt-1 text-sm text-ink/55">{task.requiredSkills.join(" + ")}</p>
                <div className="mt-4 space-y-2">
                  {ranked.map((match) => (
                    <div key={match.volunteerId} className="flex items-center justify-between rounded-lg bg-field px-3 py-2">
                      <span className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={15} /> {match.volunteerName}</span>
                      <span className="headline text-2xl font-semibold text-leaf">{match.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
