'use client';

import Link from 'next/link';
import { Apple, Dumbbell, Plus, TrendingUp } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'Generate Meal Plan',
      description: 'Create AI-powered nutrition plan',
      href: '/nutrition/generate',
      icon: Apple,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'New Workout Plan',
      description: 'Get personalized fitness routine',
      href: '/fitness/generate',
      icon: Dumbbell,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Log Progress',
      description: 'Record weight, meals, workouts',
      href: '/progress/log',
      icon: Plus,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Check your progress trends',
      href: '/progress',
      icon: TrendingUp,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
          >
            <div className="flex items-center">
              <div className={`${action.color} p-2 rounded-md transition-colors`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
