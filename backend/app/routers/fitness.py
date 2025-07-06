from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..database import get_db
from ..models import User, UserProfile, FitnessPlan, ProgressLog
from ..schemas import FitnessPlanRequest, FitnessPlan as FitnessPlanSchema
from ..auth import get_current_active_user
from ..ai_service import ai_service

router = APIRouter(prefix="/fitness", tags=["fitness"])

@router.post("/generate-plan", response_model=FitnessPlanSchema)
async def generate_fitness_plan(
    request: FitnessPlanRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate a personalized fitness plan using AI"""
    
    # Get user profile
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User profile not found. Please complete your profile first."
        )
    
    # Convert user profile to dict for AI processing
    profile_data = {
        "age": user_profile.age,
        "gender": user_profile.gender,
        "height": user_profile.height,
        "weight": user_profile.weight,
        "activity_level": user_profile.activity_level,
        "medical_conditions": user_profile.medical_conditions or [],
        "fitness_level": user_profile.fitness_level,
        "mobility_issues": user_profile.mobility_issues or [],
        "primary_goal": user_profile.primary_goal,
        "equipment_access": user_profile.equipment_access or [],
        "workout_time_preference": user_profile.workout_time_preference
    }
    
    # Generate AI fitness plan
    try:
        ai_plan = await ai_service.generate_fitness_plan(profile_data, request.dict())
        
        # Save plan to database
        db_plan = FitnessPlan(
            user_id=current_user.id,
            title=ai_plan.get("title", "Personalized Fitness Plan"),
            description=ai_plan.get("description", "AI-generated fitness plan"),
            plan_data=ai_plan.get("workout_sessions", []),
            difficulty_level=request.current_fitness_level,
            duration_weeks=4,  # Default to 4 weeks
            is_active=True
        )
        
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)
        
        return db_plan
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate fitness plan: {str(e)}"
        )

@router.get("/workout-plan/{plan_id}", response_model=FitnessPlanSchema)
async def get_workout_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific fitness plan"""
    plan = db.query(FitnessPlan).filter(
        FitnessPlan.id == plan_id,
        FitnessPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fitness plan not found"
        )
    
    return plan

@router.get("/workout-plans/user/{user_id}", response_model=List[FitnessPlanSchema])
async def get_user_workout_plans(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all fitness plans for a user"""
    # Users can only access their own plans unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    plans = db.query(FitnessPlan).filter(
        FitnessPlan.user_id == user_id
    ).order_by(FitnessPlan.created_at.desc()).all()
    
    return plans

@router.post("/log-workout")
async def log_workout(
    workout_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Log a completed workout for progress tracking"""
    
    try:
        # Create progress log entry
        progress_log = ProgressLog(
            user_id=current_user.id,
            log_type="workout",
            metric_name="workout_completed",
            metric_value=workout_data.get("duration", 0),
            metric_unit="minutes",
            additional_data=workout_data,
            notes=workout_data.get("notes", "")
        )
        
        db.add(progress_log)
        db.commit()
        
        return {"message": "Workout logged successfully", "log_id": progress_log.id}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log workout: {str(e)}"
        )

@router.post("/adaptive-plan")
async def generate_adaptive_plan(
    plan_id: int,
    adaptations: Dict[str, Any],  # mood, fatigue, injury, etc.
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate an adapted workout plan based on current conditions"""
    
    # Get original plan
    original_plan = db.query(FitnessPlan).filter(
        FitnessPlan.id == plan_id,
        FitnessPlan.user_id == current_user.id
    ).first()
    
    if not original_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Original fitness plan not found"
        )
    
    # Get user profile
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    profile_data = {
        "age": user_profile.age,
        "gender": user_profile.gender,
        "fitness_level": user_profile.fitness_level,
        "mobility_issues": user_profile.mobility_issues or [],
        "equipment_access": user_profile.equipment_access or []
    }
    
    # Create request with adaptations
    adaptive_request = {
        "fitness_goals": ["maintenance"],  # Conservative goal for adaptation
        "current_fitness_level": user_profile.fitness_level or "beginner",
        "available_equipment": user_profile.equipment_access or [],
        "workout_frequency": 3,
        "session_duration": 30,  # Shorter duration for adaptation
        "mobility_considerations": user_profile.mobility_issues or [],
        "mood_factor": adaptations.get("mood", "neutral"),
        "fatigue_level": adaptations.get("fatigue_level", 5),
        "injury_status": adaptations.get("injury_status", [])
    }
    
    try:
        # Generate adapted plan
        adapted_plan = await ai_service.generate_fitness_plan(profile_data, adaptive_request)
        
        return {
            "message": "Adaptive plan generated successfully",
            "adapted_workout": adapted_plan.get("workout_sessions", []),
            "recommendations": "Plan adapted based on current conditions"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate adaptive plan: {str(e)}"
        )

@router.put("/workout-plan/{plan_id}/activate")
async def activate_fitness_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Activate a fitness plan (deactivate others)"""
    
    # Deactivate all current plans
    db.query(FitnessPlan).filter(
        FitnessPlan.user_id == current_user.id,
        FitnessPlan.is_active == True
    ).update({"is_active": False})
    
    # Activate selected plan
    plan = db.query(FitnessPlan).filter(
        FitnessPlan.id == plan_id,
        FitnessPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fitness plan not found"
        )
    
    plan.is_active = True
    db.commit()
    
    return {"message": "Fitness plan activated successfully"}

@router.get("/exercise-library")
async def get_exercise_library(
    category: str = None,
    equipment: str = None,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    """Get exercises from the exercise database with optional filters"""
    
    # This would typically query the ExerciseDatabase model
    # For now, return a sample response
    sample_exercises = [
        {
            "id": 1,
            "name": "Push-ups",
            "category": "strength",
            "muscle_groups": ["chest", "triceps", "shoulders"],
            "equipment_needed": ["none"],
            "difficulty_level": "beginner",
            "instructions": "Start in plank position, lower body to ground, push back up",
            "modifications": ["Knee push-ups", "Incline push-ups"]
        },
        {
            "id": 2,
            "name": "Squats",
            "category": "strength",
            "muscle_groups": ["quadriceps", "glutes", "hamstrings"],
            "equipment_needed": ["none"],
            "difficulty_level": "beginner",
            "instructions": "Stand with feet shoulder-width apart, lower into sitting position",
            "modifications": ["Chair squats", "Jump squats"]
        }
    ]
    
    # Apply filters if provided
    filtered_exercises = sample_exercises
    
    if category:
        filtered_exercises = [ex for ex in filtered_exercises if ex["category"] == category]
    if equipment:
        filtered_exercises = [ex for ex in filtered_exercises if equipment in ex["equipment_needed"]]
    if difficulty:
        filtered_exercises = [ex for ex in filtered_exercises if ex["difficulty_level"] == difficulty]
    
    return {"exercises": filtered_exercises}
