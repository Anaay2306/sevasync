from app.models import PriorityRequest


def score_priority(payload: PriorityRequest) -> int:
    people = min(payload.people_affected / 500, 1.0)
    waiting = min(payload.wait_hours / 72, 1.0)
    repeated = min(payload.repeated_reports / 12, 1.0)
    score = (
        payload.severity / 10 * 27
        + payload.vulnerability / 10 * 20
        + people * 16
        + waiting * 10
        + payload.weather_risk / 10 * 10
        + payload.poverty_index / 10 * 10
        + repeated * 7
    )
    return round(score)


def explain_priority(payload: PriorityRequest) -> list[str]:
    reasons = []
    if payload.severity >= 8:
        reasons.append("High severity")
    if payload.vulnerability >= 8:
        reasons.append("High vulnerability group")
    if payload.people_affected >= 100:
        reasons.append("Large number of people affected")
    if payload.repeated_reports >= 4:
        reasons.append("Multiple independent reports")
    if payload.weather_risk >= 7:
        reasons.append("Weather or disaster risk signal")
    return reasons or ["Routine scheduled support"]
