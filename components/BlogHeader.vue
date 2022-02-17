<template>
  <nav class="BlogHeader">
    <a
      href="/"
      class="brand"
    >
      <LogoIcon
        class="logo"
        width="32"
        height="32"
      />
      <div
        class="name"
        v-text="brandName"
      />
    </a>
    <div class="links">
      <a
        v-for="(item,index) in navLinks"
        :key="index"
        :href="item.link"
        class="item"
        target="_blank"
      >
        <component
          :is="item.icon"
          width="24"
          height="24"
          icon="twitter"
        />
      </a>
    </div>
  </nav>
</template>
<script>
import LogoIcon from '../assets/icons/logo.svg';
import {
  brandName, githubLink, linkedinLink, twitterLink,
} from '../lib/config';

import IconTwitter from '../assets/icons/dynamic/icon-twitter.svg';
import IconGithub from '../assets/icons/dynamic/icon-github.svg';
import IconLinkedin from '../assets/icons/dynamic/icon-linkedin.svg';

const navLinks = [
  {
    link: twitterLink,
    icon: IconTwitter,
  },
  {
    link: githubLink,
    icon: IconGithub,
  },
  {
    link: linkedinLink,
    icon: IconLinkedin,
  },
];
export default {
  name: 'BlogHeader',
  components: {
    LogoIcon,
    IconTwitter,
    IconGithub,
    IconLinkedin,
  },
  setup() {
    return {
      brandName, navLinks,
    };
  },
};
</script>
<style lang="scss">
.BlogHeader {
  @apply flex font-sans w-full justify-between items-center py-4 mx-auto container px-4 lg:px-0;
  .brand{
    @apply flex items-center gap-2 text-2xl;
    .name{
      @apply tracking-tighter font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-b from-primary-400 to-blue-600;
    }
  }
  .links{
    @apply flex items-center gap-2;

    .item{
      width: 36px;
      height: 36px;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      border: 0;
      @apply flex justify-center rounded items-center;
      svg{
        fill:theme('colors.gray.500');
        @apply transform transition
      }
      &:hover{
        svg{
          fill:theme('colors.primary.500');
          @apply scale-125;
        }
      }
    }

    .github{

    }
    .twitter{

    }
    .linkedin{

    }
  }

}
</style>
