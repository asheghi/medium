<template>
  <div class="ManagePosts">
    <div class="top">
      <h2 class="head">
        Posts
      </h2>
      <a
        :href="'/api/posts/create'"
        class="btn"
      >
        New Post
      </a>
    </div>
    <div class="list">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post"
      >
        <div
          class="title"
          v-text="post.title"
        />
        <div class="actions flex gap-4 opacity-75">
          <a
            :href="'/admin/post/' + post.id+ '/edit'"
            v-text="'Edit'"
          />
          <div
            class="delete cursor-pointer text-red-500"
            @click="deletePost(post)"
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { ax } from '../../../../lib/plugins/axios';
import { usePageContext } from '../../../../renderer/usePageContext';

export default {
  name: 'ListPosts',
  setup() {
    const { posts: originalPosts } = usePageContext();
    const posts = ref(originalPosts);
    return { posts };
  },
  methods: {
    async deletePost(post) {
      const { data, status } = await ax.delete(`posts/${post.id}`);
      if (status === 200) {
        this.posts = this.posts.filter((it) => it.id !== post.id);
      }
    },
  },
};
</script>
<style lang="scss">
.ManagePosts{

  max-width: 600px;
  @apply mx-auto px-8 pt-16 mx-auto;
  .top{
    @apply flex justify-between  items-center;
    .head {
      @apply text-2xl;
    }
    .btn{
      @apply rounded px-2 py-1  capitalize text-primary border-primary hover:shadow-lg active:shadow-sm
      hover:bg-primary active:scale-95 hover:text-white hover:scale-110 transform  transition;
    }
  }

  .list{
    @apply flex flex-col mx-auto gap-4 py-4;
    .post {
      @apply flex mx-auto justify-between border px-4 py-2 text-lg w-full rounded
      hover:bg-gray-100;
    }
  }
}
</style>
