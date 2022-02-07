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
