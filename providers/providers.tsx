'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: any;
}

/**
 * Main Providers Component
 * Combines all app providers: React Query, NextIntl, Auth, Toast
 */
export function Providers({ children, locale, messages }: ProvidersProps) {
  // Create QueryClient with optimized settings
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Global query defaults
            staleTime: 60 * 1000, // 1 minute - data stays fresh
            gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: true, // Refetch when reconnecting
            refetchOnMount: true, // Refetch when component mounts
          },
          mutations: {
            // Global mutation defaults
            retry: 0, // Don't retry mutations
            onError: (error) => {
              // Global error handler for mutations
              console.error('Mutation error:', error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
          <ToastContainer
            style={{ zIndex: 999999999 }}
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              fontSize: '14px',
              fontWeight: 500,
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
            }}
          />
          {children}
        </AuthProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}