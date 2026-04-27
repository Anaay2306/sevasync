"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, ClipboardList, HeartHandshake, KeyRound, Shield, UserRound } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { AuthMethod, UserRole, enhanceVolunteerSkills, roleLabels, roleRedirects, saveUser } from "@/lib/auth";

const roleOptions: Array<{ role: UserRole; description: string; icon: typeof UserRound }> = [
  { role: "volunteer", description: "Accept tasks, check in, and build trust.", icon: UserRound },
  { role: "ngo_admin", description: "Manage requests, volunteers, analytics.", icon: Building2 },
  { role: "field_worker", description: "Invite-only field reporting account.", icon: ClipboardList },
  { role: "super_admin", description: "Verify NGOs and monitor platform risk.", icon: Shield },
  { role: "donor", description: "View transparent impact and sponsored work.", icon: HeartHandshake }
];

const loginMethods: Array<{ value: AuthMethod; label: string }> = [
  { value: "email", label: "Email + Password" },
  { value: "phone_otp", label: "Phone OTP" },
  { value: "google", label: "Google" },
  { value: "digilocker", label: "DigiLocker Ready" }
];

const baseInput = "w-full border border-[#d8d2c5] bg-[#f4f1e8] px-3 py-3 text-sm text-[#17201c] outline-none transition placeholder:text-[#8b8375] focus:border-[#0f766e]";

