<template>
  <div class="PostItem">
    <a
      :href="getTitleLink(post)"
      class="title"
      v-text="post.title || 'No Title'"
    />
    <div class="below-title">
      <div
        class="last-update"
      >
        updated {{ formatDateTime(post.updatedAt) }}
      </div>
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
  deletePost, formatDateTime, getTitleLink, unPublishPost,
} from './utils';
import DynamicIcon from '../../../../components/DynamicIcon';

const EDIT_POST = 'Edit Post';
const DELETE_POST = 'Delete Post';
const UN_POBLISH = 'UnPublish';

export default {
  name: 'PostItem',
  components: { DynamicIcon },
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
  @apply flex items-center gap-2;
  .item {
    @apply text-xs opacity-75 hover:opacity-100 text-primary cursor-pointer;
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
    .last-update {
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
