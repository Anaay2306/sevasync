import { AlertTriangle, BrainCircuit, LineChart, Scale } from "lucide-react";
import { Badge, Card, Metric } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { requests } from "@/lib/seed-data";

const modelStack = ["XGBoost regressor", "Random Forest classifier", "Logistic Regression baseline", "Explainable AI reason codes"];

export default function PrioritizationPage() {
  return (
    <main className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="AI Need Prioritization Engine" title="Score every request by urgency, risk, and social vulnerability">
        SevaSync converts noisy community reports into auditable priority scores from 0 to 100 with clear explanations for dispatchers.
      </PageHero>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Top score" value="98" trend="flood rescue" tone="rose" />
        <Metric label="Critical queue" value="3" trend=">= 85" tone="saffron" />
        <Metric label="Signals per case" value="7" trend="weighted" tone="river" />
        <Metric label="Auditability" value="100%" trend="reasons" tone="leaf" />
      </section>

      <section className="mx-auto mt-4 grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="flex items-center gap-2 text-sm font-medium text-river"><BrainCircuit size={16} /> Model stack</p>
          <div className="mt-4 space-y-3">
            {modelStack.map((item) => (
              <div key={item} className="rounded-lg border border-ink/10 bg-white/70 p-3 font-medium">{item}</div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-field p-4 text-sm leading-6 text-ink/65">
            Features include people affected, severity, vulnerability category, waiting time, weather signals, poverty indicators, and repeated reports.
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 text-sm font-medium text-rose"><AlertTriangle size={16} /> Priority leaderboard</p>
          <div className="mt-5 space-y-3">
            {requests
              .slice()
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .map((request) => (
                <div key={request.id} className="rounded-lg border border-ink/10 bg-white/75 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold">{request.title}</p>
                      <p className="mt-1 text-sm text-ink/58">{request.ward}, {request.city} - {request.category}</p>
                    </div>
                    <Badge tone={request.priorityScore > 85 ? "rose" : "saffron"}>{request.priorityScore}/100</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {request.explanation.map((reason) => (
                      <div key={reason} className="flex items-center gap-2 rounded-md bg-field px-3 py-2 text-sm text-ink/70">
                        <Scale size={14} />
                        {reason}
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
