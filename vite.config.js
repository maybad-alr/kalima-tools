import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Project pages: '/kalima-tools/'. After binding a custom domain, set '/'
  // and rebuild (README → Deploy steps).
  base: '/kalima-tools/',
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5175,
    host: '127.0.0.1',
    watch: {
      ignored: ['**/dist/**', '**/*.log', '**/publish-tmp/**']
    }
  },
  preview: {
    port: 4175,
    host: '127.0.0.1'
  }
});
