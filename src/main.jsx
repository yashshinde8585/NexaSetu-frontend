import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { MagicProvider } from './context/MagicContext';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy-load devtools so they are completely excluded from the production bundle
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,           // 10 minutes – reduce redundant mission data fetches
      gcTime: 30 * 60 * 1000,             // 30 minutes – keep strategic data in cache longer
      retry: (failureCount, error) => {
        // NEVER retry on auth failures to prevent loops/storms
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 1; // Max 1 retry for other errors (network/5xx)
      },
      refetchOnWindowFocus: false,         // Prevent focus spam during task execution
      refetchOnMount: true,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <AuthProvider>
          <MagicProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MagicProvider>
        </AuthProvider>
      </ClerkProvider>
      {/* DevTools: only rendered in development */}
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  </StrictMode>
);
