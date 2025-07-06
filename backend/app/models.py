from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    phone = Column(String)
    role = Column(String, default="user")  # user, trainer, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Profile relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    nutrition_plans = relationship("NutritionPlan", back_populates="user")
    fitness_plans = relationship("FitnessPlan", back_populates="user")
    progress_logs = relationship("ProgressLog", back_populates="user")
    assigned_clients = relationship("TrainerClient", foreign_keys="TrainerClient.trainer_id", back_populates="trainer")
    trainer_assignments = relationship("TrainerClient", foreign_keys="TrainerClient.client_id", back_populates="client")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Personal Info
    age = Column(Integer)
    gender = Column(String)
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    activity_level = Column(String)  # sedentary, light, moderate, active, very_active
    
    # Health Info
    medical_conditions = Column(JSON)  # list of conditions
    allergies = Column(JSON)  # list of allergies
    medications = Column(JSON)  # list of medications
    fitness_level = Column(String)  # beginner, intermediate, advanced
    mobility_issues = Column(JSON)  # list of mobility constraints
    
    # Goals
    primary_goal = Column(String)  # weight_loss, muscle_gain, maintenance, health
    target_weight = Column(Float)
    target_date = Column(DateTime)
    
    # Preferences
    dietary_preferences = Column(JSON)  # vegan, vegetarian, halal, kosher, etc.
    cultural_background = Column(String)
    cuisine_preferences = Column(JSON)
    equipment_access = Column(JSON)  # gym, home, minimal, etc.
    workout_time_preference = Column(String)  # morning, afternoon, evening
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")

class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    plan_data = Column(JSON)  # detailed meal plan structure
    nutritional_summary = Column(JSON)  # daily calories, macros, etc.
    duration_days = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="nutrition_plans")

class FitnessPlan(Base):
    __tablename__ = "fitness_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    plan_data = Column(JSON)  # detailed workout structure
    difficulty_level = Column(String)
    duration_weeks = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="fitness_plans")

class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    log_type = Column(String)  # weight, meal, workout, mood, measurements
    metric_name = Column(String)  # weight, calories, sets, reps, mood_score, etc.
    metric_value = Column(Float)
    metric_unit = Column(String)  # kg, lbs, calories, minutes, score, etc.
    additional_data = Column(JSON)  # any extra structured data
    notes = Column(Text)
    logged_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="progress_logs")

class TrainerClient(Base):
    __tablename__ = "trainer_clients"

    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey("users.id"))
    client_id = Column(Integer, ForeignKey("users.id"))
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    notes = Column(Text)

    trainer = relationship("User", foreign_keys=[trainer_id], back_populates="assigned_clients")
    client = relationship("User", foreign_keys=[client_id], back_populates="trainer_assignments")

class EducationalContent(Base):
    __tablename__ = "educational_content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content_type = Column(String)  # article, video, infographic
    content = Column(Text)  # article text or video URL
    summary = Column(Text)
    tags = Column(JSON)  # list of tags for categorization
    source = Column(String)  # NHS, WHO, USDA, etc.
    target_audience = Column(JSON)  # beginner, intermediate, advanced, specific conditions
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class FoodDatabase(Base):
    __tablename__ = "food_database"

    id = Column(Integer, primary_key=True, index=True)
    food_name = Column(String, nullable=False, index=True)
    food_code = Column(String, unique=True)  # USDA food code
    category = Column(String)
    nutritional_data = Column(JSON)  # calories, macros, micros per 100g
    cultural_tags = Column(JSON)  # cuisine types, cultural associations
    allergen_info = Column(JSON)  # common allergens
    substitutes = Column(JSON)  # alternative ingredients
    source = Column(String, default="USDA")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExerciseDatabase(Base):
    __tablename__ = "exercise_database"

    id = Column(Integer, primary_key=True, index=True)
    exercise_name = Column(String, nullable=False, index=True)
    category = Column(String)  # strength, cardio, flexibility, balance
    muscle_groups = Column(JSON)  # primary and secondary muscles
    equipment_needed = Column(JSON)  # none, dumbbells, barbell, etc.
    difficulty_level = Column(String)  # beginner, intermediate, advanced
    instructions = Column(Text)
    safety_notes = Column(Text)
    modifications = Column(JSON)  # easier/harder variations
    contraindications = Column(JSON)  # conditions where exercise should be avoided
    calories_per_minute = Column(Float)  # approximate calorie burn
    created_at = Column(DateTime(timezone=True), server_default=func.now())
