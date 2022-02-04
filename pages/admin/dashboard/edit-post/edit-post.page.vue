<template>
  <div class="EditPost">
    <div class="top text-center capitalize text-2xl mb-8">
      {{ mode }} Post
    </div>
    <div class="form">
      <div class="block">
        <div class="label">
          Title
        </div>
        <input
          v-model="form.title"
          type="text"
        >
      </div>
      <div class="block">
        <div class="label">
          Slug
        </div>
        <input
          v-model="form.slug"
          type="text"
        >
      </div>
      <div class="block">
        <div class="label">
          Content
        </div>
        <textarea v-model="form.content" />
      </div>
      <div class="block">
        <button
          class="btn"
          @click="submit"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ax } from '../../../../lib/plugins/axios';
import { usePageContext } from '../../../../renderer/usePageContext';

export default {
  name: 'CreatePost',
  setup() {
    const pageContext = usePageContext();
    const { post } = pageContext;
    return { post };
  },
  data() {
    return {
      form: {
        title: '',
        slug: '',
        content: '',
      },
    };
  },
  computed: {
    mode() {
      return this.post ? 'update' : 'create';
    },
  },
  mounted() {
    if (this.post) {
      const { title, slug, content } = this.post;
      this.form.title = title;
      this.form.slug = slug;
      this.form.content = content;
    }
  },
  methods: {
    async submit() {
      if (this.mode === 'update') {
        const { data, status } = await ax.put(`posts/${this.post.id}`, this.form);
      } else {
        const { data, status } = await ax.post('posts', this.form);
      }
      window.location.href = '/admin';
    },
  },
};
</script>
<style lang="scss">
.EditPost{
  @apply mx-auto pt-8;
  max-width: 400px;
  .form{
    @apply flex flex-col gap-4 items-center;
    .block{
      .label {
        @apply mb-1;
      }
      input,textarea{
        @apply border px-2 py-1 rounded;
      }
      .btn{
        @apply text-white bg-primary px-4 py-1 rounded;
      }
    }
  }
}
</style>
