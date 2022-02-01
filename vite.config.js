import vue from '@vitejs/plugin-vue';
// eslint-disable-next-line import/no-unresolved
import ssr from 'vite-plugin-ssr/plugin';

export default {
  plugins: [vue(), ssr()],
};
