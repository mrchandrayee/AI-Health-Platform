from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..database import get_db
from ..models import User, UserProfile, NutritionPlan, ProgressLog
from ..schemas import NutritionPlanRequest, NutritionPlan as NutritionPlanSchema, ProgressLogCreate
from ..auth import get_current_active_user
from ..ai_service import ai_service

router = APIRouter(prefix="/nutrition", tags=["nutrition"])

@router.post("/generate-plan", response_model=NutritionPlanSchema)
async def generate_nutrition_plan(
    request: NutritionPlanRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate a personalized nutrition plan using AI"""
    
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
        "allergies": user_profile.allergies or [],
        "fitness_level": user_profile.fitness_level,
        "primary_goal": user_profile.primary_goal,
        "target_weight": user_profile.target_weight,
        "dietary_preferences": user_profile.dietary_preferences or [],
        "cultural_background": user_profile.cultural_background,
        "cuisine_preferences": user_profile.cuisine_preferences or []
    }
    
    # Generate AI nutrition plan
    try:
        ai_plan = await ai_service.generate_nutrition_plan(profile_data, request.dict())
        
        # Save plan to database
        db_plan = NutritionPlan(
            user_id=current_user.id,
            title=ai_plan.get("title", "Personalized Nutrition Plan"),
            description=ai_plan.get("description", "AI-generated nutrition plan"),
            plan_data=ai_plan.get("daily_plans", []),
            nutritional_summary=ai_plan.get("nutritional_summary", {}),
            duration_days=request.duration_days,
            is_active=True
        )
        
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)
        
        return db_plan
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate nutrition plan: {str(e)}"
        )

@router.get("/meal-plan/{plan_id}", response_model=NutritionPlanSchema)
async def get_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific nutrition plan"""
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id,
        NutritionPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )
    
    return plan

@router.get("/meal-plans/user/{user_id}", response_model=List[NutritionPlanSchema])
async def get_user_meal_plans(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all nutrition plans for a user"""
    # Users can only access their own plans unless they're a trainer
    if current_user.id != user_id and current_user.role not in ["trainer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    plans = db.query(NutritionPlan).filter(
        NutritionPlan.user_id == user_id
    ).order_by(NutritionPlan.created_at.desc()).all()
    
    return plans

@router.post("/log-meal")
async def log_meal(
    meal_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Log a consumed meal for progress tracking"""
    
    try:
        # Create progress log entry
        progress_log = ProgressLog(
            user_id=current_user.id,
            log_type="meal",
            metric_name="calories_consumed",
            metric_value=meal_data.get("calories", 0),
            metric_unit="calories",
            additional_data=meal_data,
            notes=meal_data.get("notes", "")
        )
        
        db.add(progress_log)
        db.commit()
        
        return {"message": "Meal logged successfully", "log_id": progress_log.id}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log meal: {str(e)}"
        )

@router.post("/suggest-substitutions")
async def suggest_ingredient_substitutions(
    ingredient: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get AI-suggested ingredient substitutions"""
    
    # Get user's dietary preferences
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    dietary_restrictions = []
    cultural_preferences = "general"
    
    if user_profile:
        dietary_restrictions = user_profile.dietary_preferences or []
        if user_profile.allergies:
            dietary_restrictions.extend([f"no_{allergen}" for allergen in user_profile.allergies])
        cultural_preferences = user_profile.cultural_background or "general"
    
    try:
        suggestions = await ai_service.suggest_ingredient_substitutions(
            ingredient, dietary_restrictions, cultural_preferences
        )
        return {"ingredient": ingredient, "substitutions": suggestions}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate substitutions: {str(e)}"
        )

@router.put("/meal-plan/{plan_id}/activate")
async def activate_nutrition_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Activate a nutrition plan (deactivate others)"""
    
    # Deactivate all current plans
    db.query(NutritionPlan).filter(
        NutritionPlan.user_id == current_user.id,
        NutritionPlan.is_active == True
    ).update({"is_active": False})
    
    # Activate selected plan
    plan = db.query(NutritionPlan).filter(
        NutritionPlan.id == plan_id,
        NutritionPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition plan not found"
        )
    
    plan.is_active = True
    db.commit()
    
    return {"message": "Nutrition plan activated successfully"}
