<template>
  <div class="LoginPage">
    <form @submit.prevent="submit">
      <div class="head">
        <h2>Login </h2>
        <p>
          Lorem ipsum dolor sit amet
        </p>
      </div>
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
            placeholder="Enter email"
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
            placeholder="Password"
          >
        </div>
      </div>
      <button
        type="submit"
        class="button"
        :disabled="loading"
        :class="{loading}"
      >
        {{ loading ? 'Processing ...' : 'Continue' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ax } from '../../../lib/plugins/axios';

export default {
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
};
</script>

<style lang="scss">
.LoginPage {
  @apply flex justify-center items-center min-h-screen;
  form {
    @apply flex flex-col gap-8 items-start
    border border-primary px-12 py-10 rounded-xl border-dashed;
    .head{
      h2{
        @apply font-bold opacity-75 text-lg;
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
      @apply px-2 bg-gray-100 py-1 border rounded border-gray-300 ring-0 outline-primary;
    }

    .button {
      @apply border border-primary transition bg-primary text-white px-4 py-1 rounded text-lg;
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
