"use client";

export type CommunityRole = "citizen" | "volunteer" | "ngo" | "authority";
export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";
export type IssueType = "Water" | "Food" | "Health" | "Shelter" | "Electricity" | "Road" | "Safety" | "Sanitation" | "Education" | "Other";
export type TaskLifecycle = "Pending" | "Assigned" | "In Progress" | "Escalated" | "Resolved";

export const roleLabelsMap: Record<CommunityRole, string> = {
  citizen: "Citizen",
  volunteer: "Volunteer",
  ngo: "NGO",
  authority: "Authority"
};

export interface LocationNode {
  district: string;
  taluka: string;
  zone: string;
}

export interface CommunitySignal {
  id: string;
  text: string;
  issueType: IssueType;
  urgencyClues: string[];
  timeIndicators: string[];
  role: CommunityRole;
  createdAt: string;
  source: "text" | "voice" | "ngo_report";
  location: LocationNode;
  confidence: number;
}

export interface VerifiedIssue {
  id: string;
  title: string;
  issueType: IssueType;
  severity: SeverityLevel;
  status: TaskLifecycle;
  signalsCount: number;
  confidenceScore: number;
  createdAt: string;
  lastUpdatedAt: string;
  location: LocationNode;
  ownerId: string;
  supportIds: string[];
  ngoAttached: boolean;
  responseReadiness: number;
  escalationLevel: "none" | "ngo" | "authority";
  elapsedMinutes: number;
}

export interface ReliabilityRecord {
  name: string;
  role: Exclude<CommunityRole, "citizen">;
  acceptanceRate: number;
  completionRate: number;
  responseMinutes: number;
  score: number;
  area: LocationNode;
}

export const locationHierarchy: LocationNode[] = [
  { district: "Mumbai", taluka: "Kurla", zone: "Nehru Nagar" },
  { district: "Mumbai", taluka: "Kurla", zone: "Pipeline Settlement" },
  { district: "Mumbai", taluka: "Dharavi", zone: "Transit Camp" },
  { district: "Pune", taluka: "Yerawada", zone: "Municipal Ward 3" },
  { district: "Delhi", taluka: "Yamuna Pushta", zone: "Relief Corridor" }
];

const thresholdByType: Partial<Record<IssueType, number>> = {
  Water: 2,
  Food: 2,
  Health: 2,
  Shelter: 2,
  Safety: 1
};

const typeWeight: Record<IssueType, number> = {
  Water: 24,
  Food: 22,
  Health: 28,
  Shelter: 20,
  Electricity: 16,
  Road: 12,
  Safety: 26,
  Sanitation: 18,
  Education: 10,
  Other: 8
};

export const reliabilityBoard: ReliabilityRecord[] = [
  {
    name: "Aarav Menon",
    role: "volunteer",
    acceptanceRate: 93,
    completionRate: 95,
    responseMinutes: 17,
    score: 94,
    area: locationHierarchy[0]
  },
  {
    name: "Sana Qureshi",
    role: "volunteer",
    acceptanceRate: 89,
    completionRate: 92,
    responseMinutes: 22,
    score: 91,
    area: locationHierarchy[2]
  },
  {
    name: "Seva Foundation Mumbai",
    role: "ngo",
    acceptanceRate: 96,
    completionRate: 90,
    responseMinutes: 34,
    score: 92,
    area: locationHierarchy[0]
  },
  {
    name: "Ward Control Room",
    role: "authority",
    acceptanceRate: 100,
    completionRate: 88,
    responseMinutes: 41,
    score: 89,
    area: locationHierarchy[4]
  }
];

export const seededSignals: CommunitySignal[] = [
  makeSignal("Water tanker not coming for 4 days in Nehru Nagar", "citizen", locationHierarchy[0], "text"),
  makeSignal("No water in lane 7 since yesterday morning", "citizen", locationHierarchy[0], "voice"),
  makeSignal("Clinic says insulin stock ended, elders waiting", "ngo", locationHierarchy[2], "ngo_report"),
  makeSignal("Three homes still flooded near drainage line", "field", locationHierarchy[1], "text"),
  makeSignal("Streetlight failure and unsafe road after 10 PM", "citizen", locationHierarchy[3], "text")
].map((signal, index) => ({ ...signal, createdAt: new Date(Date.now() - (index + 1) * 36 * 60 * 1000).toISOString() }));

function makeSignal(text: string, role: CommunityRole | "field", location: LocationNode, source: CommunitySignal["source"]): CommunitySignal {
  const normalizedRole: CommunityRole = role === "field" ? "volunteer" : role;
  const parsed = parseSignal(text);
  return {
    id: `SIG-${Math.random().toString(36).slice(2, 9)}`,
    text,
    issueType: parsed.issueType,
    urgencyClues: parsed.urgencyClues,
    timeIndicators: parsed.timeIndicators,
    role: normalizedRole,
    createdAt: new Date().toISOString(),
    source,
    location,
    confidence: parsed.confidence
  };
}

