# HireAI

**GenAI-powered recruitment and resume intelligence platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Overview

HireAI is a production-grade AI-powered recruitment platform that transforms the hiring process through intelligent resume analysis, semantic matching, and explainable AI insights. Built for both candidates and recruiters, it provides a complete end-to-end hiring workflow with a premium SaaS-quality user interface.

### Problem It Solves

- **For Candidates:** Understand exactly why you match (or don't match) a job, get actionable improvement suggestions, and receive AI-powered career guidance
- **For Recruiters:** Automate candidate screening, rank applicants intelligently, make data-driven hiring decisions, and reduce time-to-hire by 80%

### Who It's For

- **Job Seekers** looking to optimize their resumes and understand their competitiveness
- **Recruiters** managing multiple job postings and candidate pipelines
- **Hiring Managers** making data-driven hiring decisions
- **HR Teams** seeking to reduce bias and improve hiring outcomes

---

## Features

### Candidate Features

- **Resume Analysis** - Upload PDF/DOCX resumes and get instant AI-powered analysis
- **Skill Gap Detection** - Identify missing skills and get personalized learning recommendations
- **AI Chat Assistant** - Context-aware career guidance and resume improvement tips
- **Reality Check Mode** - Brutally honest feedback on application readiness
- **Skill Impact Simulator** - See how learning new skills affects your match score
- **Career Path Suggestions** - AI-recommended career trajectories based on your profile
- **Competition Analysis** - Understand how you compare to top candidates
- **Project Generator** - Get project ideas to fill skill gaps
- **Apply Readiness Score** - One-click assessment of application strength

### Recruiter Features

- **Job Creation & Management** - Create job postings with AI-powered JD simplification
- **Multi-Resume Upload** - Batch upload and analyze multiple candidates simultaneously
- **Candidate Ranking** - Automatic AI-powered ranking with medal badges for top performers
- **Comparison Tool** - Side-by-side candidate comparison with detailed insights
- **AI Decision Support** - HIRE/CONSIDER/REJECT recommendations with reasoning
- **Risk Analysis** - Identify hiring risks, skill gaps, and red flags
- **Analytics Dashboard** - Score distribution, skill trends, and hiring metrics
- **Recruiter Chat** - Context-aware AI assistant for hiring questions
- **History System** - Full replay of all past analyses and decisions
- **Advanced AI Features** - Reality check, rejection simulator, fake experience detector, first impression analysis

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **spaCy** - NLP and skill extraction
- **Sentence Transformers** - Semantic embeddings (all-MiniLM-L6-v2)
- **OpenRouter** - LLM API access (Mistral 7B)
- **PyPDF2 / python-docx** - Document parsing

### Database & AI
- **MongoDB Atlas** - Cloud NoSQL database
- **Semantic Matching** - Cosine similarity on sentence embeddings
- **NLP Pipeline** - spaCy for text processing and skill extraction
- **GenAI** - OpenRouter for explainable insights and recommendations

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Next.js 14 + TypeScript + Tailwind + Framer Motion │
│                                                      │
│  Pages: Auth, Dashboard, Jobs, Candidates,          │
│         Analytics, Chat, History                    │
└──────────────────┬──────────────────────────────────┘
                   │ REST API (axios)
                   │
┌──────────────────▼──────────────────────────────────┐
│                   BACKEND                            │
│         FastAPI + Python + MongoDB                   │
│                                                      │
│  Services:                                           │
│  - Auth (JWT)                                        │
│  - Resume Processing (PDF/DOC extraction)            │
│  - Job Management                                    │
│  - Analysis Engine (Embeddings + NLP)                │
│  - GenAI Service (OpenRouter)                        │
│  - Advanced Features (10+ AI tools)                  │
│  - Chat Service                                      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                  AI LAYER                            │
│                                                      │
│  - Sentence Transformers (Semantic Embeddings)       │
│  - spaCy (NLP & Skill Extraction)                    │
│  - OpenRouter (LLM for Insights)                     │
│  - Cosine Similarity (Matching Algorithm)            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                  DATABASE                            │
│                  MongoDB Atlas                       │
│                                                      │
│  Collections: users, jobs, resumes, analyses,        │
│               chat_history                           │
└─────────────────────────────────────────────────────┘
```

**System Flow:**
1. User uploads resume or creates job posting
2. Backend extracts text and processes with NLP
3. AI layer generates embeddings and calculates semantic similarity
4. GenAI generates human-readable insights and recommendations
5. Results stored in MongoDB and displayed in frontend
6. Users can chat with AI for additional guidance

---

## Installation & Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB Atlas account (free tier available)
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/hireai.git
cd hireai
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Create .env file (see Environment Variables section)
# Add your MongoDB URI and OpenRouter API key

# Run backend server
uvicorn main:app --reload
```

Backend will start on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Frontend will start on `http://localhost:3000`

### 4. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

---

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hireai?retryWrites=true&w=majority

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here

# JWT Secret
SECRET_KEY=your_secret_key_here

# Server Config
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Usage

### For Candidates

1. **Sign Up** - Create an account with email and password
2. **Upload Resume** - Upload your resume (PDF or DOCX format)
3. **Enter Job Description** - Paste the job description you're applying for
4. **Get Analysis** - Receive instant AI-powered match score and insights
5. **Review Insights** - See matching skills, missing skills, and improvement suggestions
6. **Use Advanced Features** - Try Reality Check, Skill Impact Simulator, Career Path
7. **Chat with AI** - Ask questions about your resume and career

### For Recruiters

1. **Sign Up as Recruiter** - Select recruiter role during signup
2. **Create Job Posting** - Add job title and description (use AI to simplify)
3. **Upload Resumes** - Batch upload multiple candidate resumes with custom titles
4. **Analyze Candidates** - Click "Analyze All Candidates" for automatic ranking
5. **View Rankings** - See candidates ranked by AI with medal badges for top 3
6. **Review Details** - Click any candidate to see full analysis and AI insights
7. **Make Decisions** - Use AI recommendations to HIRE, CONSIDER, or REJECT
8. **Track Analytics** - Monitor score distribution, skill gaps, and hiring trends

---

## Future Improvements

- **Interview Scheduling** - Calendar integration and automated interview coordination
- **Team Collaboration** - Multi-recruiter workspaces with comments and mentions
- **Email Notifications** - Automated status updates and reminders
- **Advanced Analytics** - Hiring funnel metrics, time-to-hire tracking, custom reports
- **Pipeline Management** - Kanban board for visual candidate tracking
- **Question Generator** - AI-powered interview question generation
- **Offer Management** - Offer letter templates and e-signature integration
- **ATS Integrations** - Connect with Greenhouse, Lever, LinkedIn, GitHub

See `.kiro/specs/` for detailed feature specifications.

---

## Project Structure

```
hireai/
├── backend/
│   ├── api/
│   │   └── routes/          # API endpoints (auth, resume, job, analysis, chat, advanced)
│   ├── core/
│   │   ├── config.py        # Configuration management
│   │   ├── database.py      # MongoDB connection
│   │   └── security.py      # JWT authentication
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── services/
│   │   ├── advanced_features.py  # 10+ AI features
│   │   ├── genai_service.py      # OpenRouter integration
│   │   ├── matching_service.py   # Semantic matching
│   │   └── nlp_service.py        # spaCy NLP
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── auth/            # Login, signup pages
│   │   ├── analyze/         # Resume analysis
│   │   ├── chat/            # AI chat
│   │   ├── dashboard/       # Candidate dashboard
│   │   ├── history/         # Analysis history
│   │   └── recruiter/       # Recruiter pages
│   │       ├── analytics/   # Analytics dashboard
│   │       ├── candidates/  # Candidate management
│   │       ├── chat/        # Recruiter chat
│   │       └── jobs/        # Job management
│   ├── components/          # Reusable UI components
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── store.ts         # State management
│   ├── package.json         # Node dependencies
│   └── tailwind.config.ts   # Tailwind configuration
│
├── .env                     # Backend environment variables
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Resume Management
- `POST /api/resume/upload` - Upload resume (multipart/form-data)
- `GET /api/resume/list` - List user's resumes
- `GET /api/resume/{id}` - Get resume details
- `DELETE /api/resume/{id}` - Delete resume

### Job Management
- `POST /api/job/create` - Create job posting
- `GET /api/job/list` - List user's jobs
- `GET /api/job/{id}` - Get job details
- `DELETE /api/job/{id}` - Delete job

### Analysis
- `POST /api/analysis/analyze` - Analyze resume vs job
- `GET /api/analysis/history` - Get analysis history
- `GET /api/analysis/{id}` - Get specific analysis

### Advanced AI Features
- `POST /api/advanced/reality-check` - Brutally honest feedback
- `POST /api/advanced/skill-impact` - Skill impact simulation
- `POST /api/advanced/rejection-simulator` - Rejection reasons
- `POST /api/advanced/first-impression` - 5-second impression
- `POST /api/advanced/fake-detector` - Detect fake experience
- `POST /api/advanced/project-generator` - Generate project ideas
- `POST /api/advanced/career-path` - Career recommendations
- `POST /api/advanced/competition-analysis` - Compare vs top 10%
- `POST /api/advanced/apply-readiness` - Application readiness
- `POST /api/advanced/rank-candidates` - Rank all candidates
- `POST /api/advanced/simplify-jd` - Simplify job description

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get chat history

Full API documentation available at `http://localhost:8000/docs` when running the backend.

---

## Screenshots

### Candidate Dashboard
Clean, modern interface with stats cards, quick actions, and recent analyses.

### Resume Analysis Results
Visual score display with circular progress, skill comparison pills, and structured AI insights.

### Recruiter Rankings
Professional table with medal badges (🥇🥈🥉) for top 3 candidates, scores, and quick actions.

### Analytics Dashboard
Score distribution bars, top skills, common gaps, and hiring metrics.

---

## Contributing

This is a portfolio project. Feel free to fork and customize for your own use!

---

## License

MIT License - Free to use for learning and portfolio purposes.

---

## Author

**Satvik**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework
- [OpenRouter](https://openrouter.ai/) - LLM API access
- [spaCy](https://spacy.io/) - Industrial-strength NLP
- [Sentence Transformers](https://www.sbert.net/) - Semantic embeddings
- [MongoDB](https://www.mongodb.com/) - NoSQL database

---

**Built with ❤️ for smarter hiring**
