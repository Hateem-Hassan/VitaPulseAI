import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './mobile-optimizations.css';
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'VitaPulse - AI-Powered Health & Wellness Platform',
    template: '%s | VitaPulse'
  },
  description: 'Transform your health journey with AI-powered meal planning, personalized nutrition tracking, and comprehensive wellness tools. Join thousands achieving their health goals.',
  keywords: [
    'health',
    'wellness',
    'nutrition',
    'meal planning',
    'fitness',
    'AI health coach',
    'diet tracking',
    'weight loss',
    'muscle gain',
    'healthy lifestyle',
    'BMI calculator',
    'health calculators',
    'gamification',
    'health tracking'
  ],
  authors: [{ name: 'VitaPulse Team' }],
  creator: 'VitaPulse',
  publisher: 'VitaPulse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vitapulse.fit'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'VitaPulse - AI-Powered Health & Wellness Platform',
    description: 'Transform your health journey with AI-powered meal planning, personalized nutrition tracking, and comprehensive wellness tools.',
    siteName: 'VitaPulse',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VitaPulse - AI-Powered Health & Wellness Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitaPulse - AI-Powered Health & Wellness Platform',
    description: 'Transform your health journey with AI-powered meal planning and personalized nutrition tracking.',
    images: ['/twitter-image.jpg'],
    creator: '@vitapulse',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Removed clinical CSS that was breaking the design */}
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="VitaPulse" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VitaPulse" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2E7D32" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}