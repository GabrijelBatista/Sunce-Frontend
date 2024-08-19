import { defineStore } from "pinia";
import axios from "axios";
import { useNotificationStore } from "/src/store/notification";
import { useModalStore } from "/src/store/modal";
import { useMaterialStore } from "/src/store/material";
import { useProductStore } from "/src/store/product";
import { useRequestStore } from "/src/store/request";
import { reactive } from "vue";

export const useCategoryStore = defineStore("category", {
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
    deleteCategory(category) {
      const confirmed = confirm(
        "Da li Ste sigurni da želite obrisati ovu kategoriju?"
      );
      if (confirmed) {
        const notificationStore = useNotificationStore();
        axios
          .delete("/category/delete/" + category.id)
          .then(() => {
            const itemsStore =
              category.type == 1 ? useProductStore() : useMaterialStore();
            const items = category.type == 1 ? "products" : "materials";

            const category_index = itemsStore[items].findIndex(
              (el) => el.id === category.id
            );
            if (category_index > -1) {
              const requestStore = useRequestStore();
              requestStore.updateInProgress(
                category.type == 1 ? "getProducts" : "getMaterials",
                true
              );
              const endpoint =
                category.type == 1
                  ? "/category/get-product-categories" +
                    (itemsStore.term !== null ? "?term=" + itemsStore.term : "")
                  : "/category/get-material-categories" +
                    (itemsStore.term !== null
                      ? "?term=" + itemsStore.term
                      : "");
              axios.get(endpoint).then((response) => {
                itemsStore[items] = response.data.data;
                itemsStore.categories_current_page = response.data.current_page;
                itemsStore.categories_last_page = response.data.last_page;
                document.getElementById("main-container").scrollTop = 0;
                requestStore.updateInProgress(
                  category.type == 1 ? "getProducts" : "getMaterials",
                  false
                );
              });
            }
            notificationStore.addNotification({
              type: "success",
              message: "Kategorija uspješno obrisana.",
            });
          })
          .catch(() => {
            notificationStore.addNotification({
              type: "error",
              message: "Došlo je do pogreške, kategorija nije obrisana.",
            });
          });
      }
    },
    saveCategory(category) {
      this.selected_category = null;
      const notificationStore = useNotificationStore();
      const modalStore = useModalStore();

      let method = "post";
      let path = "add";
      if (category.id) {
        method = "put";
        path = "edit";
      }

      axios({
        method: method,
        url: "/category/" + path,
        data: category,
      })
        .then((response) => {
          const itemsStore =
            category.type === 1 ? useProductStore() : useMaterialStore();

          const items = category.type == 1 ? "products" : "materials";
          if (path === "edit") {
            const category_index = itemsStore[items].findIndex(
              (el) => el.id === category.id
            );
            if (category_index > -1) {
              itemsStore[items][category_index].name = category.name;
            }
          } else {
            const requestStore = useRequestStore();
            requestStore.updateInProgress(
              category.type == 1 ? "getProducts" : "getMaterials",
              true
            );
            const endpoint =
              category.type == 1
                ? "/category/get-product-categories"
                : "/category/get-material-categories";
            axios.get(endpoint).then((response) => {
              itemsStore[items] = response.data.data;
              itemsStore.categories_current_page = response.data.current_page;
              itemsStore.categories_last_page = response.data.last_page;
              document.getElementById("main-container").scrollTop = 0;
              requestStore.updateInProgress(
                category.type == 1 ? "getProducts" : "getMaterials",
                false
              );
            });
          }
          notificationStore.addNotification({
            type: "success",
            message: response.data.message,
          });
          modalStore.toggleModal();
        })
        .catch(() => {
          notificationStore.addNotification({
            type: "error",
            message: "Kategorija s odabranim imenom već postoji.",
          });
        });
    },
    selectCategory(category) {
      this.selected_category = category;
      this.categories = [];
    },
  },
});
