'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ProgressLog } from '@/types';
import { Clock, Activity, Apple, Dumbbell, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentActivity() {
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState<ProgressLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchRecentActivity();
    }
  }, [user?.id]);

  const fetchRecentActivity = async () => {
    try {
      const logs = await apiClient.getUserMetrics(user!.id);
      // Get the 5 most recent logs
      setRecentLogs((logs as ProgressLog[]).slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (logType: string) => {
    switch (logType) {
      case 'meal':
        return Apple;
      case 'workout':
        return Dumbbell;
      case 'weight':
        return Target;
      default:
        return Activity;
    }
  };

  const getActivityColor = (logType: string) => {
    switch (logType) {
      case 'meal':
        return 'text-green-600 bg-green-100';
      case 'workout':
        return 'text-blue-600 bg-blue-100';
      case 'weight':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatActivityDescription = (log: ProgressLog) => {
    switch (log.log_type) {
      case 'meal':
        return `Logged ${log.metric_value} ${log.metric_unit}`;
      case 'workout':
        return `Completed ${log.metric_value} ${log.metric_unit} workout`;
      case 'weight':
        return `Recorded weight: ${log.metric_value} ${log.metric_unit}`;
      default:
        return `${log.metric_name}: ${log.metric_value} ${log.metric_unit}`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      
      {recentLogs.length > 0 ? (
        <div className="space-y-3">
          {recentLogs.map((log, index) => {
            const ActivityIcon = getActivityIcon(log.log_type);
            const colorClasses = getActivityColor(log.log_type);
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colorClasses}`}>
                  <ActivityIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formatActivityDescription(log)}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(log.logged_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">No recent activity</p>
          <p className="text-gray-400 text-xs">Start logging your progress to see activities here</p>
        </div>
      )}
    </div>
  );
}
