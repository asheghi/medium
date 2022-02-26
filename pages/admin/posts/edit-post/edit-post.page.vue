<template>
  <div class="EditPost">
    <div class="top flex gap-4 py-8 items-center">
      <div class="flex items-center gap-4 items-center text-lg capitalize h-8">
        <LogoIcon
          width="32"
          height="32"
          class="logo"
        />
      </div>
      <a
        href="/admin"
        class="h-full text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-primary-400 to-blue-600"
      >
        Back to Posts
      </a>
      <div
        v-if="loadingSave"
        class="save-status text-sm opacity-50"
      >
        Saving changes ...
      </div>
      <a
        class="ml-auto text-xs opacity-75"
        :href="'/post/' + post.slug+'?preview=true'"
        target="_blank"
      >Preview</a>
      <button
        data-test="publish-modal-btn"
        class="btn"
        @click="$refs.modal.show()"
      >
        Publish
      </button>
    </div>
    <div class="title">
      <input
        data-test="title"
        v-model="form.draftTitle"
        placeholder="choose a great title"
      >
    </div>
    <div
      data-test="loading"
      v-if="!(post && hasMounted)"
      class="loading-editor opacity-0 animate-pulse"
    >
      Loading Editor ...
    </div>
    <PostEditor
      test-data="editor"
      v-if="post && hasMounted"
      v-model="form.draftContent"
      class="-mx-4"
    />
    <Modal
      ref="modal"
    >
      <div class="flex p-4 flex-col gap-4">
        <div class="summary">
          <div class="text-sm opacity-50 mb-2">
            Write a summary for your post
          </div>
          <textarea
            data-test="summary"
            v-model="summary"
            class="border border-gray-200 w-full px-4 py-2 rounded outline-primary"
            type="text"
            placeholder="summary"
          />
        </div>
        <div class="slug text-sm ">
          <div class="text-sm opacity-50 mb-2 opacity-50">
            you can choose a custom url
          </div>
          <div class="flex items-center gap-1">
            <div
              class="link opacity-50"
              v-text="link"
            />
            <input
              v-model="slug"
              class="w-48 border rounded border-gray-300 px-2 py-1 outline-primary"
              type="text"
              placeholder="slug"
            >
          </div>
        </div>
        <div
          v-if="post && post.published"
          class="twitter text-sm mt-4"
        >
          <div class="text-sm  mb-2">
            <span class="opacity-50">
              Have you shared this in Twitter?
            </span>
            <a
              v-if="post.published"
              :href="twitterLink"
              target="_blank"
              class="ml-2 text-primary"
            >Share on Twitter</a>
          </div>
          <div class="flex items-center gap-1">
            <input
              v-model="twitter"
              class="border rounded border-gray-300 px-2 py-1 outline-primary w-full"
              type="text"
              placeholder="link of tweet"
            >
          </div>
        </div>
        <div class="flex mt-4 gap-8 justify-center items-center ">
          <a
            data-test="read-post"
            v-if="post && post.published"
            class="w-auto text-primary whitespace-nowrap"
            :href="publishedLink"
            target="_blank"
            v-text="'Read Post'"
          />
          <button
            data-test="submit-publish"
            :disabled="loadingPublish"
            class="btn px-4 py-1 text-lg bg-primary text-white rounded"
            @click="publish"
          >
            {{ loadingPublish ? 'Publishing ...' : 'Publish' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import debounce from 'lodash.debounce';
import slugify from 'slugify';
import { ax } from '../../../../lib/plugins/axios';
import { usePageContext } from '../../../../renderer/usePageContext';
import PostEditor from './post-editor.vue';
import { getDebug, parseAxiosError } from '../../../../lib/utils';
import LogoIcon from '../../../../assets/icons/dynamic/icon-logo.svg';
import Modal from '../../../../components/modal.vue';
import { defaultSiteTitle, domain } from '../../../../lib/config';

const debug = getDebug('edit-post', 'page');
export default {
  pageTitle({ post }) {
    return `Edit Post - ${post.title || defaultSiteTitle}`;
  },
  cacheControl: 'no-store',
  name: 'EditPost',
  components: { PostEditor, LogoIcon, Modal },
  setup() {
    const pageContext = usePageContext();
    const { post } = pageContext;
    return { post };
  },
  data() {
    const options = {
      leading: true,
      trailing: true,
      maxWait: 5000,
    };
    const debouncedSave = debounce(this.saveDraft, 5000, options);
    const {
      draftTitle, draftContent, slug, summary, twitter,
    } = this.post;
    return {
      form: { draftTitle, draftContent },
      debouncedSave,
      loadingSave: false,
      loadingPublish: false,
      slug,
      summary,
      hasMounted: false,
      twitter,
    };
  },
  computed: {
    link() {
      return `${domain}/post/`;
    },
    twitterLink() {
      const text = `${this.post.title}\n\n${domain}/post/${this.post.slug}`;
      return `https://twitter.com/intent/tweet?text=${encodeURI(text)}`;
    },
    publishedLink() {
      return `/post/${this.post.slug}`;
    },
  },
  watch: {
    form: {
      handler(n) {
        const contentChanged = n.draftContent !== this.post.draftContent;
        const titleChanged = n.draftTitle !== this.post.draftTitle;
        if (contentChanged || titleChanged) {
          this.debouncedSave();
        }
        if (titleChanged) {
          this.slug = slugify(this.form.draftTitle);
        }
      },
      deep: true,
    },
  },
  async mounted() {
    const { post } = this;
    if (post && post.published) {
      if (!this.form.draftTitle) this.form.draftTitle = post.title;
      if (!this.form.draftContent) this.form.draftContent = post.content;
      if (!this.slug) this.slug = slugify(this.form.draftTitle);
    }
    this.hasMounted = true;
  },
  methods: {
    async saveDraft() {
      this.loadingSave = true;
      try {
        const { data, status } = await ax.post(`posts/save/${this.post.id}`, this.form);
        // todo handle error - show error if post is not saved
      } catch (e) {
        debug(parseAxiosError(e));
      } finally {
        this.loadingSave = false;
      }
    },
    async publish() {
      this.loadingPublish = true;
      try {
        const { draftContent, draftTitle } = this.form;
        const { slug, summary, twitter } = this;
        const { data, status } = await ax.post(`posts/publish/${this.post.id}`, {
          draftTitle, draftContent, slug, summary, twitter,
        });
        if (status === 200) {
          this.post = data;
        }
      } catch (e) {
        debug(parseAxiosError(e));
      } finally {
        this.loadingPublish = false;
      }
    },
  },
};
</script>
<style lang="scss">
@import "../../../../assets/styles/post";
.EditPost {
  @apply mx-auto container flex flex-col px-4 lg:px-0;

  .top {
    @apply px-0;
    .btn {
      @apply rounded px-2 py-1  capitalize text-primary border-primary
      hover:shadow-lg active:shadow-sm hover:bg-primary active:scale-95
      hover:text-white hover:scale-110 transform  transition;
    }
  }

  .title {
    @apply w-full mb-8 -mx-4;
    input {
      @apply w-full rounded-xl py-4 px-4 text-2xl outline-0 font-extrabold text-4xl
      border border-gray-200 border-dashed;
    }
  }
}

.Modal {
  .modal-box {
    @apply bg-red-500;
    padding: 0!important;
  }
}
</style>
