<template>
  <div class="AddMedia">
    <div class="tabs">
      <div
        :class="{active:currentTab === TAB_UPLOAD}"
        class="tab"
        @click="currentTab = TAB_UPLOAD"
      >
        from computer
      </div>
      <div
        :class="{active:currentTab === TAB_URL}"
        class="tab"
        @click="currentTab = TAB_URL"
      >
        from url
      </div>
    </div>
    <div class="content">
      <div
        v-if="currentTab === TAB_UPLOAD"
        class="upload-content"
      >
        <div class="files">
          <fileUpload
            v-for="(file,index) in files"
            :key="index"
            :file="file"
            @remove="removeFile"
            @uploaded="onFileUploaded"
          />
        </div>

        <div
          class="drop-area"
          @dragover.prevent
          @drop.prevent="addFile"
        >
          <div class="inside">
            <DynamicIcon
              class="icon"
              icon="image"
              width="56"
              height="56"
            />
            <div class="text">
              Drag and Drop here or
            </div>
            <div
              type="file"
              class="button"
              @click="$refs.inputFile.click()"
            >
              Browse Files
            </div>
            <input
              ref="inputFile"
              hidden
              type="file"
              @change="addFileInput"
            >
          </div>
        </div>
      </div>
      <div
        v-if="currentTab === TAB_URL"
        class="from-url-content"
      >
        <input
          v-model="fromUrl"
          type="text"
          placeholder="link"
        >
        <button
          class="button"
          @click="insertFromUrl"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DynamicIcon from '../../../../components/DynamicIcon';
import FileUpload from './FileUpload.vue';

const TAB_UPLOAD = 'upload';
const TAB_URL = 'url';

export default {
  name: 'AddMedia',
  components: { FileUpload, DynamicIcon },
  data() {
    return {
      currentTab: TAB_UPLOAD,
      TAB_UPLOAD,
      TAB_URL,
      files: [],
      fromUrl: '',
    };
  },
  methods: {
    addFile(e) {
      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) return;
      this.files.push(...droppedFiles);
    },
    removeFile(file) {
      this.files = this.files.filter((f) => f !== file);
    },
    upload() {
      const formData = new FormData();
      this.files.forEach((f, x) => {
        formData.append(`file${x + 1}`, f);
      });

      fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log('done uploading', res);
        })
        .catch((e) => {
          console.error(JSON.stringify(e.message));
        });
    },
    addFileInput(e) {
      const { files } = e.target;
      if (files) {
        this.files.push(...files);
      }
    },
    insertFromUrl() {

    },
    onFileUploaded(arg) {
      setTimeout(() => {
        this.removeFile(arg);
      }, 5000);
    },
  },
};
</script>
<style lang="scss">
.AddMedia {
  min-width: 400px;
  min-height: 360px;
  @apply px-8;
  .tabs {
    @apply flex gap-2;
    .tab {
      @apply px-2 py-1 rounded text-sm  opacity-50 capitalize cursor-pointer;
      &.active {
        @apply bg-primary text-white opacity-100 ;
      }
    }
  }

  .content {
    .upload-content {
      @apply py-1;
      .drop-area {
        @apply border my-8 h-56 rounded-2xl border-dashed border-2 border-primary;
        .inside{
          @apply flex flex-col justify-center items-center h-full gap-3;
          .icon{
              fill:theme('colors.primary.400')
          }
          .text{
            @apply text-gray-500
          }
          .button{
            @apply cursor-pointer bg-primary text-white px-3 py-1 rounded;
          }
        }
      }
    }
    .from-url-content{
      @apply py-4;
      input{
        @apply border px-2 py-1 rounded bg-gray-100;
      }
    }
  }
}
</style>
