import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Only import the dev-only Kimi inspect plugin when it exists
  const devPlugins: import('vite').Plugin[] = [];
  if (mode !== 'production') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { inspectAttr } = require('kimi-plugin-inspect-react');
      devPlugins.push(inspectAttr());
    } catch { /* plugin not installed in production */ }
  }

  return {
    base: '/',
    plugins: [...devPlugins, react()],
    server: { port: 3000 },
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — cached separately, changes rarely
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Supabase + auth — only needed for reviews & admin
            'vendor-supabase': ['@supabase/supabase-js'],
            // UI libraries — icons, animations, toasts
            'vendor-ui': ['lucide-react', 'sonner', 'clsx', 'tailwind-merge'],
          },
        },
      },
      // Raise warning threshold — the admin bundle will always be bigger
      chunkSizeWarningLimit: 600,
    },
  };
});
