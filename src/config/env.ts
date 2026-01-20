export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
} as const;

if (!config.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}
