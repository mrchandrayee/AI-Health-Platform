'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Dumbbell, Plus, Calendar, Target, Play, Clock, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';

export default function FitnessPage() {
  const [activeTab, setActiveTab] = useState('workouts');

  const tabs = [
    { id: 'workouts', label: 'Workout Plans', icon: Dumbbell },
    { id: 'generate', label: 'Generate Plan', icon: Plus },
    { id: 'logs', label: 'Workout Logs', icon: Calendar },
    { id: 'exercises', label: 'Exercise Library', icon: Play },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Fitness Planner</h1>
            <p className="text-gray-600 mt-1">Adaptive workout plans powered by AI</p>
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
          {activeTab === 'workouts' && <WorkoutPlansTab />}
          {activeTab === 'generate' && <GeneratePlanTab />}
          {activeTab === 'logs' && <WorkoutLogsTab />}
          {activeTab === 'exercises' && <ExerciseLibraryTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function WorkoutPlansTab() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Current Plan */}
      <div className="card card-hover p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Current Week Plan</h3>
          <span className="badge badge-success">Active</span>
        </div>
        <p className="text-gray-600 text-sm mb-6">Strength Training + Cardio, 4 days/week</p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Today: Upper Body</p>
                <p className="text-sm text-gray-600">45 min • 8 exercises</p>
              </div>
            </div>
            <button className="btn-primary text-xs px-3 py-1">Start</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium text-gray-900">3/4 days completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
        
        <button className="w-full btn-outline py-2">
          View Full Plan
        </button>
      </div>

      {/* Previous Plan */}
      <div className="card card-hover p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Last Week Plan</h3>
          <span className="badge badge-warning">Completed</span>
        </div>
        <p className="text-gray-600 text-sm mb-6">Full Body Circuit, 3 days/week</p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Full Body Circuit</p>
              <p className="text-sm text-gray-600">40 min • 6 exercises</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium text-gray-900">3/3 days completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
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
          <p className="text-gray-600 text-sm mb-6">Create a personalized workout plan with AI</p>
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
    goal: '',
    fitnessLevel: '',
    availableEquipment: [] as string[],
    workoutDays: 3,
    sessionDuration: 45,
    injuryHistory: '',
    preferences: [] as string[],
  });

  return (
    <div className="max-w-2xl">
      <div className="card p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Generate New Workout Plan</h3>
            <p className="text-gray-600 text-sm">Tell us about your fitness goals</p>
          </div>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Fitness Goal
            </label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="input"
            >
              <option value="">Select your goal</option>
              <option value="strength">Build Strength</option>
              <option value="muscle">Build Muscle</option>
              <option value="endurance">Improve Endurance</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Fitness Level
            </label>
            <select
              value={formData.fitnessLevel}
              onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
              className="input"
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner (0-6 months)</option>
              <option value="intermediate">Intermediate (6 months - 2 years)</option>
              <option value="advanced">Advanced (2+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Equipment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 'Gym Access', 'Bodyweight Only'].map((equipment) => (
                <label key={equipment} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    onChange={(e) => {
                      const newEquipment = e.target.checked
                        ? [...formData.availableEquipment, equipment]
                        : formData.availableEquipment.filter(eq => eq !== equipment);
                      setFormData({ ...formData, availableEquipment: newEquipment });
                    }}
                  />
                  <span className="ml-3 text-sm text-gray-700">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Days/Week
              </label>
              <select
                value={formData.workoutDays}
                onChange={(e) => setFormData({ ...formData, workoutDays: parseInt(e.target.value) })}
                className="input"
              >
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
                <option value={6}>6 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration (min)
              </label>
              <select
                value={formData.sessionDuration}
                onChange={(e) => setFormData({ ...formData, sessionDuration: parseInt(e.target.value) })}
                className="input"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Injury History (Optional)
            </label>
            <textarea
              value={formData.injuryHistory}
              onChange={(e) => setFormData({ ...formData, injuryHistory: e.target.value })}
              placeholder="Any injuries or limitations we should know about?"
              className="input min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-base font-medium"
          >
            Generate AI Workout Plan
          </button>
        </form>
      </div>
    </div>
  );
}

function WorkoutLogsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Recent Workouts</h3>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Log Workout</span>
        </button>
      </div>
      
      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Upper Body Strength</p>
                <p className="text-sm text-gray-600">45 min • 8 exercises</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Today</p>
              <p className="text-sm text-gray-600">2:30 PM</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Cardio Session</p>
                <p className="text-sm text-gray-600">30 min • Running</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Yesterday</p>
              <p className="text-sm text-gray-600">6:00 AM</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <Dumbbell className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Lower Body</p>
                <p className="text-sm text-gray-600">50 min • 6 exercises</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">2 days ago</p>
              <p className="text-sm text-gray-600">5:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseLibraryTab() {
  const categories = [
    { name: 'Strength Training', icon: Dumbbell, count: 45 },
    { name: 'Cardio', icon: TrendingUp, count: 23 },
    { name: 'Flexibility', icon: Target, count: 18 },
    { name: 'Bodyweight', icon: Play, count: 32 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Exercise Categories</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <div key={index} className="card card-hover p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
              <p className="text-sm text-gray-600">{category.count} exercises</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Exercises</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Push-ups', category: 'Bodyweight', difficulty: 'Beginner' },
            { name: 'Squats', category: 'Strength', difficulty: 'Beginner' },
            { name: 'Deadlifts', category: 'Strength', difficulty: 'Advanced' },
            { name: 'Planks', category: 'Core', difficulty: 'Beginner' },
            { name: 'Burpees', category: 'Cardio', difficulty: 'Intermediate' },
            { name: 'Pull-ups', category: 'Strength', difficulty: 'Advanced' },
          ].map((exercise, index) => (
            <div key={index} className="card card-hover p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                <span className={`badge ${
                  exercise.difficulty === 'Beginner' ? 'badge-success' :
                  exercise.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-primary'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600">{exercise.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

