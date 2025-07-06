import os
from pathlib import Path
from decouple import config

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Security
SECRET_KEY = config("SECRET_KEY", default="your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database
DATABASE_URL = config(
    "DATABASE_URL", 
    default="postgresql://username:password@localhost/ai_health_platform"
)

# Supabase
SUPABASE_URL = config("SUPABASE_URL", default="")
SUPABASE_ANON_KEY = config("SUPABASE_ANON_KEY", default="")
SUPABASE_SERVICE_KEY = config("SUPABASE_SERVICE_KEY", default="")

# OpenAI
OPENAI_API_KEY = config("OPENAI_API_KEY", default="")

# Redis
REDIS_URL = config("REDIS_URL", default="redis://localhost:6379")

# External APIs
USDA_API_KEY = config("USDA_API_KEY", default="")
NHS_API_KEY = config("NHS_API_KEY", default="")

# File uploads
UPLOAD_DIR = BASE_DIR / "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Logging
LOG_LEVEL = config("LOG_LEVEL", default="INFO")

# CORS
CORS_ORIGINS = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
]

# Environment
ENVIRONMENT = config("ENVIRONMENT", default="development")
