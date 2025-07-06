'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ProgressTrends } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ProgressCharts() {
  const { user } = useAuth();
  const [trendsData, setTrendsData] = useState<ProgressTrends[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  useEffect(() => {
    if (user?.id) {
      fetchTrends();
    }
  }, [user?.id, selectedPeriod]);

  const fetchTrends = async () => {
    try {
      const data = await apiClient.getUserTrends(user!.id, selectedPeriod);
      setTrendsData(data as ProgressTrends[]);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const weightTrend = trendsData.find(trend => trend.metric_name === 'weight');
  const workoutTrend = trendsData.find(trend => trend.metric_name === 'workout_completed');

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

      <div className="space-y-8">
        {/* Weight Progress Chart */}
        {weightTrend && weightTrend.trend_data.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Weight Progress
              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                weightTrend.trend_direction === 'decreasing' 
                  ? 'bg-green-100 text-green-800' 
                  : weightTrend.trend_direction === 'increasing'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {weightTrend.percentage_change > 0 ? '+' : ''}{weightTrend.percentage_change.toFixed(1)}%
              </span>
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightTrend.trend_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Weight']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Workout Frequency Chart */}
        {workoutTrend && workoutTrend.trend_data.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Workout Frequency
              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                workoutTrend.trend_direction === 'increasing' 
                  ? 'bg-green-100 text-green-800' 
                  : workoutTrend.trend_direction === 'decreasing'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {workoutTrend.percentage_change > 0 ? '+' : ''}{workoutTrend.percentage_change.toFixed(1)}%
              </span>
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workoutTrend.trend_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value} workouts`, 'Count']}
                />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* No data message */}
        {trendsData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500">No progress data available yet.</p>
            <p className="text-gray-400 text-sm">Start logging your activities to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
