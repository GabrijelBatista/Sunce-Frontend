<template>
  <div
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-4xl w-full p-6 bg-white rounded-md shadow-xl">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">Lozinka</h3>
        <svg
          @click="togglePasswordModal()"
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-red-900 cursor-pointer hover:text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="mt-4">
        <p class="mb-4 text-sm">
          <label
            class="block mb-2 text-sm font-medium text-gray-900"
            for="current_password"
            >Trenutna lozinka</label
          >
          <input
            type="password"
            autocomplete="one-time-code"
            placeholder="••••••••"
            name="current_password"
            max="20"
            v-model="current_password"
            class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
          />
        </p>
        <p class="mb-4 text-sm">
          <label
            class="block mb-2 text-sm font-medium text-gray-900"
            for="new_password"
            >Nova lozinka</label
          >
          <input
            type="password"
            placeholder="••••••••"
            autocomplete="one-time-code"
            name="password"
            max="20"
            v-model="password"
            class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
          />
        </p>
        <p class="mb-4 text-sm">
          <label
            class="block mb-2 text-sm font-medium text-gray-900"
            for="password_confirmation"
            >Potvrda lozinke</label
          >
          <input
            type="password"
            placeholder="••••••••"
            autocomplete="one-time-code"
            name="password_confirmation"
            max="20"
            v-model="password_confirmation"
            class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
          />
        </p>

        <button
          type="button"
          @click="togglePasswordModal()"
          class="px-6 py-2 text-white border bg-black rounded hover:bg-gray-300"
        >
          Odustani
        </button>
        <button
          class="px-6 py-2 ml-2 text-blue-100 bg-green-600 rounded float-right hover:bg-green-300"
          type="button"
          @click="savePassword()"
        >
          Spremi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCategoryStore } from "/src/store/category";
import { useModalStore } from "/src/store/modal";
import { useNotificationStore } from "/src/store/notification";
import axios from "axios";

const modalStore = useModalStore();
const notificationStore = useNotificationStore();

const current_password = ref("");
const password = ref("");
const password_confirmation = ref("");

const togglePasswordModal = () => {
  current_password.value = "";
  password.value = "";
  password_confirmation.value = "";
  modalStore.toggleModal();
};

const savePassword = () => {
  const data = {
    current_password: current_password.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  };

  axios
    .put("/user/change-password", data)
    .then((response) => {
      notificationStore.addNotification({
        type: "success",
        message: "Lozinka uspješno promijenjena.",
      });
      togglePasswordModal();
    })
    .catch((error) => {
      notificationStore.addNotification({
        type: "error",
        message: "Došlo je do pogreške, lozinka nije promijenjena.",
      });
    });
};
</script>
