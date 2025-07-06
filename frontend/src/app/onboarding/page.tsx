'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingData {
  personalInfo: {
    age: string;
    gender: string;
    height: string;
    weight: string;
    activityLevel: string;
  };
  goals: {
    primaryGoal: string;
    targetWeight: string;
    timeline: string;
    motivation: string[];
  };
  preferences: {
    dietaryRestrictions: string[];
    allergies: string;
    culturalPreferences: string;
    workoutTypes: string[];
    equipmentAccess: string[];
  };
  health: {
    medicalConditions: string[];
    injuries: string;
    medications: string;
    sleepHours: string;
    stressLevel: string;
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {
      age: '',
      gender: '',
      height: '',
      weight: '',
      activityLevel: '',
    },
    goals: {
      primaryGoal: '',
      targetWeight: '',
      timeline: '',
      motivation: [],
    },
    preferences: {
      dietaryRestrictions: [],
      allergies: '',
      culturalPreferences: '',
      workoutTypes: [],
      equipmentAccess: [],
    },
    health: {
      medicalConditions: [],
      injuries: '',
      medications: '',
      sleepHours: '',
      stressLevel: '',
    },
  });

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information about you' },
    { number: 2, title: 'Your Goals', description: 'What do you want to achieve?' },
    { number: 3, title: 'Preferences', description: 'Your dietary and fitness preferences' },
    { number: 4, title: 'Health Info', description: 'Medical history and current health' },
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // TODO: Send data to backend
    console.log('Onboarding data:', data);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AI Health</h1>
          <p className="text-gray-600">Let's personalize your health and fitness journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.number <= currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-300'
                }`}>
                  {step.number < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-20 mx-4 ${
                    step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center" style={{ width: '200px' }}>
                <p className={`text-sm font-medium ${
                  step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          {currentStep === 1 && <PersonalInfoStep data={data} setData={setData} />}
          {currentStep === 2 && <GoalsStep data={data} setData={setData} />}
          {currentStep === 3 && <PreferencesStep data={data} setData={setData} />}
          {currentStep === 4 && <HealthInfoStep data={data} setData={setData} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoStep({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  const updatePersonalInfo = (field: string, value: string) => {
    setData({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">This information helps us create personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={data.personalInfo.age}
            onChange={(e) => updatePersonalInfo('age', e.target.value)}
            placeholder="Enter your age"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={data.personalInfo.gender}
            onChange={(e) => updatePersonalInfo('gender', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
          <input
            type="number"
            value={data.personalInfo.height}
            onChange={(e) => updatePersonalInfo('height', e.target.value)}
            placeholder="Enter your height"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (lbs)</label>
          <input
            type="number"
            value={data.personalInfo.weight}
            onChange={(e) => updatePersonalInfo('weight', e.target.value)}
            placeholder="Enter your weight"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Current Activity Level</label>
        <div className="space-y-3">
          {[
            { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, little to no exercise' },
            { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
            { value: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
            { value: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
            { value: 'extra_active', label: 'Extremely Active', desc: 'Physical job + exercise' },
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="activityLevel"
                value={option.value}
                checked={data.personalInfo.activityLevel === option.value}
                onChange={(e) => updatePersonalInfo('activityLevel', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalsStep({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  const updateGoals = (field: string, value: string | string[]) => {
    setData({
      ...data,
      goals: { ...data.goals, [field]: value }
    });
  };

  const toggleMotivation = (motivation: string) => {
    const current = data.goals.motivation;
    const updated = current.includes(motivation)
      ? current.filter(m => m !== motivation)
      : [...current, motivation];
    updateGoals('motivation', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your goals?</h2>
        <p className="text-gray-600">Help us understand what you want to achieve</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Primary Goal</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Lose weight',
            'Gain muscle',
            'Improve fitness',
            'Increase strength',
            'Better nutrition',
            'Stress management',
          ].map((goal) => (
            <label key={goal} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="primaryGoal"
                value={goal}
                checked={data.goals.primaryGoal === goal}
                onChange={(e) => updateGoals('primaryGoal', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 font-medium text-gray-900">{goal}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (lbs)</label>
          <input
            type="number"
            value={data.goals.targetWeight}
            onChange={(e) => updateGoals('targetWeight', e.target.value)}
            placeholder="Enter target weight"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
          <select
            value={data.goals.timeline}
            onChange={(e) => updateGoals('timeline', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select timeline</option>
            <option value="1_month">1 month</option>
            <option value="3_months">3 months</option>
            <option value="6_months">6 months</option>
            <option value="1_year">1 year</option>
            <option value="long_term">Long term</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What motivates you? (Select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Health improvement',
            'Better appearance',
            'Increased energy',
            'Stress relief',
            'Social activities',
            'Competitions',
          ].map((motivation) => (
            <label key={motivation} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.goals.motivation.includes(motivation)}
                onChange={() => toggleMotivation(motivation)}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{motivation}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreferencesStep({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  const updatePreferences = (field: string, value: string | string[]) => {
    setData({
      ...data,
      preferences: { ...data.preferences, [field]: value }
    });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const current = data.preferences[field as keyof typeof data.preferences] as string[];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updatePreferences(field, updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your preferences</h2>
        <p className="text-gray-600">Tell us about your dietary and fitness preferences</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Dietary Restrictions (Select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Vegetarian',
            'Vegan',
            'Gluten-free',
            'Dairy-free',
            'Halal',
            'Kosher',
          ].map((restriction) => (
            <label key={restriction} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.preferences.dietaryRestrictions.includes(restriction)}
                onChange={() => toggleArrayItem('dietaryRestrictions', restriction)}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{restriction}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Allergies</label>
          <textarea
            value={data.preferences.allergies}
            onChange={(e) => updatePreferences('allergies', e.target.value)}
            placeholder="List any food allergies or intolerances"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Food Preferences</label>
          <input
            type="text"
            value={data.preferences.culturalPreferences}
            onChange={(e) => updatePreferences('culturalPreferences', e.target.value)}
            placeholder="e.g., Mediterranean, Asian, Middle Eastern"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Workout Types</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Cardio',
            'Strength training',
            'Yoga',
            'HIIT',
            'Swimming',
            'Running',
          ].map((workout) => (
            <label key={workout} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.preferences.workoutTypes.includes(workout)}
                onChange={() => toggleArrayItem('workoutTypes', workout)}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{workout}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Available Equipment</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Gym membership',
            'Home gym',
            'Dumbbells',
            'Resistance bands',
            'Yoga mat',
            'Bodyweight only',
          ].map((equipment) => (
            <label key={equipment} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.preferences.equipmentAccess.includes(equipment)}
                onChange={() => toggleArrayItem('equipmentAccess', equipment)}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{equipment}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function HealthInfoStep({ data, setData }: { data: OnboardingData; setData: (data: OnboardingData) => void }) {
  const updateHealth = (field: string, value: string | string[]) => {
    setData({
      ...data,
      health: { ...data.health, [field]: value }
    });
  };

  const toggleCondition = (condition: string) => {
    const current = data.health.medicalConditions;
    const updated = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition];
    updateHealth('medicalConditions', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health information</h2>
        <p className="text-gray-600">This helps us create safe and effective recommendations</p>
        <p className="text-sm text-gray-500 mt-1">All information is kept strictly confidential</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Do you have any medical conditions? (Select all that apply)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Diabetes',
            'High blood pressure',
            'Heart disease',
            'Arthritis',
            'Asthma',
            'None',
          ].map((condition) => (
            <label key={condition} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.health.medicalConditions.includes(condition)}
                onChange={() => toggleCondition(condition)}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Injuries or Limitations</label>
          <textarea
            value={data.health.injuries}
            onChange={(e) => updateHealth('injuries', e.target.value)}
            placeholder="Any current injuries, mobility issues, or exercise limitations"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
          <textarea
            value={data.health.medications}
            onChange={(e) => updateHealth('medications', e.target.value)}
            placeholder="List any medications you're currently taking (optional)"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Average Sleep Hours</label>
          <select
            value={data.health.sleepHours}
            onChange={(e) => updateHealth('sleepHours', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select sleep hours</option>
            <option value="less_than_5">Less than 5 hours</option>
            <option value="5_to_6">5-6 hours</option>
            <option value="6_to_7">6-7 hours</option>
            <option value="7_to_8">7-8 hours</option>
            <option value="8_to_9">8-9 hours</option>
            <option value="more_than_9">More than 9 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
          <select
            value={data.health.stressLevel}
            onChange={(e) => updateHealth('stressLevel', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select stress level</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="very_high">Very High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
