<template>
  <div class="max-w-6xl p-0 w-full mx-auto mb-20">
    <ProductsTable
      :key="category.id"
      v-for="category in categories"
      :category="category"
    />
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import { useProductStore } from '/src/store/product';
import ProductsTable from '/src/components/ProductsTable.vue';

const productStore = useProductStore();

const props = defineProps({
  selected_item: Object,
});

const categories = computed({
  get() {
    return productStore.products;
  },
});

onBeforeMount(() => {
  productStore.getProducts();
});

onMounted(() => {
  const container = document.getElementById('main-container');
  container.addEventListener('scrollend', handleScroll);
});

onBeforeUnmount(() => {
  const container = document.getElementById('main-container');
  container.removeEventListener('scrollend', handleScroll);
});

const handleScroll = () => {
  const container = document.getElementById('main-container');
  if (
    container.scrollTop + container.offsetHeight >=
    container.scrollHeight
  ) {
    productStore.getProducts(
      productStore.categories_current_page + 1
    );
  }
};
</script>
