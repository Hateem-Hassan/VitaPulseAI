'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { RegistrationPopup } from '@/components/registration-popup';
import { useRegistrationPopup } from '@/hooks/use-registration-popup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const { isOpen, closePopup, handleRegistration } = useRegistrationPopup();

  return (
    <>
      {children}
      <RegistrationPopup
        isOpen={isOpen}
        onClose={closePopup}
        onRegister={handleRegistration}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000, // Reduced duration to prevent spam
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </>
  );
}

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>
        <ProvidersContent>{children}</ProvidersContent>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}

// Export ThemeProvider as a named export for compatibility
export const ThemeProvider = NextThemesProvider;
