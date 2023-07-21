<template>
  <div class="bg-primary-950 border-primary-600 dark:bg-primary-400">
    <div class="max-w-4xl mx-auto p-2 float-right">
      <button
        class="rounded-3xl text-white border border-white w-38 p-2 m-2"
      >
        Export CSV
      </button>
      <button
        class="rounded-3xl text-white border border-white w-38 p-2 m-2"
        @click="toggleCategoryModal()"
      >
        Dodaj kategoriju
      </button>
      <button
        class="rounded-3xl text-white border border-white w-38 p-2 m-2"
        @click="toggleItemModal()"
      >
        Dodaj {{ info.product_name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '/src/store/modal';
import { ref, computed } from 'vue';

const props = defineProps({
  current_route: String,
});

const modalStore = useModalStore();

const footer_info = ref({
  product_name: '',
  csv_endpoint: '',
  add_product_modal: '',
  add_category_modal: '',
});

const current_route = computed({
  get() {
    return props.current_route;
  },
});

const info = computed({
  get() {
    if (current_route.value === 'Products') {
      return (footer_info.value = {
        product_name: 'jelo',
        csv_endpoint: '#',
        add_product_modal: 'add-product',
        add_category_modal: 'add-product-category',
      });
    } else {
      return (footer_info.value = {
        product_name: 'sastojak',
        csv_endpoint: '#',
        add_product_modal: 'add-material',
        add_category_modal: 'add-material-category',
      });
    }
  },
});

const toggleCategoryModal = () => {
  modalStore.toggleModal({ name: 'Categories' });
};
const toggleItemModal = () => {
  modalStore.toggleModal({ name: current_route });
};
</script>
