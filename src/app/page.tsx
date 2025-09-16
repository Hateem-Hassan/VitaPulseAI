'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Brain,
  Utensils,
  Calculator,
  Camera,
  BookOpen,
  Users,
  Globe,
  Shield,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Activity,
  Target,
  TrendingUp,
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t, language } = useI18n();

  const features = [
    {
      icon: Brain,
      title: 'AI Symptom Checker',
      description: 'Get instant health insights with our culturally-aware AI that understands your background and provides personalized recommendations.',
      href: '/health/symptom-checker',
      color: 'bg-blue-500',
      badge: 'AI Powered',
    },
    {
      icon: Utensils,
      title: 'Smart Meal Planner',
      description: 'Create personalized meal plans with Halal compliance, cultural dietary preferences, and nutritional optimization.',
      href: '/health/meal-planner',
      color: 'bg-green-500',
      badge: 'Cultural Aware',
    },
    {
      icon: Calculator,
      title: 'Health Calculators',
      description: 'Comprehensive health metrics including BMI, TDEE, body fat percentage, and specialized cultural health assessments.',
      href: '/health/calculators',
      color: 'bg-purple-500',
      badge: 'Comprehensive',
    },
    {
      icon: Camera,
      title: 'Food Logger',
      description: 'Track your nutrition with barcode scanning, meal logging, and intelligent food recognition technology.',
      href: '/food-logger',
      color: 'bg-orange-500',
      badge: 'Smart Tracking',
    },
    {
      icon: BookOpen,
      title: 'Health Education',
      description: 'Access culturally-sensitive health resources, medical information, and wellness guides in multiple languages.',
      href: '/education',
      color: 'bg-indigo-500',
      badge: 'Multi-Language',
    },
    {
      icon: Activity,
      title: 'Health Dashboard',
      description: 'Comprehensive health tracking with analytics, insights, and personalized recommendations for your wellness journey.',
      href: '/dashboard',
      color: 'bg-red-500',
      badge: 'Analytics',
    },
  ];

  const benefits = [
    {
      icon: Globe,
      title: '8 Languages Supported',
      description: 'Full support for English, Spanish, French, German, Arabic (RTL), Japanese, Chinese, and Hindi.',
    },
    {
      icon: Shield,
      title: 'Cultural Sensitivity',
      description: 'AI trained to understand and respect diverse cultural health practices and dietary requirements.',
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Instant health analysis and recommendations powered by advanced AI and machine learning.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with others who share your cultural background and health goals.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Health Assessments', value: '1M+', icon: Activity },
    { label: 'Cultural Backgrounds', value: '100+', icon: Globe },
    { label: 'Languages Supported', value: '8', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">VitaPulse AI</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline">Profile</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="h-4 w-4 mr-1" />
              AI-Powered Health Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Intelligent
              <span className="text-primary block">Health Companion</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience personalized healthcare with cultural sensitivity, multi-language support, 
              and AI-powered insights that understand your unique background and health needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Your Health Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/health/symptom-checker">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Try Symptom Checker
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Health Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for intelligent health management, 
              designed with cultural awareness and powered by AI.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {feature.description}
                    </CardDescription>
                    <Link href={feature.href}>
                      <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Explore Feature
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose VitaPulse AI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for diversity, powered by intelligence, designed for your unique health journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Health Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who trust VitaPulse AI for culturally-aware, 
              intelligent health management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Access Your Dashboard
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Start Free Today
                      <Star className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/health/symptom-checker">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                      Try Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">VitaPulse AI</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Your intelligent health companion, designed with cultural sensitivity 
                and powered by advanced AI to support your unique wellness journey.
              </p>
              <div className="flex space-x-2">
                <Badge variant="outline">GDPR Compliant</Badge>
                <Badge variant="outline">HIPAA Secure</Badge>
                <Badge variant="outline">ISO 27001</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Health Tools</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/health/symptom-checker" className="hover:text-primary transition-colors">Symptom Checker</Link></li>
                <li><Link href="/health/meal-planner" className="hover:text-primary transition-colors">Meal Planner</Link></li>
                <li><Link href="/health/calculators" className="hover:text-primary transition-colors">Health Calculators</Link></li>
                <li><Link href="/food-logger" className="hover:text-primary transition-colors">Food Logger</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/education" className="hover:text-primary transition-colors">Health Education</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
                <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VitaPulse AI. All rights reserved. Built with ❤️ for global health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;