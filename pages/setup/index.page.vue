<template>
  <div class="SetupPage">
    <form @submit.prevent="submit">
      <div class="left">
        <div class="title">
          Setup Admin
        </div>
        <p class="desc">
          we don't know who's the boss yet!
        </p>
      </div>
      <div class="right">
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
    </form>
  </div>
</template>

<script>
import { ax } from '../../lib/plugins/axios';
import { defaultSiteTitle } from '../../lib/config';

export default {
  siteTitle: `${defaultSiteTitle} - Setup`,
  name: 'SetupPage',
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
      const { email, password } = this.form;
      // todo add proper form validation
      if (!email || !password) {
        return;
      }
      this.loading = true;
      try {
        const { status } = await ax.post('auth/setup', { email, password });
        if (status === 200) {
          window.location.href = '/admin';
        } else {
          // eslint-disable-next-line no-alert
          alert('something went wrong!');
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = true;
      }
    },
  },
};
</script>

<style lang="scss">
.SetupPage {
  @apply flex justify-center items-center min-h-screen;
  form {
    @apply flex flex-col sm:flex-row gap-12 items-center
    border border-gray-200 shadow-lg px-8 py-10 rounded-xl border-dashed;
    .left{
      .title{
        @apply text-4xl font-extrabold text-transparent pb-4
      bg-clip-text bg-gradient-to-b from-primary-400 to-blue-600 sm:pr-8;
      }
      p{
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
      @apply px-2 py-1 bg-gray-100 border rounded border-gray-300 ring-0 outline-primary;
    }

    .button {
      @apply border border-primary transition font-bold bg-primary text-white px-4 py-1 rounded text-lg;
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
