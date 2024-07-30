<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 max-w-4xl w-full"
  >
    <RouterLink
      to="/"
      class="flex items-center mb-6 text-2xl font-semibold text-gray-900"
    >
      <img class="w-16 h-16" src="/assets/sunce-logo.png" alt="logo" />
    </RouterLink>
    <div class="w-full bg-white rounded-md shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="font-bold bg-green-500 leading-tight tracking-tight text-white text-center p-2"
        >
          Verifikacijski kod je poslan na Vašu email adresu.
        </h1>
        <form class="space-y-4 md:space-y-6" @submit.prevent="resetPassword()">
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
              disabled
              v-model="email"
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Nova lozinka</label
            >
            <input
              type="password"
              name="password"
              autocomplete="off"
              id="password"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              required
              v-model="password"
            />
          </div>
          <div>
            <label
              for="password_confirmation"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Potvrda lozinke</label
            >
            <input
              type="password"
              name="password_confirmation"
              autocomplete="off"
              id="password-confirmation"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              required
              v-model="password_confirmation"
            />
          </div>
          <div>
            <label
              for="code"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Verifikacijski kod</label
            >
            <input
              type="code"
              name="code"
              autocomplete="off"
              id="code"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              placeholder="123456"
              required
              v-model="code"
            />
          </div>
          <div class="flex items-center justify-between">
            <span
              @click="sendVerificationCode()"
              class="text-sm font-medium text-primary-950 hover:underline cursor-pointer"
              >Pošalji novi verifikacijski kod.</span
            >
          </div>
          <button
            type="submit"
            :disabled="userStore.waiting_for_response"
            class="w-full text-white bg-green-600 hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-primary-950 font-medium rounded-md text-sm px-5 py-2.5 text-center"
          >
            POTVRDI
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "/src/store/user";
import { useNotificationStore } from "/src/store/notification";
import { useRouter } from "vue-router";

const password = ref("");
const password_confirmation = ref("");
const code = ref("");

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const email = userStore.email;

const sendVerificationCode = () => {
  if (!userStore.waiting_for_response) {
    userStore.sendVerificationCode(email);
  }
};

const resetPassword = () =>
  axios
    .put("/auth/reset-password", {
      email: email,
      password: password.value,
      password_confirmation: password_confirmation.value,
      code: code.value,
    })
    .then((response) => {
      userStore.addToken(response.data.token);
      userStore.setVerified(true);
      notificationStore.addNotification({
        type: "success",
        message: "Lozinka uspješno promijenjena.",
      });
      router.push({ name: "Products" });
    })
    .catch(() => {
      notificationStore.addNotification({
        type: "error",
        message: "Došlo je do pogreške, lozinka nije promijenjena.",
      });
    });
</script>
