<template>
  <div class="">
    <BlogHeader />
    <div
      v-if="preview"
      class="preview"
    >
      <div class="text">
        Preview Mode
      </div>
    </div>
    <div
      v-if="post"
      class="ShowPost"
    >
      <div
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
    if (!post) return defaultSiteTitle;
    return `${post?.title} - ${defaultSiteTitle}`;
  },
  pageDesc({ post }) {
    return post?.summary;
  },
  name: 'ShowPost',
  components: { BlogFooter, BlogHeader },
  setup() {
    const pageContext = usePageContext();
    const { post, preview } = pageContext;
    return { post, preview };
  },
  cacheControl: 'public, max-age=43200',
};
</script>

<style lang="scss">
.ShowPost{
  @apply container mx-auto px-4 lg:px-0;
  .content{
    @apply mt-12;
  }

  hr{
    width: 340px;
    margin: 0 auto;
  }
  img{
    margin: 0 auto;
    @apply rounded;
  }
}

.preview{
  @apply fixed bottom-8 left-0 right-0 text-center;
  .text{
    @apply text-primary bg-white border border-primary rounded-full inline-block
    px-2 py-1;
  }
}
</style>
