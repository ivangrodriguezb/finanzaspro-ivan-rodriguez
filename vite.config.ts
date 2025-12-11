import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize API_KEY, fallback to VITE_API_KEY if specific Vercel config uses that
  const apiKey = env.API_KEY || env.VITE_API_KEY;

  return {
    plugins: [react()],
    define: {
      // Robustly define the process.env.API_KEY for the client
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});