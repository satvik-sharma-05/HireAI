"""
Advanced GenAI Features for HireAI
Implements all production-level AI capabilities
"""

from typing import Dict, List, Any
from services.genai_service import call_openrouter
from services.matching_service import calculate_match_score


async def reality_check_analysis(resume_text: str, job_description: str, match_data: Dict) -> Dict[str, Any]:
    """
    Brutally honest feedback - no sugarcoating
    """
    prompt = f"""You are a brutally honest senior tech recruiter with 15 years of experience. 
Your job is to give DIRECT, UNFILTERED feedback. NO sugarcoating. NO generic praise.

Resume:
{resume_text[:3000]}

Job Description:
{job_description[:2000]}

Match Score: {match_data['score']}%
Matching Skills: {', '.join(match_data['matching_skills'][:10])}
Missing Skills: {', '.join(match_data['missing_skills'][:10])}

Provide BRUTALLY HONEST feedback in 4-5 sentences:
1. Are they ACTUALLY ready for this role? (YES/NO and why)
2. What are their BIGGEST weaknesses?
3. What would make a recruiter REJECT them immediately?
4. What's the HARSH TRUTH they need to hear?

Be direct. Be specific. Be harsh if needed. This candidate wants REALITY, not encouragement."""

    response = await call_openrouter(prompt)
    
    return {
        "brutal_feedback": response,
        "readiness": "NOT READY" if match_data['score'] < 70 else "MAYBE READY" if match_data['score'] < 85 else "READY",
        "confidence": match_data['score']
    }


async def skill_impact_simulator(resume_text: str, job_description: str, skill: str, current_score: float) -> Dict[str, Any]:
    """
    Simulate impact of adding a specific skill
    """
    prompt = f"""You are an AI career advisor analyzing skill impact.

Current Resume Skills: {resume_text[:1500]}
Job Requirements: {job_description[:1500]}
Current Match Score: {current_score}%

Skill to Add: {skill}

Analyze the impact of adding this skill:
1. New estimated match score (be realistic, typically +5-15%)
2. Why this skill matters for this role (2-3 sentences)
3. How much it improves candidacy (Low/Medium/High impact)
4. What else is needed beyond this skill (1-2 sentences)

Format:
NEW_SCORE: [number]
IMPACT: [Low/Medium/High]
REASONING: [explanation]
NEXT_STEPS: [what else needed]"""

    response = await call_openrouter(prompt)
    
    # Parse response
    lines = response.split('\n')
    new_score = current_score + 10  # Default
    impact = "Medium"
    reasoning = ""
    next_steps = ""
    
    for line in lines:
        if line.startswith("NEW_SCORE:"):
            try:
                new_score = min(100, float(line.split(':')[1].strip()))
            except:
                pass
        elif line.startswith("IMPACT:"):
            impact = line.split(':')[1].strip()
        elif line.startswith("REASONING:"):
            reasoning = line.split(':', 1)[1].strip()
        elif line.startswith("NEXT_STEPS:"):
            next_steps = line.split(':', 1)[1].strip()
    
    return {
        "skill": skill,
        "current_score": current_score,
        "projected_score": new_score,
        "score_increase": new_score - current_score,
        "impact_level": impact,
        "reasoning": reasoning or response[:200],
        "next_steps": next_steps or "Continue building related skills"
    }


async def rejection_simulator(resume_text: str, job_description: str, match_data: Dict) -> Dict[str, Any]:
    """
    Simulate why a recruiter might reject this candidate
    """
    prompt = f"""You are a senior recruiter reviewing this application. Simulate rejection reasoning.

Resume: {resume_text[:2000]}
Job: {job_description[:1500]}
Match Score: {match_data['score']}%

List 3-5 specific reasons why you might REJECT this candidate:
1. [Reason with specific evidence from resume]
2. [Reason with specific evidence]
3. [Reason with specific evidence]

Be specific. Reference actual gaps. Be realistic about hiring decisions."""

    response = await call_openrouter(prompt)
    
    return {
        "rejection_reasons": response,
        "likelihood": "High" if match_data['score'] < 60 else "Medium" if match_data['score'] < 80 else "Low",
        "score": match_data['score']
    }


