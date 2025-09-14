import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sleep Needs Calculator | VitaPulse AI',
  description: 'Calculate your optimal sleep duration based on age, lifestyle, and health factors. Get personalized sleep recommendations to improve your rest and recovery.',
  keywords: ['sleep calculator', 'sleep needs', 'sleep duration', 'sleep health', 'rest calculator', 'sleep optimization'],
  openGraph: {
    title: 'Sleep Needs Calculator | VitaPulse AI',
    description: 'Calculate your optimal sleep duration based on age, lifestyle, and health factors.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sleep Needs Calculator | VitaPulse AI',
    description: 'Calculate your optimal sleep duration based on age, lifestyle, and health factors.',
  },
}

export default function SleepNeedsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}