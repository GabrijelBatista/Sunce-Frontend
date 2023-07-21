import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notification: null,
  }),
  actions: {
    addNotification(notification) {
      this.notification = notification;
    },
  },
});
