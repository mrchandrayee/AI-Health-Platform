'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, Utensils, Calendar, Target, Sparkles, Clock, CheckCircle } from 'lucide-react';

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState('plans');

  const tabs = [
    { id: 'plans', label: 'Meal Plans', icon: Utensils },
    { id: 'generate', label: 'Generate Plan', icon: Plus },
    { id: 'logs', label: 'Food Logs', icon: Calendar },
    { id: 'goals', label: 'Nutrition Goals', icon: Target },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Nutrition Planner</h1>
            <p className="text-gray-600 mt-1">Personalized meal plans powered by AI</p>
          </div>
          <button className="btn-primary flex items-center space-x-2 px-6 py-3">
            <Sparkles className="h-5 w-5" />
            <span>Generate New Plan</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'plans' && <MealPlansTab />}
          {activeTab === 'generate' && <GeneratePlanTab />}
          {activeTab === 'logs' && <FoodLogsTab />}
          {activeTab === 'goals' && <NutritionGoalsTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function MealPlansTab() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Current Plan */}
      <div className="card card-hover p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Current Week Plan</h3>
          <span className="badge badge-success">Active</span>
        </div>
        <p className="text-gray-600 text-sm mb-6">Mediterranean diet, 1800 calories/day</p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Protein</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">25%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Carbs</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">45%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Fats</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">30%</span>
          </div>
        </div>
        
        <button className="w-full btn-outline py-2">
          View Details
        </button>
      </div>

      {/* Previous Plans */}
      <div className="card card-hover p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Last Week Plan</h3>
          <span className="badge badge-warning">Completed</span>
        </div>
        <p className="text-gray-600 text-sm mb-6">Keto diet, 1600 calories/day</p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Protein</span>
            <span className="text-sm font-semibold text-gray-900">30%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Carbs</span>
            <span className="text-sm font-semibold text-gray-900">10%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Fats</span>
            <span className="text-sm font-semibold text-gray-900">60%</span>
          </div>
        </div>
        
        <button className="w-full btn-outline py-2">
          View Details
        </button>
      </div>

      {/* Generate New Plan */}
      <div className="card card-hover p-6 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate New Plan</h3>
          <p className="text-gray-600 text-sm mb-6">Create a personalized meal plan with AI</p>
          <button className="btn-primary w-full">
            Start Planning
          </button>
        </div>
      </div>
    </div>
  );
}

function GeneratePlanTab() {
  const [formData, setFormData] = useState({
    goals: '',
    dietaryRestrictions: [] as string[],
    allergies: '',
    culturalPreferences: '',
    mealsPerDay: 3,
    targetCalories: 2000,
  });

  return (
    <div className="max-w-2xl">
      <div className="card p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Generate New Meal Plan</h3>
            <p className="text-gray-600 text-sm">Tell us about your preferences</p>
          </div>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Goals
            </label>
            <select
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              className="input"
            >
              <option value="">Select your goal</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="bulking">Bulking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dietary Restrictions
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free'].map((restriction) => (
                <label key={restriction} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    onChange={(e) => {
                      const newRestrictions = e.target.checked
                        ? [...formData.dietaryRestrictions, restriction]
                        : formData.dietaryRestrictions.filter(r => r !== restriction);
                      setFormData({ ...formData, dietaryRestrictions: newRestrictions });
                    }}
                  />
                  <span className="ml-3 text-sm text-gray-700">{restriction}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cultural Preferences
            </label>
            <input
              type="text"
              value={formData.culturalPreferences}
              onChange={(e) => setFormData({ ...formData, culturalPreferences: e.target.value })}
              placeholder="e.g., Mediterranean, Asian, Middle Eastern"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meals Per Day
              </label>
              <select
                value={formData.mealsPerDay}
                onChange={(e) => setFormData({ ...formData, mealsPerDay: parseInt(e.target.value) })}
                className="input"
              >
                <option value={3}>3 meals</option>
                <option value={4}>4 meals</option>
                <option value={5}>5 meals</option>
                <option value={6}>6 meals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Calories
              </label>
              <input
                type="number"
                value={formData.targetCalories}
                onChange={(e) => setFormData({ ...formData, targetCalories: parseInt(e.target.value) })}
                className="input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-base font-medium"
          >
            Generate AI Meal Plan
          </button>
        </form>
      </div>
    </div>
  );
}

function FoodLogsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Today's Food Log</h3>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Food</span>
        </button>
      </div>
      
      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Breakfast</p>
                <p className="text-sm text-gray-600">Oatmeal with berries</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">320 cal</p>
              <p className="text-sm text-gray-600">8:30 AM</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Lunch</p>
                <p className="text-sm text-gray-600">Grilled chicken salad</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">450 cal</p>
              <p className="text-sm text-gray-600">12:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionGoalsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Targets</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Calories</span>
                <span className="font-medium">1,200 / 1,800</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Protein</span>
                <span className="font-medium">85g / 120g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Carbs</span>
                <span className="font-medium">150g / 200g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Goals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Weight Goal</span>
              <span className="text-sm text-gray-600">-2 lbs this week</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Water Intake</span>
              <span className="text-sm text-gray-600">8 glasses/day</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Meal Prep</span>
              <span className="text-sm text-gray-600">3 days/week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
