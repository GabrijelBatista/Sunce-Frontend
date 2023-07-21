import { defineStore } from 'pinia';
import axios from 'axios';
import { useNotificationStore } from '/src/store/notification';
import { useRequestStore } from '/src/store/request';
import { useModalStore } from '/src/store/modal';
import { reactive } from 'vue';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: reactive([]),
    selected_items: reactive([]),
    items: reactive([]),
    selected_item: null,
    categories_current_page: 1,
    categories_last_page: 1,
    materials_current_page: 1,
    materials_last_page: 1,
    term: null,
  }),
  actions: {
    getProducts(page = 1, term = null) {
      if (page <= this.categories_last_page) {
        const requestStore = useRequestStore();
        if (term !== null) {
          this.term = term;
          this.products = [];
        }
        if (!requestStore.in_progress) {
          const endpoint =
            this.term !== null
              ? '/category/get-product-categories?page=' +
                page +
                '&term=' +
                this.term
              : '/category/get-product-categories?page=' + page;
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
                      '/get-category-products?term=' +
                      this.term
                    : '/category/' + el.id + '/get-category-products';
                axios.get(endpoint2).then((res) => {
                  el.products = res.data.data;
                  items_processed++;
                  if (items_processed === response.data.data.length) {
                    callback();
                  }
                });
              });
            }
            const callback = () => {
              if (page > 1) {
                this.products = this.products.concat(
                  response.data.data
                );
              } else {
                this.products = response.data.data;
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
    getItems(endpoint) {
      axios.get(endpoint).then((response) => {
        this.items = response.data;
        this.selected_item = null;
      });
    },
    saveProduct(product, category) {
      const notificationStore = useNotificationStore();
      const requestStore = useRequestStore();
      const modalStore = useModalStore();

      requestStore.updateInProgress(true);
      let method = 'post';
      let path = 'add';
      if (product.id) {
        method = 'put';
        path = 'edit';
      }

      let materials = [];
      this.selected_items.forEach((el) => {
        materials.push({
          id: el.material.id,
          material_quantity: el.material_quantity,
        });
      });

      product.materials = materials;

      axios({
        method: method,
        url: '/product/' + path,
        data: product,
      })
        .then((response) => {
          const category_index = this.products.findIndex(
            (el) => el.id === product.category_id
          );
          if (category_index > -1) {
            if (path === 'add') {
              this.products[category_index].products.push(
                response.data.product
              );
            }
            if (path === 'edit') {
              const product_index = this.products[
                category_index
              ].products.findIndex((el) => el.id === product.id);
              this.products[category_index].products[product_index] =
                response.data.product;
            }
          } else if (path === 'add') {
            category.products = [product];
            this.products.push(category);
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
    },
    selectItem(item) {
      this.selected_item = item;
      this.items = [];
    },
    addItemToList(item) {
      this.selected_items.push(item);
      this.selected_item = null;
    },
    getCategoryProducts(id) {
      const category_index = this.products.findIndex(
        (el) => el.id === id
      );
      if (category_index > -1) {
        let page = 2;
        if (
          this.products[category_index].last_page &&
          this.products[category_index].current_page <
            this.products[category_index].last_page
        ) {
          page = this.products[category_index].current_page + 1;
        }
        if (
          !this.products[category_index].last_page ||
          this.products[category_index].current_page <
            this.products[category_index].last_page
        ) {
          const requestStore = useRequestStore();
          if (!requestStore.in_progress) {
            requestStore.updateTableScroll(id);
            requestStore.updateInProgress(true);
            const endpoint =
              this.term !== null
                ? '/category/' +
                  id +
                  '/get-category-products?page=' +
                  page +
                  '&term=' +
                  this.term
                : '/category/' +
                  id +
                  '/get-category-products?page=' +
                  page;
            axios.get(endpoint).then((response) => {
              this.products[category_index].products = this.products[
                category_index
              ].products.concat(response.data.data);
              this.products[category_index].current_page =
                response.data.current_page;
              this.products[category_index].last_page =
                response.data.last_page;
              requestStore.updateInProgress(false);
              requestStore.updateTableScroll(0);
            });
          }
        }
      }
    },
    removeItemFromList(i) {
      this.selected_items.splice(i, 1);
    },
    getProductMaterials(id, page = 1) {
      if (
        !this.materials_last_page ||
        page <= this.materials_last_page
      ) {
        const requestStore = useRequestStore();
        if (!requestStore.in_progress) {
          requestStore.updateInProgress(true);
          axios
            .get('/product/' + id + '/get-materials?page=' + page)
            .then((response) => {
              if (page === 1) {
                this.selected_items = response.data.data;
              } else {
                this.selected_items = this.selected_items.concat(
                  response.data.data
                );
              }
              this.materials_current_page =
                response.data.current_page;
              this.materials_last_page = response.data.last_page;
              requestStore.updateInProgress(false);
            });
        }
      }
    },
    resetSelectedItems() {
      this.selected_items = [];
    },
    deleteProduct(id) {
      const confirmed = confirm('Are you sure?');
      if (confirmed) {
        const modalStore = useModalStore();
        const requestStore = useRequestStore();
        const notificationStore = useNotificationStore();
        if (!requestStore.in_progress) {
          requestStore.updateInProgress(true);
          axios
            .delete('/product/delete/' + id)
            .then((response) => {
              const category_index = this.products.findIndex((el) => {
                return (
                  el.products.findIndex((el2) => {
                    return el2.id === id;
                  }) !== -1
                );
              });
              if (category_index > -1) {
                const product_index = this.products[
                  category_index
                ].products.findIndex((el) => {
                  return el.id === id;
                });
                if (product_index > -1) {
                  this.products[category_index].products.splice(
                    product_index,
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
