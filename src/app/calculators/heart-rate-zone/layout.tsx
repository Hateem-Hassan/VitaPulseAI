import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Heart Rate Zone Calculator | VitaPulse AI',
  description: 'Calculate your optimal heart rate zones for different training intensities. Maximize your workout efficiency with personalized heart rate targets.',
  keywords: ['heart rate zones', 'training zones', 'cardio zones', 'max heart rate', 'fitness training', 'workout intensity'],
  openGraph: {
    title: 'Heart Rate Zone Calculator | VitaPulse AI',
    description: 'Calculate your optimal heart rate zones for different training intensities.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heart Rate Zone Calculator | VitaPulse AI',
    description: 'Calculate your optimal heart rate zones for different training intensities.',
  },
}

export default function HeartRateZoneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}