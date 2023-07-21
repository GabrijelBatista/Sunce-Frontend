import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
  }),
  actions: {
    addToken(token) {
      this.token = token;
    },
  },
  persist: true,
});
