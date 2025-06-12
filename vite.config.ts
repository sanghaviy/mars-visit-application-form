import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/mars-visit-application-form/', // Your repo name
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
