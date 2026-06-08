import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import svgLoader from 'vite-svg-loader';
import path from 'path';

export default defineConfig({
  plugins: [vue(), vike(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
