import type { MissionTask, Volunteer } from "@/lib/types";

const relatedSkills: Record<string, string[]> = {
  "First Aid": ["Nursing", "Senior Care", "Flood Rescue"],
  Nursing: ["First Aid", "Senior Care", "Counseling"],
  Logistics: ["Driving", "Inventory", "Food Distribution"],
  Teaching: ["Childcare", "Translation", "Event Management"],
  "Flood Rescue": ["First Aid", "Logistics", "Driving"],
  "Food Distribution": ["Inventory", "Logistics", "Driving"]
};

export function buildCapabilityGraph(volunteer: Volunteer) {
  return volunteer.verifiedSkills.map((skill) => ({
    skill,
    adjacent: relatedSkills[skill] ?? [],
    verified: volunteer.certifications.some((cert) => cert.toLowerCase().includes("verified"))
  }));
}

export function detectCapabilityGaps(task: MissionTask, volunteers: Volunteer[]) {
  const available = new Set(volunteers.flatMap((volunteer) => volunteer.verifiedSkills));
  return task.requiredSkills.filter((skill) => !available.has(skill));
}

export function recommendTrainingPath(skillGap: string) {
  const paths: Record<string, string[]> = {
    "Flood Rescue": ["Water safety basics", "Rescue rope handling", "Crisis dispatch simulation"],
    Nursing: ["Medical camp triage", "Medication handling", "Patient record protocol"],
    Teaching: ["Child learning levels", "Local language lesson planning", "Safe classroom conduct"],
    Logistics: ["Inventory workflow", "Route optimization", "Cold-chain handling"]
  };

  return paths[skillGap] ?? ["NGO orientation", `${skillGap} fundamentals`, "Supervised field mission"];
}