export function SignupPanel() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("volunteer");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["First Aid", "Driving"]);
  const [bio, setBio] = useState("Worked in food drives, has driving license, knows first aid.");
  const [status, setStatus] = useState("");

  const enhancedSkills = useMemo(() => enhanceVolunteerSkills({ skills: selectedSkills, bio }), [selectedSkills, bio]);

  const submitSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name =
      role === "ngo_admin"
        ? String(data.get("ngoName") || "Pending NGO")
        : String(data.get("fullName") || data.get("contactPerson") || "New User");
    const emailOrPhone = String(data.get("emailOrPhone") || data.get("email") || "demo@sevasync.org");
    const user = {
      id: `USR-${Date.now()}`,
      role,
      name,
      emailOrPhone,
      city: String(data.get("city") || ""),
      status: role === "ngo_admin" ? "pending_approval" as const : role === "field_worker" ? "invited" as const : "active" as const,
      skills: role === "volunteer" ? selectedSkills : undefined,
      enhancedSkills: role === "volunteer" ? enhancedSkills : undefined,
      ngoName: role === "ngo_admin" ? String(data.get("ngoName") || "") : undefined,
      createdAt: new Date().toISOString()
    };
    saveUser(user);
    setStatus(role === "ngo_admin" ? "NGO submitted for super admin approval." : "Account created.");
    window.setTimeout(() => router.push(roleRedirects[role]), 450);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
      <Card>
        <p className="text-sm font-semibold uppercase text-leaf">Choose account type</p>
        <div className="mt-4 grid gap-2">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const active = role === option.role;
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => setRole(option.role)}
                className={`border p-3 text-left transition ${active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white/75 text-ink hover:border-ink"}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold uppercase"><Icon size={16} /> {roleLabels[option.role]}</span>
                <span className="mt-1 block text-xs opacity-70">{option.description}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-river">Signup flow</p>
            <h1 className="headline mt-2 text-3xl font-semibold">{roleLabels[role]}</h1>
          </div>
          <Badge tone={role === "ngo_admin" ? "saffron" : "leaf"}>{role === "ngo_admin" ? "Approval required" : "Instant profile"}</Badge>
        </div>

        <form className="mt-5 grid gap-3" onSubmit={submitSignup}>
          {role === "volunteer" && (
            <>
              <input className={baseInput} name="fullName" placeholder="Full Name" required />
              <input className={baseInput} name="emailOrPhone" placeholder="Email / Phone" required />
              <input className={baseInput} name="password" placeholder="Password / OTP" type="password" required />
              <input className={baseInput} name="city" placeholder="City" required />
              <input className={baseInput} name="languages" placeholder="Languages, e.g. Hindi, Marathi, English" />
              <textarea className={baseInput} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Profile bio for skills.sh analysis" rows={3} />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["First Aid", "Driving", "Food Distribution", "Teaching", "Counseling", "Translation"].map((skill) => (
                  <label key={skill} className="flex items-center gap-2 border border-ink/15 bg-white/70 p-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={(event) =>
                        setSelectedSkills((current) => event.target.checked ? [...current, skill] : current.filter((item) => item !== skill))
                      }
                    />
                    {skill}
                  </label>
                ))}
              </div>
              <input className={baseInput} name="availability" placeholder="Availability, e.g. Weekends, 6 PM - 9 PM" />
              <input className={baseInput} name="emergencyContact" placeholder="Emergency Contact" />
              <input className={baseInput} name="idUpload" type="file" aria-label="Upload ID optional" />
              <div className="border border-leaf/25 bg-leaf/10 p-3 text-sm text-ink/70">
                <p className="font-semibold text-leaf">skills.sh enhancement preview</p>
                <p className="mt-1">{enhancedSkills.join(", ")}</p>
              </div>
            </>
          )}

          {role === "ngo_admin" && (
            <>
              <input className={baseInput} name="ngoName" placeholder="NGO Name" required />
              <input className={baseInput} name="registrationNumber" placeholder="Registration Number" required />
              <input className={baseInput} name="email" placeholder="Email" required />
              <input className={baseInput} name="password" placeholder="Password" type="password" required />
              <input className={baseInput} name="contactPerson" placeholder="Contact Person" required />
              <input className={baseInput} name="city" placeholder="City" required />
              <input className={baseInput} name="ngoType" placeholder="NGO Type, e.g. Disaster Relief, Education" />
              <input className={baseInput} name="certificate" type="file" aria-label="Upload NGO certificate" />
              <p className="border border-saffron/30 bg-saffron/10 p-3 text-sm text-ink/65">Status will be pending approval until a Super Admin verifies the NGO.</p>
            </>
          )}

          {role === "field_worker" && (
            <>
              <input className={baseInput} name="inviteCode" placeholder="Invite Link / Code" required />
              <input className={baseInput} name="fullName" placeholder="Full Name" required />
              <input className={baseInput} name="emailOrPhone" placeholder="Email / Phone" required />
              <input className={baseInput} name="password" placeholder="Password / OTP" type="password" required />
              <input className={baseInput} name="city" placeholder="Assigned City" required />
              <p className="border border-river/25 bg-river/10 p-3 text-sm text-ink/65">Field worker accounts are linked to the inviting NGO.</p>
            </>
          )}

          {(role === "super_admin" || role === "donor") && (
            <>
              <input className={baseInput} name="fullName" placeholder="Full Name" required />
              <input className={baseInput} name="emailOrPhone" placeholder="Email" required />
              <input className={baseInput} name="password" placeholder="Password" type="password" required />
              <input className={baseInput} name="city" placeholder="City" />
            </>
          )}

          <button className="border border-ink bg-ink px-4 py-3 text-sm font-semibold uppercase text-white" type="submit">
            Create {roleLabels[role]} Account
          </button>
          {status && <p className="flex items-center gap-2 text-sm font-semibold text-leaf"><CheckCircle2 size={16} /> {status}</p>}
        </form>
      </Card>
    </div>
  );
}

export function LoginPanel({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("volunteer");
  const [method, setMethod] = useState<AuthMethod>("email");

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    saveUser({
      id: `LOGIN-${Date.now()}`,
      role,
      name: String(data.get("emailOrPhone") || roleLabels[role]),
      emailOrPhone: String(data.get("emailOrPhone") || "demo@sevasync.org"),
      status: role === "ngo_admin" ? "pending_approval" : "active",
      createdAt: new Date().toISOString()
    });
    router.push(roleRedirects[role]);
  };

  const content = (
    <>
      <p className="flex items-center gap-2 text-sm font-semibold uppercase text-leaf"><KeyRound size={16} /> Login</p>
      <h1 className="headline mt-2 text-4xl font-semibold">Role-based access</h1>
      <form className="mt-5 grid gap-3" onSubmit={login}>
        <div className="grid gap-2 sm:grid-cols-2">
          {roleOptions.map((option) => (
            <button
              key={option.role}
              type="button"
              onClick={() => setRole(option.role)}
              className={`border px-3 py-3 text-left text-sm font-semibold uppercase transition ${role === option.role ? "border-[#17201c] bg-[#17201c] text-white" : "border-[#d8d2c5] bg-[#f4f1e8] text-[#17201c]"}`}
            >
              {roleLabels[option.role]}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {loginMethods.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setMethod(item.value)}
              className={`border px-3 py-2 text-xs font-semibold uppercase transition ${method === item.value ? "border-[#0f766e] bg-[#0f766e] text-white" : "border-[#d8d2c5] bg-[#f4f1e8] text-[#5f655f]"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input className={baseInput} name="emailOrPhone" placeholder={method === "phone_otp" ? "Phone number" : "Email / Phone"} required />
        {(method === "email" || method === "digilocker") && <input className={baseInput} name="password" placeholder="Password" type="password" required />}
        {method === "phone_otp" && <input className={baseInput} name="otp" placeholder="OTP code" required />}
        {method === "google" && <p className="border border-[#c6d7f7] bg-[#eaf1ff] p-3 text-sm text-[#40506b]">Google OAuth placeholder. Production should connect Firebase, Clerk, or NextAuth.</p>}
        <button className="border border-[#17201c] bg-[#17201c] px-4 py-3 text-sm font-semibold uppercase text-white" type="submit">
          Login and redirect to {roleRedirects[role]}
        </button>
      </form>
    </>
  );

  if (embedded) {
    return content;
  }

  return <Card className="mx-auto max-w-3xl">{content}</Card>;
}
