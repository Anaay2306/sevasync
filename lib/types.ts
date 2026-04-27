export type NeedCategory =
  | "Food"
  | "Health"
  | "Shelter"
  | "Education"
  | "Senior Care"
  | "Disaster"
  | "Employment";

export type TaskStatus = "Open" | "Assigned" | "In Progress" | "Completed";

export interface CommunityRequest {
  id: string;
  title: string;
  city: string;
  ward: string;
  category: NeedCategory;
  peopleAffected: number;
  severity: number;
  vulnerability: number;
  waitHours: number;
  repeatedReports: number;
  weatherRisk: number;
  povertyIndex: number;
  lat: number;
  lng: number;
  source: "OCR" | "CSV" | "WhatsApp" | "Field App" | "Voice";
  priorityScore: number;
  explanation: string[];
}

export interface Volunteer {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  verifiedSkills: string[];
  languages: string[];
  availabilityHours: number;
  reliabilityScore: number;
  missionsCompleted: number;
  certifications: string[];
  interests: string[];
  trustBadge: "New" | "Reliable" | "Lead" | "Crisis Ready";
}

export interface MissionTask {
  id: string;
  requestId: string;
  title: string;
  requiredSkills: string[];
  requiredLanguages: string[];
  urgency: number;
  city: string;
  status: TaskStatus;
  etaMinutes: number;
  assignedVolunteerIds: string[];
}

export interface AssignmentScore {
  volunteerId: string;
  volunteerName: string;
  taskId: string;
  score: number;
  factors: {
    skillFit: number;
    distance: number;
    availability: number;
    urgencyReadiness: number;
    pastPerformance: number;
    languageFit: number;
  };
  rationale: string;
}
