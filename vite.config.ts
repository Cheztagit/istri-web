import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // manualChunks hanya untuk build browser; build SSR melakukan externalisasi node_modules
        manualChunks: isSsrBuild
          ? undefined
          : {
              vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
            },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}));
