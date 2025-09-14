'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  Quote,
  Heart,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    avatar: '👩‍💼',
    rating: 5,
    content: 'VitaPulse has completely transformed my approach to health and nutrition. The AI meal planning is incredibly accurate and the community support is amazing!',
    results: 'Lost 25 lbs in 3 months',
    icon: Target,
    color: 'text-green-500',
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    avatar: '👨‍💻',
    rating: 5,
    content: 'As someone who works long hours, VitaPulse has been a game-changer. The smart food logging and wearable integration make it so easy to stay on track.',
    results: 'Improved energy levels by 40%',
    icon: Zap,
    color: 'text-blue-500',
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Nutritionist',
    avatar: '👩‍⚕️',
    rating: 5,
    content: 'I recommend VitaPulse to all my clients. The health calculators are incredibly accurate and the AI recommendations are evidence-based. It\'s like having a personal health coach.',
    results: 'Helped 200+ clients achieve goals',
    icon: Heart,
    color: 'text-red-500',
  },
  {
    name: 'James Wilson',
    role: 'Personal Trainer',
    avatar: '👨‍🏋️',
    rating: 5,
    content: 'The analytics and progress tracking features are outstanding. I can see exactly how my clients are progressing and adjust their plans accordingly.',
    results: 'Increased client retention by 60%',
    icon: TrendingUp,
    color: 'text-purple-500',
  },
  {
    name: 'Lisa Park',
    role: 'Busy Mom',
    avatar: '👩‍👧‍👦',
    rating: 5,
    content: 'VitaPulse makes healthy eating so much easier for my family. The meal planning takes into account everyone\'s preferences and dietary restrictions.',
    results: 'Family health improved significantly',
    icon: Heart,
    color: 'text-pink-500',
  },
  {
    name: 'David Thompson',
    role: 'Retiree',
    avatar: '👨‍🦳',
    rating: 5,
    content: 'At 65, I thought it was too late to change my health habits. VitaPulse proved me wrong! The gentle approach and community support made all the difference.',
    results: 'Reversed pre-diabetes',
    icon: Target,
    color: 'text-orange-500',
  },
];

const stats = [
  { label: 'Happy Users', value: '50K+', icon: Heart },
  { label: 'Meals Planned', value: '1M+', icon: Target },
  { label: 'Success Rate', value: '95%', icon: TrendingUp },
  { label: 'Countries', value: '50+', icon: Star },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
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
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their health journey with VitaPulse
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="flex justify-start mb-4">
                    <Quote className="w-8 h-8 text-muted-foreground/50" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Results */}
                  <div className="flex items-center space-x-2 mb-4 p-3 rounded-lg bg-gradient-to-r from-success-50 to-primary-50 dark:from-success-950 dark:to-primary-950">
                    <testimonial.icon className={`w-5 h-5 ${testimonial.color}`} />
                    <span className="text-sm font-medium text-foreground">
                      {testimonial.results}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Start your health transformation today with a 14-day free trial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200">
                View More Stories
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
