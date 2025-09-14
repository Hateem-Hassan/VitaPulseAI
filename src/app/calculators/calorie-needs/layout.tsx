import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calorie Needs Calculator | VitaPulse',
  description: 'Calculate your daily calorie needs based on your goals, activity level, and personal metrics. Get personalized recommendations for weight loss, maintenance, or muscle gain.',
  keywords: 'calorie calculator, daily calorie needs, weight loss calories, calorie requirements, nutrition calculator, diet planning',
  openGraph: {
    title: 'Calorie Needs Calculator | VitaPulse',
    description: 'Calculate your daily calorie needs based on your goals, activity level, and personal metrics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calorie Needs Calculator | VitaPulse',
    description: 'Calculate your daily calorie needs based on your goals, activity level, and personal metrics.',
  },
};

export default function CalorieNeedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}