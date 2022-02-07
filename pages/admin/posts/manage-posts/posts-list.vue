<template>
  <div class="DraftsList">
    <PostItem
      v-for="post in posts"
      :key="post.id"
      class="post"
      :post="post"
      @deletedPost="$emit('deletedPost',$event)"
      @unPublishedPost="$emit('unPublishedPost',$event)"
    />
    <div
      v-if="!posts.length"
      class="no-data"
    >
      nothing yet.
    </div>
  </div>
</template>
<script>
import PostItem from './post-item.vue';

export default {
  name: 'PostsItem',
  components: { PostItem },
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  emits: ['deletedPost', 'unPublishedPost'],
  data() {
    return {
    };
  },
};
</script>
<style lang="scss">
.no-data{
  min-height: 400px;
  @apply flex justify-center items-center opacity-50;
}
</style>
