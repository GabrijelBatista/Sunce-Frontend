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
          <th class="p-3 w-1/3 pr-10 text-center">Cijena</th>
          <th class="p-2 w-20"></th>
        </tr>
      </thead>
      <tbody
        class="bg-grey-light flex flex-col items-center overflow-y-auto w-full max-h-56 overscroll-contain"
        :id="'category-' + category.id"
      >
        <tr
          class="flex w-full mb-1 h-10 bg-white rounded-xl"
          :key="material.id"
          v-for="material in category.materials"
        >
          <td class="p-2 w-1/2">{{ material.name }}</td>
          <td class="p-2 w-1/3 text-center">
            <div class="rounded-xl bg-gray-400">
              {{ formatNumber(material.price_per_uom) }} KM/{{
                material.uom
              }}
            </div>
          </td>
          <td class="p-2 w-20 text-center">
            <div
              class="rounded-xl bg-orange-400 cursor-pointer"
              @click="
                editMaterial(material, {
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
        <tr
          v-show="request_in_progress && table_scroll === category.id"
          class="mb-10"
        >
          <Spinner />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, computed } from 'vue';
import { useMaterialStore } from '/src/store/material';
import { useRequestStore } from '/src/store/request';
import { useModalStore } from '/src/store/modal';
import Spinner from './Spinner.vue';

const materialStore = useMaterialStore();
const requestStore = useRequestStore();
const modalStore = useModalStore();

const props = defineProps({
  category: Object,
});

const request_in_progress = computed({
  get() {
    return requestStore.in_progress;
  },
});

const table_scroll = computed({
  get() {
    return requestStore.table_scroll;
  },
});

const editCategory = (category) => {
  modalStore.toggleModal({ name: 'Categories', item: category });
};

const formatNumber = (number) => {
  return Number(number).toFixed(2);
};

const editMaterial = (material, category) => {
  modalStore.toggleModal({
    name: 'Materials',
    item: material,
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
    materialStore.getCategoryMaterials(props.category.id);
  }
};
</script>
