<template>
  <div class="FileUpload">
    <img
      class="preview"
      :src="getImagePreview"
      :alt="file.name"
    >
    <div class="overlay">
      <div class="text">
        {{ file.name }} ({{ kb }} kb)
      </div>
      <div
        v-if="uploaded"
        class="uploaded text"
      >
        Uploaded file!
      </div>
      <div
        v-if="!uploaded"
        class="buttons"
      >
        <button
          class="bg-primary"
          title="Remove"
          :disabled="loading"
          @click="uploadFile"
        >
          {{ loading ? 'Uploading ...' : 'Upload file' }}
        </button>
        <button
          class="bg-red-500"
          title="Remove"
          @click="removeFile"
        >
          Remove file
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ax } from '../../../../lib/plugins/axios';
import { getDebug, parseAxiosError } from '../../../../lib/utils';

const debug = getDebug('file-upload');
export default {
  name: 'FileUpload',
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  emits: ['remove', 'uploaded'],
  data() {
    return {
      loading: false,
      uploaded: false,
    };
  },
  computed: {
    getImagePreview() {
      return URL.createObjectURL(this.file);
    },
    kb() {
      return Math.floor(this.file.size / 1024);
    },
  },
  methods: {
    removeFile() {
      this.$emit('remove', this.file);
    },
    async uploadFile() {
      const body = new FormData();
      body.append('image', this.file);
      this.loading = true;
      try {
        const { status } = await ax.post('media/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (status === 200) {
          this.uploaded = true;
          this.$emit('uploaded', this.file);
        }
      } catch (e) {
        debug(parseAxiosError(e));
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss">
.FileUpload {
  @apply flex flex-col relative my-4;
  img {
    object-fit: cover;
    min-width: 400px;
    min-height: 120px;
    max-height: 400px;
    @apply rounded-xl m-0;
  }
  .overlay{
    @apply absolute inset-4 flex flex-col gap-4 justify-center items-center h-full;

    .text {
      @apply rounded text-white px-2 py-1;
      background: rgba(black, 0.5);
    }
    .uploaded{
    }

    .buttons {
      @apply flex justify-center gap-8;
      button {
        @apply px-2 py-1 rounded text-sm  opacity-50 capitalize cursor-pointer;
        @apply text-white opacity-100 ;
      }
    }
  }
}
</style>
