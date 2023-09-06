<template>
  <div
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-4xl w-full p-6 bg-white rounded-md shadow-xl">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">Sastojak</h3>
        <svg
          @click="toggleMaterialModal(false)"
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-red-900 cursor-pointer hover:text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <form @submit.prevent="saveMaterial">
        <div class="mt-4">
          <div class="mb-4 text-sm flex justify-center">
            <div class="m-2 w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900"
                for="name"
                >Ime sastojka</label
              >
              <input
                required
                type="text"
                placeholder="Ime"
                name="name"
                max="20"
                v-model="name"
                class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              />
            </div>
            <div class="m-2 w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900"
                for="name"
                >Kategorija</label
              >
              <AutocompleteCategory
                endpoint="/category/autocomplete?type=2"
              />
            </div>
          </div>
          <div class="mb-4 text-sm flex justify-center">
            <div class="m-2 w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900"
                for="price_per_uom"
                >Cijena</label
              >
              <input
                required
                type="number"
                placeholder="Cijena"
                name="price_per_uom"
                max="1000000"
                step=".01"
                v-model="price_per_uom"
                @change="price_per_uom = formatNumber(price_per_uom)"
                class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
              />
            </div>
            <div class="m-2 w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900"
                for="uom"
                >Mjerna jedinica</label
              >
              <select
                class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
                name="uom"
                v-model="uom"
                required
              >
                <option value="kg">kg</option>
                <option value="l">l</option>
              </select>
            </div>
          </div>
          <hr />
          <div v-if="modalStore.modal.item">
            <div class="text-sm flex mt-2">
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900"
                  for="name"
                  >Jela koja sadržavaju ovaj sastojak</label
                >
              </div>
            </div>
            <table class="text-left w-full border-2 mb-2 text-sm">
              <tbody
                class="bg-grey-light flex flex-col items-center overflow-y-auto w-full max-h-56"
                id="products-body"
              >
                <tr
                  class="flex w-full mb-1 bg-white rounded-md items-center"
                  :key="product.product.id"
                  v-for="product in material_products"
                >
                  <td class="p-2 w-1/3 break-words">
                    {{ product.product.name }}
                  </td>
                  <td class="p-2 w-1/6 text-center">
                    <div class="rounded-md bg-gray-400">
                      {{ product.material_quantity }}
                      {{ uom }}
                      ({{
                        formatNumber(
                          product.material_quantity * price_per_uom
                        )
                      }}
                      KM)
                    </div>
                  </td>
                  <td class="p-2 w-1/6 text-center">
                    <div class="rounded-md bg-gray-400">
                      {{ formatNumber(product.product.price_sell) }}
                      KM
                    </div>
                  </td>
                  <td class="p-2 w-1/6 text-center">
                    <div class="rounded-md bg-red-400">
                      {{
                        calculatePriceCost(
                          product.product.price_cost,
                          product.material_quantity
                        )
                      }}
                      KM
                    </div>
                  </td>
                  <td class="p-2 w-1/6 text-center">
                    <div class="rounded-md bg-green-400">
                      {{
                        calculatePriceDiff(
                          product.product.price_sell,
                          product.product.price_cost,
                          product.material_quantity
                        )
                      }}
                      KM
                    </div>
                  </td>
                </tr>
                <tr
                  v-show="request_in_progress.getMaterialProducts"
                  class="mb-10"
                >
                  <Spinner />
                </tr>
              </tbody>
            </table>
          </div>
          <button
            type="button"
            @click="toggleMaterialModal()"
            class="px-6 py-2 ml-2 text-white border bg-black rounded hover:bg-gray-300"
          >
            Odustani
          </button>
          <button
            v-if="modalStore.modal.item"
            type="button"
            @click="deleteMaterial()"
            class="px-6 py-2 ml-2 text-white border border-red-600 bg-red-600 rounded hover:bg-red-300"
          >
            Obriši
          </button>
          <button
            class="px-6 py-2 ml-2 text-blue-100 bg-green-600 rounded float-right hover:bg-green-300"
            type="submit"
          >
            Potvrdi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import AutocompleteCategory from './AutocompleteCategory.vue';
import Spinner from './Spinner.vue';
import { useMaterialStore } from '/src/store/material';
import { useCategoryStore } from '/src/store/category';
import { useModalStore } from '/src/store/modal';
import { useRequestStore } from '/src/store/request';
import { useNotificationStore } from '/src/store/notification';

const categoryStore = useCategoryStore();
const materialStore = useMaterialStore();
const modalStore = useModalStore();
const requestStore = useRequestStore();
const notificationStore = useNotificationStore();

const name = modalStore.modal.item
  ? ref(modalStore.modal.item.name)
  : ref('');
const price_per_uom = modalStore.modal.item
  ? ref(modalStore.modal.item.price_per_uom.toFixed(2))
  : ref('');
const uom = modalStore.modal.item
  ? ref(modalStore.modal.item.uom)
  : ref('');
const original_price_per_uom = modalStore.modal.item
  ? ref(modalStore.modal.item.price_per_uom)
  : ref(0);

const category = computed({
  get() {
    return categoryStore.selected_category;
  },
});

const request_in_progress = computed({
  get() {
    return requestStore.in_progress;
  },
});

const material_products = computed({
  get() {
    return materialStore.material_products;
  },
});

const toggleMaterialModal = () => {
  modalStore.toggleModal();
};

const formatNumber = (number) => {
  return Number(number).toFixed(2);
};

const calculatePriceCost = (cost, quantity) => {
  const cost_calculated =
    cost +
    quantity * price_per_uom.value -
    quantity * original_price_per_uom.value;
  return formatNumber(cost_calculated);
};

const calculatePriceDiff = (sell, cost, quantity) => {
  const diff_calculated =
    sell -
    (cost +
      quantity * price_per_uom.value -
      quantity * original_price_per_uom.value);
  return formatNumber(diff_calculated);
};

const saveMaterial = () => {
  if (category.value) {
    const material = {
      name: name.value,
      price_per_uom: price_per_uom.value,
      uom: uom.value,
      category_id: category.value.id,
    };

    let cat = null;
    if (!modalStore.modal.item) {
      cat = category.value;
    } else {
      material.id = modalStore.modal.item.id;
    }

    materialStore.saveMaterial(material, cat);
  } else {
    notificationStore.addNotification({
      type: 'error',
      message: 'Category is not selected.',
    });
  }
};

const deleteMaterial = () => {
  materialStore.deleteMaterial(modalStore.modal.item.id);
};

onMounted(() => {
  const body = document.getElementById('products-body');
  if (body) {
    body.addEventListener('scrollend', handleScroll);
  }
});

onBeforeUnmount(() => {
  const body = document.getElementById('products-body');
  if (body) {
    body.removeEventListener('scrollend', handleScroll);
  }
});

const handleScroll = () => {
  const body = document.getElementById('products-body');
  if (body.scrollTop + body.offsetHeight >= body.scrollHeight) {
    materialStore.getMaterialProducts(
      modalStore.modal.item.id,
      materialStore.materials_current_page + 1
    );
  }
};

onBeforeMount(() => {
  if (modalStore.modal.item) {
    materialStore.getMaterialProducts(modalStore.modal.item.id);
    categoryStore.selectCategory(modalStore.modal.category);
  }
});
</script>
