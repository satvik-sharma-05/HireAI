from fastapi import APIRouter, HTTPException, status
from models.schemas import UserSignup, UserLogin, TokenResponse
from core.database import get_db
from core.security import hash_password, verify_password, create_access_token
from datetime import datetime

router = APIRouter()

@router.post("/signup", response_model=TokenResponse)
async def signup(user: UserSignup):
    db = get_db()
    
    # Check if user exists
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_doc = {
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Generate token
    token = create_access_token({"sub": user_id, "email": user.email, "role": user.role})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "email": user.email, "role": user.role}
    }

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_db()
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    
    # Generate token
    token = create_access_token({"sub": user_id, "email": user["email"], "role": user["role"]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "email": user["email"], "role": user["role"]}
    }
