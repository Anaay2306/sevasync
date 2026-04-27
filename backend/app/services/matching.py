from math import asin, cos, radians, sin, sqrt


def distance_km(a_lat: float, a_lng: float, b_lat: float, b_lng: float) -> float:
    earth_radius = 6371
    d_lat = radians(b_lat - a_lat)
    d_lng = radians(b_lng - a_lng)
    h = sin(d_lat / 2) ** 2 + cos(radians(a_lat)) * cos(radians(b_lat)) * sin(d_lng / 2) ** 2
    return 2 * earth_radius * asin(sqrt(h))


def rank_volunteers(volunteers: list[dict], task: dict, request: dict) -> list[dict]:
    ranked = []
    for volunteer in volunteers:
        if volunteer["city"] != task["city"]:
            continue
        matched = [skill for skill in task["required_skills"] if skill in volunteer["verified_skills"]]
        skill_fit = len(matched) / max(len(task["required_skills"]), 1)
        km = distance_km(volunteer["lat"], volunteer["lng"], request["lat"], request["lng"])
        distance = max(0, 1 - km / 40)
        availability = min(1, volunteer["availability_hours"] / max(4, task["urgency"]))
        urgency = 1 if volunteer["trust_badge"] == "Crisis Ready" else 0.86 if volunteer["trust_badge"] == "Lead" else 0.68
        performance = volunteer["reliability_score"] / 100
        language = 1 if set(task["required_languages"]).intersection(volunteer["languages"]) else 0.45
        score = round(skill_fit * 34 + distance * 16 + availability * 14 + urgency * 14 + performance * 14 + language * 8)
        ranked.append(
            {
                "volunteerId": volunteer["id"],
                "volunteerName": volunteer["name"],
                "score": score,
                "matchedSkills": matched,
                "distanceKm": round(km, 1),
                "rationale": f"{len(matched)}/{len(task['required_skills'])} skills matched, {round(km)} km away.",
            }
        )
    return sorted(ranked, key=lambda item: item["score"], reverse=True)
