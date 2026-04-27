import { CheckCircle2, Cloud, Database, KeyRound, Server, Shield } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";

const deploySteps = [
  { title: "Frontend", detail: "Deploy Next.js to Vercel with NEXT_PUBLIC_API_BASE_URL and Ola Maps key.", icon: Cloud },
  { title: "Backend", detail: "Deploy FastAPI to Railway, Render, or AWS with uvicorn and managed environment secrets.", icon: Server },
  { title: "Database", detail: "Provision PostgreSQL with PostGIS and run database/schema.sql.", icon: Database },
  { title: "Secrets", detail: "Configure Clerk, volunteer verification, Twilio, WhatsApp, email, and database credentials.", icon: KeyRound },
  { title: "Security", detail: "Add auth middleware, tenant policies, audit logs, rate limits, and upload scanning.", icon: Shield }
];

export default function DeploymentPage() {
  return (
    <main className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="Production Readiness" title="Deployment path for a scalable multi-NGO platform">
        SevaSync is structured for Vercel, FastAPI hosting, PostgreSQL/PostGIS, credential verification, notifications, maps, and secure multi-tenant operations.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Launch checklist</h2>
            <Badge>Enterprise ready</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {deploySteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-lg border border-ink/10 bg-white/75 p-4">
                  <p className="flex items-center gap-2 font-semibold"><Icon size={18} /> {step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/62">{step.detail}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold">Winning features covered</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[
              "Multi-NGO ecosystem",
              "Volunteer trust score",
              "AI team formation",
              "Crisis auto-dispatch",
              "Local language intake",
              "Gamified streaks",
              "Credential certification",
              "Donor transparency",
              "Offline sync plan",
              "Predictive relief planning"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 rounded-md bg-field px-3 py-2 text-sm">
                <CheckCircle2 className="text-leaf" size={16} />
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-ink p-4 text-sm leading-6 text-white/72">
            The README includes local run commands, API routes, deployment steps, environment variables, and production hardening guidance.
          </div>
        </Card>
      </section>
    </main>
  );
}
