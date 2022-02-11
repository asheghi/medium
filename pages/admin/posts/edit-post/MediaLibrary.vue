<template>
  <div class="MediaLibrary">
    <div class="top">
      <div
        class="head"
        :class="{active: currentTab === 'library',inactive: currentTab !== 'library'}"
        @click="currentTab = 'library'"
      >
        Media Library
      </div>
      <div
        class="add"
        :class="{active: currentTab === 'add',inactive: currentTab !== 'add'}"
        @click="currentTab = 'add'"
      >
        Add Image
      </div>
    </div>
    <div
      v-if="currentTab === 'library' "
      class="list-media"
    >
      <div
        v-if="loading"
        class="loading"
        v-text="'Fetching images ...'"
      />
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
    <AddMedia
      v-if="currentTab === 'add'"
      @select="onSelect($event)"
    />
  </div>
</template>
<script>
import { ax } from '../../../../lib/plugins/axios';
import AddMedia from './AddMedia.vue';

export default {
  name: 'MediaLibrary',
  components: { AddMedia },
  emits: ['select'],
  data() {
    return {
      media: [],
      currentTab: 'library',
      loading: false,
    };
  },
  mounted() {
    this.fetchMedia();
  },
  methods: {
    async fetchMedia() {
      try {
        this.loading = true;
        const { data, status } = await ax.get('media');
        this.media = data;
      } catch (e) {
      } finally {
        this.loading = false;
      }
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
<style lang="scss">
.MediaLibrary{
  min-width: 400px;
  .top{
    @apply flex justify-between py-4;
    .active{
      @apply text-gray-500 text-lg;
    }
    .inactive{
      @apply cursor-pointer bg-primary-400 text-white border rounded px-2 py-1;
    }
    & > div{
      @apply order-2;
      &.active{
        @apply order-1;
      }
    }
  }
  .list-media{
    @apply p-4;
    .images{
      @apply flex flex-wrap gap-4;
      img{
        max-width: 200px;
        max-height: 120px;
      }
    }
  }
}
</style>