RELATED_SKILLS = {
    "First Aid": ["Nursing", "Senior Care", "Flood Rescue"],
    "Nursing": ["First Aid", "Senior Care", "Counseling"],
    "Logistics": ["Driving", "Inventory", "Food Distribution"],
    "Teaching": ["Childcare", "Translation", "Event Management"],
    "Flood Rescue": ["First Aid", "Logistics", "Driving"],
    "Food Distribution": ["Inventory", "Logistics", "Driving"],
}

KNOWN_SKILLS = [
    "First Aid",
    "Nursing",
    "Driving",
    "Counseling",
    "Food Distribution",
    "Logistics",
    "Tech Support",
    "Translation",
    "Childcare",
    "Event Management",
    "Flood Rescue",
    "Teaching",
    "Inventory",
    "Senior Care",
]


def parse_profile(profile_text: str) -> dict:
    normalized = profile_text.lower()
    verified = [skill for skill in KNOWN_SKILLS if skill.lower() in normalized]
    inferred = []
    for skill in verified:
        inferred.extend(RELATED_SKILLS.get(skill, []))
    return {
        "provider": "SevaSync Credential Engine",
        "verifiedSkills": verified,
        "inferredStrengths": list(dict.fromkeys(inferred))[:6],
        "capabilityGraphReady": bool(verified),
        "recommendedRole": recommend_role(verified),
    }


def build_capability_graph(volunteer: dict) -> list[dict]:
    return [
        {
            "skill": skill,
            "adjacent": RELATED_SKILLS.get(skill, []),
            "verified": any("verified" in cert.lower() for cert in volunteer["certifications"]),
        }
        for skill in volunteer["verified_skills"]
    ]


def recommend_role(skills: list[str]) -> str:
    if {"Flood Rescue", "First Aid"}.intersection(skills):
        return "Crisis response volunteer"
    if {"Nursing", "Senior Care"}.intersection(skills):
        return "Medical camp support"
    if {"Teaching", "Childcare"}.intersection(skills):
        return "Education cohort mentor"
    if {"Driving", "Logistics"}.intersection(skills):
        return "Logistics dispatcher"
    return "General volunteer"
