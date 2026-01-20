import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/query-client';
import { AppRouter } from './router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider, ToastProvider } from './contexts';
import { ToastContainer } from './components/ui/ToastContainer';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AppRouter />
            <ToastContainer />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
