import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import axios from 'axios';
import { useUserStore } from '/src/store/user';

import Products from '/src/pages/Products.vue';
import Materials from '/src/pages/Materials.vue';
import Login from '/src/pages/Login.vue';
import Register from '/src/pages/Register.vue';

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
    },
    {
      path: '/materials',
      name: 'Materials',
      component: Materials,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
  ],
});

const app = createApp(App).use(pinia).use(router);

const userStore = useUserStore();

router.beforeEach(async (to, from) => {
  if (
    !userStore.$state.token &&
    to.name !== 'Login' &&
    to.name !== 'Register'
  ) {
    return { name: 'Login' };
  } else if (
    userStore.$state.token &&
    (to.name === 'Login' ||
      to.name === 'Register' ||
      to.name === 'Home')
  ) {
    return { name: 'Products' };
  }
});

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
  const token = userStore.$state.token;
  config.headers['Authorization'] = `Bearer ${token}`;
  config.headers['Accept'] = 'application/json';
  config.headers['Content-Type'] =
    'application/x-www-form-urlencoded';
  return config;
});

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest.url.includes('auth/jwt/refresh/')
    ) {
      userStore.addToken('');
      userStore.addUser({});
      router.push('/login');
      return Promise.reject(error);
    } else if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      axios
        .post('/auth/refresh')
        .then((response) => {
          userStore.addToken(response.data.authorisation.token);
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + response.data.authorisation.token;
          return location.reload();
        })
        .catch((err) => {
          userStore.addToken('');
          userStore.addUser({});
          router.push('/login');
        });
    }
    return Promise.reject(error);
  }
);

app.directive('click-outside', {
  mounted(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

app.mount('#app');
