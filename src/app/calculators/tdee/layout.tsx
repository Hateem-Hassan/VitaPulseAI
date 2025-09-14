import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TDEE Calculator - VitaPulse',
  description: 'Calculate your Total Daily Energy Expenditure (TDEE) with our accurate calculator. Get personalized calorie recommendations based on your activity level.',
  keywords: [
    'TDEE calculator',
    'total daily energy expenditure',
    'calorie calculator',
    'BMR calculator',
    'metabolism calculator',
    'daily calories'
  ],
  openGraph: {
    title: 'TDEE Calculator - VitaPulse',
    description: 'Calculate your Total Daily Energy Expenditure with personalized calorie recommendations.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'TDEE Calculator - VitaPulse',
    description: 'Calculate your TDEE with personalized calorie recommendations.',
  },
};

export default function TDEECalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}