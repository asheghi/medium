<template>
  <div v-if="is404">
    <h1>404 Page Not Found</h1>
    <p>This page could not be found.</p>
  </div>
  <div v-else>
    <h1>500 Internal Server Error</h1>
    <p>Something went wrong.</p>
  </div>
</template>

<script>
export default {
  props: {
    is404: {
      type: Boolean,
      default: false,
    },
  },
  pageTitle(ctx) {
    const { is404 } = ctx.pageProps;
    if (is404) return 'Page not Found!';
    return 'Something went wrong!';
  },
  cacheControl: 'public, max-age=3600',
};
</script>
