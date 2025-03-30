import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Allow JSX in .js files
    include: /\.(js|jsx)$/,
    loader: 'jsx',
  },
});