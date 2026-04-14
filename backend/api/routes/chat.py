from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from core.database import get_db
from core.security import get_current_user
from models.schemas import ChatMessage
from services.genai_service import generate_chat_response
from bson import ObjectId

router = APIRouter()

@router.post("/message")
async def send_message(chat: ChatMessage, current_user: dict = Depends(get_current_user)):
    db = get_db()
    
    # Get context
    context = {}
    if chat.context_id:
        if chat.context_type == "resume":
            doc = await db.resumes.find_one({"_id": ObjectId(chat.context_id)})
            context = {"type": "resume", "text": doc.get("text", ""), "skills": doc.get("skills", [])}
        elif chat.context_type == "job":
            doc = await db.jobs.find_one({"_id": ObjectId(chat.context_id)})
            context = {"type": "job", "description": doc.get("description", ""), "skills": doc.get("required_skills", [])}
        elif chat.context_type == "analysis":
            doc = await db.analyses.find_one({"_id": ObjectId(chat.context_id)})
            context = {"type": "analysis", "score": doc.get("score", 0), "summary": doc.get("summary", "")}
    
    # Generate response
    response = await generate_chat_response(chat.message, context)
    
    # Save chat
    chat_doc = {
        "user_id": current_user["user_id"],
        "message": chat.message,
        "response": response,
        "context_type": chat.context_type,
        "context_id": chat.context_id,
        "created_at": datetime.utcnow()
    }
    
    await db.chats.insert_one(chat_doc)
    
    return {
        "message": chat.message,
        "response": response,
        "timestamp": datetime.utcnow()
    }

@router.get("/history")
async def get_chat_history(current_user: dict = Depends(get_current_user), limit: int = 20):
    db = get_db()
    chats = await db.chats.find({"user_id": current_user["user_id"]}).sort("created_at", -1).limit(limit).to_list(limit)
    
    return [
        {
            "id": str(c["_id"]),
            "message": c["message"],
            "response": c["response"],
            "created_at": c["created_at"]
        }
        for c in reversed(chats)
    ]
