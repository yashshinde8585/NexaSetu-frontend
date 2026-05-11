/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // standard plugin (compatible with Vite 8)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vendor chunk grouping (function form required by Vite 8 / rolldown)
// Ordered most-specific → least-specific to prevent false-positive matches.
const vendorGroups = {
  // Core
  'vendor-react':      (id) => id.includes('node_modules/react/') || id.includes('node_modules/react-dom/'),
  'vendor-router':     (id) => id.includes('node_modules/react-router'),
  // Data layer
  'vendor-query':      (id) => id.includes('node_modules/@tanstack'),
  'vendor-socket':     (id) =>
    id.includes('node_modules/socket.io-client') ||
    id.includes('node_modules/engine.io-client') ||
    id.includes('node_modules/@socket.io'),
  // Heavy UI / visualization (already lazy via page-level code split)
  'vendor-charts':     (id) => id.includes('node_modules/recharts') || id.includes('node_modules/d3'),
  'vendor-flow':       (id) => id.includes('node_modules/reactflow') || id.includes('node_modules/@reactflow'),
  // Deferred-load UI helpers (now loaded lazily via React.lazy)
  'vendor-datepicker': (id) => id.includes('node_modules/react-datepicker'),
  'vendor-markdown':   (id) =>
    id.includes('node_modules/react-markdown') ||
    id.includes('node_modules/remark') ||
    id.includes('node_modules/rehype') ||
    id.includes('node_modules/unified') ||
    id.includes('node_modules/micromark') ||
    id.includes('node_modules/mdast') ||
    id.includes('node_modules/hast') ||
    id.includes('node_modules/vfile'),
  // Utilities
  'vendor-icons':      (id) => id.includes('node_modules/lucide-react'),
  'vendor-utils':      (id) => id.includes('node_modules/axios') || id.includes('node_modules/date-fns'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ── Build Optimizations ──────────────────────────────────────────────────
  build: {
    target: 'es2015',
    // minify: default (oxc) – esbuild is no longer bundled in Vite 8
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Function form satisfies rolldown / Vite 8 requirement
        manualChunks(id) {
          for (const [chunkName, matcher] of Object.entries(vendorGroups)) {
            if (matcher(id)) return chunkName;
          }
        },
        // Content-hash filenames for optimal long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },

  // ── Dev Server ─────────────────────────────────────────────────────────────
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  // ── Test Config ────────────────────────────────────────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});
