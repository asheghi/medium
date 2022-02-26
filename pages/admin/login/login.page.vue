<template>
  <div class="LoginPage">
    <form @submit.prevent="submit">
      <div class="left">
        <div class="title">
          Login
        </div>
        <div
          class="desc"
          v-text="'yet another login'"
        />
      </div>
      <div class="right">
        <div>
          <div class="form-group">
            <label
              for="email"
              class="form-label"
            >Email address</label>
            <input
              id="email"
              v-model="form.email"
              :disabled="loading"
              type="email"
              class="input"
              aria-describedby="emailHelp"
              placeholder=""
            >
          </div>
          <div class="form-group">
            <label
              for="password"
              class="form-label"
            >Password</label>
            <input
              id="password"
              v-model="form.password"
              :disabled="loading"
              type="password"
              class="input"
              placeholder=""
            >
          </div>
          <div class="form-group">
            <button
                data-test="submit"
              type="submit"
              class="button"
              :disabled="loading"
              :class="{loading}"
            >
              {{ loading ? 'Processing ...' : 'Continue' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ax } from '../../../lib/plugins/axios';
import { defaultSiteTitle } from '../../../lib/config';

export default {
  pageTitle: `Login to ${defaultSiteTitle}`,
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const { status, data } = await ax.post('auth/login', this.form);
        if (status === 200) {
          window.location.href = '/admin';
        } else {
          alert('oops, not what you thought!');
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
  cacheControl: 'public, max-age=86400',
};
</script>

<style lang="scss">
.LoginPage {
  @apply flex justify-center items-center min-h-screen;
  form {
    @apply flex flex-col sm:flex-row gap-12 items-start items-center
    border border-gray-300 px-12 py-10 rounded-xl border-dashed
    shadow-lg;
    .left{
      min-width: 200px;
      @apply  flex flex-col justify-center items-start;
      .title{
        @apply text-4xl font-extrabold text-transparent pb-4
        bg-clip-text bg-gradient-to-b from-primary-400 to-blue-600;
      }
      .desc{
        @apply opacity-50 text-sm;
      }
    }
    .form-group{
      @apply flex flex-col py-2;
      .form-label{
        @apply text-xs opacity-50 mb-2;
      }
    }
    input {
      @apply px-2 bg-gray-100 py-1 border rounded border-gray-300 ring-0 outline-primary;
    }

    .button {
      @apply border border-primary transition bg-primary text-white px-4 py-1 rounded text-lg
      font-bold;
      &:hover,&:focus{
        @apply bg-white text-primary border border-primary;
      }
      &:active{
        @apply scale-90;
      }
      &.loading{
        @apply bg-primary text-white border border-primary opacity-50;
        @apply scale-100;
      }
    }
  }
}
</style>
