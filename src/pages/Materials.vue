<template>
  <div class="max-w-6xl p-0 w-full mx-auto mb-20">
    <MaterialsTable
      :key="category.id"
      v-for="category in categories"
      :category="category"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import { useMaterialStore } from "/src/store/material";
import MaterialsTable from "/src/components/MaterialsTable.vue";

const materialStore = useMaterialStore();

const props = defineProps({
  selected_item: Object,
});

const categories = computed({
  get() {
    return materialStore.materials;
  },
});

onBeforeMount(() => {
  materialStore.getMaterials();
});

onMounted(() => {
  let container = document.getElementById("main-container");
  container.scrollTop = 0;
  container.addEventListener("scrollend", handleScroll);
});

onBeforeUnmount(() => {
  const container = document.getElementById("main-container");
  container.removeEventListener("scrollend", handleScroll);
  materialStore.$reset();
});

const handleScroll = () => {
  const container = document.getElementById("main-container");
  if (container.scrollTop + container.offsetHeight >= container.scrollHeight) {
    materialStore.getMaterials(materialStore.categories_current_page + 1);
  }
};
</script>
