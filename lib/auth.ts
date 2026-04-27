export type UserRole = "volunteer" | "ngo_admin" | "field_worker" | "super_admin" | "donor";

export type AuthMethod = "email" | "phone_otp" | "google" | "digilocker";

export interface StoredUser {
  id: string;
  role: UserRole;
  name: string;
  emailOrPhone: string;
  city?: string;
  status: "active" | "pending_approval" | "invited";
  skills?: string[];
  enhancedSkills?: string[];
  ngoName?: string;
  createdAt: string;
}

export const roleLabels: Record<UserRole, string> = {
  volunteer: "Volunteer",
  ngo_admin: "NGO Admin",
  field_worker: "Field Worker",
  super_admin: "Super Admin",
  donor: "Donor / Sponsor"
};

export const roleRedirects: Record<UserRole, string> = {
  volunteer: "/volunteer/dashboard",
  ngo_admin: "/ngo/dashboard",
  field_worker: "/field/dashboard",
  super_admin: "/admin",
  donor: "/donor/dashboard"
};

const skillDictionary = [
  "First Aid",
  "Driving",
  "Food Distribution",
  "Logistics",
  "Community Support",
  "Teaching",
  "Counseling",
  "Translation",
  "Inventory",
  "Senior Care"
];

export function enhanceVolunteerSkills(input: { skills: string[]; bio: string }) {
  const lowerBio = input.bio.toLowerCase();
  const extracted = skillDictionary.filter((skill) => lowerBio.includes(skill.toLowerCase()));
  const inferred = [];
  if (lowerBio.includes("license") || lowerBio.includes("driving")) inferred.push("Driving", "Logistics");
  if (lowerBio.includes("food drive") || lowerBio.includes("ration")) inferred.push("Food Distribution", "Community Support");
  if (lowerBio.includes("first aid") || lowerBio.includes("medical")) inferred.push("First Aid");

  return Array.from(new Set([...input.skills, ...extracted, ...inferred]));
}

export function saveUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  const users = getUsers();
  window.localStorage.setItem("sevasync:users", JSON.stringify([...users.filter((item) => item.id !== user.id), user]));
  window.localStorage.setItem("sevasync:current-user", JSON.stringify(user));
}

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("sevasync:users") ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

export function getCurrentUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem("sevasync:current-user") ?? "null") as StoredUser | null;
  } catch {
    return null;
  }
}
