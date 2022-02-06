import vue from '@vitejs/plugin-vue';
// eslint-disable-next-line import/no-unresolved
import ssr from 'vite-plugin-ssr/plugin';
import svgLoader from 'vite-svg-loader';
import path from 'path';

export default {
  plugins: [vue(), ssr(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
};
