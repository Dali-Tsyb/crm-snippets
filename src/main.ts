import 'bootstrap';
import '@/assets/css/bootstrap-select.min.css';
import 'vue-select/dist/vue-select.css';
import '@/assets/css/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import VueSelect from 'vue-select';

const app = createApp(App);

app.component('v-select', VueSelect);
app.use(createPinia());
app.use(router);
app.mount('#app');
