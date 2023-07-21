<template>
  <div
    class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 fixed right-5 top-5"
    :class="
      notification.type === 'error'
        ? 'text-red-800 bg-red-50 '
        : 'text-green-800 bg-green-50 '
    "
    role="alert"
  >
    {{ notification.message }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '/src/store/notification';

const props = defineProps({
  notification: Object,
});

const notificationStore = useNotificationStore();

onMounted(() => {
  setTimeout(() => {
    notificationStore.addNotification(null);
  }, 5000);
});
</script>
