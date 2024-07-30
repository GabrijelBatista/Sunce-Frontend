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
        <form
          class="space-y-4 md:space-y-6"
          @submit.prevent="sendVerificationCode()"
        >
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
          <button
            type="submit"
            class="w-full text-white bg-green-600 hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-primary-950 font-medium rounded-md text-sm px-5 py-2.5 text-center"
            :disabled="userStore.waiting_for_response"
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
import { useUserStore } from "/src/store/user";

const email = ref("");

const userStore = useUserStore();
const sendVerificationCode = () => {
  userStore.sendVerificationCode(email.value);
};
</script>
