<template>
  <div class="bg-primary-950 border-primary-600">
    <div class="max-w-6xl mx-auto p-2 sm:float-right text-center">
      <button
        class="rounded-md text-white border border-white w-40 p-2 m-2 hover:bg-gray-300"
        @click="toggleCategoryModal()"
      >
        <font-awesome-icon
          :icon="['fas', 'circle-plus']"
          class="float-left mt-1"
        />
        <div class="float-right">Dodaj kategoriju</div>
      </button>
      <button
        class="rounded-md text-white border border-white w-40 p-2 m-2 hover:bg-gray-300"
        @click="toggleItemModal()"
      >
        <font-awesome-icon
          :icon="['fas', 'circle-plus']"
          class="float-left align-middle mt-1"
        />
        <div class="float-right">Dodaj {{ info.product_name }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from "/src/store/modal";
import { ref, computed } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

library.add(faCirclePlus);

const props = defineProps({
  current_route: String,
});

const modalStore = useModalStore();

const footer_info = ref({
  product_name: "",
  csv_endpoint: "",
  add_product_modal: "",
  add_category_modal: "",
});

const current_route = computed({
  get() {
    return props.current_route;
  },
});

const info = computed({
  get() {
    if (current_route.value === "Products") {
      return (footer_info.value = {
        product_name: "jelo",
        csv_endpoint: "#",
        add_product_modal: "add-product",
        add_category_modal: "add-product-category",
      });
    } else {
      return (footer_info.value = {
        product_name: "sastojak",
        csv_endpoint: "#",
        add_product_modal: "add-material",
        add_category_modal: "add-material-category",
      });
    }
  },
});

const toggleCategoryModal = () => {
  modalStore.toggleModal({ name: "Categories" });
};
const toggleItemModal = () => {
  modalStore.toggleModal({ name: current_route });
};
</script>
