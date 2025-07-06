'use client';

import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Brain,
  Apple,
  Dumbbell,
  Clock,
  Award,
  Globe
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">AI-Powered Health Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Transform Your
              <span className="block gradient-text">Health Journey</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience personalized nutrition planning, adaptive fitness routines, and intelligent progress tracking. 
              All powered by cutting-edge AI technology designed for real results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/auth/register"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-outline text-lg px-8 py-4 flex items-center justify-center group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
          
          {/* Hero Cards */}
          <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="card card-hover p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Nutrition</h3>
                <p className="text-gray-600 leading-relaxed">Personalized meal plans tailored to your goals, preferences, and dietary needs.</p>
              </div>
              
              <div className="card card-hover p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Fitness</h3>
                <p className="text-gray-600 leading-relaxed">Adaptive workout plans that evolve with your progress and fitness level.</p>
              </div>
              
              <div className="card card-hover p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">Comprehensive analytics and insights to monitor your health journey.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for a
              <span className="block gradient-text">Healthier You</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform combines cutting-edge AI with proven health science 
              to deliver personalized experiences that actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Meal Planning",
                description: "Generate personalized nutrition plans based on your goals, preferences, and cultural background.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Target,
                title: "Adaptive Fitness Programs",
                description: "Workouts that adjust to your fitness level, available equipment, and physical condition.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: TrendingUp,
                title: "Smart Progress Tracking",
                description: "Comprehensive analytics and insights to monitor your health journey in real-time.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Users,
                title: "Expert Trainer Support",
                description: "Connect with certified trainers for personalized guidance and motivation.",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: Shield,
                title: "Privacy & Security",
                description: "Your health data is encrypted and secure, with full control over privacy settings.",
                color: "from-red-500 to-red-600"
              },
              {
                icon: Zap,
                title: "Instant Recommendations",
                description: "Get immediate suggestions for meals, exercises, and lifestyle improvements.",
                color: "from-yellow-500 to-yellow-600"
              }
            ].map((feature, index) => (
              <div key={index} className="card card-hover p-8 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How AI Health
              <span className="block gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Getting started is simple. Our AI learns about you and creates a personalized health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Complete Your Profile",
                description: "Tell us about your goals, preferences, health history, and lifestyle.",
                icon: Users
              },
              {
                step: "02",
                title: "Get AI Recommendations",
                description: "Our AI creates personalized nutrition and fitness plans just for you.",
                icon: Brain
              },
              {
                step: "03",
                title: "Track & Improve",
                description: "Monitor your progress and let AI adapt your plans for optimal results.",
                icon: TrendingUp
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <step.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-primary">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users
              <span className="block gradient-text">Say</span>
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of people who have transformed their health with AI Health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fitness Enthusiast",
                content: "The AI nutrition planning is incredible! I've never felt better and finally achieved my weight loss goals.",
                rating: 5,
                avatar: "SJ"
              },
              {
                name: "Michael Chen",
                role: "Busy Professional",
                content: "The adaptive workout plans fit perfectly into my schedule. I've gained strength and confidence.",
                rating: 5,
                avatar: "MC"
              },
              {
                name: "Emily Rodriguez",
                role: "Health Coach",
                content: "As a trainer, I love how the platform helps my clients stay motivated and track their progress.",
                rating: 5,
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card card-hover p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform
            <span className="block">Your Health?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of users who have already started their journey to better health with AI-powered guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
