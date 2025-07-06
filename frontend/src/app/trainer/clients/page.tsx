'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, MessageSquare, Calendar, TrendingUp, Plus, Search } from 'lucide-react';

export default function TrainerClientsPage() {
  const [activeTab, setActiveTab] = useState('clients');

  const tabs = [
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
            <p className="text-gray-600">Manage your clients and track their progress</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600">+3 this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <p className="text-sm text-blue-600">75% completion rate</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">82%</p>
                <p className="text-sm text-green-600">+5% this week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
                <p className="text-sm text-orange-600">Needs attention</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
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
          {activeTab === 'clients' && <ClientsTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ClientsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      startDate: '2024-01-15',
      program: 'Weight Loss Program',
      progress: 78,
      lastActivity: '2 hours ago',
      status: 'active',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      startDate: '2024-02-01',
      program: 'Strength Training',
      progress: 92,
      lastActivity: '1 day ago',
      status: 'active',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      startDate: '2024-01-20',
      program: 'Marathon Training',
      progress: 65,
      lastActivity: '3 days ago',
      status: 'needs_attention',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      startDate: '2024-03-01',
      program: 'General Fitness',
      progress: 45,
      lastActivity: '5 hours ago',
      status: 'active',
      avatar: 'DK'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>All Clients</option>
          <option>Active</option>
          <option>Needs Attention</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{client.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                client.status === 'active' ? 'bg-green-100 text-green-800' :
                client.status === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {client.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Program:</span>
                  <span className="font-medium">{client.program}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{client.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Activity:</span>
                <span className="text-gray-900">{client.lastActivity}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 text-sm">
                View Progress
              </button>
              <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 text-sm">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-lg mb-4">Today's Schedule</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-blue-600 font-medium">9:00 AM</div>
          <div className="flex-1">
            <p className="font-medium">Session with Sarah Johnson</p>
            <p className="text-sm text-gray-600">Weight Loss Consultation</p>
          </div>
          <button className="text-blue-600 text-sm">Join Call</button>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600 font-medium">11:00 AM</div>
          <div className="flex-1">
            <p className="font-medium">Session with Mike Chen</p>
            <p className="text-sm text-gray-600">Strength Training Review</p>
          </div>
          <button className="text-gray-600 text-sm">Upcoming</button>
        </div>
      </div>
    </div>
  );
}

function MessagesTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-lg mb-4">Recent Messages</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">SJ</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="font-medium">Sarah Johnson</p>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-600">Hi! I completed today's workout but struggled with the last set. Any tips?</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">MC</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="font-medium">Mike Chen</p>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <p className="text-sm text-gray-600">Thanks for the updated meal plan! Really appreciate the variety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Client Progress Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Progress Chart Placeholder</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Program Effectiveness</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weight Loss Program</span>
              <span className="font-medium text-green-600">92% success rate</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Strength Training</span>
              <span className="font-medium text-green-600">88% success rate</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Marathon Training</span>
              <span className="font-medium text-yellow-600">75% success rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
