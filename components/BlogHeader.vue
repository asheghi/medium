<template>
  <a
    href="/"
    class="header"
  >
    <LogoIcon
      width="46"
      height="46"
    />
    <h1>
      Awesome Blog
    </h1>
  </a>
</template>
<script>
import LogoIcon from '../assets/icons/logo.svg';

export default {
  name: 'BlogHeader',
  components: { LogoIcon },
};
</script>
<style lang="scss">
.header{
  @apply text-center py-4 text-lg flex items-center gap-4 font-bold text-2xl;
}
</style>