async def recruiter_first_impression(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    What recruiter thinks in first 5 seconds
    """
    prompt = f"""You are a busy recruiter who spends 5 seconds scanning each resume.

Resume: {resume_text[:1500]}
Job: {job_description[:1000]}

In 2-3 SHORT sentences, what's your INSTANT reaction?
- First impression (positive/negative/neutral)
- One thing that stands out (good or bad)
- Immediate decision (interview/reject/maybe)

Be quick. Be honest. Be realistic."""

    response = await call_openrouter(prompt)
    
    return {
        "first_impression": response,
        "scan_time": "5 seconds"
    }


async def fake_experience_detector(resume_text: str) -> Dict[str, Any]:
    """
    Detect potential overclaimed skills or inconsistencies
    """
    prompt = f"""You are an expert at detecting resume red flags and overclaimed experience.

Resume: {resume_text[:2500]}

Analyze for:
1. Skills claimed but no projects/experience showing them
2. Inconsistent timelines or experience levels
3. Buzzwords without substance
4. Claims that seem exaggerated

List 2-4 specific red flags or concerns. Be specific with evidence.
If resume looks genuine, say "No major red flags detected" and explain why."""

    response = await call_openrouter(prompt)
    
    return {
        "analysis": response,
        "confidence": "Medium"
    }


async def auto_project_generator(missing_skills: List[str], job_description: str) -> Dict[str, List[Dict]]:
    """
    Generate project ideas for missing skills
    """
    skills_text = ", ".join(missing_skills[:5])
    
    prompt = f"""You are a technical mentor. Generate practical project ideas.

Missing Skills: {skills_text}
Target Role: {job_description[:1000]}

For each missing skill, suggest ONE specific project:
- Project name
- What to build (2-3 sentences)
- Technologies to use
- Estimated time (hours)

Format each as:
SKILL: [skill name]
PROJECT: [project name]
DESCRIPTION: [what to build]
TECH: [technologies]
TIME: [hours]

---"""

    response = await call_openrouter(prompt)
    
    # Parse projects
    projects = []
    current_project = {}
    
    for line in response.split('\n'):
        line = line.strip()
        if line.startswith('SKILL:'):
            if current_project:
                projects.append(current_project)
            current_project = {'skill': line.split(':', 1)[1].strip()}
        elif line.startswith('PROJECT:'):
            current_project['name'] = line.split(':', 1)[1].strip()
        elif line.startswith('DESCRIPTION:'):
            current_project['description'] = line.split(':', 1)[1].strip()
        elif line.startswith('TECH:'):
            current_project['technologies'] = line.split(':', 1)[1].strip()
        elif line.startswith('TIME:'):
            current_project['time'] = line.split(':', 1)[1].strip()
    
    if current_project:
        projects.append(current_project)
    
    return {"projects": projects}


async def career_path_recommender(resume_text: str, current_role: str) -> Dict[str, Any]:
    """
    Recommend career paths and next skills
    """
    prompt = f"""You are a career advisor analyzing career progression.

Current Resume: {resume_text[:2000]}
Target Role: {current_role}

Recommend:
1. Best next role (1-2 years from now)
2. Alternative career paths (2-3 options)
3. Top 5 skills to learn next (prioritized)
4. Timeline for transition

Be specific and realistic."""

    response = await call_openrouter(prompt)
    
    return {
        "recommendations": response
    }


async def competition_analysis(resume_text: str, job_description: str, match_data: Dict) -> Dict[str, Any]:
    """
    Compare candidate vs top 10% candidates
    """
    prompt = f"""You are analyzing how this candidate compares to TOP candidates.

Candidate Resume: {resume_text[:2000]}
Job: {job_description[:1500]}
Their Score: {match_data['score']}%

Compare this candidate to TOP 10% candidates for this role:
1. What do top candidates have that this one lacks? (3-4 points)
2. Where does this candidate fall short? (be specific)
3. What would it take to reach top 10%? (actionable steps)

Be honest and specific."""

    response = await call_openrouter(prompt)
    
    return {
        "analysis": response,
        "current_percentile": "Top 50%" if match_data['score'] >= 75 else "Top 70%" if match_data['score'] >= 60 else "Below Average",
        "gap_to_top_10": "Significant gaps in experience and skills" if match_data['score'] < 70 else "Close but needs refinement"
    }


async def resume_heatmap_analysis(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Identify strong vs weak sections of resume
    """
    prompt = f"""Analyze this resume section by section.

Resume: {resume_text[:2500]}
Job: {job_description[:1500]}

Rate each section (Strong/Moderate/Weak):
1. Technical Skills: [rating + reason]
2. Work Experience: [rating + reason]
3. Projects: [rating + reason]
4. Education: [rating + reason]

Be specific about what's strong and what's weak."""

    response = await call_openrouter(prompt)
    
    return {
        "heatmap": response
    }


async def generate_cover_letter(resume_text: str, job_description: str, company_name: str = "the company") -> Dict[str, str]:
    """
    Generate personalized cover letter
    """
    prompt = f"""Write a professional cover letter.

Resume: {resume_text[:2000]}
Job: {job_description[:1500]}
Company: {company_name}

Write a compelling 3-paragraph cover letter:
1. Strong opening (why interested + key qualification)
2. Relevant experience and skills (specific examples)
3. Closing (enthusiasm + call to action)

Keep it professional, specific, and under 300 words."""

    response = await call_openrouter(prompt)
    
    return {
        "cover_letter": response
    }


async def simplify_job_description(job_description: str) -> Dict[str, str]:
    """
    Convert complex JD to simple explanation
    """
    prompt = f"""Simplify this job description for easy understanding.

Job Description: {job_description[:2000]}

Provide:
1. Role in one sentence
2. Key responsibilities (3-4 bullet points)
3. Must-have skills (top 5)
4. Nice-to-have skills (top 3)
5. Experience level needed

Make it clear and concise."""

    response = await call_openrouter(prompt)
    
    return {
        "simplified": response
    }


async def apply_readiness_score(resume_text: str, job_description: str, match_data: Dict) -> Dict[str, Any]:
    """
    One-click readiness assessment
    """
    score = match_data['score']
    missing_count = len(match_data['missing_skills'])
    
    # Decision logic
    if score >= 85 and missing_count <= 2:
        decision = "YES"
        reason = "Strong match with minimal gaps. You should apply now."
        confidence = "High"
    elif score >= 70 and missing_count <= 5:
        decision = "YES"
        reason = "Good match. Address key gaps in cover letter and apply."
        confidence = "Medium"
    elif score >= 60:
        decision = "MAYBE"
        reason = "Moderate match. Consider applying but expect competition. Highlight transferable skills."
        confidence = "Medium"
    else:
        decision = "NOT YET"
        reason = "Significant gaps. Build missing skills first, then apply in 2-3 months."
        confidence = "High"
    
    return {
        "decision": decision,
        "reason": reason,
        "confidence": confidence,
        "score": score,
        "missing_skills_count": missing_count
    }
