import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Progress Tracker | VitaPulse AI',
  description: 'Track and analyze your fitness progress with comprehensive metrics. Monitor strength gains, endurance improvements, and body composition changes.',
  keywords: 'fitness tracker, progress monitoring, workout analytics, strength gains, endurance tracking, body composition, fitness metrics',
  openGraph: {
    title: 'Fitness Progress Tracker | VitaPulse AI',
    description: 'Track and analyze your fitness progress with comprehensive metrics. Monitor strength gains, endurance improvements, and body composition changes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitness Progress Tracker | VitaPulse AI',
    description: 'Track and analyze your fitness progress with comprehensive metrics. Monitor strength gains, endurance improvements, and body composition changes.',
  },
}

export default function FitnessProgressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}