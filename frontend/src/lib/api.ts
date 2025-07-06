import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: `${this.baseURL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          Cookies.remove('access_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    params?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url,
        data,
        params,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  // Authentication methods
  async login(credentials: { username: string; password: string }) {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    return this.request<{ access_token: string; token_type: string }>('POST', '/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
    phone?: string;
    role?: string;
  }) {
    return this.request('POST', '/auth/register', userData);
  }

  async getCurrentUser() {
    return this.request('GET', '/auth/me');
  }

  async getUserProfile() {
    return this.request('GET', '/auth/me/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('PUT', '/auth/me/profile', profileData);
  }

  // Nutrition methods
  async generateNutritionPlan(planRequest: {
    dietary_goals: string[];
    meal_frequency?: number;
    calorie_target?: number;
    special_requirements?: string[];
    duration_days?: number;
  }) {
    return this.request('POST', '/nutrition/generate-plan', planRequest);
  }

  async getNutritionPlan(planId: number) {
    return this.request('GET', `/nutrition/meal-plan/${planId}`);
  }

  async getUserNutritionPlans(userId: number) {
    return this.request('GET', `/nutrition/meal-plans/user/${userId}`);
  }

  async logMeal(mealData: any) {
    return this.request('POST', '/nutrition/log-meal', mealData);
  }

  async getIngredientSubstitutions(ingredient: string) {
    return this.request('POST', '/nutrition/suggest-substitutions', { ingredient });
  }

  async activateNutritionPlan(planId: number) {
    return this.request('PUT', `/nutrition/meal-plan/${planId}/activate`);
  }

  // Fitness methods
  async generateFitnessPlan(planRequest: {
    fitness_goals: string[];
    current_fitness_level: string;
    available_equipment: string[];
    workout_frequency?: number;
    session_duration?: number;
    mobility_considerations?: string[];
    mood_factor?: string;
    fatigue_level?: number;
    injury_status?: string[];
  }) {
    return this.request('POST', '/fitness/generate-plan', planRequest);
  }

  async getFitnessPlan(planId: number) {
    return this.request('GET', `/fitness/workout-plan/${planId}`);
  }

  async getUserFitnessPlans(userId: number) {
    return this.request('GET', `/fitness/workout-plans/user/${userId}`);
  }

  async logWorkout(workoutData: any) {
    return this.request('POST', '/fitness/log-workout', workoutData);
  }

  async generateAdaptivePlan(planId: number, adaptations: any) {
    return this.request('POST', `/fitness/adaptive-plan?plan_id=${planId}`, adaptations);
  }

  async activateFitnessPlan(planId: number) {
    return this.request('PUT', `/fitness/workout-plan/${planId}/activate`);
  }

  async getExerciseLibrary(filters?: {
    category?: string;
    equipment?: string;
    difficulty?: string;
  }) {
    return this.request('GET', '/fitness/exercise-library', null, filters);
  }

  // Progress methods
  async logMetric(metricData: {
    log_type: string;
    metric_name: string;
    metric_value: number;
    metric_unit: string;
    additional_data?: any;
    notes?: string;
  }) {
    return this.request('POST', '/progress/log-metric', metricData);
  }

  async getUserMetrics(userId: number, filters?: {
    log_type?: string;
    metric_name?: string;
    start_date?: string;
    end_date?: string;
  }) {
    return this.request('GET', `/progress/user/${userId}/metrics`, null, filters);
  }

  async getUserTrends(userId: number, period: string = 'weekly') {
    return this.request('GET', `/progress/user/${userId}/trends`, null, { period });
  }

  async updateUserGoals(userId: number, goals: any) {
    return this.request('PUT', `/progress/user/${userId}/goals`, goals);
  }

  async getUserMilestones(userId: number) {
    return this.request('GET', `/progress/user/${userId}/milestones`);
  }

  async getProgressDashboard(userId: number) {
    return this.request('GET', `/progress/user/${userId}/dashboard`);
  }

  // Education methods
  async getArticles(filters?: {
    tag?: string;
    target_audience?: string;
    featured_only?: boolean;
    limit?: number;
  }) {
    return this.request('GET', '/education/articles', null, filters);
  }

  async getArticle(articleId: number) {
    return this.request('GET', `/education/articles/${articleId}`);
  }

  async getVideos(filters?: {
    tag?: string;
    target_audience?: string;
    featured_only?: boolean;
    limit?: number;
  }) {
    return this.request('GET', '/education/videos', null, filters);
  }

  async getVideo(videoId: number) {
    return this.request('GET', `/education/videos/${videoId}`);
  }

  async searchEducationalContent(searchData: {
    keywords: string[];
    content_type?: string;
    target_audience?: string;
  }) {
    return this.request('POST', '/education/search', searchData);
  }

  async getEducationRecommendations() {
    return this.request('GET', '/education/recommendations');
  }

  async getEducationCategories() {
    return this.request('GET', '/education/categories');
  }

  // Trainer methods
  async getMyClients() {
    return this.request('GET', '/trainers/my-clients');
  }

  async getClientProgress(clientId: number) {
    return this.request('GET', `/trainers/clients/${clientId}/progress`);
  }

  async assignPlanToClient(clientId: number, planData: any) {
    return this.request('POST', `/trainers/clients/${clientId}/assign-plan`, planData);
  }

  async updateClientPlan(clientId: number, planId: number, planUpdates: any) {
    return this.request('PUT', `/trainers/clients/${clientId}/update-plan/${planId}`, planUpdates);
  }

  async assignClientToTrainer(assignmentData: {
    trainer_id: number;
    client_id: number;
    notes?: string;
  }) {
    return this.request('POST', '/trainers/assign-client', assignmentData);
  }

  async sendMessageToClient(clientId: number, message: string) {
    return this.request('POST', '/trainers/messages', { client_id: clientId, message });
  }

  async getAvailableTrainers() {
    return this.request('GET', '/trainers/available');
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
