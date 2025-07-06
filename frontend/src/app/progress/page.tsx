'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { TrendingUp, Calendar, Target, Plus, Scale, Activity, Heart } from 'lucide-react';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'weight', label: 'Weight Tracking', icon: Scale },
    { id: 'fitness', label: 'Fitness Progress', icon: Activity },
    { id: 'wellness', label: 'Wellness Metrics', icon: Heart },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600">Monitor your health and fitness journey</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Log Progress</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900">185 lbs</p>
                <p className="text-sm text-green-600">-5 lbs this month</p>
              </div>
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Workouts This Week</p>
                <p className="text-2xl font-bold text-gray-900">4/5</p>
                <p className="text-sm text-blue-600">80% completion</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Sleep</p>
                <p className="text-2xl font-bold text-gray-900">7.2h</p>
                <p className="text-sm text-green-600">Above target</p>
              </div>
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                <p className="text-2xl font-bold text-gray-900">67%</p>
                <p className="text-sm text-blue-600">On track</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </div>
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
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'weight' && <WeightTrackingTab />}
          {activeTab === 'fitness' && <FitnessProgressTab />}
          {activeTab === 'wellness' && <WellnessMetricsTab />}
          {activeTab === 'goals' && <GoalsTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function OverviewTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Weight Progress Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Weight Progress (Last 3 Months)</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Weight Progress Chart Placeholder</p>
        </div>
      </div>

      {/* Workout Consistency */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Workout Consistency</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">This Week</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((day) => (
                <div
                  key={day}
                  className={`w-8 h-8 rounded ${
                    day <= 4 ? 'bg-green-500' : 'bg-gray-200'
                  } flex items-center justify-center`}
                >
                  <span className="text-xs text-white font-medium">
                    {day <= 4 ? '✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Week</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((day) => (
                <div
                  key={day}
                  className={`w-8 h-8 rounded ${
                    day <= 5 ? 'bg-green-500' : 'bg-gray-200'
                  } flex items-center justify-center`}
                >
                  <span className="text-xs text-white font-medium">
                    {day <= 5 ? '✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightTrackingTab() {
  const [newWeight, setNewWeight] = useState('');

  return (
    <div className="space-y-6">
      {/* Add New Weight Entry */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Log Weight</h3>
        <div className="flex space-x-4">
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Enter weight (lbs)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Log Weight
          </button>
        </div>
      </div>

      {/* Weight History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Weight History</h3>
        <div className="space-y-3">
          {[
            { date: '2024-12-29', weight: 185, change: -1 },
            { date: '2024-12-22', weight: 186, change: -2 },
            { date: '2024-12-15', weight: 188, change: -1 },
            { date: '2024-12-08', weight: 189, change: -0.5 },
          ].map((entry, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{entry.date}</span>
              <span className="font-medium">{entry.weight} lbs</span>
              <span className={`text-sm ${entry.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {entry.change > 0 ? '+' : ''}{entry.change} lbs
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FitnessProgressTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strength Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Strength Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bench Press</span>
              <span className="font-medium">185 lbs (+10 lbs)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Squat</span>
              <span className="font-medium">225 lbs (+15 lbs)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Deadlift</span>
              <span className="font-medium">275 lbs (+20 lbs)</span>
            </div>
          </div>
        </div>

        {/* Cardio Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Cardio Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">5K Time</span>
              <span className="font-medium">24:30 (-1:15)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resting HR</span>
              <span className="font-medium">65 bpm (-3 bpm)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">VO2 Max</span>
              <span className="font-medium">42 ml/kg/min (+2)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WellnessMetricsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Sleep Quality</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">7.2h</p>
            <p className="text-sm text-gray-600">Average this week</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Stress Level</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">Low</p>
            <p className="text-sm text-gray-600">Improved from last week</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Energy Level</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">8/10</p>
            <p className="text-sm text-gray-600">Above average</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Current Goals</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Lose 20 pounds</h4>
              <span className="text-sm text-blue-600">67% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            <p className="text-sm text-gray-600">Target: March 2025 • Progress: 13.4 lbs lost</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Run 5K under 25 minutes</h4>
              <span className="text-sm text-green-600">80% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-sm text-gray-600">Current time: 24:30 • Target: 24:59</p>
          </div>
        </div>
      </div>
    </div>
  );
}
