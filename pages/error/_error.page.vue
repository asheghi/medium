<template>
  <template v-if="is404">
    <div class="NotFoundPage">
      <div class="icon">
        <GhostIcon
          width="160"
          height="160"
        />
      </div>
      <div
        class="text"
        v-text="'boooo'"
      />
      <div class="home">
        <div class="lost">
          Are you lost?
        </div>
        <a href="/">Take me home</a>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="ServerCrashPage min-h-screen flex justify-center items-center">
      <div class="message">
        <div class="text-4xl text-primary font-extrabold mb-4 tracking-wider">
          Ooops...
        </div>
        <div class="text-2xl opacity-50">
          server crashed at {{ new Date().toLocaleString() }}
        </div>
      </div>
    </div>
  </template>
</template>

<script>

import GhostIcon from '../../assets/icons/dynamic/icon-ghost.svg';

export default {
  components: {
    GhostIcon,
  },
  props: {
    is404: {
      type: Boolean,
      default: false,
    },
  },
  pageTitle(ctx) {
    const { is404 } = ctx.pageProps;
    if (is404) return 'Page not Found!';
    return 'Server Crashed!';
  },
  cacheControl: 'public, max-age=3600',
};
</script>
<style lang="scss">
.NotFoundPage {
  @apply font-sans flex flex-col gap-8  justify-center items-center my-auto min-h-screen;
  .icon {
    @apply opacity-0 animate-pulse;
    svg {
      fill: theme('colors.gray.400');
    }
  }
  .text {
    @apply text-gray-400 opacity-0 text-4xl animate-pulse font-extrabold;
  }
  .home{
    @apply mt-16;
    .lost{
      @apply text-gray-500 mb-6 opacity-75;
    }
    a{
      @apply text-primary text-6xl font-extrabold;
    }
  }
}
</style>
