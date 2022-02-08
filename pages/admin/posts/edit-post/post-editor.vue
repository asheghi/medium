<template>
  <div class="PostEditor">
    <div
      v-if="editor"
      class="top-menu"
    >
      <button
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Icon
          width="24"
          height="24"
          icon="bold"
        />
      </button>
      <button
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Icon
          width="24"
          height="24"
          icon="italic"
        />
      </button>
      <button
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <Icon
          width="24"
          height="24"
          icon="strike"
        />
      </button>
      <button
        :class="{ 'is-active': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
      >
        code
      </button>
      <button @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </button>
      <button @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </button>
      <button
        :class="{ 'is-active': editor.isActive('paragraph') }"
        @click="editor.chain().focus().setParagraph().run()"
      >
        paragraph
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        h1
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        h2
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        h3
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        h4
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        h5
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        h6
      </button>
      <button
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        bullet list
      </button>
      <button
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        ordered list
      </button>
      <button
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        code block
      </button>
      <button
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        blockquote
      </button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </button>
      <button @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </button>
      <button @click="editor.chain().focus().undo().run()">
        undo
      </button>
      <button @click="editor.chain().focus().redo().run()">
        redo
      </button>
    </div>
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
    <div
      v-if="showIcon"
      ref="iconPlus"
      class="icon-plus"
      @click="addImage"
    >
      +
    </div>
  </div>
</template>

<script>
import {
  Editor, EditorContent, BubbleMenu,
} from '@tiptap/vue-3';
import ImageExtension from '@tiptap/extension-image';
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
      showIcon: true,
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
        ImageExtension,
      ],
      onUpdate: ({ editor }) => {
        this.$emit('update:modelValue', editor.getHTML());
      },
    });
    window.editor = this.editor;
    await this.$nextTick();
    // console.log('element:', element);
    this.editor.on('transaction', () => {
      /* try {
        const { view } = this.editor;
        const { state } = view;

        // Sometime check for `empty` is not enough.
        // Doubleclick an empty paragraph returns a node size of 2.
        // So we check also for an empty text size.
        const isEmptyTextBlock = isTextSelection(state.selection);

        this.showIcon = !!(state?.selection?.empty /!* || isEmptyTextBlock *!/);
        console.log('showIcon', this.showIcon);
      } catch (e) {
        console.error(e);
      } */

      try {
        const selection = window?.getSelection();
        const { anchorNode } = selection;

        const e = selection.focusNode;
        let pos;
        if (e.getBoundingClientRect) {
          pos = e.getBoundingClientRect();
        } else {
          pos = anchorNode.parentNode.getBoundingClientRect();
        }
        this.$refs.iconPlus.style.top = `${pos.top + window.scrollY}px`;
        this.$refs.iconPlus.style.left = `${Math.floor(pos.left - 70)}px`;
      } catch (e) {
        console.error(e);
      }
    });
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  },
  methods: {
    addImage() {
      const url = window.prompt('URL');
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
};
</script>

<style lang="scss">
.PostEditor {
  @apply flex flex-col gap-4;
  .top-menu{
    @apply flex flex-wrap gap-2;
    button{
      @apply border rounded px-2 py-1;
      &.is-active{
        @apply text-primary bg-gray-200;
      }
    }
  }
  .icon-plus{
    @apply absolute cursor-pointer text-2xl font-bold shadow
    bg-gradient-to-t from-primary to-primary-300 flex justify-center
    items-center text-white bg-primary rounded-full w-8 h-8;
  };
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
