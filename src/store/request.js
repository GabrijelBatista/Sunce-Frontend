import { defineStore } from 'pinia';

export const useRequestStore = defineStore('request', {
  state: () => ({
    in_progress: false,
    table_scroll: 0,
  }),
  actions: {
    updateInProgress(value) {
      this.in_progress = value;
    },
    updateTableScroll(value) {
      this.table_scroll = value;
    },
  },
});
