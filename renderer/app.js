import { createSSRApp, h } from 'vue';
import { setPageContext } from './usePageContext';

import '../assets/styles/tailwind.css';

function createApp(pageContext) {
  const { Page, pageProps } = pageContext;
  const PageComponent = {
    render() {
      return h(Page, pageProps || {});
    },
  };

  const app = createSSRApp(PageComponent);

  // We make `pageContext` available from any Vue component
  setPageContext(app, pageContext);

  return app;
}

export { createApp };
