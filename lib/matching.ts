import type { AssignmentScore, MissionTask, Volunteer } from "@/lib/types";

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

export function scoreVolunteerForTask(
  volunteer: Volunteer,
  task: MissionTask,
  taskLocation: { lat: number; lng: number }
): AssignmentScore {
  const matchedSkills = task.requiredSkills.filter((skill) => volunteer.verifiedSkills.includes(skill));
  const skillFit = task.requiredSkills.length ? matchedSkills.length / task.requiredSkills.length : 1;
  const km = distanceKm(volunteer.lat, volunteer.lng, taskLocation.lat, taskLocation.lng);
  const distance = Math.max(0, 1 - km / 40);
  const availability = Math.min(1, volunteer.availabilityHours / Math.max(4, task.urgency));
  const urgencyReadiness = volunteer.trustBadge === "Crisis Ready" ? 1 : volunteer.trustBadge === "Lead" ? 0.86 : 0.68;
  const pastPerformance = volunteer.reliabilityScore / 100;
  const languageFit = task.requiredLanguages.some((language) => volunteer.languages.includes(language)) ? 1 : 0.45;

  const score =
    skillFit * 34 +
    distance * 16 +
    availability * 14 +
    urgencyReadiness * 14 +
    pastPerformance * 14 +
    languageFit * 8;

  return {
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    taskId: task.id,
    score: Math.round(score),
    factors: {
      skillFit: Math.round(skillFit * 100),
      distance: Math.round(distance * 100),
      availability: Math.round(availability * 100),
      urgencyReadiness: Math.round(urgencyReadiness * 100),
      pastPerformance: Math.round(pastPerformance * 100),
      languageFit: Math.round(languageFit * 100)
    },
    rationale: `${matchedSkills.length}/${task.requiredSkills.length} skills matched, ${Math.round(km)} km away, ${volunteer.trustBadge.toLowerCase()} responder.`
  };
}

export function rankVolunteers(volunteers: Volunteer[], task: MissionTask, taskLocation: { lat: number; lng: number }) {
  return volunteers
    .filter((volunteer) => volunteer.city === task.city)
    .map((volunteer) => scoreVolunteerForTask(volunteer, task, taskLocation))
    .sort((a, b) => b.score - a.score);
}
