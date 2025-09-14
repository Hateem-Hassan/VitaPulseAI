import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Macro Splitter Calculator | VitaPulse AI',
  description: 'Calculate your optimal macronutrient distribution (protein, carbs, fats) based on your goals, activity level, and dietary preferences.',
  keywords: ['macro calculator', 'macronutrient split', 'protein calculator', 'carb calculator', 'fat calculator', 'nutrition planning'],
  openGraph: {
    title: 'Macro Splitter Calculator | VitaPulse AI',
    description: 'Calculate your optimal macronutrient distribution based on your goals and activity level.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macro Splitter Calculator | VitaPulse AI',
    description: 'Calculate your optimal macronutrient distribution based on your goals and activity level.',
  },
}

export default function MacroSplitterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}