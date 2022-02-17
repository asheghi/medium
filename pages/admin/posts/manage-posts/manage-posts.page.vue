<template>
  <div class="ManagePosts font-sans">
    <div class="top">
      <h2 class="head">
        Posts
      </h2>
      <div
        :class="{loading:loadingCreate}"
        class="btn"
        @click="createPost"
      >
        {{ loadingCreate ? 'Processing...' : 'New Post' }}
      </div>
    </div>
    <div class="tabs">
      <div
        class="tab"
        :class="{active:currentTab === DRAFTS}"
        @click="currentTab = DRAFTS"
      >
        Drafts
      </div>
      <div
        class="tab"
        :class="{active:currentTab === PUBLISHED}"
        @click="currentTab = PUBLISHED"
      >
        Published
      </div>
    </div>
    <div class="list">
      <PostsList
        :posts="posts_filtered"
        @deletedPost="onPostDeleted"
        @unPublishedPost="onUnPublishedPost"
      />
    </div>
  </div>
</template>
<script>
import { provide, reactive, ref } from 'vue';
import { usePageContext } from '../../../../renderer/usePageContext';
import PostsList from './posts-list.vue';
import { DRAFTS, PUBLISHED } from './utils';
import { defaultSiteTitle } from '../../../../lib/config';
import { ax } from '../../../../lib/plugins/axios';
import { getDebug, parseAxiosError } from '../../../../lib/utils';

const debug = getDebug('manage-posts:page');

export default {
  pageTitle: `Dashboard - ${defaultSiteTitle}`,
  cacheControl: 'no-store',
  name: 'ListPosts',
  components: { PostsList },
  setup() {
    const { posts: originalPosts } = usePageContext();
    const posts = ref(originalPosts);

    const currentTab = ref(DRAFTS);
    provide('currentTab', currentTab);

    const loadingCreate = ref(false);
    const createPost = async () => {
      loadingCreate.value = true;
      try {
        const { status, data } = await ax.post('posts/anotherOne');
        if (status === 200 && data && data.id) {
          window.location.href = `/admin/post/${data.id}/edit`;
          await new Promise((r) => { setTimeout(r); }, 1500);
        }
      } catch (e) {
        debug(parseAxiosError(e));
      } finally {
        loadingCreate.value = false;
      }
    };

    return {
      posts, currentTab, DRAFTS, PUBLISHED, loadingCreate, createPost,
    };
  },
  computed: {
    posts_filtered() {
      const { currentTab, posts } = this;
      if (currentTab === DRAFTS) {
        return posts.filter((it) => it.draftTitle || it.draftContent);
      }
      if (currentTab === PUBLISHED) {
        return posts.filter((it) => it.published);
      }
      return posts;
    },
  },
  methods: {
    onPostDeleted(post) {
      this.posts = this.posts.filter((it) => it.id !== post.id);
    },
    onUnPublishedPost(post) {
      const index = this.posts.findIndex((it) => it.id !== post.id);
      this.posts[index].published = false;
    },
  },
};
</script>
<style lang="scss">
.ManagePosts {

  max-width: 600px;
  @apply mx-auto px-8 pt-16 mx-auto;
  .top {
    @apply flex justify-between  items-center;
    .head {
      @apply text-2xl;
    }

    .btn {
      @apply rounded px-2 py-1  capitalize text-primary border-primary
      hover:shadow-lg active:shadow-sm hover:bg-primary active:scale-95
      hover:text-white hover:scale-110 transform  transition cursor-pointer;
      &.loading{
        @apply cursor-progress opacity-75 animate-pulse;
      }
    }
  }

  .tabs {
    @apply flex gap-4 pt-6;
    .tab {
      @apply text-gray-500 cursor-pointer transition-all text-xl
      border border-transparent py-1;
      &.active {
        @apply cursor-default text-primary-600 border-b-primary;
      }
    }
  }

  .list {
    @apply flex flex-col mx-auto gap-4;

  }
}
</style>
