import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';

const allowed = ['localhost', '127.0.0.1', '.replit.dev', '.picard.replit.dev'];

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: { lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"' }
    }),
    visualizer({ filename: 'stats.html', gzipSize: true, open: false })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    host: '0.0.0.0',
    port: 5001,
    strictPort: true,
    allowedHosts: allowed,
    hmr: process.env.REPLIT_DEV_DOMAIN
      ? { protocol: 'wss', clientPort: 443, host: process.env.REPLIT_DEV_DOMAIN }
      : true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  preview: { port: 5000 }
});
