import { defineStore } from 'pinia';

export const useRequestStore = defineStore('request', {
  state: () => ({
    in_progress: {
      getCategoryMaterials: false,
      getCategoryProducts: false,
      getProducts: false,
      getMaterials: false,
      getProductMaterials: false,
      getMaterialProducts: false,
      deleteMaterial: false,
      deleteProduct: false,
      saveMaterial: false,
      saveProduct: false,
    },
    table_scroll: 0,
  }),
  actions: {
    updateInProgress(key, value) {
      this.in_progress[key] = value;
    },
    updateTableScroll(value) {
      this.table_scroll = value;
    },
  },
});
