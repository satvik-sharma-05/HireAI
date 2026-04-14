from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Server
    PORT: int = 8000
    ENV: str = "development"
    
    # OpenRouter
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "mistralai/mistral-7b-instruct"
    
    # App Info
    APP_NAME: str = "HireAI"
    APP_URL: str = "http://localhost:3000"
    
    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Database
    MONGO_URI: str
    DATABASE_NAME: str = "hireai"
    
    # File Handling
    MAX_FILE_SIZE_MB: int = 5
    ALLOWED_FILE_TYPES: str = "pdf,docx"
    
    # Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Chat
    CHAT_HISTORY_LIMIT: int = 10
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.7
    
    class Config:
        env_file = ".env"

settings = Settings()
