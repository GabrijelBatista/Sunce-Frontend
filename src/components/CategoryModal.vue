<template>
  <div
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-4xl w-full p-6 bg-white rounded-md shadow-xl">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">Kategorija</h3>
        <svg
          @click="toggleAddCategoryModal()"
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
      <div class="mt-4">
        <p class="mb-4 text-sm">
          <label class="block mb-2 text-sm font-medium text-gray-900" for="name"
            >Ime kategorije</label
          >
          <input
            type="text"
            placeholder="Ime"
            autocomplete="off"
            name="name"
            max="20"
            v-model="name"
            class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
          />
        </p>
        <button
          type="button"
          @click="toggleAddCategoryModal()"
          class="px-6 py-2 border bg-black text-white rounded hover:bg-gray-300"
        >
          Odustani
        </button>
        <button
          class="px-6 py-2 ml-2 text-blue-100 bg-green-600 rounded float-right hover:bg-green-300"
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
import { ref, computed } from "vue";
import { useCategoryStore } from "/src/store/category";
import { useModalStore } from "/src/store/modal";

const categoryStore = useCategoryStore();
const modalStore = useModalStore();

const props = defineProps({
  current_route: String,
  modal: Object | null,
});

const name = props.modal.item ? ref(props.modal.item.name) : ref("");
const type = computed({
  get() {
    return props.current_route === "Products" ? 1 : 2;
  },
});

const toggleAddCategoryModal = () => {
  name.value = "";
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
