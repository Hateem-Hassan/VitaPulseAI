'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Stethoscope, Brain, Heart, Users, Award } from 'lucide-react';

export default function MedEdPage() {
  const medicalTopics = [
    {
      id: 1,
      title: "Cardiovascular Health",
      description: "Learn about heart health, blood pressure, and cardiovascular diseases.",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      lessons: 12,
      duration: "2 hours"
    },
    {
      id: 2,
      title: "Nutrition & Metabolism",
      description: "Understanding macronutrients, metabolism, and dietary guidelines.",
      icon: Brain,
      color: "text-green-500",
      bgColor: "bg-green-50",
      lessons: 15,
      duration: "3 hours"
    },
    {
      id: 3,
      title: "Exercise Physiology",
      description: "How exercise affects the body and optimal training principles.",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      lessons: 10,
      duration: "2.5 hours"
    },
    {
      id: 4,
      title: "Medical Diagnostics",
      description: "Understanding common medical tests and diagnostic procedures.",
      icon: Stethoscope,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      lessons: 18,
      duration: "4 hours"
    },
    {
      id: 5,
      title: "Health Assessment",
      description: "Learn to evaluate health metrics and interpret results.",
      icon: Award,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      lessons: 8,
      duration: "1.5 hours"
    },
    {
      id: 6,
      title: "Medical Literature",
      description: "How to read and interpret medical research and studies.",
      icon: BookOpen,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      lessons: 14,
      duration: "3.5 hours"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Medical Education
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enhance your medical knowledge with our comprehensive educational resources and interactive learning modules.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">77</div>
            <div className="text-gray-600 dark:text-gray-300">Total Lessons</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">16.5</div>
            <div className="text-gray-600 dark:text-gray-300">Hours of Content</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
            <div className="text-gray-600 dark:text-gray-300">Topic Areas</div>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicalTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card key={topic.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className={`w-12 h-12 ${topic.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 ${topic.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {topic.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {topic.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{topic.lessons} lessons</span>
                  <span>{topic.duration}</span>
                </div>
                <Button className="w-full">
                  Start Learning
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              More Content Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're continuously adding new medical education content. Stay tuned for updates!
            </p>
            <Button variant="outline">
              Get Notified
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}