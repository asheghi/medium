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
        v-if="twitterLink"
        :href="twitterLink"
        class="item twitter"
      >
        <IconTwitter
          width="24"
          height="24"
          icon="twitter"
        />
      </a>

      <a
        v-if="githubLink"
        :href="githubLink"
        class="item github"
      >
        <IconGithub
          width="24"
          height="24"
          icon="github"
        />
      </a>

      <a
        v-if="linkedinLink"
        :href="linkedinLink"
        class="item linkedin"
      >
        <IconLinkedin
          width="24"
          height="24"
          icon="linkedin"
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
      brandName, githubLink, twitterLink, linkedinLink,
    };
  },
};
</script>
<style lang="scss">
.BlogHeader {
  @apply flex w-full justify-between items-center py-4;
  .brand{
    @apply flex items-center gap-2 text-2xl;
    .name{
      @apply tracking-wider;
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
