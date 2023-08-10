<template>
  <div
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-4xl w-full p-2 bg-white rounded-md shadow-xl">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl">Jelo</h3>
        <svg
          @click="toggleProductModal(false)"
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-red-900 cursor-pointer"
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
      <div class="mt-2">
        <div class="mb-2 text-sm flex">
          <div class="m-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-900"
              for="name"
              >Ime jela</label
            >
            <input
              required
              type="text"
              placeholder="Ime"
              name="name"
              max="20"
              v-model="name"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
            />
          </div>
          <div class="m-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-900"
              for="name"
              >Kategorija</label
            >
            <AutocompleteCategory
              endpoint="/category/autocomplete?type=1"
              placeholder="Ime kategorije"
            />
          </div>
        </div>
        <div class="mb-2 text-sm flex">
          <div class="m-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-900"
              for="price_sell"
              >Cijena (KM)</label
            >
            <input
              required
              type="number"
              placeholder="Cijena"
              name="price_sell"
              max="1000000"
              step=".01"
              v-model="price_sell"
              @change="calculatePriceDiff()"
              class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
            />
          </div>
          <div class="m-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-900"
              for="price_cost"
              >Utrošak</label
            >
            <div
              class="bordersm:text-sm rounded-lg block w-full p-2 text-red-500"
            >
              {{ formatNumber(price_cost_computed) }} KM
            </div>
          </div>
          <div class="m-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-900"
              for="price_cost"
              >Razlika</label
            >
            <div
              class="bordersm:text-sm rounded-lg block w-full p-2 text-green-500"
            >
              {{ formatNumber(price_diff_computed) }} KM
            </div>
          </div>
        </div>
        <hr />
        <div class="text-sm flex mt-2">
          <div>
            <label
              class="block mb-2 text-sm font-medium text-gray-900"
              for="name"
              >Sastojci</label
            >
          </div>
        </div>
        <div class="mb-2 text-sm flex">
          <div class="m-2">
            <AutocompleteItem
              endpoint="/material/autocomplete"
              placeholder="Ime sastojka"
            />
          </div>
          <div class="m-2">
            <input
              type="number"
              placeholder="Količina"
              name="material_quantity"
              max="1000000"
              step=".01"
              v-model="material_quantity"
              class="my-2 bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
            />
          </div>
          <div class="m-2 my-6">
            {{ selected_material ? selected_material.uom : '' }}
          </div>
          <button
            type="button"
            class="px-6 py-2 m-2 my-4 text-blue-100 bg-blue-600 rounded"
            @click="addMaterialToList(selected_material)"
          >
            Add
          </button>
        </div>

        <table class="text-left w-full border-2 mb-2 text-sm">
          <tbody
            class="bg-grey-light flex flex-col items-center overflow-y-auto w-full max-h-56"
            id="materials-body"
          >
            <tr
              class="flex w-full mb-1 h-10 bg-white rounded-xl"
              :key="material.material.id"
              v-for="(material, i) in selected_materials"
            >
              <td class="p-2 w-1/2">
                {{ material.material.name }}
              </td>
              <td class="p-2 w-1/4 text-center">
                <div class="rounded-xl bg-gray-400">
                  {{ material.material_quantity }}
                  {{ material.material.uom }}
                </div>
              </td>
              <td class="p-2 w-1/4 text-center">
                <div class="rounded-xl bg-red-400">
                  {{
                    formatNumber(
                      material.material.price_per_uom *
                        material.material_quantity
                    )
                  }}
                  KM
                </div>
              </td>
              <td class="p-2 w-20 text-center">
                <div
                  class="rounded-xl bg-gray-400 cursor-pointer"
                  @click="removeMaterialFromList(i)"
                >
                  Remove
                </div>
              </td>
            </tr>
            <tr
              v-show="request_in_progress.getProductMaterials"
              class="mb-10"
            >
              <Spinner />
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          @click="toggleProductModal()"
          class="px-6 py-2 ml-2 text-blue-800 border border-blue-600 rounded"
        >
          Odustani
        </button>
        <button
          v-if="modalStore.modal.item"
          type="button"
          class="px-6 py-2 ml-2 bg-red-500 text-white border border-red-600 rounded"
          @click="deleteProduct()"
        >
          Obriši
        </button>
        <button
          class="px-6 py-2 ml-2 float-right text-blue-100 bg-blue-600 rounded"
          type="button"
          @click="saveProduct"
        >
          Spremi
        </button>
      </div>
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
import AutocompleteItem from './AutocompleteItem.vue';
import Spinner from './Spinner.vue';
import { useProductStore } from '/src/store/product';
import { useCategoryStore } from '/src/store/category';
import { useModalStore } from '/src/store/modal';
import { useRequestStore } from '/src/store/request';
import { useNotificationStore } from '/src/store/notification';

