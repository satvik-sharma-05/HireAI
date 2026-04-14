from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from core.database import get_db
from core.security import get_current_user
from models.schemas import AnalysisRequest
from services.matching_service import calculate_match_score
from services.genai_service import generate_analysis
from bson import ObjectId

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(request: AnalysisRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Get resume and job
    resume = await db.resumes.find_one({"_id": ObjectId(request.resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(request.job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    # Calculate match score
    match_data = calculate_match_score(resume["text"], job["description"], resume["skills"], job["required_skills"])
    
    # Generate AI insights
    ai_insights = await generate_analysis(resume["text"], job["description"], match_data)
    
    # Save complete analysis
    analysis_doc = {
        "user_id": current_user["user_id"],
        "resume_id": request.resume_id,
        "job_id": request.job_id,
        "resume_filename": resume.get("filename", "Unknown"),
        "job_title": job.get("title", "Untitled Job"),
        "job_description": job["description"],
        "score": match_data["score"],
        "semantic_score": match_data.get("semantic_score", 0),
        "skill_score": match_data.get("skill_score", 0),
        "summary": ai_insights["summary"],
        "matching_skills": match_data["matching_skills"],
        "missing_skills": match_data["missing_skills"],
        "suggestions": ai_insights["suggestions"],
        "explanation": ai_insights["explanation"],
        "learning_resources": ai_insights.get("learning_resources", {}),
        "reality_check": ai_insights.get("reality_check", ""),
        "rejection_reasons": ai_insights.get("rejection_reasons", ""),
        "first_impression": ai_insights.get("first_impression", ""),
        "apply_readiness": ai_insights.get("apply_readiness", ""),
        "full_analysis": ai_insights.get("full_analysis", ""),
        "created_at": datetime.utcnow()
    }
    
    result = await db.analyses.insert_one(analysis_doc)
    
    return {
        "id": str(result.inserted_id),
        "score": match_data["score"],
        "semantic_score": match_data.get("semantic_score", 0),
        "skill_score": match_data.get("skill_score", 0),
        "summary": ai_insights["summary"],
        "matching_skills": match_data["matching_skills"],
        "missing_skills": match_data["missing_skills"],
        "suggestions": ai_insights["suggestions"],
        "explanation": ai_insights["explanation"],
        "learning_resources": ai_insights.get("learning_resources", {}),
        "reality_check": ai_insights.get("reality_check", ""),
        "rejection_reasons": ai_insights.get("rejection_reasons", ""),
        "first_impression": ai_insights.get("first_impression", ""),
        "apply_readiness": ai_insights.get("apply_readiness", "")
    }

@router.get("/history")
async def get_analysis_history(current_user: dict = Depends(get_current_user)):
    db = get_db()
    analyses = await db.analyses.find({"user_id": current_user["user_id"]}).sort("created_at", -1).to_list(100)
    
    return [
        {
            "id": str(a["_id"]),
            "resume_id": a.get("resume_id"),
            "job_id": a.get("job_id"),
            "resume_filename": a.get("resume_filename", "Unknown"),
            "job_title": a.get("job_title", "Untitled"),
            "score": a["score"],
            "summary": a.get("summary", "")[:200],  # Preview only
            "created_at": a["created_at"]
        }
        for a in analyses
    ]

@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    analysis = await db.analyses.find_one({"_id": ObjectId(analysis_id), "user_id": current_user["user_id"]})
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {
        "id": str(analysis["_id"]),
        "resume_filename": analysis.get("resume_filename", "Unknown"),
        "job_title": analysis.get("job_title", "Untitled"),
        "job_description": analysis.get("job_description", ""),
        "score": analysis["score"],
        "semantic_score": analysis.get("semantic_score", 0),
        "skill_score": analysis.get("skill_score", 0),
        "summary": analysis["summary"],
        "matching_skills": analysis["matching_skills"],
        "missing_skills": analysis["missing_skills"],
        "suggestions": analysis["suggestions"],
        "explanation": analysis["explanation"],
        "learning_resources": analysis.get("learning_resources", {}),
        "reality_check": analysis.get("reality_check", ""),
        "rejection_reasons": analysis.get("rejection_reasons", ""),
        "first_impression": analysis.get("first_impression", ""),
        "apply_readiness": analysis.get("apply_readiness", ""),
        "created_at": analysis["created_at"]
    }
