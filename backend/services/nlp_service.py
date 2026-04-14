import spacy
from fastapi import UploadFile
import PyPDF2
from docx import Document
import io
import re

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("⚠️ spaCy model not found. Run: python -m spacy download en_core_web_sm")
    nlp = None

# Common tech skills
TECH_SKILLS = {
    "python", "java", "javascript", "typescript", "react", "angular", "vue",
    "node", "nodejs", "express", "fastapi", "django", "flask",
    "sql", "mongodb", "postgresql", "mysql", "redis",
    "aws", "azure", "gcp", "docker", "kubernetes", "k8s",
    "git", "github", "gitlab", "ci/cd", "jenkins",
    "machine learning", "ml", "deep learning", "nlp", "ai",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "html", "css", "tailwind", "bootstrap",
    "rest", "api", "graphql", "microservices",
    "agile", "scrum", "jira", "testing", "jest", "pytest"
}

async def extract_text_from_file(file: UploadFile) -> str:
    """Extract text from PDF or DOCX"""
    content = await file.read()
    
    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    
    elif file.filename.endswith('.docx'):
        doc = Document(io.BytesIO(content))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    
    else:
        raise ValueError("Unsupported file format")

def extract_skills(text: str) -> list:
    """Extract skills from text using NLP + keyword matching"""
    text_lower = text.lower()
    found_skills = []
    
    # Keyword matching
    for skill in TECH_SKILLS:
        if skill in text_lower:
            found_skills.append(skill.title())
    
    # NLP-based extraction (if spaCy loaded)
    if nlp:
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "GPE"]:
                skill = ent.text.lower()
                if skill in TECH_SKILLS and skill.title() not in found_skills:
                    found_skills.append(skill.title())
    
    return list(set(found_skills))

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text
