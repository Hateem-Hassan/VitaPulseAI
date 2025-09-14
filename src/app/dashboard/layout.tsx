import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - VitaPulse',
  description: 'Your personal health dashboard with AI-powered insights, meal tracking, and wellness analytics.',
  keywords: [
    'health dashboard',
    'wellness tracking',
    'AI health insights',
    'meal planning',
    'fitness tracking',
    'health analytics'
  ],
  openGraph: {
    title: 'Dashboard - VitaPulse',
    description: 'Your personal health dashboard with AI-powered insights and wellness tracking.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dashboard - VitaPulse',
    description: 'Your personal health dashboard with AI-powered insights.',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
