import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Step Goal Calculator | VitaPulse',
  description: 'Calculate your personalized daily step goal based on age, fitness level, and health objectives. Set achievable walking targets for better health.',
  keywords: 'step goal calculator, daily steps, walking goal, fitness tracker, step counter, health goals, physical activity',
  openGraph: {
    title: 'Step Goal Calculator | VitaPulse',
    description: 'Calculate your personalized daily step goal based on age, fitness level, and health objectives. Set achievable walking targets for better health.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Step Goal Calculator | VitaPulse',
    description: 'Calculate your personalized daily step goal based on age, fitness level, and health objectives. Set achievable walking targets for better health.',
  },
}

export default function StepGoalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}