import { ThemeToggle } from '../components/ThemeToggle';
import { useMemo } from 'react';

function DashboardPage() {

  const greeting = useMemo(() => {
         const hour = new Date().getHours();
         if (hour < 12) return 'Good morning';
         if (hour < 18) return 'Good afternoon';
         return 'Good evening';
    }, []);


  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">React Template</h1>
            <div className="flex items-center gap-2">
                <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {greeting}!
            </h2>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to React template with TypeScript, Vite, Tailwind CSS v4.
              </p>
            </div>
          </div>
        </main>
    </div>
  );
}

export default DashboardPage;
