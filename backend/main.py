from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api.routes import auth, resume, job, analysis, chat, advanced
from core.database import connect_db, close_db

load_dotenv()

app = FastAPI(
    title="HireAI Lite API",
    description="GenAI-powered resume screening system",
    version="1.0.0"
)

# CORS - Allow Vercel deployments
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://hire-ai-nine.vercel.app",
    "https://*.vercel.app",  # Allow all Vercel preview deployments
]

# Add FRONTEND_URL from environment
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Events
@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(job.router, prefix="/api/job", tags=["Job"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(advanced.router, prefix="/api/advanced", tags=["Advanced Features"])

@app.get("/")
def root():
    return {"message": "HireAI Lite API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
