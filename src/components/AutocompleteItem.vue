<template>
  <div class="my-2" v-click-outside="() => reset()">
    <input
      autocomplete="off"
      type="text"
      class="bg-gray-50 border border-gray-950 text-gray-900 sm:text-sm rounded-md focus:ring-primary-950 focus:border-primary-950 block w-full p-2.5"
      name="term"
      @input="getItems"
      @keyup.delete="getItems"
      v-model="term"
      :placeholder="placeholder"
    />
    <ul
      v-if="items[0]"
      class="bg-white mt-1 border-2 border-slate-50 overflow-auto shadow-lg rounded list-none absolute min-w-32"
    >
      <li
        v-for="item in items"
        :key="item.id"
        @click="selectItem(item)"
        :class="[
          'hover:bg-blue-100 hover:text-blue-800',
          'w-full list-none text-left py-2 px-3 cursor-pointer hover:bg-blue-300',
        ]"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useProductStore } from '/src/store/product';

const props = defineProps({
  endpoint: String,
  placeholder: String,
});

const productStore = useProductStore();

const term = ref('');

const items = computed({
  get() {
    return productStore.items.filter((obj1) =>
      productStore.selected_items.every(
        (obj2) => obj1.id !== obj2.material.id
      )
    );
  },
});

const selectItem = (item) => {
  productStore.selectItem(item);
  term.value = item ? item.name : '';
};

const getItems = () => {
  if (term.value.length > 2 || term.value.length === 0) {
    const endpoint = props.endpoint + '?term=' + term.value;
    productStore.getItems(endpoint);
  }
};

const reset = () => {
  if (!productStore.selected_item) {
    term.value = '';
    selectItem(null);
  }
};
</script>
