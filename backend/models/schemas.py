from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ============ AUTH ============
class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = Field(pattern="^(candidate|recruiter)$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# ============ RESUME ============
class ResumeUpload(BaseModel):
    filename: str
    text: str
    skills: List[str] = []
    custom_title: Optional[str] = None  # User-defined title

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    custom_title: Optional[str]
    text: str
    skills: List[str]
    created_at: datetime

# ============ JOB ============
class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: Optional[List[str]] = []

class JobResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    required_skills: List[str]
    created_at: datetime

# ============ ANALYSIS ============
class AnalysisRequest(BaseModel):
    resume_id: str
    job_id: str
    mode: Optional[str] = "standard"  # standard, brutal, detailed

class AnalysisResponse(BaseModel):
    id: str
    resume_id: str
    job_id: str
    score: float
    summary: str
    matching_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]
    explanation: str
    created_at: datetime

# ============ ADVANCED FEATURES ============
class SkillImpactRequest(BaseModel):
    resume_id: str
    job_id: str
    skill: str

class RankingRequest(BaseModel):
    job_id: str
    resume_ids: List[str]

class CompetitionAnalysisRequest(BaseModel):
    resume_id: str
    job_id: str

# ============ CHAT ============
class ChatMessage(BaseModel):
    message: str
    context_type: str = "resume"  # resume, job, analysis
    context_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    response: str
    timestamp: datetime
