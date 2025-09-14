import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator - VitaPulse',
  description: 'Calculate your Body Mass Index (BMI) with our accurate BMI calculator. Get instant results, health insights, and personalized recommendations.',
  keywords: [
    'BMI calculator',
    'body mass index',
    'weight calculator',
    'health calculator',
    'BMI chart',
    'healthy weight'
  ],
  openGraph: {
    title: 'BMI Calculator - VitaPulse',
    description: 'Calculate your Body Mass Index with instant results and health insights.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'BMI Calculator - VitaPulse',
    description: 'Calculate your BMI with instant results and health insights.',
  },
};

export default function BMICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
