import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Body Fat Calculator | VitaPulse',
  description: 'Calculate your body fat percentage using various methods including Navy, Army, and YMCA formulas. Track your body composition and health metrics.',
  keywords: 'body fat calculator, body fat percentage, body composition, Navy method, Army method, YMCA method, health metrics, fitness tracking',
  openGraph: {
    title: 'Body Fat Calculator | VitaPulse',
    description: 'Calculate your body fat percentage using various methods including Navy, Army, and YMCA formulas. Track your body composition and health metrics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Body Fat Calculator | VitaPulse',
    description: 'Calculate your body fat percentage using various methods including Navy, Army, and YMCA formulas. Track your body composition and health metrics.',
  },
}

export default function BodyFatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}