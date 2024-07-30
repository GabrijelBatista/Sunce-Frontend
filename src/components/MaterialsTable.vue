<template>
  <div class="mb-5 bg-gray-300 w-full p-10 pt-5 rounded-md overflow-hidden">
    <table class="text-left w-full">
      <thead class="flex w-full">
        <tr class="flex w-full mb-1">
          <th class="p-2 w-1/2 inline-flex">
            <div class="inline-block mx-2">
              <div
                class="bg-white rounded-md p-1 cursor-pointer hover:bg-blue-300 font-medium text-xs"
                @click="editCategory(category)"
              >
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </div>
            </div>
            <div class="inline-block">{{ category.name }}</div>
          </th>
          <th class="p-3 w-3/5 pr-10 text-center">Cijena</th>
          <th class="p-2 w-10">
            <font-awesome-icon
              @click="deleteCategory(category)"
              class="text-red-600 cursor-pointer hover:text-red-500"
              :icon="['fas', 'trash']"
            />
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-grey-light flex flex-col items-center w-full"
        :id="'category-' + category.id"
      >
        <tr
          class="flex w-full mb-1 bg-white rounded-md items-center"
          :key="material.id"
          v-for="material in category.materials"
        >
          <td class="p-2 w-1/2 break-words">{{ material.name }}</td>
          <td class="p-2 w-3/5 text-center">
            <div class="rounded-md bg-gray-400">
              {{ formatNumber(material.price_per_uom) }} KM/{{ material.uom }}
            </div>
          </td>
          <td class="p-2 w-10 text-center">
            <div
              class="rounded-md bg-gray-300 cursor-pointer hover:bg-blue-300 font-medium"
              @click="
                editMaterial(material, {
                  id: category.id,
                  name: category.name,
                  type: category.type,
                })
              "
            >
              <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useModalStore } from "/src/store/modal";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCategoryStore } from "../store/category";

library.add(faPenToSquare);
library.add(faTrash);

const modalStore = useModalStore();
const categoryStore = useCategoryStore();

const props = defineProps({
  category: Object,
});

const editCategory = (category) => {
  modalStore.toggleModal({ name: "Categories", item: category });
};

const formatNumber = (number) => {
  return Number(number).toFixed(2);
};

const deleteCategory = (category) => {
  categoryStore.deleteCategory(category);
};

const editMaterial = (material, category) => {
  modalStore.toggleModal({
    name: "Materials",
    item: material,
    category: category,
  });
};
</script>
