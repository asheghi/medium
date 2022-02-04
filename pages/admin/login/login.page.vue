<template>
  <div class="LoginPage">
    <div class="box">
      <div
        class="head"
        v-text="'login'"
      />
      <div class="form">
        <div class="block">
          <div
            class="label"
            v-text="'Email'"
          />
          <input
            v-model="form.email"
            type="email"
            name="email"
            placeholder="Email"
          >
        </div>
        <div class="block">
          <div
            class="label"
            v-text="'Password'"
          />
          <input
            v-model="form.password"
            type="password"
            name="password"
            placeholder="Password"
          >
        </div>
      </div>
      <div
        class="submit"
        @click="submit"
        v-text="'continue'"
      />
    </div>
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
      const { status, data } = await ax.post('auth/login', this.form);
      if (status === 200) {
        window.location.href = '/admin';
      } else {
        alert('oops, not what you thought!');
      }
    },
  },
};
</script>

<style lang="scss">
.LoginPage {
  @apply min-h-screen flex justify-center items-center bg-gray-400;
  .box {
    @apply px-6 py-8 border rounded-xl shadow-lg bg-white flex flex-col gap-8;
    .head{
      @apply text-center capitalize text-2xl;
    }
    .form {
      @apply flex flex-col gap-4;
      .block {
        .label{
          @apply text-xs opacity-30 mb-1;
        }
        input {
          @apply rounded border border-gray-400 px-2 py-1 ring-0;
        }
      }

    }
    .submit{
         @apply cursor-pointer bg-primary rounded text-white text-center
         px-4 py-1 capitalize text-lg;
       }
  }
}

</style>
