from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from .config import CORS_ORIGINS, ENVIRONMENT
from .database import engine, Base
from .routers import auth, nutrition, fitness, progress, education, trainers

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="AI Health Platform API",
    description="A comprehensive AI-powered health platform for nutrition and fitness",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if ENVIRONMENT == "development" else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(nutrition.router, prefix="/api/v1")
app.include_router(fitness.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")
app.include_router(education.router, prefix="/api/v1")
app.include_router(trainers.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "AI Health Platform API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs" if ENVIRONMENT == "development" else "Disabled in production"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": ENVIRONMENT}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if ENVIRONMENT == "development" else "An error occurred"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=ENVIRONMENT == "development"
    )
