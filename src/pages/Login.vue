<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 max-w-4xl w-full"
  >
    <a
      href="#"
      class="flex items-center mb-6 text-2xl font-semibold text-gray-900"
    >
      <img
        class="w-8 h-8 mr-2"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="logo"
      />
      Logo
    </a>
    <div
      class="w-full bg-white rounded-md shadow md:mt-0 sm:max-w-md xl:p-0"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          PRIJAVA
        </h1>
        <form class="space-y-4 md:space-y-6" @submit.prevent="Login">
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              placeholder="ime@domena.com"
              required
              v-model="email"
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Lozinka</label
            >
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              required
              v-model="password"
            />
          </div>
          <div class="flex items-center justify-between">
            <a
              href="#"
              class="text-sm font-medium text-primary-950 hover:underline"
              >Zaboravili ste lozinku?</a
            >
          </div>
          <button
            type="submit"
            class="w-full text-white bg-green-600 hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-primary-950 font-medium rounded-md text-sm px-5 py-2.5 text-center"
          >
            PRIJAVI SE
          </button>
          <p class="text-sm font-light text-gray-500">
            Još nemate račun?
            <RouterLink
              to="/register"
              class="font-medium text-primary-950 hover:underline"
              >Registujte se!
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '/src/store/user';
import { useNotificationStore } from '/src/store/notification';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const Login = () =>
  axios
    .post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      userStore.addToken(response.data.authorisation.token);
      router.push({ name: 'Products' });
    })
    .catch((error) => {
      notificationStore.addNotification({
        type: 'error',
        message: error.response.data.message,
      });
    });
</script>