const categoryStore = useCategoryStore();
const productStore = useProductStore();
const modalStore = useModalStore();
const requestStore = useRequestStore();
const notificationStore = useNotificationStore();

const name = modalStore.modal.item
  ? ref(modalStore.modal.item.name)
  : ref('');
const price_sell = modalStore.modal.item
  ? ref(modalStore.modal.item.price_sell.toFixed(2))
  : ref('');
const price_cost = modalStore.modal.item
  ? ref(modalStore.modal.item.price_cost)
  : ref(0);
const price_diff = modalStore.modal.item
  ? ref(modalStore.modal.item.price_diff)
  : ref(0);
const material_quantity = ref('');

const category = computed({
  get() {
    return categoryStore.selected_category;
  },
});

const price_cost_computed = computed({
  get() {
    return price_cost.value;
  },
});

const request_in_progress = computed({
  get() {
    return requestStore.in_progress;
  },
});

const price_diff_computed = computed({
  get() {
    return price_diff.value;
  },
});

const calculatePriceDiff = () => {
  price_diff.value = price_sell.value - price_cost.value;
  price_sell.value = formatNumber(price_sell.value);
};

const toggleProductModal = () => {
  modalStore.toggleModal();
};

const formatNumber = (number) => {
  return Number(number).toFixed(2);
};

const deleteProduct = () => {
  productStore.deleteProduct(modalStore.modal.item.id);
};

const addMaterialToList = (material) => {
  if (material) {
    productStore.addItemToList({
      material,
      material_quantity: material_quantity.value,
    });
    price_cost.value +=
      material.price_per_uom * material_quantity.value;
    calculatePriceDiff();

    material_quantity.value = '';
  }
};

const removeMaterialFromList = (i) => {
  price_cost.value -=
    selected_materials.value[i].material.price_per_uom *
    selected_materials.value[i].material_quantity;
  calculatePriceDiff();
  productStore.removeItemFromList(i);
};

const selected_materials = computed({
  get() {
    return productStore.selected_items;
  },
});

const selected_material = computed({
  get() {
    return productStore.selected_item;
  },
});

const saveProduct = () => {
  if (category.value) {
    const product = {
      name: name.value,
      price_sell: price_sell.value,
      category_id: category.value.id,
    };

    let cat = null;
    if (!modalStore.modal.item) {
      cat = category.value;
    } else {
      product.id = modalStore.modal.item.id;
    }

    productStore.saveProduct(product, cat);
  } else {
    notificationStore.addNotification({
      type: 'error',
      message: 'Category is not selected.',
    });
  }
};

onMounted(() => {
  const body = document.getElementById('materials-body');
  body.addEventListener('scrollend', handleScroll);
});

onBeforeUnmount(() => {
  const body = document.getElementById('materials-body');
  body.removeEventListener('scrollend', handleScroll);
});

const handleScroll = () => {
  const body = document.getElementById('materials-body');
  if (body.scrollTop + body.offsetHeight >= body.scrollHeight) {
    productStore.getProductMaterials(
      modalStore.modal.item.id,
      productStore.materials_current_page + 1
    );
  }
};

onBeforeMount(() => {
  if (modalStore.modal.item) {
    productStore.getProductMaterials(modalStore.modal.item.id);
    categoryStore.selectCategory(modalStore.modal.category);
  }
});
</script>
