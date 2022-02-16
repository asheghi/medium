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
      ref="topMenu"
      class="bubble-menu"
      :editor="editor"
    >
      <div class="group">
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
      </div>
      <div class="group">
        <button
          class="h3"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          <span class="icon"> T</span>
        </button>
        <button
          class="h4"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        >
          <span class="icon small">
            T
          </span>
        </button>
      </div>
      <div class="group">
        <button
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <Icon
            width="24"
            height="24"
            icon="bulleted"
          />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <Icon
            width="24"
            height="24"
            icon="numbered"
          />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <Icon
            width="24"
            height="24"
            icon="code"
          />
        </button>
        <button
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <Icon
            width="24"
            height="24"
            icon="quotes"
          />
        </button>
        <button
          v-if="!editor.getAttributes('link').href"
          @click="onSetLinkClicked"
        >
          <Icon
            width="24"
            height="24"
            icon="link"
          />
        </button>
        <button
          v-if="editor.getAttributes('link').href"
          @click="unsetLink"
        >
          <Icon
            width="24"
            height="24"
            icon="unlink"
          />
        </button>
      </div>
      <div class="group text-align">
        <button
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          @click="editor.chain().focus().setTextAlign('left').run()"
        >
          <Icon
            width="24"
            height="24"
            icon="text-align-left"
          />
        </button>
        <button
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          @click="editor.chain().focus().setTextAlign('center').run()"
        >
          <Icon
            width="24"
            height="24"
            icon="text-align-center"
          />
        </button>
        <button
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          @click="editor.chain().focus().setTextAlign('right').run()"
        >
          <Icon
            width="24"
            height="24"
            icon="text-align-right"
          />
        </button>
        <button
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          @click="editor.chain().focus().setTextAlign('justify').run()"
        >
          <Icon
            width="24"
            height="24"
            icon="text-align-justify"
          />
        </button>
        <!--        <button @click="editor.chain().focus().unsetTextAlign().run()">
          <Icon
            width="24"
            height="24"
            icon="strike"
          />
        </button>-->
      </div>
    </bubble-menu>
    <editor-content
      :editor="editor"
    />
    <div
      v-show="showIcon"
      ref="iconPlus"
      class="icon-plus"
      @click.prevent.stop="showMediaModal"
    >
      +
    </div>
    <TModal
      ref="modal"
      class="MediaModal"
    >
      <InsertMedia @select="addImage" />
    </TModal>
    <TModal
      ref="linkModal"
    >
      <div class="LinkModal">
        <input
          v-model="link_href"
          placeholder="https://..."
          type="text"
        >
        <button
          @click="setLink"
        >
          Set
        </button>
      </div>
    </TModal>
  </div>
</template>

<script>
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3';
import ImageExtension from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Text from '@tiptap/extension-text';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import InsertMedia from './InsertMedia.vue';
import TModal from '../../../../components/modal.vue';
import DynamicIcon from '../../../../components/DynamicIcon';

export default {
  name: 'PostEditor',
  components: {
    InsertMedia,
    TModal,
    EditorContent,
    BubbleMenu,
    Icon: DynamicIcon,
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
      showIcon: false,
      focused: false,
      link_href: null,
    };
  },
  computed: {},
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
        Document,
        Paragraph,
        Text,
        Heading,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Link.configure({
          openOnClick: false,
        }),
      ],
      onUpdate: ({ editor }) => {
        this.$emit('update:modelValue', editor.getHTML());
      },
    });
    await this.$nextTick();
    window.e = this.editor;
    this.editor.on('focus', () => {
      this.focused = true;
      this.updateIconPosition();
    });
    this.editor.on('blur', () => {
      this.focused = false;
    });
    this.editor.on('transaction', () => {
      this.updateIconPosition();
      this.updateShowIconState();
    });
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  },
  methods: {
    addImage(url) {
      this.$refs.modal.hide();
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },
    updateIconPosition() {
      const topMenuPos = document.querySelector('.top-menu').getBoundingClientRect();
      const topMenuBottom = topMenuPos.bottom + 15;

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

        let iconTop = pos.top + window.scrollY;
        if (iconTop < topMenuBottom) {
          iconTop = topMenuBottom;
        }
        this.$refs.iconPlus.style.top = `${iconTop}px`;
        this.$refs.iconPlus.style.left = `${Math.floor(topMenuPos.left - 48)}px`;
      } catch (e) {
        // console.error(e);
        this.$refs.iconPlus.style.top = `${topMenuBottom + 9}px`;
        this.$refs.iconPlus.style.left = `${Math.floor(topMenuPos.left - 48)}px`;
      }
    },
    updateShowIconState() {
      try {
        const { view } = this.editor;
        const { state } = view;
        this.showIcon = !state?.selection?.ranges[0].$from.parent.textContent.trim();
      } catch (e) {
        console.error(e);
        this.showIcon = false;
      }
    },
    showMediaModal() {
      this.$refs.modal.show();
    },
    setLink() {
      if (!this.link_href) return;
      this.$refs.linkModal.hide();
      this.editor.commands.setLink({ href: this.link_href, target: '_blank' });
    },
    unsetLink() {
      this.editor.commands.unsetLink();
    },
    onSetLinkClicked() {
      this.link_href = this.editor.getAttributes('link').href;
      this.$refs.linkModal.show();
    },
  },
};
</script>

<style lang="scss">
.PostEditor {
  @apply flex flex-col gap-4 container mx-auto;
  .top-menu {
    width: 0;
    height: 0;
    overflow: hidden;
    @apply flex flex-wrap gap-2;
    button {
      @apply border rounded px-2 py-1;
      &.is-active {
        @apply text-primary bg-gray-200;
      }
    }
  }

  .icon-plus {
    @apply absolute transition transform cursor-pointer text-2xl font-bold shadow
    bg-gradient-to-t from-primary to-primary-300 flex justify-center
    items-center text-white bg-primary rounded-full w-8 h-8 opacity-50;
    &:hover {
      @apply shadow opacity-100 scale-110;
    }

    .icon-plus-content {
      @apply absolute left-8;
    }
  }
;
}

/* Basic editor styles */
.ProseMirror {
  max-width: 100vw;
  width: 100%;
  @apply w-full border border-dashed rounded-xl border-gray-300 px-4 py-2 m-0;
  /*> * + * {
    margin-top: 0.75em;
  }*/
}

.bubble-menu {
  @apply flex bg-white px-1 py-1 shadow-lg transition-all transition border border-gray-400 rounded gap-3;
  min-width: 400px;

  & > div {
    @apply flex gap-1;
  }

  .small {
    @apply transform scale-[.85];
    transform-origin: bottom;
  }

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

hr {
  width: 340px;
  margin: 0 auto;
}
.LinkModal{
  @apply px-4 py-4 flex items-center gap-2;
  input{
    @apply outline-primary border-gray-200 rounded border px-2 py-1 h-8;
  }
  button{
    @apply bg-primary text-white px-4 py-1 max-h-8 rounded;
  }
}
</style>
