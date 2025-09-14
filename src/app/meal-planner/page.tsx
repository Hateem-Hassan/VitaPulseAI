'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MealPlanner from '@/components/meal-planner/meal-planner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';

export default function MealPlannerPage() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access the meal planner.</p>
        </div>
      </div>
    );
  }

  const userProfile = {
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    healthGoals: ['weight_loss', 'muscle_gain'],
    dietaryRestrictions: ['gluten_free'],
    preferredCuisines: ['mediterranean', 'asian'],
    calorieTarget: 2000,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <main className="p-6">
          <MealPlanner userProfile={userProfile} />
        </main>
      </div>
    </div>
  );
}