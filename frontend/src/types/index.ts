// Types for User and Authentication
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'trainer' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activity_level?: string;
  medical_conditions?: string[];
  allergies?: string[];
  medications?: string[];
  fitness_level?: string;
  mobility_issues?: string[];
  primary_goal?: string;
  target_weight?: number;
  target_date?: string;
  dietary_preferences?: string[];
  cultural_background?: string;
  cuisine_preferences?: string[];
  equipment_access?: string[];
  workout_time_preference?: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  role?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// Types for Nutrition
export interface NutritionPlanRequest {
  dietary_goals: string[];
  meal_frequency?: number;
  calorie_target?: number;
  special_requirements?: string[];
  duration_days?: number;
}

export interface MealItem {
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface Meal {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealItem[];
  total_calories: number;
  total_macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  preparation_time: number;
  instructions?: string;
}

export interface DayPlan {
  day: number;
  meals: Meal[];
  daily_totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface NutritionPlan {
  id: number;
  user_id: number;
  title: string;
  description: string;
  plan_data: DayPlan[];
  nutritional_summary: {
    avg_daily_calories: number;
    avg_daily_macros: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    key_nutrients: string[];
    health_benefits: string[];
  };
  duration_days: number;
  is_active: boolean;
  created_at: string;
}

// Types for Fitness
export interface FitnessPlanRequest {
  fitness_goals: string[];
  current_fitness_level: string;
  available_equipment: string[];
  workout_frequency?: number;
  session_duration?: number;
  mobility_considerations?: string[];
  mood_factor?: string;
  fatigue_level?: number;
  injury_status?: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest_time: number;
  weight?: number;
  notes?: string;
  modifications?: string[];
}

export interface WorkoutSession {
  day?: number;
  session_type: 'strength' | 'cardio' | 'flexibility' | 'recovery';
  exercises: Exercise[];
  estimated_duration: number;
  difficulty_level: string;
  warm_up?: string[];
  cool_down?: string[];
}

export interface FitnessPlan {
  id: number;
  user_id: number;
  title: string;
  description: string;
  plan_data: WorkoutSession[];
  difficulty_level: string;
  duration_weeks: number;
  is_active: boolean;
  created_at: string;
}

// Types for Progress
export interface ProgressLogCreate {
  log_type: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  additional_data?: Record<string, any>;
  notes?: string;
}

export interface ProgressLog {
  id: number;
  user_id: number;
  log_type: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  additional_data?: Record<string, any>;
  notes?: string;
  logged_at: string;
}

export interface ProgressTrends {
  metric_name: string;
  trend_data: Array<{
    period: string;
    value: number;
    count: number;
  }>;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  percentage_change: number;
  period: string;
}

// Types for Education
export interface EducationalContent {
  id: number;
  title: string;
  content_type: 'article' | 'video' | 'infographic';
  content: string;
  summary?: string;
  tags?: string[];
  source?: string;
  target_audience?: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at?: string;
}

// Types for Trainers
export interface TrainerClient {
  id: number;
  trainer_id: number;
  client_id: number;
  assigned_at: string;
  is_active: boolean;
  notes?: string;
}

export interface ClientProgress {
  client: {
    id: number;
    full_name: string;
    email: string;
  };
  recent_progress: ProgressLog[];
  active_nutrition_plan?: NutritionPlan;
  active_fitness_plan?: FitnessPlan;
  assignment_date: string;
  trainer_notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Error Types
export interface ApiError {
  detail: string;
  status_code?: number;
}

// Dashboard Types
export interface DashboardData {
  user_id: number;
  summary: {
    current_weight?: {
      value: number;
      unit: string;
      date: string;
    };
    monthly_workouts?: number;
    avg_daily_calories?: number;
  };
  last_updated: string;
}
