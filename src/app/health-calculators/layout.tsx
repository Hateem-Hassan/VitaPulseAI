import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Calculators - VitaPulse',
  description: 'Comprehensive health calculators including BMI, BMR, TDEE, body fat, and more. Get accurate health metrics and personalized insights.',
  keywords: [
    'BMI calculator',
    'BMR calculator',
    'TDEE calculator',
    'body fat calculator',
    'health calculators',
    'fitness calculators',
    'nutrition calculators'
  ],
  openGraph: {
    title: 'Health Calculators - VitaPulse',
    description: 'Comprehensive health calculators for accurate health metrics and personalized insights.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Health Calculators - VitaPulse',
    description: 'Comprehensive health calculators for accurate health metrics.',
  },
};

export default function HealthCalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
