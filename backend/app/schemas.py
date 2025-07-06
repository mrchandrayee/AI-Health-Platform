from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# User Profile Schemas
class UserProfileBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    medical_conditions: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    fitness_level: Optional[str] = None
    mobility_issues: Optional[List[str]] = []
    primary_goal: Optional[str] = None
    target_weight: Optional[float] = None
    target_date: Optional[datetime] = None
    dietary_preferences: Optional[List[str]] = []
    cultural_background: Optional[str] = None
    cuisine_preferences: Optional[List[str]] = []
    equipment_access: Optional[List[str]] = []
    workout_time_preference: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfile(UserProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Nutrition Schemas
class NutritionPlanRequest(BaseModel):
    dietary_goals: List[str]
    meal_frequency: int = 3
    calorie_target: Optional[int] = None
    special_requirements: Optional[List[str]] = []
    duration_days: int = 7

class MealItem(BaseModel):
    food_name: str
    quantity: float
    unit: str
    calories: float
    macros: Dict[str, float]

class Meal(BaseModel):
    meal_type: str  # breakfast, lunch, dinner, snack
    items: List[MealItem]
    total_calories: float
    total_macros: Dict[str, float]
    preparation_time: int
    instructions: Optional[str] = None

class DayPlan(BaseModel):
    day: int
    meals: List[Meal]
    daily_totals: Dict[str, float]

class NutritionPlan(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    plan_data: List[DayPlan]
    nutritional_summary: Dict[str, Any]
    duration_days: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Fitness Schemas
class FitnessPlanRequest(BaseModel):
    fitness_goals: List[str]
    current_fitness_level: str
    available_equipment: List[str]
    workout_frequency: int = 3
    session_duration: int = 60  # minutes
    mobility_considerations: Optional[List[str]] = []
    mood_factor: Optional[str] = None
    fatigue_level: Optional[int] = None
    injury_status: Optional[List[str]] = []

class Exercise(BaseModel):
    name: str
    sets: int
    reps: Optional[int] = None
    duration: Optional[int] = None  # for time-based exercises
    rest_time: int  # seconds
    weight: Optional[float] = None
    notes: Optional[str] = None
    modifications: Optional[List[str]] = []

class WorkoutSession(BaseModel):
    session_type: str  # strength, cardio, flexibility, recovery
    exercises: List[Exercise]
    estimated_duration: int
    difficulty_level: str
    warm_up: Optional[List[str]] = []
    cool_down: Optional[List[str]] = []

class FitnessPlan(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    plan_data: List[WorkoutSession]
    difficulty_level: str
    duration_weeks: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Progress Schemas
class ProgressLogCreate(BaseModel):
    log_type: str
    metric_name: str
    metric_value: float
    metric_unit: str
    additional_data: Optional[Dict[str, Any]] = {}
    notes: Optional[str] = None

class ProgressLog(BaseModel):
    id: int
    user_id: int
    log_type: str
    metric_name: str
    metric_value: float
    metric_unit: str
    additional_data: Optional[Dict[str, Any]] = {}
    notes: Optional[str] = None
    logged_at: datetime

    class Config:
        from_attributes = True

class ProgressTrends(BaseModel):
    metric_name: str
    trend_data: List[Dict[str, Any]]
    trend_direction: str  # increasing, decreasing, stable
    percentage_change: float
    period: str  # weekly, monthly, etc.

# Education Schemas
class EducationalContentBase(BaseModel):
    title: str
    content_type: str
    content: str
    summary: Optional[str] = None
    tags: Optional[List[str]] = []
    source: Optional[str] = None
    target_audience: Optional[List[str]] = []
    is_featured: bool = False

class EducationalContentCreate(EducationalContentBase):
    pass

class EducationalContent(EducationalContentBase):
    id: int
    view_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Trainer Schemas
class TrainerClientAssignment(BaseModel):
    trainer_id: int
    client_id: int
    notes: Optional[str] = None

class TrainerClient(BaseModel):
    id: int
    trainer_id: int
    client_id: int
    assigned_at: datetime
    is_active: bool
    notes: Optional[str] = None

    class Config:
        from_attributes = True
