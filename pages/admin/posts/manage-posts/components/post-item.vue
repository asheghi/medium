<template>
  <div class="PostItem">
    <a
      data-test="post-link"
      :href="getTitleLink(post,currentTab.value)"
      class="title"
      v-text="title"
    />
    <div class="below-title">
      <div
        class="date"
        v-text="dateFormatted"
      />
      <div class="menu">
        <DynamicIcon
          class="trigger-icon"
          width="16"
          height="16"
          :icon="showMenu ? 'chevron-left' : 'chevron-right'"
          @click="toggleShowMenu"
        />
        <template v-if="showMenu">
          <div
            v-for="item in menuItems"
            :key="item"
            class="item"
            @click="onMenuSelected(post,item)"
            v-text="item"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import {
  deletePost, DRAFTS, formatDateTime, getTitleLink, PUBLISHED, unPublishPost,
} from '../utils';
import DynamicIcon from '../../../../../components/DynamicIcon';

const EDIT_POST = 'Edit Post';
const DELETE_POST = 'Delete Post';
const UN_POBLISH = 'UnPublish';

export default {
  name: 'PostItem',
  components: { DynamicIcon },
  inject: ['currentTab'],
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['deletedPost', 'unPublishedPost'],
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    menuItems() {
      const { draftTitle, draftContent } = this.post;
      if (draftTitle || draftContent) {
        return [EDIT_POST, DELETE_POST];
      }
      return [EDIT_POST, UN_POBLISH, DELETE_POST];
    },
    dateFormatted() {
      if (this.currentTab.value === DRAFTS) {
        return `updated ${formatDateTime(this.post.updatedAt)}`;
      }
      if (this.currentTab.value === PUBLISHED) {
        return `published ${formatDateTime(this.post.publishedAt)}`;
      }
      return '';
    },
    title() {
      const { currentTab, post } = this;
      if (currentTab.value === PUBLISHED) {
        const { title } = post;
        return title || 'Untitled';
      }
      if (currentTab.value === DRAFTS) {
        const { draftTitle } = post;
        return draftTitle || 'Untitled';
      }
      return '';
    },
  },
  methods: {
    getTitleLink,
    formatDateTime,
    async onMenuSelected(post, item) {
      switch (item) {
        case EDIT_POST: {
          window.location.href = `/admin/post/${post.id}/edit`;
          break;
        }
        case DELETE_POST: {
          await deletePost(post);
          this.$emit('deletedPost', post);
          break;
        }
        case UN_POBLISH: {
          await unPublishPost(post);
          this.$emit('unPublishedPost', post);
          break;
        }

        default: {
          // do nothing
        }
      }
    },
    toggleShowMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
<style lang="scss">
.menu {
  @apply flex items-center gap-2 flex-wrap;
  .item {
    @apply text-xs opacity-75 hover:opacity-100 text-primary cursor-pointer whitespace-nowrap;
  }
}

.post {
  @apply flex items-start  gap-1 flex-col mx-auto justify-between py-3 text-lg w-full rounded;
  .title {
    @apply inline-block;
  }

  &:hover {
    .title {
      @apply hover:text-primary-500 ;
    }
  }

  .below-title {
    @apply flex items-center gap-1;
    .date {
      @apply text-xs opacity-50;
    }

    .trigger-icon {
      @apply cursor-pointer transition opacity-50;
      &:hover {
        fill: theme('colors.primary.500')
      }
    }
  }
}
</style>
