// Hook `usePageContext()` to make `pageContext` available from any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import { inject } from 'vue';

const key = Symbol('pageContext');

function usePageContext() {
  const pageContext = inject(key);
  return pageContext;
}

function setPageContext(app, pageContext) {
  app.provide(key, pageContext);
}

export { usePageContext };
export { setPageContext };
