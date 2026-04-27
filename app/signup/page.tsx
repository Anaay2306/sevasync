import Link from "next/link";
import { SignupPanel } from "@/components/auth-panels";
import { PageHero } from "@/components/page-hero";

export default function SignupPage() {
  return (
    <main className="min-h-screen px-3 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="Role-Based Signup" title="Create the right account for your social impact workflow">
        Volunteers, NGO admins, field workers, super admins, and donors each get a tailored onboarding path and dashboard.
      </PageHero>
      <section className="mx-auto max-w-7xl">
        <SignupPanel />
      </section>
      <div className="mx-auto mt-6 max-w-4xl text-center text-sm text-ink/60">
        Already have access? <Link href="/login" className="font-semibold text-leaf">Sign in</Link>
      </div>
    </main>
  );
}
