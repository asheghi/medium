<template>
  <div class="PostEditor">
    <bubble-menu
      v-if="editor"
      class="bubble-menu"
      :editor="editor"
    >
      <button
        :class="{ 'active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Icon
          width="24"
          height="24"
          icon="bold"
        />
      </button>
      <button
        :class="{ 'active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Icon
          width="24"
          height="24"
          icon="italic"
        />
      </button>
      <button
        :class="{ 'active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <Icon
          width="24"
          height="24"
          icon="strike"
        />
      </button>
    </bubble-menu>
    <editor-content
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import DynamicIcon from '../../../../components/DynamicIcon';

export default {
  name: 'PostEditor',
  components: {
    EditorContent, BubbleMenu, Icon: DynamicIcon,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editor: null,
    };
  },
  async mounted() {
    this.editor = new Editor({
      content: this.modelValue,
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
        },
      },
      extensions: [
        StarterKit,
      ],
      onUpdate: ({ editor }) => {
        this.$emit('update:modelValue', editor.getHTML());
      },
    });
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  },
};
</script>

<style lang="scss">
.PostEditor {
  @apply flex flex-col gap-4;
}

/* Basic editor styles */
.ProseMirror {
  max-width: 100vw;
  width: 100%;
  @apply w-full border-gray-200 px-4 py-2 m-0;
  /*> * + * {
    margin-top: 0.75em;
  }*/
}

.bubble-menu {
  @apply flex gap-1 px-1 py-1 bg-white shadow border border-gray-400 rounded;
  button {
    @apply flex justify-center items-center rounded text-primary;
    width: 24px;
    height: 24px;

    svg {
      width: 24px;
      height: 24px;
      fill: theme('colors.gray.400')
    }

    &.active {
      svg {
        fill: theme('colors.primary.400')
      }
    }
  }
}
</style>
