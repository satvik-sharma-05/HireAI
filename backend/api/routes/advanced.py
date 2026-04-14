from fastapi import APIRouter, Depends, HTTPException
from core.database import get_db
from core.security import get_current_user
from services.advanced_features import (
    reality_check_analysis,
    skill_impact_simulator,
    rejection_simulator,
    recruiter_first_impression,
    fake_experience_detector,
    auto_project_generator,
    career_path_recommender,
    competition_analysis,
    resume_heatmap_analysis,
    generate_cover_letter,
    simplify_job_description,
    apply_readiness_score
)
from services.matching_service import calculate_match_score
from bson import ObjectId

router = APIRouter()


@router.post("/reality-check")
async def get_reality_check(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Brutally honest feedback"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    match_data = calculate_match_score(
        resume["text"], job["description"],
        resume["skills"], job["required_skills"]
    )
    
    result = await reality_check_analysis(resume["text"], job["description"], match_data)
    return result


@router.post("/skill-impact")
async def get_skill_impact(
    resume_id: str,
    job_id: str,
    skill: str,
    current_user: dict = Depends(get_current_user)
):
    """Simulate impact of adding a skill"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    match_data = calculate_match_score(
        resume["text"], job["description"],
        resume["skills"], job["required_skills"]
    )
    
    result = await skill_impact_simulator(
        resume["text"], job["description"], skill, match_data["score"]
    )
    return result


@router.post("/rejection-simulator")
async def get_rejection_reasons(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Simulate rejection reasons"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    match_data = calculate_match_score(
        resume["text"], job["description"],
        resume["skills"], job["required_skills"]
    )
    
    result = await rejection_simulator(resume["text"], job["description"], match_data)
    return result


@router.post("/first-impression")
async def get_first_impression(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Recruiter's first 5-second impression"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    result = await recruiter_first_impression(resume["text"], job["description"])
    return result


@router.post("/fake-detector")
async def detect_fake_experience(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Detect overclaimed skills"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    result = await fake_experience_detector(resume["text"])
    return result


@router.post("/project-generator")
async def generate_projects(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Generate project ideas for missing skills"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    match_data = calculate_match_score(
        resume["text"], job["description"],
        resume["skills"], job["required_skills"]
    )
    
    result = await auto_project_generator(match_data["missing_skills"], job["description"])
    return result


@router.post("/career-path")
async def get_career_path(
    resume_id: str,
    target_role: str,
    current_user: dict = Depends(get_current_user)
):
    """Career path recommendations"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    result = await career_path_recommender(resume["text"], target_role)
    return result


@router.post("/competition-analysis")
async def get_competition_analysis(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Compare vs top 10% candidates"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    match_data = calculate_match_score(
        resume["text"], job["description"],
        resume["skills"], job["required_skills"]
    )
    
    result = await competition_analysis(resume["text"], job["description"], match_data)
    return result


@router.post("/resume-heatmap")
async def get_resume_heatmap(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Resume section strength analysis"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    result = await resume_heatmap_analysis(resume["text"], job["description"])
    return result


@router.post("/cover-letter")
async def generate_cover_letter_endpoint(
    resume_id: str,
    job_id: str,
    company_name: str = "the company",
    current_user: dict = Depends(get_current_user)
):
    """Generate personalized cover letter"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    result = await generate_cover_letter(resume["text"], job["description"], company_name)
    return result


@router.post("/simplify-jd")
async def simplify_jd(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Simplify job description"""
    db = get_db()
    
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    result = await simplify_job_description(job["description"])
    return result


@router.post("/apply-readiness")
async def get_apply_readiness(
    resume_id: str,
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """One-click apply readiness score"""
    db = get_db()
    
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")
    
    match_data = calculate_match_score(
        resume["text"], job["description"],
        resume["skills"], job["required_skills"]
    )
    
    result = await apply_readiness_score(resume["text"], job["description"], match_data)
    return result


@router.post("/rank-candidates")
async def rank_candidates(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Rank all resumes for a job"""
    db = get_db()
    
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get all analyses for this job
    analyses = await db.analyses.find({
        "user_id": current_user["user_id"],
        "job_id": job_id
    }).sort("score", -1).to_list(100)
    
    ranked = []
    for idx, analysis in enumerate(analyses):
        ranked.append({
            "rank": idx + 1,
            "resume_id": analysis["resume_id"],
            "resume_title": analysis.get("resume_filename", "Unknown"),
            "score": analysis["score"],
            "summary": analysis.get("summary", "")[:150],
            "top_skills": analysis.get("matching_skills", [])[:5],
            "is_top_3": idx < 3
        })
    
    return {"rankings": ranked, "total": len(ranked)}
