from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import MatchRequest, PriorityRequest, ProfileParseRequest
from app.seed import COMMUNITY_REQUESTS, TASKS, VOLUNTEERS
from app.services.maps import route_eta
from app.services.matching import rank_volunteers
from app.services.priority import explain_priority, score_priority
from app.services.credentials import build_capability_graph, parse_profile

app = FastAPI(title="SevaSync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://sevasync.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "sevasync-api"}


@app.get("/requests")
def list_requests():
    return COMMUNITY_REQUESTS


@app.post("/priority/score")
def priority_score(payload: PriorityRequest):
    score = score_priority(payload)
    return {"priorityScore": score, "explanation": explain_priority(payload)}


@app.get("/volunteers")
def list_volunteers():
    return VOLUNTEERS


@app.post("/credentials/parse-profile")
def credentials_parse_profile(payload: ProfileParseRequest):
    return parse_profile(payload.profile_text)


@app.get("/credentials/graph/{volunteer_id}")
def credentials_graph(volunteer_id: str):
    volunteer = next((item for item in VOLUNTEERS if item["id"] == volunteer_id), None)
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return {"volunteerId": volunteer_id, "capabilityGraph": build_capability_graph(volunteer)}


@app.post("/matching/rank")
def matching_rank(payload: MatchRequest):
    task = next((item for item in TASKS if item["id"] == payload.task_id), None)
    request = next((item for item in COMMUNITY_REQUESTS if item["id"] == task["request_id"]), None) if task else None
    if not task or not request:
        raise HTTPException(status_code=404, detail="Task or request not found")
    return {"taskId": payload.task_id, "matches": rank_volunteers(VOLUNTEERS, task, request)[: payload.limit]}


@app.get("/maps/eta")
def maps_eta(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float):
    return route_eta(origin_lat, origin_lng, dest_lat, dest_lng)


@app.get("/dashboard")
def dashboard():
    people_helped = sum(item["people_affected"] for item in COMMUNITY_REQUESTS)
    return {
        "activeEmergencies": len([item for item in COMMUNITY_REQUESTS if item["priority_score"] >= 85]),
        "volunteersOnline": len([item for item in VOLUNTEERS if item["availability_hours"] > 0]),
        "pendingTasks": len([item for item in TASKS if item["status"] == "Open"]),
        "peopleHelped": people_helped,
        "averageResponseMinutes": 27,
        "volunteerUtilizationRate": 76,
    }
