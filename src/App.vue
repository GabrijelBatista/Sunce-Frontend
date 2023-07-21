<template>
  <div class="min-h-screen bg-gray-400">
    <NavBar
      :current_route="current_route"
      class="fixed w-full z-30"
    />
    <transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="transform opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-75"
    >
      <AlertBox
        class="z-50"
        v-if="notification"
        :notification="notification"
      />
    </transition>
    <div
      id="main-container"
      class="bg-gray-400 py-20 max-h-screen overflow-y-auto"
    >
      <div
        class="relative overflow-x-auto max-w-4xl flex flex-wrap items-center justify-between mx-auto"
      >
        <RouterView class="mb-30" />
      </div>
      <Spinner
        v-show="
          request_in_progress && !current_modal && !table_scroll
        "
        class="mb-32 -mt-20"
      />
    </div>
    <PageFooter
      v-if="
        current_route === 'Products' || current_route === 'Materials'
      "
      class="fixed bottom-0 left-0 right-0 mr-auto ml-auto min overflow-x-auto max-w-4xl rounded-t-md"
      :current_route="current_route"
    />
  </div>
  <CategoryModal
    class="z-40"
    v-if="current_modal && current_modal.name === 'Categories'"
    :modal="current_modal"
    :current_route="current_route"
  />
  <MaterialModal
    class="z-40"
    v-if="current_modal && current_modal.name === 'Materials'"
    :modal="current_modal"
  />
  <ProductModal
    class="z-40"
    v-if="current_modal && current_modal.name === 'Products'"
    :modal="current_modal"
  />
  <PasswordModal
    class="z-40"
    v-if="current_modal && current_modal.name === 'Password'"
  />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import AlertBox from '/src/components/AlertBox.vue';
import NavBar from '/src/components/NavBar.vue';
import PageFooter from '/src/components/PageFooter.vue';
import MaterialModal from '/src/components/MaterialModal.vue';
import ProductModal from '/src/components/ProductModal.vue';
import CategoryModal from './components/CategoryModal.vue';
import PasswordModal from './components/PasswordModal.vue';
import Spinner from '/src/components/Spinner.vue';
import { computed } from 'vue';
import { useNotificationStore } from '/src/store/notification';
import { useRequestStore } from '/src/store/request';
import { useModalStore } from '/src/store/modal';

const modalStore = useModalStore();
const notificationStore = useNotificationStore();
const requestStore = useRequestStore();
const route = useRoute();

const current_modal = computed({
  get() {
    return modalStore.modal;
  },
});

const notification = computed({
  get() {
    return notificationStore.notification;
  },
});

const request_in_progress = computed({
  get() {
    return requestStore.in_progress;
  },
});

const table_scroll = computed({
  get() {
    return requestStore.table_scroll;
  },
});

const current_route = computed({
  get() {
    return route.name;
  },
});
</script>
