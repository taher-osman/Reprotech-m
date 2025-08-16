import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Disable TypeScript errors in development for faster builds
    tsDecorators: true,
  })],
  esbuild: {
    // Ignore TypeScript errors during development
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections
    strictPort: true, // Exit if port is already in use
    allowedHosts: ['reprotech.duckdns.org'], // Allow DuckDNS external access
    hmr: {
      port: 5173,
      host: 'localhost',
      protocol: 'ws',
      clientPort: 5173
    },
    watch: {
      usePolling: false, // Use native file watching instead of polling
      interval: 100
    },
    cors: true // Enable CORS
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
