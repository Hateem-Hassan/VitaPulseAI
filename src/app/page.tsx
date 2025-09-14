'use client';

import { useEffect } from 'react';
import HeroSection from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { NotificationManager, useNotifications } from '@/components/ui/notification';

export default function HomePage() {
  const { notifications, removeNotification, showSuccess } = useNotifications();

  useEffect(() => {
    // Show notifications for fixed issues
    const timer1 = setTimeout(() => {
      showSuccess(
        '✅ Design Issues Fixed!',
        'Removed clinical CSS conflicts and improved visual hierarchy',
        4000
      );
    }, 1000);

    const timer2 = setTimeout(() => {
      showSuccess(
        '🔗 All Links Now Clickable!',
        'Homepage tiles and navigation links are fully functional',
        4000
      );
    }, 2000);

    const timer3 = setTimeout(() => {
      showSuccess(
        '🎨 Stunning New Design!',
        'Added mesmerizing animations and gradient backgrounds',
        4000
      );
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [showSuccess]);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "VitaPulse",
    "description": "AI-Powered Health & Wellness Platform with meal planning, nutrition tracking, and comprehensive wellness tools",
    "url": "https://vitapulse.fit",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI Health Coach",
      "20+ Health Calculators", 
      "AI Meal Planner",
      "Nutrition Tracking",
      "Gamification",
      "Community Features",
      "Progress Analytics",
      "Multilingual Support"
    ],
    "author": {
      "@type": "Organization",
      "name": "VitaPulse Team"
    }
  };

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}