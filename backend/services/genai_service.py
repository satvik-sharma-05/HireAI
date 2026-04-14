import httpx
from core.config import settings
from typing import Dict, List

# Learning resources database
LEARNING_RESOURCES = {
    "python": {
        "courses": [
            {"name": "Python for Everybody", "platform": "Coursera", "url": "https://www.coursera.org/specializations/python"},
            {"name": "Complete Python Bootcamp", "platform": "Udemy", "url": "https://www.udemy.com/course/complete-python-bootcamp/"}
        ],
        "books": ["Python Crash Course by Eric Matthes", "Automate the Boring Stuff with Python"],
        "projects": ["Build a REST API with FastAPI", "Create a data analysis dashboard", "Develop a web scraper"]
    },
    "javascript": {
        "courses": [
            {"name": "JavaScript: The Complete Guide", "platform": "Udemy", "url": "https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/"},
            {"name": "Modern JavaScript", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=hdI2bqOjy3c"}
        ],
        "books": ["Eloquent JavaScript", "You Don't Know JS"],
        "projects": ["Build a task manager app", "Create an interactive game", "Develop a weather dashboard"]
    },
    "react": {
        "courses": [
            {"name": "React - The Complete Guide", "platform": "Udemy", "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"},
            {"name": "React Tutorial", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=Ke90Tje7VS0"}
        ],
        "books": ["Learning React by Alex Banks", "React Up & Running"],
        "projects": ["Build a social media dashboard", "Create an e-commerce site", "Develop a real-time chat app"]
    },
    "aws": {
        "courses": [
            {"name": "AWS Certified Solutions Architect", "platform": "Udemy", "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/"},
            {"name": "AWS Tutorial for Beginners", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=ulprqHHWlng"}
        ],
        "books": ["AWS Certified Solutions Architect Study Guide", "Amazon Web Services in Action"],
        "projects": ["Deploy a web app on EC2", "Build a serverless API with Lambda", "Create a CI/CD pipeline"]
    },
    "docker": {
        "courses": [
            {"name": "Docker Mastery", "platform": "Udemy", "url": "https://www.udemy.com/course/docker-mastery/"},
            {"name": "Docker Tutorial", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo"}
        ],
        "books": ["Docker Deep Dive by Nigel Poulton", "Docker in Action"],
        "projects": ["Containerize a full-stack app", "Create multi-container setup with Docker Compose", "Build a microservices architecture"]
    },
    "kubernetes": {
        "courses": [
            {"name": "Kubernetes for Developers", "platform": "Udemy", "url": "https://www.udemy.com/course/kubernetes-for-developers/"},
            {"name": "Kubernetes Tutorial", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=X48VuDVv0do"}
        ],
        "books": ["Kubernetes Up & Running", "The Kubernetes Book"],
        "projects": ["Deploy a microservices app on K8s", "Set up auto-scaling", "Implement service mesh"]
    },
    "machine learning": {
        "courses": [
            {"name": "Machine Learning by Andrew Ng", "platform": "Coursera", "url": "https://www.coursera.org/learn/machine-learning"},
            {"name": "ML Crash Course", "platform": "Google", "url": "https://developers.google.com/machine-learning/crash-course"}
        ],
        "books": ["Hands-On Machine Learning", "Pattern Recognition and Machine Learning"],
        "projects": ["Build a recommendation system", "Create image classifier", "Develop sentiment analysis model"]
    },
    "sql": {
        "courses": [
            {"name": "The Complete SQL Bootcamp", "platform": "Udemy", "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/"},
            {"name": "SQL Tutorial", "platform": "YouTube", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY"}
        ],
        "books": ["SQL in 10 Minutes", "Learning SQL by Alan Beaulieu"],
        "projects": ["Design a database schema", "Optimize complex queries", "Build analytics dashboard"]
    }
}

def get_learning_resources(skill: str) -> Dict:
    """Get learning resources for a specific skill"""
    skill_lower = skill.lower()
    
    # Direct match
    if skill_lower in LEARNING_RESOURCES:
        return LEARNING_RESOURCES[skill_lower]
    
    # Partial match
    for key in LEARNING_RESOURCES:
        if key in skill_lower or skill_lower in key:
            return LEARNING_RESOURCES[key]
    
    # Default resources
    return {
        "courses": [
            {"name": f"{skill} Complete Course", "platform": "Udemy", "url": f"https://www.udemy.com/courses/search/?q={skill.replace(' ', '+')}"},
            {"name": f"{skill} Tutorial", "platform": "YouTube", "url": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+tutorial"}
        ],
        "books": [f"Learning {skill}: A Comprehensive Guide"],
        "projects": [f"Build a project using {skill}", f"Create a portfolio piece with {skill}"]
    }

async def call_openrouter(prompt: str, system_prompt: str = None, max_tokens: int = 2000) -> str:
    """Call OpenRouter API with advanced model"""
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "HTTP-Referer": settings.APP_URL,
        "X-Title": settings.APP_NAME,
        "Content-Type": "application/json"
    }
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"OpenRouter API returned status {response.status_code}: {response.text}")
                return generate_intelligent_fallback(prompt)
                
    except Exception as e:
        print(f"OpenRouter API Error: {e}")
        return generate_intelligent_fallback(prompt)

def generate_intelligent_fallback(prompt: str) -> str:
    """Generate intelligent fallback response"""
    if "summary" in prompt.lower():
        return """This candidate demonstrates solid technical capabilities with relevant experience in the required domain. Their skill set shows practical application through project work, though there are opportunities to deepen expertise in specific areas. The resume reflects a foundation that could be strengthened with targeted skill development and more quantifiable achievements."""
    elif "explain" in prompt.lower() or "why" in prompt.lower():
        return """The scoring reflects a balanced assessment: strong foundational skills create a solid base, but gaps in advanced technologies and specific domain expertise prevent a higher rating. The candidate shows promise through their existing work, yet would benefit from expanding their technical toolkit to fully match the role's requirements. Key differentiators would be hands-on experience with the missing technologies and demonstrated impact through measurable results."""
    elif "suggestions" in prompt.lower():
        return """1. Quantify achievements with specific metrics (e.g., "improved performance by 40%" rather than "improved performance")
2. Develop hands-on projects showcasing the missing technical skills, particularly in production environments
3. Obtain relevant certifications to validate expertise in key technologies
4. Restructure experience descriptions to emphasize problem-solving approach and business impact
5. Add technical blog posts or open-source contributions to demonstrate thought leadership"""
    else:
        return """Based on comprehensive analysis, this candidate presents a mixed profile with clear strengths and development areas. Their technical foundation is sound, but advancement would require focused skill acquisition and deeper specialization in the role's core technologies."""

async def generate_analysis(resume_text: str, job_description: str, match_data: dict) -> dict:
    """Generate deep, personalized AI-powered analysis with ALL advanced features"""
    
    system_prompt = """You are a senior technical recruiter and career strategist with 15+ years of experience hiring for top tech companies.
Your job is to perform a COMPLETE, REALISTIC, and DEEP evaluation of a candidate based on their resume and a job description.

⚠️ IMPORTANT RULES:
- DO NOT give generic answers
- DO NOT use vague phrases like "good understanding"
- Be specific, analytical, and brutally honest when needed
- Think like a real recruiter making a hiring decision
- All outputs must be dynamically generated (no templates)"""
    
    # Master comprehensive prompt
    master_prompt = f"""
INPUT:
RESUME: {resume_text[:2500]}

JOB DESCRIPTION: {job_description[:1500]}

MATCH DATA:
- Score: {match_data['score']}%
- Matching Skills: {', '.join(match_data['matching_skills'][:10])}
- Missing Skills: {', '.join(match_data['missing_skills'][:10])}

TASK:
Generate a COMPLETE analysis with the following sections:

🧠 OVERALL ASSESSMENT (4–6 sentences)
- Evaluate how strong the candidate is for THIS specific role
- Mention exact skills, projects, and gaps
- Be realistic (not overly positive)

🔍 WHY THIS SCORE (Deep Breakdown)
- What increased the score (specific strengths)
- What reduced the score (specific weaknesses)
- Explain impact of missing skills on real job performance
- Compare candidate with typical applicants

🚨 REALITY CHECK MODE (Brutally Honest)
- Be direct and critical
- Answer: "Is this candidate actually ready for this role?"
- If not ready → clearly say why

❌ WHY THIS CANDIDATE MAY GET REJECTED
- Simulate recruiter rejection reasons
- Be specific: weak projects, lack of depth, missing production experience, etc.

🧠 RECRUITER THINKING SIMULATION
- Write what a recruiter thinks in first 5–10 seconds
- Example style: "Looks like a fresher with X strengths but lacks Y which is critical"

📊 APPLY READINESS
- Answer clearly: READY / MAYBE / NOT YET
- Give reasoning

🚀 TOP 5 ACTIONABLE SUGGESTIONS
- Provide 5 SPECIFIC recommendations to improve
- Each must be actionable with clear next steps
- Prioritize by impact

OUTPUT FORMAT:
Use clear section headers exactly as shown above.
Be structured, specific, and honest.
No markdown code blocks, just clean formatted text.
"""
    
    # Call LLM with master prompt
    full_response = await call_openrouter(master_prompt, system_prompt, max_tokens=2500)
    
    # Parse the comprehensive response
    sections = {}
    current_section = None
    current_content = []
    
    for line in full_response.split('\n'):
        line = line.strip()
        
        # Detect section headers
        if '🧠 OVERALL ASSESSMENT' in line or 'OVERALL ASSESSMENT' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'summary'
            current_content = []
        elif '🔍 WHY THIS SCORE' in line or 'WHY THIS SCORE' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'explanation'
            current_content = []
        elif '🚨 REALITY CHECK' in line or 'REALITY CHECK' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'reality_check'
            current_content = []
        elif '❌ WHY THIS CANDIDATE MAY GET REJECTED' in line or 'MAY GET REJECTED' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'rejection_reasons'
            current_content = []
        elif '🧠 RECRUITER THINKING' in line or 'RECRUITER THINKING' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'first_impression'
            current_content = []
        elif '📊 APPLY READINESS' in line or 'APPLY READINESS' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'apply_readiness'
            current_content = []
        elif '🚀 TOP 5 ACTIONABLE SUGGESTIONS' in line or 'ACTIONABLE SUGGESTIONS' in line:
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = 'suggestions'
            current_content = []
        elif line and not line.startswith('---'):
            current_content.append(line)
    
    # Save last section
    if current_section:
        sections[current_section] = '\n'.join(current_content).strip()
    
    # Extract suggestions as list
    suggestions = []
    if 'suggestions' in sections:
        for line in sections['suggestions'].split('\n'):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
                clean_line = line.lstrip('0123456789.-•) ').strip()
                if clean_line and len(clean_line) > 20:
                    suggestions.append(clean_line)
    
    # Fallback suggestions if parsing failed
    if len(suggestions) < 3:
        suggestions = [
            "Develop hands-on projects demonstrating the missing technical skills in production-like environments, focusing on scalability and best practices",
            "Obtain industry-recognized certifications in the key missing technologies to validate expertise and fill knowledge gaps",
            "Restructure resume to lead with quantifiable achievements and business impact rather than task descriptions",
            "Contribute to open-source projects or write technical blog posts showcasing deep understanding of required technologies",
            "Seek mentorship or consulting opportunities to gain real-world experience with the missing skill set"
        ]
    
    # Generate learning resources for missing skills
    learning_resources = {}
    for skill in match_data['missing_skills'][:5]:
        learning_resources[skill] = get_learning_resources(skill)
    
    # Return structured data
    return {
        "summary": sections.get('summary', generate_intelligent_fallback("summary")),
        "explanation": sections.get('explanation', generate_intelligent_fallback("explanation")),
        "suggestions": suggestions[:5],
        "learning_resources": learning_resources,
        "reality_check": sections.get('reality_check', ''),
        "rejection_reasons": sections.get('rejection_reasons', ''),
        "first_impression": sections.get('first_impression', ''),
        "apply_readiness": sections.get('apply_readiness', ''),
        "full_analysis": full_response  # Store complete response
    }

async def generate_chat_response(message: str, context: dict) -> str:
    """Generate context-aware chat response"""
    
    system_prompt = """You are a helpful career assistant. Answer questions about resumes, jobs, and career advice.
Be supportive, professional, and provide actionable guidance."""
    
    # Build context
    context_text = ""
    if context.get("type") == "resume":
        context_text = f"Resume Context:\nSkills: {', '.join(context.get('skills', []))}\nText: {context.get('text', '')[:500]}"
    elif context.get("type") == "job":
        context_text = f"Job Context:\nDescription: {context.get('description', '')[:500]}\nRequired Skills: {', '.join(context.get('skills', []))}"
    elif context.get("type") == "analysis":
        context_text = f"Analysis Context:\nMatch Score: {context.get('score', 0)}%\nSummary: {context.get('summary', '')}"
    
    prompt = f"""
{context_text}

User Question: {message}

Provide a helpful, specific answer based on the context above.
"""
    
    response = await call_openrouter(prompt, system_prompt)
    return response.strip()
