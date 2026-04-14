from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize TF-IDF vectorizer (lightweight, no model loading)
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    stop_words='english',
    lowercase=True
)

def calculate_match_score(resume_text: str, job_description: str, resume_skills: list, job_skills: list) -> dict:
    """Calculate match score using TF-IDF similarity"""
    
    # 1. TF-IDF semantic similarity (60% weight)
    try:
        # Fit vectorizer on both texts and transform
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        semantic_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except:
        # Fallback if texts are too short
        semantic_score = 0.5
    
    # 2. Skill match (40% weight)
    resume_skills_set = set([s.lower() for s in resume_skills])
    job_skills_set = set([s.lower() for s in job_skills])
    
    if job_skills_set:
        matching_skills = resume_skills_set.intersection(job_skills_set)
        missing_skills = job_skills_set - resume_skills_set
        skill_score = len(matching_skills) / len(job_skills_set)
    else:
        matching_skills = set()
        missing_skills = set()
        skill_score = 0.5
    
    # Combined score
    final_score = (semantic_score * 0.6 + skill_score * 0.4) * 100
    
    return {
        "score": round(final_score, 2),
        "semantic_score": round(semantic_score * 100, 2),
        "skill_score": round(skill_score * 100, 2),
        "matching_skills": list(matching_skills),
        "missing_skills": list(missing_skills)
    }

def rank_candidates(candidates: list, job_description: str, job_skills: list) -> list:
    """Rank multiple candidates"""
    ranked = []
    
    for candidate in candidates:
        match_data = calculate_match_score(
            candidate["resume_text"],
            job_description,
            candidate["skills"],
            job_skills
        )
        ranked.append({
            "candidate_id": candidate["id"],
            "name": candidate.get("name", "Unknown"),
            "score": match_data["score"],
            "matching_skills": match_data["matching_skills"],
            "missing_skills": match_data["missing_skills"]
        })
    
    # Sort by score
    ranked.sort(key=lambda x: x["score"], reverse=True)
    
    return ranked
