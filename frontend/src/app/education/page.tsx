'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen, Play, Search, Filter, Clock, Star } from 'lucide-react';

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'favorites', label: 'Favorites', icon: Star },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Education Hub</h1>
            <p className="text-gray-600">AI-curated health and fitness content</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, videos, topics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
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
          {activeTab === 'articles' && <ArticlesTab searchQuery={searchQuery} />}
          {activeTab === 'videos' && <VideosTab searchQuery={searchQuery} />}
          {activeTab === 'favorites' && <FavoritesTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ArticlesTab({ searchQuery }: { searchQuery: string }) {
  const articles = [
    {
      id: 1,
      title: "The Science of Intermittent Fasting: What Research Really Says",
      excerpt: "A comprehensive look at the latest research on intermittent fasting and its effects on metabolism, weight loss, and overall health.",
      category: "Nutrition",
      readTime: "8 min read",
      author: "Dr. Sarah Johnson",
      publishedAt: "2024-12-28",
      image: "/api/placeholder/300/200",
      tags: ["Intermittent Fasting", "Metabolism", "Weight Loss"]
    },
    {
      id: 2,
      title: "Progressive Overload: The Key to Continuous Strength Gains",
      excerpt: "Learn how to properly implement progressive overload in your training to ensure consistent strength and muscle gains over time.",
      category: "Fitness",
      readTime: "6 min read",
      author: "Mike Thompson, CSCS",
      publishedAt: "2024-12-26",
      image: "/api/placeholder/300/200",
      tags: ["Strength Training", "Progressive Overload", "Muscle Building"]
    },
    {
      id: 3,
      title: "Sleep Optimization: Your Secret Weapon for Recovery",
      excerpt: "Discover evidence-based strategies to improve your sleep quality and accelerate recovery from intense training sessions.",
      category: "Recovery",
      readTime: "10 min read",
      author: "Dr. Emily Chen",
      publishedAt: "2024-12-24",
      image: "/api/placeholder/300/200",
      tags: ["Sleep", "Recovery", "Performance"]
    },
    {
      id: 4,
      title: "Micronutrients: The Often Overlooked Foundation of Health",
      excerpt: "Understanding the crucial role of vitamins and minerals in optimal health and athletic performance.",
      category: "Nutrition",
      readTime: "12 min read",
      author: "Dr. Alex Rodriguez",
      publishedAt: "2024-12-22",
      image: "/api/placeholder/300/200",
      tags: ["Micronutrients", "Vitamins", "Health"]
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Featured Article */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center mb-2">
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">Featured</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Complete Guide to Nutrition Timing</h2>
        <p className="text-blue-100 mb-4">
          Master the art of when to eat for optimal performance, recovery, and body composition.
        </p>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
          Read Article
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-4">
        {['All', 'Nutrition', 'Fitness', 'Recovery', 'Mental Health'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50 focus:bg-blue-50 focus:border-blue-300 focus:text-blue-600"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Article Image</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{article.author}</span>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideosTab({ searchQuery }: { searchQuery: string }) {
  const videos = [
    {
      id: 1,
      title: "Perfect Push-Up Form: Common Mistakes to Avoid",
      duration: "5:32",
      category: "Exercise Form",
      views: "12.5K",
      thumbnail: "/api/placeholder/300/200",
      instructor: "Coach Maria Lopez"
    },
    {
      id: 2,
      title: "Meal Prep for Busy Professionals: 5 Quick Recipes",
      duration: "12:45",
      category: "Nutrition",
      views: "8.7K",
      thumbnail: "/api/placeholder/300/200",
      instructor: "Chef David Kim"
    },
    {
      id: 3,
      title: "10-Minute Morning Yoga Flow for Energy",
      duration: "10:15",
      category: "Yoga",
      views: "15.2K",
      thumbnail: "/api/placeholder/300/200",
      instructor: "Sarah Williams"
    },
    {
      id: 4,
      title: "Understanding Macronutrients: Protein, Carbs, and Fats",
      duration: "8:22",
      category: "Nutrition Education",
      views: "6.3K",
      thumbnail: "/api/placeholder/300/200",
      instructor: "Dr. James Martinez"
    }
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Video Categories */}
      <div className="flex space-x-4">
        {['All', 'Exercise Form', 'Nutrition', 'Yoga', 'Cardio', 'Strength'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50 focus:bg-blue-50 focus:border-blue-300 focus:text-blue-600"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                {video.category}
              </span>
              <h3 className="font-semibold text-lg mt-2 mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{video.instructor}</span>
                <span>{video.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesTab() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-600 mb-4">
          Save articles and videos you love by clicking the star icon
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse Content
        </button>
      </div>
    </div>
  );
}
