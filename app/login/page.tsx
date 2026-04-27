import Link from "next/link";
import { LoginPanel } from "@/components/auth-panels";
import { MeteorDemo } from "@/components/ui/meteors-demo";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#070808_0%,#111715_100%)] px-3 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-48px)] max-w-7xl items-center gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden lg:block">
          <MeteorDemo>
            <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 text-white">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-teal-300">Secure Access</p>
                <h1 className="headline mt-6 max-w-xl text-6xl font-semibold">Sign in and land in the right workspace.</h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/68">
                  Choose classic email login, phone OTP, Google, or future DigiLocker verification, then redirect by role.
                </p>
              </div>
              <div className="grid max-w-xl grid-cols-3 gap-3">
                {[
                  ["Volunteer", "Tasks and mission check-ins"],
                  ["NGO Admin", "Requests, volunteers, analytics"],
                  ["Field Teams", "Invite-only field reporting"]
                ].map(([title, copy]) => (
                  <div key={title} className="border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-sm font-semibold uppercase text-white">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-white/58">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </MeteorDemo>
        </div>

        <div className="relative">
          <div className="absolute inset-0 lg:hidden">
            <MeteorDemo />
          </div>
          <div className="relative z-10 py-6 lg:py-0">
            <div className="mx-auto max-w-3xl border border-[#d8d2c5] bg-[#fcfaf4] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
              <div className="mb-6 lg:hidden">
                <p className="text-sm font-semibold uppercase text-[#0f766e]">Secure Login</p>
                <h1 className="headline mt-2 text-4xl font-semibold text-[#17201c]">Role-based access</h1>
                <p className="mt-2 text-sm leading-6 text-[#69726b]">
                  Sign in with the method that fits your workflow, then continue into your role-specific dashboard.
                </p>
              </div>
              <LoginPanel embedded />
            </div>
            <div className="mx-auto mt-6 max-w-3xl text-center text-sm text-white/72 lg:text-white/72">
              New to SevaSync? <Link href="/signup" className="font-semibold text-teal-300">Create an account</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
