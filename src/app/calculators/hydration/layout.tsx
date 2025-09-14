import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hydration Calculator | VitaPulse',
  description: 'Calculate your daily water intake needs based on your weight, activity level, and climate. Stay properly hydrated for optimal health and performance.',
  keywords: 'hydration calculator, water intake, daily water needs, hydration requirements, water consumption, health calculator',
  openGraph: {
    title: 'Hydration Calculator | VitaPulse',
    description: 'Calculate your daily water intake needs based on your weight, activity level, and climate.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hydration Calculator | VitaPulse',
    description: 'Calculate your daily water intake needs based on your weight, activity level, and climate.',
  },
};

export default function HydrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}