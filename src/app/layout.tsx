import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VitaPulse AI - Your Intelligent Health Companion',
  description: 'AI-powered health platform with cultural sensitivity, multi-language support, and comprehensive health tracking.',
  keywords: 'health, AI, wellness, nutrition, fitness, medical, cultural health',
  authors: [{ name: 'VitaPulse Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  openGraph: {
    title: 'VitaPulse AI - Your Intelligent Health Companion',
    description: 'AI-powered health platform with cultural sensitivity and multi-language support.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'fr_FR', 'de_DE', 'ar_SA', 'ja_JP', 'zh_CN', 'hi_IN'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitaPulse AI - Your Intelligent Health Companion',
    description: 'AI-powered health platform with cultural sensitivity and multi-language support.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                <div className="flex flex-col min-h-screen">
                  {children}
                </div>
              </div>
              <Toaster
                position="top-right"
                expand={false}
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                  className: 'toast',
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}