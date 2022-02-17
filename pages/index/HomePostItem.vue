<template>
  <a
    class="HomePostItem"
    :href="'/post/' + post.slug"
  >
    <h2
      class="title"
      v-text="post.title"
    />
    <p
      class="summary"
      v-text="post.summary"
    />
    <p
      class="date"
      v-text="formattedPublishDate"
    />
  </a>
</template>
<script>
import { formatDateTime } from '../admin/posts/manage-posts/utils';

export default {
  name: 'HomePostItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedPublishDate() {
      return formatDateTime(this.post.publishedAt);
    },
  },
  methods: {
  },
};
</script>
<style lang="scss">
.HomePostItem{
  @apply py-3 cursor-pointer transition flex flex-col gap-2;
  .title{
    @apply text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-primary-400 to-blue-600;
  }
  .summary{
    @apply opacity-75;
  }
  .date{
    @apply opacity-50 text-xs;
  }
}
</style>
