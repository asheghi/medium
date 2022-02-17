<template>
  <div class="">
    <BlogHeader />
    <div
      v-if="post"
      class="ShowPost"
    >
      <h1
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
    <BlogFooter class="footer" />
    <div
      v-if="preview"
      class="preview"
    >
      <div class="text">
        Preview Mode
      </div>
    </div>
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
@import "../../assets/styles/post";
.ShowPost{
  @apply container mx-auto lg:px-0 prose;
  max-width: 640px;
  @screen md{
    max-width: 768px;
  }
  .post-content, .title{
    @apply mt-16 mb-2;
  }
  .short-desc{
    @apply opacity-75;
  }

  hr{
    width: 340px;
    margin: 3rem auto;
  }
  img{
    margin: 0 auto;
    @apply rounded;
  }
}
.title{
  @apply text-3xl text-transparent bg-clip-text bg-gradient-to-b from-primary-400 to-blue-600
}

.preview{
  @apply fixed bottom-8 left-0 right-0 text-center;
  .text{
    @apply text-primary bg-white border border-primary rounded-full inline-block
    px-2 py-1 animate-bounce shadow-xl;
  }
}
</style>
