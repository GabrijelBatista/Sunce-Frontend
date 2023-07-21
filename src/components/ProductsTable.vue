<template>
  <div class="mb-5 bg-gray-300 w-full p-10 pt-5 rounded-xl">
    <table class="text-left w-full">
      <thead class="flex w-full">
        <tr class="flex w-full mb-1">
          <th class="p-2 w-1/2">
            <div class="inline-block">{{ category.name }}</div>
            <div class="inline-block mx-2">
              <div
                class="bg-orange-400 rounded-xl p-1 cursor-pointer"
                @click="editCategory(category)"
              >
                Uredi
              </div>
            </div>
          </th>
          <th class="p-3 w-1/6 text-center">Cijena</th>
          <th class="p-3 w-1/6 text-center">Utrošak</th>
          <th class="p-3 w-1/6 text-center">Razlika</th>
          <th class="p-2 w-20"></th>
        </tr>
      </thead>
      <tbody
        :id="'category-' + category.id"
        class="bg-grey-light flex flex-col items-center overflow-y-auto w-full max-h-56 overscroll-contain"
      >
        <tr
          class="flex w-full mb-1 h-10 bg-white rounded-xl"
          :key="product.id"
          v-for="product in category.products"
        >
          <td class="p-2 w-1/2">{{ product.name }}</td>
          <td class="p-2 w-1/6 text-center">
            <div class="rounded-xl bg-gray-400">
              {{ formatNumber(product.price_sell) }} KM
            </div>
          </td>
          <td class="p-2 w-1/6 text-center">
            <div class="rounded-xl bg-red-400">
              {{ formatNumber(product.price_cost) }} KM
            </div>
          </td>
          <td class="p-2 w-1/6 text-center">
            <div class="rounded-xl bg-green-400">
              {{ formatNumber(product.price_diff) }} KM
            </div>
          </td>
          <td class="p-2 w-20 text-center">
            <div
              class="rounded-xl bg-orange-400 cursor-pointer"
              @click="
                editProduct(product, {
                  id: category.id,
                  name: category.name,
                  type: category.type,
                })
              "
            >
              Uredi
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { useProductStore } from '/src/store/product';
import { useModalStore } from '/src/store/modal';

const productStore = useProductStore();
const modalStore = useModalStore();

const props = defineProps({
  category: Object,
});

const editCategory = (category) => {
  modalStore.toggleModal({ name: 'Categories', item: category });
};

const formatNumber = (number) => {
  return Number(number).toFixed(2);
};

const editProduct = (product, category) => {
  modalStore.toggleModal({
    name: 'Products',
    item: product,
    category: category,
  });
};

onMounted(() => {
  const body = document.getElementById(
    'category-' + props.category.id
  );
  body.addEventListener('scrollend', handleScroll);
});

onBeforeUnmount(() => {
  const body = document.getElementById(
    'category-' + props.category.id
  );
  body.removeEventListener('scrollend', handleScroll);
});

const handleScroll = () => {
  const body = document.getElementById(
    'category-' + props.category.id
  );

  if (body.scrollTop + body.offsetHeight >= body.scrollHeight) {
    productStore.getCategoryProducts(props.category.id);
  }
};
</script>
