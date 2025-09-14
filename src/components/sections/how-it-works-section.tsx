'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  Brain, 
  Target, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Sign Up & Profile Setup',
    description: 'Create your account and complete your health profile with goals, preferences, and dietary restrictions.',
    icon: UserPlus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    number: '02',
    title: 'AI Analysis & Planning',
    description: 'Our advanced AI analyzes your profile and creates personalized meal plans, workout routines, and health recommendations.',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    number: '03',
    title: 'Track & Monitor',
    description: 'Log your meals, exercises, and health metrics. Our AI continuously learns and adapts to your progress.',
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    number: '04',
    title: 'Achieve Your Goals',
    description: 'Watch your health improve with personalized insights, community support, and gamified challenges.',
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
];

const benefits = [
  'Personalized AI recommendations',
  'Real-time health tracking',
  'Community support and challenges',
  'Professional health calculators',
  'Wearable device integration',
  'Multilingual support',
  'Mobile-first design',
  'HIPAA-compliant security',
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How VitaPulse Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in minutes and see results in days. Our simple 4-step process 
            makes it easy to transform your health journey.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className={`${step.bgColor} ${step.borderColor} border hover:shadow-lg transition-all duration-300 h-full`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl ${step.bgColor} flex items-center justify-center`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Step {step.number}
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {step.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Why Choose VitaPulse?
            </h3>
            <p className="text-muted-foreground">
              Experience the difference with our comprehensive health and wellness platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 p-3 rounded-lg bg-white/50 dark:bg-black/20"
              >
                <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
