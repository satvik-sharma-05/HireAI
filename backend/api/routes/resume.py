from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from typing import List, Optional
from datetime import datetime
from core.database import get_db
from core.security import get_current_user
from services.nlp_service import extract_text_from_file, extract_skills
from bson import ObjectId

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    custom_title: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    # Extract text
    text = await extract_text_from_file(file)
    
    # Extract skills using NLP
    skills = extract_skills(text)
    
    # Save to DB
    db = get_db()
    resume_doc = {
        "user_id": current_user["user_id"],
        "filename": file.filename,
        "custom_title": custom_title,
        "text": text,
        "skills": skills,
        "created_at": datetime.utcnow()
    }
    
    result = await db.resumes.insert_one(resume_doc)
    
    return {
        "id": str(result.inserted_id),
        "filename": file.filename,
        "custom_title": custom_title,
        "skills": skills,
        "message": "Resume uploaded successfully"
    }

@router.put("/{resume_id}/title")
async def update_resume_title(
    resume_id: str,
    custom_title: str,
    current_user: dict = Depends(get_current_user)
):
    """Update custom title for a resume"""
    db = get_db()
    result = await db.resumes.update_one(
        {"_id": ObjectId(resume_id), "user_id": current_user["user_id"]},
        {"$set": {"custom_title": custom_title}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {"message": "Title updated successfully", "custom_title": custom_title}

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a resume and all associated analyses"""
    db = get_db()
    
    # Delete resume
    result = await db.resumes.delete_one(
        {"_id": ObjectId(resume_id), "user_id": current_user["user_id"]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Delete associated analyses
    await db.analyses.delete_many({"resume_id": resume_id})
    
    return {"message": "Resume deleted successfully"}

@router.get("/list")
async def list_resumes(current_user: dict = Depends(get_current_user)):
    db = get_db()
    resumes = await db.resumes.find({"user_id": current_user["user_id"]}).sort("created_at", -1).to_list(100)
    
    return [
        {
            "id": str(r["_id"]),
            "filename": r["filename"],
            "custom_title": r.get("custom_title"),
            "skills": r["skills"],
            "created_at": r["created_at"]
        }
        for r in resumes
    ]

@router.get("/{resume_id}")
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id), "user_id": current_user["user_id"]})
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {
        "id": str(resume["_id"]),
        "filename": resume["filename"],
        "custom_title": resume.get("custom_title"),
        "text": resume["text"],
        "skills": resume["skills"],
        "created_at": resume["created_at"]
    }
