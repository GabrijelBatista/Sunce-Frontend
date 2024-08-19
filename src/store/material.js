import { defineStore } from "pinia";
import axios from "axios";
import { useNotificationStore } from "/src/store/notification";
import { useRequestStore } from "/src/store/request";
import { useModalStore } from "/src/store/modal";
import { reactive } from "vue";

export const useMaterialStore = defineStore("material", {
  state: () => ({
    materials: reactive([]),
    material_products: reactive([]),
    categories_current_page: 1,
    categories_last_page: 1,
    products_current_page: 1,
    products_last_page: 1,
    term: null,
  }),
  actions: {
    getMaterials(page = 1, term = null) {
      if (page <= this.categories_last_page) {
        const requestStore = useRequestStore();
        if (term !== null) {
          this.term = term;
          this.products = [];
        }
        if (!requestStore.in_progress.getMaterials) {
          const endpoint =
            this.term !== null
              ? "/category/get-material-categories?page=" +
                page +
                "&term=" +
                this.term
              : "/category/get-material-categories?page=" + page;
          requestStore.updateInProgress("getMaterials", true);
          axios.get(endpoint).then((response) => {
            this.materials =
              this.term !== null
                ? response.data.data
                : this.materials.concat(response.data.data);
            this.categories_current_page = response.data.current_page;
            this.categories_last_page = response.data.last_page;
            requestStore.updateInProgress("getMaterials", false);
          });
        }
      }
    },
    saveMaterial(material, category) {
      const notificationStore = useNotificationStore();
      const requestStore = useRequestStore();
      const modalStore = useModalStore();
      if (!requestStore.in_progress.saveMaterial) {
        requestStore.updateInProgress("saveMaterial", true);
        let method = "post";
        let path = "add";
        if (material.id) {
          method = "put";
          path = "edit";
        }

        axios({
          method: method,
          url: "/material/" + path,
          data: material,
        })
          .then((response) => {
            const category_index = this.materials.findIndex(
              (el) => el.id === material.category_id
            );
            if (category_index > -1) {
              if (path === "add") {
                this.materials[category_index].materials.push(material);
              }
              if (path === "edit") {
                const material_index = this.materials[
                  category_index
                ].materials.findIndex((el) => el.id === material.id);
                this.materials[category_index].materials[material_index] =
                  material;
              }
            }
            notificationStore.addNotification({
              type: "success",
              message: response.data.message,
            });
            requestStore.updateInProgress("saveMaterial", false);
            modalStore.toggleModal();
            this.material_products = [];
          })
          .catch(() => {
            notificationStore.addNotification({
              type: "error",
              message: "Došlo je do pogreške, sastojak nije dodan.",
            });
            requestStore.updateInProgress("saveMaterial", false);
          });
      }
    },
    getMaterialProducts(id, page = 1) {
      if (!this.products_last_page || page <= this.products_last_page) {
        const requestStore = useRequestStore();
        if (!requestStore.in_progress.getMaterialProducts) {
          requestStore.updateInProgress("getMaterialProducts", true);
          axios
            .get("/material/" + id + "/get-products?page=" + page)
            .then((response) => {
              if (page === 1) {
                this.material_products = response.data.data;
              } else {
                this.material_products = this.material_products.concat(
                  response.data.data
                );
              }
              this.products_current_page = response.data.current_page;
              this.products_last_page = response.data.last_page;
              requestStore.updateInProgress("getMaterialProducts", false);
            });
        }
      }
    },
    addCategory(category) {
      this.materials.push(category);
    },
    deleteMaterial(id) {
      const confirmed = confirm(
        "Da li Ste sigurni da želite izbrisati ovaj sastojak? Brisanje ovog sastojka podrazumijeva i izbacivanje ovog sastojka iz svih jela."
      );
      if (confirmed) {
        const modalStore = useModalStore();
        const requestStore = useRequestStore();
        const notificationStore = useNotificationStore();
        if (!requestStore.in_progress.deleteMaterial) {
          requestStore.updateInProgress("deleteMaterial", true);
          axios
            .delete("/material/delete/" + id)
            .then((response) => {
              const category_index = this.materials.findIndex((el) => {
                return (
                  el.materials.findIndex((el2) => {
                    return el2.id === id;
                  }) !== -1
                );
              });
              if (category_index > -1) {
                const material_index = this.materials[
                  category_index
                ].materials.findIndex((el) => {
                  return el.id === id;
                });
                if (material_index > -1) {
                  this.materials[category_index].materials.splice(
                    material_index,
                    1
                  );
                }
              }
              notificationStore.addNotification({
                type: "success",
                message: response.data.message,
              });
              requestStore.updateInProgress("deleteMaterial", false);
              modalStore.toggleModal();
            })
            .catch(() => {
              notificationStore.addNotification({
                type: "error",
                message: "Došlo je do pogreške, sastojak nije obrisan.",
              });
              requestStore.updateInProgress("deleteMaterial", false);
            });
        }
      }
    },
  },
});
