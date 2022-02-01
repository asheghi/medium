// eslint-disable-next-line import/no-unresolved
import { getPage } from 'vite-plugin-ssr/client';
import { createApp } from './app';

async function hydrate() {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage();
  const app = createApp(pageContext);
  app.mount('#app');
}

hydrate();
