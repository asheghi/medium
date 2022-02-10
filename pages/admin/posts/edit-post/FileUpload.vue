<template>
  <div class="FileUpload">
    <img
      class="preview"
      :src="getImagePreview"
      :alt="file.name"
    >
    <div class="text">
      {{ file.name }} ({{ kb }} kb)
    </div>
    <div
      v-if="uploaded"
      class="uploaded"
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
        @click="uploadFile"
      >
        Upload file
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
  emits: ['remove'],
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
        const { status, data } = await ax.post('media/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (status === 200) {
          this.uploaded = true;
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
  @apply flex flex-col relative py-4;
  img {
    max-height: 400px;
    @apply rounded-xl;
  }

  .text {
    @apply py-2 text-gray-500;
  }

  .buttons {
    @apply flex justify-center gap-8;
    button {
      @apply px-2 py-1 rounded text-sm  opacity-50 capitalize cursor-pointer;
      @apply text-white opacity-100 ;
    }
  }
}
</style>
