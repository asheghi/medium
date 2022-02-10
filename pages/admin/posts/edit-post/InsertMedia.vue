<template>
  <div class="InsertMedia">
    <MediaLibrary @select="$emit('select',$event)" />
    <AddMedia />
  </div>
</template>
<script>
import MediaLibrary from './MediaLibrary.vue';
import AddMedia from './AddMedia.vue';

export default {
  name: 'InsertMedia',
  components: { AddMedia, MediaLibrary },
  emits: ['select'],
};
</script>
<style lang="scss">
.InsertMedia{
}
</style>
