<template>
  <div class="">
    <BlogHeader />
    <div class="ShowPost">
      <div
        v-if="post"
        class="content prose"
      >
        <h2
          class="title"
          v-text="post.title"
        />
        <p
          class="short-desc"
          v-text="post.summary"
        />
        <div
          v-if="post.content"
          class="post-content"
          v-html="post.content"
        />
      </div>
    </div>
    <BlogFooter class="footer" />
  </div>
</template>

<script>
import { usePageContext } from '../../renderer/usePageContext';
import BlogHeader from '../../components/BlogHeader.vue';
import BlogFooter from '../../components/BlogFooter.vue';
import { defaultSiteTitle } from '../../lib/config';

export default {
  pageTitle({ post }) {
    return `${post.title} - ${defaultSiteTitle}`;
  },
  pageDesc({ post }) {
    return post.summary;
  },
  name: 'ShowPost',
  components: { BlogFooter, BlogHeader },
  setup() {
    const pageContext = usePageContext();
    const { post } = pageContext;
    return { post };
  },
};
</script>

<style lang="scss">
.ShowPost{
  @apply container mx-auto px-4 lg:px-0;
  .content{
    @apply mt-12;
  }
}
hr{
  width: 340px;
  margin: 0 auto;
}
</style>
