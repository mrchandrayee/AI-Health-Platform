'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { DashboardData } from '@/types';
import { Activity, Target, TrendingUp, Calendar, TrendingDown, Minus } from 'lucide-react';

interface OverviewCard {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function OverviewCards() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      const data = await apiClient.getProgressDashboard(user!.id);
      setDashboardData(data as DashboardData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cards: OverviewCard[] = [
    {
      title: 'Current Weight',
      value: dashboardData?.summary.current_weight 
        ? `${dashboardData.summary.current_weight.value} ${dashboardData.summary.current_weight.unit}`
        : '--',
      subtitle: 'Last recorded',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      trend: { value: -2.5, isPositive: false }
    },
    {
      title: 'Monthly Workouts',
      value: dashboardData?.summary.monthly_workouts?.toString() || '0',
      subtitle: 'This month',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Avg Daily Calories',
      value: dashboardData?.summary.avg_daily_calories 
        ? Math.round(dashboardData.summary.avg_daily_calories).toString()
        : '--',
      subtitle: 'Last 7 days',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      trend: { value: 0, isPositive: true }
    },
    {
      title: 'Days Active',
      value: '12',
      subtitle: 'This month',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500',
      trend: { value: 3, isPositive: true }
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="card card-hover p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            {card.trend && (
              <div className={`flex items-center text-xs font-medium ${
                card.trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : card.trend.value < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <Minus className="h-3 w-3 mr-1" />
                )}
                {Math.abs(card.trend.value)}%
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-xs text-gray-400">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
