<template>
  <div class="EditPost">
    <div class="top flex justify-between py-8 items-center">
      <div class="flex gap-4 items-center text-lg capitalize h-8">
        <LogoIcon
          width="32"
          height="32"
          class="logo"
        />
        <div
          v-if="loadingSave"
          class="save-status text-sm opacity-50"
        >
          Saving changes ...
        </div>
      </div>
      <button
        class="btn"
        @click="$refs.modal.show()"
      >
        Publish
      </button>
    </div>
    <div class="title">
      <input
        v-model="form.draftTitle"
        placeholder="choose a great title"
      >
    </div>
    <PostEditor
      v-if="post && hasMounted"
      v-model="form.draftContent"
    />
    <Modal
      ref="modal"
    >
      <div class="flex flex-col gap-4">
        <div class="summary">
          <div class="text-sm opacity-50 mb-2">
            Write a summary for your post
          </div>
          <textarea
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
        <div class="text-center pt-4">
          <button
            class="btn px-2 py-1 text-lg bg-primary text-white rounded"
            @click="publish"
          >
            Publish
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
import LogoIcon from '../../../../assets/icons/logo.svg';
import Modal from '../../../../components/Modal.vue';
import { domain } from '../../../../lib/config';

const debug = getDebug('edit-post', 'page');
export default {
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
      draftTitle, draftContent, slug, summary,
    } = this.post;
    return {
      form: { draftTitle, draftContent },
      debouncedSave,
      loadingSave: false,
      loadingPublish: false,
      slug,
      summary,
      hasMounted: false,
    };
  },
  computed: {
    link() {
      return `${domain}/post/`;
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
      this.hasMounted = true;
    }
  },
  methods: {
    async saveDraft() {
      this.loadingSave = true;
      try {
        const { data, status } = await ax.post(`posts/save/${this.post.id}`, this.form);
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
        const { slug, summary } = this;
        const { data, status } = await ax.post(`posts/publish/${this.post.id}`, {
          draftTitle, draftContent, slug, summary,
        });
        if (status === 200) {
          this.$refs.modal.hide();
          window.location.href = `/post/${this.slug}`;
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
.EditPost {
  @apply mx-auto;
  max-width: 700px;

  .top {
    @apply px-4;
    .btn {
      @apply rounded px-2 py-1  capitalize text-primary border-primary
      hover:shadow-lg active:shadow-sm hover:bg-primary active:scale-95
      hover:text-white hover:scale-110 transform  transition;
    }
  }

  .title {
    @apply w-full mb-8;
    input {
      @apply w-full rounded-xl py-4 px-4 text-2xl outline-0;
    }
  }
}

.Modal {
  .modal-box {
    @apply bg-red-500 p-12;
  }
}
</style>
