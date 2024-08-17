<template>
  <div class="my-2" v-click-outside="() => reset()">
    <input
      autocomplete="one-time-code"
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
import { computed, ref } from "vue";
import { useCategoryStore } from "/src/store/category";

const props = defineProps({
  endpoint: String,
  placeholder: String,
});

const categoryStore = useCategoryStore();

const term = categoryStore.selected_category
  ? ref(categoryStore.selected_category.name)
  : ref("");

const items = computed({
  get() {
    return categoryStore.categories;
  },
});

const selectItem = (item) => {
  categoryStore.selectCategory(item);
  term.value = item ? item.name : "";
};

const getItems = () => {
  if (term.value.length > 2 || term.value.length === 0) {
    const endpoint = props.endpoint + "&term=" + term.value;
    categoryStore.getCategories(endpoint);
  }
};

const reset = () => {
  if (!categoryStore.selected_category) {
    term.value = "";
    selectItem(null);
  }
};
</script>
