<template>
  <div class="ShowPost">
    <BlogHeader />
    <div class="content prose">
      <h2
        class="title"
        v-text="post.title"
      />
      <p
        class="short-desc"
        v-text="post.shortDesc"
      />
      <img
        v-if="getImageSrc(post.image)"
        :src="getImageSrc(post.image)"
        alt=""
        class="image"
      >
      <div
        v-if="post.content"
        class="post-content"
        v-html="post.content"
      />
    </div>
    <BlogFooter />
  </div>
</template>

<script>
import { usePageContext } from '../../renderer/usePageContext';
import BlogHeader from '../../components/BlogHeader.vue';
import BlogFooter from '../../components/BlogFooter.vue';
import { getImageSrc } from '../../lib/utils';

export default {
  name: 'ShowPost',
  components: { BlogFooter, BlogHeader },
  setup() {
    const pageContext = usePageContext();
    const { post } = pageContext;
    return { post, getImageSrc };
  },
};
</script>

<style lang="scss">
.ShowPost{
  @apply mx-auto;
  max-width: 720px;

  .content{
    @apply mt-12;
  }
}
</style>
