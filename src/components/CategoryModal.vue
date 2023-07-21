<template>
  <div
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-4xl w-full p-6 bg-white rounded-md shadow-xl">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl">Kategorija</h3>
        <svg
          @click="toggleAddCategoryModal()"
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
      <div class="mt-4">
        <p class="mb-4 text-sm">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            for="name"
            >Ime kategorije</label
          >
          <input
            type="text"
            placeholder="Ime"
            name="name"
            max="20"
            v-model="name"
            class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-950 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </p>
        <button
          type="button"
          @click="toggleAddCategoryModal()"
          class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
        >
          Odustani
        </button>
        <button
          class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded float-right"
          type="button"
          @click="saveCategory()"
        >
          Spremi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCategoryStore } from '/src/store/category';
import { useModalStore } from '/src/store/modal';

const categoryStore = useCategoryStore();
const modalStore = useModalStore();

const props = defineProps({
  current_route: String,
  modal: Object | null,
});

const name = props.modal.item ? ref(props.modal.item.name) : ref('');
const type = computed({
  get() {
    return props.current_route === 'Products' ? 1 : 2;
  },
});

const toggleAddCategoryModal = () => {
  name.value = '';
  modalStore.toggleModal();
};

const saveCategory = () => {
  const category = {
    name: name.value,
    type: type.value,
  };
  if (props.modal.item) {
    category.id = props.modal.item.id;
  }
  categoryStore.saveCategory(category);
};
</script>