export function parseSignal(text: string) {
  const lower = text.toLowerCase();
  const urgencyClues = ["urgent", "critical", "flood", "medicine", "unsafe", "not coming", "4 days", "elder"].filter((clue) => lower.includes(clue));
  const timeIndicators = ["today", "yesterday", "4 days", "since morning", "10 pm", "hours"].filter((clue) => lower.includes(clue));

  let issueType: IssueType = "Other";
  if (/(water|tanker|drinking)/.test(lower)) issueType = "Water";
  else if (/(food|ration|meal)/.test(lower)) issueType = "Food";
  else if (/(medicine|clinic|doctor|insulin|health)/.test(lower)) issueType = "Health";
  else if (/(flood|home|shelter|roof)/.test(lower)) issueType = "Shelter";
  else if (/(light|electric)/.test(lower)) issueType = "Electricity";
  else if (/(road|drainage|pothole)/.test(lower)) issueType = "Road";
  else if (/(unsafe|violence|harass|danger)/.test(lower)) issueType = "Safety";
  else if (/(toilet|garbage|sewer|sanitation)/.test(lower)) issueType = "Sanitation";
  else if (/(school|class|teacher|education)/.test(lower)) issueType = "Education";

  const confidence = Math.min(96, 52 + urgencyClues.length * 10 + timeIndicators.length * 6 + (issueType !== "Other" ? 12 : 0));
  return { issueType, urgencyClues, timeIndicators, confidence };
}

export function createSignal(text: string, role: CommunityRole, location: LocationNode, source: CommunitySignal["source"] = "text") {
  return makeSignal(text, role, location, source);
}

export function clusterSignals(signals: CommunitySignal[]) {
  const clusters = new Map<string, CommunitySignal[]>();
  for (const signal of signals) {
    const key = `${signal.location.district}|${signal.location.taluka}|${signal.location.zone}|${signal.issueType}`;
    const bucket = clusters.get(key) ?? [];
    bucket.push(signal);
    clusters.set(key, bucket);
  }
  return Array.from(clusters.entries()).map(([key, items]) => ({ key, items }));
}

export function getSeverity(signals: CommunitySignal[], ngoAttached = false): SeverityLevel {
  const density = signals.length * 14;
  const delaySignal = signals.some((signal) => signal.timeIndicators.length > 0) ? 16 : 0;
  const issueWeight = typeWeight[signals[0]?.issueType ?? "Other"];
  const urgency = signals.reduce((sum, signal) => sum + signal.urgencyClues.length * 6, 0);
  const ngoBoost = ngoAttached ? 12 : 0;
  const score = density + delaySignal + issueWeight + urgency + ngoBoost;
  if (score >= 78) return "Critical";
  if (score >= 58) return "High";
  if (score >= 34) return "Medium";
  return "Low";
}

export function buildIssuesFromSignals(signals: CommunitySignal[]) {
  return clusterSignals(signals)
    .filter(({ items }) => items.length >= (thresholdByType[items[0].issueType] ?? 2) || items.some((signal) => signal.urgencyClues.length >= 2))
    .map(({ items }, index): VerifiedIssue => {
      const ngoAttached = items.some((signal) => signal.role === "ngo");
      const severity = getSeverity(items, ngoAttached);
      const responseReadiness = Math.min(100, 46 + items.length * 10 + (ngoAttached ? 12 : 0) + (severity === "Critical" ? 16 : severity === "High" ? 10 : 4));
      const escalationLevel = severity === "Critical" ? "authority" : severity === "High" ? "ngo" : "none";
      const owner = reliabilityBoard.filter((record) => record.area.district === items[0].location.district && record.role !== "ngo").sort((a, b) => b.score - a.score)[0];
      const support = reliabilityBoard.filter((record) => record.area.district === items[0].location.district && record.name !== owner?.name).slice(0, 3);
      const title = `${items[0].issueType} issue in ${items[0].location.zone}`;

      return {
        id: `ISS-${index + 1}`,
        title,
        issueType: items[0].issueType,
        severity,
        status: severity === "Critical" ? "Escalated" : owner ? "Assigned" : "Pending",
        signalsCount: items.length,
        confidenceScore: Math.round(items.reduce((sum, item) => sum + item.confidence, 0) / items.length),
        createdAt: items[items.length - 1].createdAt,
        lastUpdatedAt: items[0].createdAt,
        location: items[0].location,
        ownerId: owner?.name ?? "Unassigned",
        supportIds: support.map((item) => item.name),
        ngoAttached,
        responseReadiness,
        escalationLevel,
        elapsedMinutes: 24 + index * 18
      };
    });
}

export function filterByLocation<T extends { location: LocationNode }>(items: T[], location: LocationNode) {
  return items.filter(
    (item) =>
      item.location.district === location.district &&
      item.location.taluka === location.taluka &&
      item.location.zone === location.zone
  );
}

export function getAutoDetectedLocation() {
  return locationHierarchy[0];
}
