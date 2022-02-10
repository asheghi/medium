<template>
  <div class="MediaLibrary">
    <div class="list-media">
      Media Library
      <br>
      <div class="images">
        <div
          v-for="image in media"
          :key="image.id"
          class="image"
        >
          <img
            :src="getImageUrl(image)"
            :alt="image.alt"
            @click="onSelect(image)"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ax } from '../../../../lib/plugins/axios';

export default {
  name: 'MediaLibrary',
  emits: ['select'],
  data() {
    return {
      media: [],
    };
  },
  mounted() {
    this.fetchMedia();
  },
  methods: {
    async fetchMedia() {
      const { data, status } = await ax.get('media');
      this.media = data;
    },
    onSelect(image) {
      this.$emit('select', this.getImageUrl(image));
    },
    getImageUrl(image) {
      return `/api/media/${image.filename}`;
    },
  },
};
</script>
