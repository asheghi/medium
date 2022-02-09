<template>
  <div class="InsertMedia">
    <MediaLibrary />
    <AddMedia />
  </div>
</template>
<script>
import MediaLibrary from './MediaLibrary.vue';
import AddMedia from './AddMedia.vue';

export default {
  name: 'InsertMedia',
  components: { AddMedia, MediaLibrary },
};
</script>
<style lang="scss">
.InsertMedia{
}
</style>
