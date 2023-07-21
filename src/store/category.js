import { defineStore } from 'pinia';
import axios from 'axios';
import { useNotificationStore } from '/src/store/notification';
import { useModalStore } from '/src/store/modal';
import { useMaterialStore } from '/src/store/material';
import { useProductStore } from '/src/store/product';

import { reactive } from 'vue';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: reactive([]),
    selected_category: null,
  }),
  actions: {
    getCategories(endpoint) {
      axios.get(endpoint).then((response) => {
        this.categories = response.data;
        this.selected_category = null;
      });
    },
    saveCategory(category) {
      this.selected_category = null;
      const notificationStore = useNotificationStore();
      const modalStore = useModalStore();

      let method = 'post';
      let path = 'add';
      if (category.id) {
        method = 'put';
        path = 'edit';
      }

      axios({
        method: method,
        url: '/category/' + path,
        data: category,
      })
        .then((response) => {
          if (path === 'edit') {
            const itemsStore =
              category.type === 1
                ? useProductStore()
                : useMaterialStore();

            const items =
              category.type === 1 ? 'products' : 'materials';

            const category_index = itemsStore[items].findIndex(
              (el) => el.id === category.id
            );
            if (category_index > -1) {
              itemsStore[items][category_index].name = category.name;
            }
          }
          notificationStore.addNotification({
            type: 'success',
            message: response.data.message,
          });
          modalStore.toggleModal();
        })
        .catch((error) => {
          notificationStore.addNotification({
            type: 'error',
            message: error.response.data.message,
          });
        });
    },
    selectCategory(category) {
      this.selected_category = category;
      this.categories = [];
    },
  },
});
