<template>
  <div class="InsertMedia">
    <MediaLibrary @select="$emit('select',$event)" />
  </div>
</template>
<script>
import MediaLibrary from './MediaLibrary.vue';

export default {
  name: 'InsertMedia',
  components: { MediaLibrary },
  emits: ['select'],
};
</script>
<style lang="scss">
.InsertMedia{
}
</style>
