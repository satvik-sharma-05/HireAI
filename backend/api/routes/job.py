from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from core.database import get_db
from core.security import get_current_user
from models.schemas import JobCreate
from services.nlp_service import extract_skills
from bson import ObjectId

router = APIRouter()

@router.post("/create")
async def create_job(job: JobCreate, current_user: dict = Depends(get_current_user)):
    # Extract skills from job description
    skills = extract_skills(job.description)
    
    db = get_db()
    job_doc = {
        "user_id": current_user["user_id"],
        "title": job.title,
        "description": job.description,
        "required_skills": job.required_skills or skills,
        "created_at": datetime.utcnow()
    }
    
    result = await db.jobs.insert_one(job_doc)
    
    return {
        "id": str(result.inserted_id),
        "title": job.title,
        "required_skills": job_doc["required_skills"],
        "message": "Job created successfully"
    }

@router.get("/list")
async def list_jobs(current_user: dict = Depends(get_current_user)):
    db = get_db()
    jobs = await db.jobs.find({"user_id": current_user["user_id"]}).to_list(100)
    
    return [
        {
            "id": str(j["_id"]),
            "title": j["title"],
            "description": j["description"],
            "required_skills": j["required_skills"],
            "created_at": j["created_at"]
        }
        for j in jobs
    ]

@router.get("/{job_id}")
async def get_job(job_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "id": str(job["_id"]),
        "title": job["title"],
        "description": job["description"],
        "required_skills": job["required_skills"],
        "created_at": job["created_at"]
    }
