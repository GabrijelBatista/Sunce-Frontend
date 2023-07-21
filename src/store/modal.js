import { defineStore } from 'pinia';
import { useCategoryStore } from './category';
import { useProductStore } from './product';

export const useModalStore = defineStore('modal', {
  state: () => ({
    modal: null,
  }),
  actions: {
    toggleModal(modal = null) {
      if (!modal) {
        const categoryStore = useCategoryStore();
        const productStore = useProductStore();

        categoryStore.selectCategory(null);
        productStore.selectItem(null);
        productStore.resetSelectedItems();
      }
      this.modal = modal;
    },
  },
});
