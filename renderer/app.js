import { createSSRApp, h } from 'vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(pageContext) {
  const { Page, pageProps } = pageContext
  const PageComponent = {
    render() {
      return h(Page, pageProps || {})    },
  }

  const app = createSSRApp(PageComponent)

  // We make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
