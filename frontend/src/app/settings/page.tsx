'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings as SettingsIcon, Database, Download, Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <DataManagementSection />
          <AppPreferencesSection />
          <DangerZoneSection />
        </div>
      </div>
    </DashboardLayout>
  );
}

function DataManagementSection() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Database className="h-5 w-5 mr-2" />
        Data Management
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Export Data</h3>
            <p className="text-sm text-gray-600">Download all your health and fitness data</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Data Backup</h3>
            <p className="text-sm text-gray-600">Last backup: December 28, 2024</p>
          </div>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Backup Now
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Storage Usage</h3>
            <p className="text-sm text-gray-600">Using 2.3 GB of 5 GB available</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '46%' }}></div>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

function AppPreferencesSection() {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoSync: true,
    offlineMode: false,
    betaFeatures: false,
    analyticsSharing: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <SettingsIcon className="h-5 w-5 mr-2" />
        App Preferences
      </h2>
      
      <div className="space-y-4">
        {Object.entries({
          darkMode: { title: 'Dark Mode', desc: 'Switch to dark theme for better nighttime viewing' },
          autoSync: { title: 'Auto Sync', desc: 'Automatically sync data across all your devices' },
          offlineMode: { title: 'Offline Mode', desc: 'Download content for offline access' },
          betaFeatures: { title: 'Beta Features', desc: 'Get early access to new features' },
          analyticsSharing: { title: 'Analytics Sharing', desc: 'Help improve the app by sharing usage data' },
        }).map(([key, { title, desc }]) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences[key as keyof typeof preferences]}
                onChange={() => handleToggle(key as keyof typeof preferences)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function DangerZoneSection() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-red-200 p-6">
      <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Danger Zone
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <h3 className="font-medium text-red-900">Clear All Data</h3>
            <p className="text-sm text-red-700">Remove all your health and fitness data permanently</p>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
            <Trash2 className="h-4 w-4" />
            <span>Clear Data</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <h3 className="font-medium text-red-900">Delete Account</h3>
            <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
          </div>
          <button 
            onClick={() => setShowConfirmation(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
