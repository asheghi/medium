<template>
  <div class="HomePage min-h-screen">
    <BlogHeader />
    <div
      v-if="posts && posts.length"
      class="content"
    >
      <HomePostItem
        v-for="post in posts"
        :key="post.slug"
        :post="post"
        class="post"
      />
      <div
        v-if="pageCount"
        class="pagination"
      >
        <a
          v-if="page > 1"
          :href="'/page/'+(page - 1)"
          class="link newer"
        >
          <div class="icon">
            <FreshIcon />
          </div>
          <div class="text">
            newer posts
          </div>
        </a>
        <a
          v-if="page < pageCount"
          :href="'/page/'+(page + 1)"
          class="link older"
        >
          <div class="icon">
            <OldIcon />
          </div>
          <div class="text">
            older posts
          </div>
        </a>
      </div>
    </div>
    <div
      v-if="!(posts && posts.length)"
      class="no-post"
    >
      <div class="icon">
        <GhostIcon />
      </div>
      <div
        class="text"
        v-text="'nothing here'"
      />
    </div>
    <BlogFooter />
  </div>
</template>

<script>
import { usePageContext } from '../../renderer/usePageContext';
import BlogHeader from '../../components/BlogHeader.vue';
import BlogFooter from '../../components/BlogFooter.vue';
import HomePostItem from './HomePostItem.vue';
import FreshIcon from '../../assets/icons/dynamic/icon-fresh.svg';
import OldIcon from '../../assets/icons/dynamic/icon-old.svg';
import GhostIcon from '../../assets/icons/dynamic/icon-ghost.svg';
import { defaultSiteTitle } from '../../lib/config';

export default {
  components: {
    HomePostItem, BlogFooter, BlogHeader, FreshIcon, OldIcon, GhostIcon,
  },
  setup() {
    const { posts, page, pageCount } = usePageContext();
    return {
      posts,
      page,
      pageCount,
    };
  },
  pageTitle(ctx) {
    const { page } = ctx;
    if (page > 1) {
      return `${defaultSiteTitle} - Page ${page}`;
    }
    return `${defaultSiteTitle} - Home Page`;
  },
  cacheControl: 'public, max-age=43200',
};
</script>
<style lang="scss">
.HomePage{
  .content{
    @apply container mx-auto pt-8 px-4 lg:px-0;
    min-height: calc(100vh - (68px + 64px))
  }
  .pagination{
    @apply container flex flex-col sm:flex-row justify-center items-center gap-4;
    .link{
      @apply flex justify-center items-center gap-2 capitalize px-2 py-4
      border rounded-xl whitespace-nowrap w-full;
      flex: 1;
      max-width: 500px;

      .text{
        @apply text-lg tracking-wider  text-gray-600;
      }
    }
    .newer{
      svg{
        fill: theme('colors.green.400')
      }
    }
    .older{
      svg{
        fill: theme('colors.green.800')
      }
    }
  }
  .no-post{
    @apply px-4 py-2 flex flex-col items-center gap-2 my-auto;
    .icon{
      @apply opacity-0 animate-pulse;
      svg{
        fill: theme('colors.gray.400');
      }
    }
    .text{
      @apply text-gray-400 capitalize;
    }
  }
}
</style>
