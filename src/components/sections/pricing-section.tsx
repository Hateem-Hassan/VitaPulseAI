'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Star,
  Heart,
  Zap,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with basic health tracking',
    icon: Heart,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
    borderColor: 'border-gray-200 dark:border-gray-800',
    features: [
      'Basic meal logging',
      'Simple health calculators',
      'Basic AI recommendations',
      'Community access',
      'Mobile app access',
      'Email support',
    ],
    limitations: [
      'Limited AI meal plans',
      'Basic analytics',
      'No wearable integration',
      'No advanced features',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    description: 'Most popular for serious health enthusiasts',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    features: [
      'Unlimited AI meal plans',
      'Advanced health calculators',
      'Wearable device integration',
      'Detailed analytics & insights',
      'Priority AI recommendations',
      'Recipe generation',
      'Shopping list creation',
      'Progress tracking',
      'Priority support',
      'Export data',
    ],
    limitations: [],
    cta: 'Start Premium Trial',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: 'per month',
    description: 'For health professionals and power users',
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
    features: [
      'Everything in Premium',
      'Advanced AI models (GPT-4, Claude)',
      'Custom health calculators',
      'API access',
      'White-label options',
      'Advanced analytics dashboard',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support',
      'Advanced security features',
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50 dark:from-primary-950 dark:via-background dark:to-secondary-950">
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your health journey. All plans include our core features 
            with no hidden fees or long-term contracts.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`${plan.bgColor} ${plan.borderColor} border hover:shadow-xl transition-all duration-300 h-full ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${plan.bgColor} flex items-center justify-center`}>
                    <plan.icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-success-500 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-center space-x-2">
                            <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
                        : 'bg-foreground hover:bg-foreground/90'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                Is there a free trial?
              </h4>
              <p className="text-muted-foreground">
                Yes, all paid plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and Apple Pay for your convenience.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
