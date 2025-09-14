import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stress Level Estimator | VitaPulse AI',
  description: 'Assess your stress levels with our comprehensive stress estimator. Get personalized recommendations for stress management and mental wellness.',
  keywords: 'stress calculator, stress assessment, mental health, wellness, stress management, anxiety, burnout, work stress',
  openGraph: {
    title: 'Stress Level Estimator | VitaPulse AI',
    description: 'Assess your stress levels with our comprehensive stress estimator. Get personalized recommendations for stress management and mental wellness.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stress Level Estimator | VitaPulse AI',
    description: 'Assess your stress levels with our comprehensive stress estimator. Get personalized recommendations for stress management and mental wellness.',
  },
}

export default function StressEstimatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}