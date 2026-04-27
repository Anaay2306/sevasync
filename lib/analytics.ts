import { requests, tasks, volunteers } from "@/lib/seed-data";
import { rankVolunteers } from "@/lib/matching";

export function getDashboardMetrics() {
  const activeEmergencies = requests.filter((request) => request.priorityScore >= 85).length;
  const pendingTasks = tasks.filter((task) => task.status === "Open").length;
  const completionRate = Math.round((tasks.filter((task) => task.status === "Completed").length / tasks.length) * 100);
  const peopleHelped = requests.reduce((sum, request) => sum + request.peopleAffected, 0);
  const volunteersOnline = volunteers.filter((volunteer) => volunteer.availabilityHours > 0).length;

  return {
    activeEmergencies,
    pendingTasks,
    completionRate,
    peopleHelped,
    volunteersOnline,
    responseTimeMinutes: 27,
    utilizationRate: 76,
    costSavedLakhs: 18.4
  };
}

export function getTopMatches() {
  return tasks.map((task) => {
    const request = requests.find((item) => item.id === task.requestId)!;
    return {
      task,
      request,
      matches: rankVolunteers(volunteers, task, request).slice(0, 3)
    };
  });
}
