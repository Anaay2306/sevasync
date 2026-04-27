from pydantic import BaseModel, Field


class PriorityRequest(BaseModel):
    people_affected: int = Field(ge=1)
    severity: int = Field(ge=1, le=10)
    vulnerability: int = Field(ge=1, le=10)
    wait_hours: int = Field(ge=0)
    weather_risk: int = Field(ge=0, le=10)
    poverty_index: int = Field(ge=0, le=10)
    repeated_reports: int = Field(ge=0)


class ProfileParseRequest(BaseModel):
    profile_text: str = Field(min_length=5)


class MatchRequest(BaseModel):
    task_id: str
    limit: int = Field(default=5, ge=1, le=20)
