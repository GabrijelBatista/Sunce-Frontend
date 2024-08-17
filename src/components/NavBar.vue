<template>
  <nav class="bg-primary-950 border-primary-600">
    <div
      class="max-w-6xl flex flex-wrap items-center justify-center sm:justify-between mx-auto p-2"
    >
      <div class="flex items-center">
        <img
          src="/assets/sunce-logo.png"
          class="h-8 mr-3"
          alt="Flowbite Logo"
        />
      </div>
      <div class="flex items-center md:order-2" v-if="userStore.token">
        <div class="relative" v-if="userStore.verified">
          <input
            type="text"
            autocomplete="one-time-code"
            class="block w-full p-2 text-sm text-gray-900 rounded-md bg-gray-50 focus:ring-white focus:border-white"
            placeholder="Pretraga"
            v-model="term"
            @input="getItems"
            @keyup.delete="getItems"
          />
          <button
            type="submit"
            class="absolute right-2.5 bottom-2.5 m-1 rounded-md text-sm hover:bg-gray-300"
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
        <RouterLink to="/products" v-if="userStore.verified">
          <button
            class="rounded-md text-white border border-white w-26 sm:w-32 p-1 m-1 hover:bg-gray-300"
          >
            Jelovnik
          </button>
        </RouterLink>
        <RouterLink to="/materials" v-if="userStore.verified">
          <button
            class="rounded-md text-white border border-white w-26 sm:w-32 p-1 m-1 hover:bg-gray-300"
          >
            Sastojci
          </button>
        </RouterLink>
        <div class="relative m-1" v-click-outside="() => (dropdown = false)">
          <button
            class="flex border-white border rounded-md items-center whitespace-nowrap bg-primary px-6 pb-2 pt-1 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-gray-300 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none"
            type="button"
            id="dropdownMenuButton1"
            aria-expanded="false"
            @click="toggleDropdown()"
          >
            <font-awesome-icon
              :icon="['fas', 'user']"
              class="float-left align-middle mt-1"
            />
            <span class="ml-2 w-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>
          <ul
            v-if="dropdown"
            class="right-0 absolute z-[1000] float-left m-0 min-w-max list-none overflow-hidden rounded-md border-none bg-white bg-clip-padding text-left text-base shadow-lg"
            aria-labelledby="dropdownMenuButton1"
          >
            <li>
              <button
                class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline"
                type="button"
                @click="changePassword()"
              >
                Promijeni lozinku
              </button>
            </li>
            <li>
              <button
                class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-red-600 hover:bg-neutral-100 active:text-neutral-800 active:no-underline"
                type="button"
                @click="logout()"
              >
                Odjavi se
              </button>
            </li>
            <li>
              <button
                class="block w-full whitespace-nowrap bg-red-700 px-4 py-2 text-sm font-normal text-white hover:bg-red-500 active:text-neutral-800 active:no-underline"
                type="button"
                @click="deleteAccount()"
              >
                Obriši nalog
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "/src/store/user";
import { useModalStore } from "/src/store/modal";
import { useProductStore } from "/src/store/product";
import { useMaterialStore } from "/src/store/material";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { ref, computed } from "vue";
import { getActivePinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { watch } from "vue";

library.add(faUser);
const props = defineProps({
  current_route: String,
});

const userStore = useUserStore();
const modalStore = useModalStore();
const productStore = useProductStore();
const materialStore = useMaterialStore();

const router = useRouter();
const route = useRoute();

const current_route = computed({
  get() {
    return props.current_route;
  },
});

const dropdown = ref(false);
const term = ref("");

const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};

const changePassword = () => {
  modalStore.toggleModal({ name: "Password" });
  dropdown.value = false;
};

const logout = () => {
  axios.post("/auth/logout").then(() => {
    getActivePinia()._s.forEach((store) => store.$reset());
    dropdown.value = false;
    router.push("/login");
  });
};

const deleteAccount = () => {
  if (
    confirm(
      "Da li Ste sigurni da želite obrisati ovaj nalog? Ova akcija podrazumjeva brisanje svih podataka vezanih uz ovaj nalog."
    )
  ) {
    axios
      .delete("/user/delete-account")
      .then(() => {
        getActivePinia()._s.forEach((store) => store.$reset());
        dropdown.value = false;
        router.push("/login");
      })
      .catch(() => {
        notificationStore.addNotification({
          type: "error",
          message: "Došlo je do pogreške, nalog nije obrisan.",
        });
      });
  }
};

const getItems = () => {
  if (term.value.length > 2 || term.value.length === 0) {
    if (current_route.value === "Products") {
      productStore.getProducts(1, term.value);
    } else if (current_route.value === "Materials") {
      materialStore.getMaterials(1, term.value);
    }
  }
};

watch(route, () => {
  term.value = "";
});
</script>
