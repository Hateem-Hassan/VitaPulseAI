'use client';

import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  language: string;
  avatar: string;
  profession: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "VitaPulse has completely transformed my approach to health and wellness. The AI-powered recommendations are incredibly accurate and personalized. I've lost 15 pounds and feel more energetic than ever!",
    language: "English",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20smiling%20woman%20with%20blonde%20hair%20in%20business%20attire%20against%20clean%20background&image_size=square",
    profession: "Marketing Manager"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    location: "Madrid, España",
    rating: 5,
    text: "¡Increíble plataforma! Los calculadores de salud son muy precisos y la función de seguimiento de comidas me ha ayudado a mantener una dieta equilibrada. Recomiendo VitaPulse a todos mis amigos.",
    language: "Español",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20smiling%20hispanic%20man%20with%20dark%20hair%20in%20casual%20shirt%20against%20clean%20background&image_size=square",
    profession: "Fitness Trainer"
  },
  {
    id: 3,
    name: "Marie Dubois",
    location: "Paris, France",
    rating: 5,
    text: "Une application fantastique ! J'adore les fonctionnalités de gamification qui me motivent à atteindre mes objectifs de santé. L'interface est intuitive et les conseils nutritionnels sont excellents.",
    language: "Français",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20smiling%20french%20woman%20with%20brown%20hair%20in%20elegant%20blouse%20against%20clean%20background&image_size=square",
    profession: "Nutritionist"
  },
  {
    id: 4,
    name: "Hans Mueller",
    location: "Berlin, Deutschland",
    rating: 5,
    text: "VitaPulse ist die beste Gesundheits-App, die ich je verwendet habe. Die medizinischen Rechner sind sehr genau und die KI-gestützten Empfehlungen haben mir geholfen, meine Fitnessziele zu erreichen.",
    language: "Deutsch",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20smiling%20german%20man%20with%20light%20hair%20wearing%20glasses%20in%20button%20shirt%20against%20clean%20background&image_size=square",
    profession: "Software Engineer"
  },
  {
    id: 5,
    name: "田中健太",
    location: "Tokyo, Japan",
    rating: 5,
    text: "VitaPulseは素晴らしいアプリです！健康計算機能が非常に正確で、食事記録機能も使いやすいです。AIコーチからのアドバイスのおかげで、健康的な生活習慣を身につけることができました。",
    language: "日本語",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20smiling%20japanese%20man%20with%20black%20hair%20in%20business%20suit%20against%20clean%20background&image_size=square",
    profession: "Doctor"
  },
  {
    id: 6,
    name: "أحمد العلي",
    location: "Dubai, UAE",
    rating: 5,
    text: "تطبيق رائع جداً! لقد ساعدني VitaPulse في تحسين صحتي بشكل كبير. الحاسبات الطبية دقيقة جداً ونظام تتبع الطعام سهل الاستخدام. أنصح به بشدة لكل من يريد تحسين نمط حياته.",
    language: "العربية",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20smiling%20middle%20eastern%20man%20with%20dark%20hair%20and%20beard%20in%20white%20shirt%20against%20clean%20background&image_size=square",
    profession: "Business Consultant"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Users Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their health journey with VitaPulse
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={testimonial.avatar}
                    alt={`${testimonial.name} profile`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.profession}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Language Badge */}
              <div className="mt-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {testimonial.language}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-300">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">4.9</div>
            <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
            <div className="text-gray-600 dark:text-gray-300">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
}