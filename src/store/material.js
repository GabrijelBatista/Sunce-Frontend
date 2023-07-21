import { defineStore } from 'pinia';
import axios from 'axios';
import { useNotificationStore } from '/src/store/notification';
import { useRequestStore } from '/src/store/request';
import { useModalStore } from '/src/store/modal';
import { reactive } from 'vue';

export const useMaterialStore = defineStore('material', {
  state: () => ({
    materials: reactive([]),
    material_products: reactive([]),
    categories_current_page: 1,
    categories_last_page: 1,
    productss_current_page: 1,
    productss_last_page: 1,
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
        if (!requestStore.in_progress) {
          const endpoint =
            this.term !== null
              ? '/category/get-material-categories?page=' +
                page +
                '&term=' +
                this.term
              : '/category/get-material-categories?page=' + page;
          requestStore.updateInProgress(true);
          axios.get(endpoint).then((response) => {
            let items_processed = 0;
            if (!response.data.data[0]) {
              this.materials = [];
            } else {
              response.data.data.forEach((el) => {
                const endpoint2 =
                  this.term !== null
                    ? '/category/' +
                      el.id +
                      '/get-category-materials?term=' +
                      this.term
                    : '/category/' +
                      el.id +
                      '/get-category-materials';
                axios.get(endpoint2).then((res) => {
                  el.materials = res.data.data;
                  items_processed++;
                  if (items_processed === response.data.data.length) {
                    callback();
                  }
                });
              });
            }
            const callback = () => {
              if (page > 1) {
                this.materials = this.materials.concat(
                  response.data.data
                );
              } else {
                this.materials = response.data.data;
              }
              this.categories_current_page =
                response.data.current_page;
              this.categories_last_page = response.data.last_page;
            };
            requestStore.updateInProgress(false);
          });
        }
      }
    },
    saveMaterial(material, category) {
      const notificationStore = useNotificationStore();
      const requestStore = useRequestStore();
      const modalStore = useModalStore();

      requestStore.updateInProgress(true);
      let method = 'post';
      let path = 'add';
      if (material.id) {
        method = 'put';
        path = 'edit';
      }

      axios({
        method: method,
        url: '/material/' + path,
        data: material,
      })
        .then((response) => {
          const category_index = this.materials.findIndex(
            (el) => el.id === material.category_id
          );
          if (category_index > -1) {
            if (path === 'add') {
              this.materials[category_index].materials.push(material);
            }
            if (path === 'edit') {
              const material_index = this.materials[
                category_index
              ].materials.findIndex((el) => el.id === material.id);
              this.materials[category_index].materials[
                material_index
              ] = material;
            }
          } else if (path === 'add') {
            category.materials = [material];
            this.materials.push(category);
          }
          notificationStore.addNotification({
            type: 'success',
            message: response.data.message,
          });
          requestStore.updateInProgress(false);
          modalStore.toggleModal();
          this.material_products = [];
        })
        .catch((error) => {
          notificationStore.addNotification({
            type: 'error',
            message: error.response.data.message,
          });
          requestStore.updateInProgress(false);
        });
    },
    getCategoryMaterials(id) {
      const category_index = this.materials.findIndex(
        (el) => el.id === id
      );
      if (category_index > -1) {
        let page = 2;
        if (
          this.materials[category_index].last_page &&
          this.materials[category_index].current_page <
            this.materials[category_index].last_page
        ) {
          page = this.materials[category_index].current_page + 1;
        }
        if (
          !this.materials[category_index].last_page ||
          this.materials[category_index].current_page <
            this.materials[category_index].last_page
        ) {
          const requestStore = useRequestStore();
          if (!requestStore.in_progress) {
            requestStore.updateTableScroll(id);
            requestStore.updateInProgress(true);
            const endpoint =
              this.term !== null
                ? '/category/' +
                  id +
                  '/get-category-materials?page=' +
                  page +
                  '&term=' +
                  this.term
                : '/category/' +
                  id +
                  '/get-category-materials?page=' +
                  page;
            axios.get(endpoint).then((response) => {
              this.materials[category_index].materials =
                this.materials[category_index].materials.concat(
                  response.data.data
                );
              this.materials[category_index].current_page =
                response.data.current_page;
              this.materials[category_index].last_page =
                response.data.last_page;
              requestStore.updateInProgress(false);
              requestStore.updateTableScroll(0);
            });
          }
        }
      }
    },
    getMaterialProducts(id, page = 1) {
      if (
        !this.products_last_page ||
        page <= this.products_last_page
      ) {
        const requestStore = useRequestStore();
        if (!requestStore.in_progress) {
          requestStore.updateInProgress(true);
          axios
            .get('/material/' + id + '/get-products?page=' + page)
            .then((response) => {
              if (page === 1) {
                this.material_products = response.data.data;
              } else {
                this.material_products =
                  this.material_products.concat(response.data.data);
              }
              this.products_current_page = response.data.current_page;
              this.products_last_page = response.data.last_page;
              requestStore.updateInProgress(false);
            });
        }
      }
    },
    deleteMaterial(id) {
      const confirmed = confirm(
        'Da li Ste sigurni da želite izbrisati ovaj sastojak? Brisanje ovog sastojka podrazumijeva i izbacivanje ovog sastojka iz svih jela.'
      );
      if (confirmed) {
        const modalStore = useModalStore();
        const requestStore = useRequestStore();
        const notificationStore = useNotificationStore();
        if (!requestStore.in_progress) {
          requestStore.updateInProgress(true);
          axios
            .delete('/material/delete/' + id)
            .then((response) => {
              const category_index = this.materials.findIndex(
                (el) => {
                  return (
                    el.materials.findIndex((el2) => {
                      return el2.id === id;
                    }) !== -1
                  );
                }
              );
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
                type: 'success',
                message: response.data.message,
              });
              requestStore.updateInProgress(false);
              modalStore.toggleModal();
            })
            .catch((error) => {
              notificationStore.addNotification({
                type: 'error',
                message: error.response.data.message,
              });
              requestStore.updateInProgress(false);
            });
        }
      }
    },
  },
});
