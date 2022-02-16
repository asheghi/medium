<template>
  <div class="Modal">
    <transition name="fade">
      <div
        v-if="open"
        class="modal-fullscreen"
        @click.stop.prevent="hide"
      >
        <div
          class="modal-box"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TModal',
  components: {},
  data() {
    return {
      open: false,
    };
  },
  methods: {
    show() {
      this.open = true;
    },
    hide() {
      this.open = false;
    },
  },
};
</script>

<style lang="scss">
.Modal {
  transition: all ease 360ms;
  .modal-fullscreen {
    @apply fixed inset-0 w-full h-screen overflow-hidden;
    z-index: 9999;
    @apply w-full h-full flex justify-center items-center;
    background: rgba(black, 0.1);
    backdrop-filter: blur(1px);

    .modal-box {
      z-index: 999999!important;
      @apply bg-white px-4 py-6 rounded-xl shadow-xl;
      max-height: 80vh;
      overflow-y: auto;
      max-width: 80vw;
      overflow-x: auto;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
