import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import InstantSearch from 'vue-instantsearch/vue3/es';

createApp(App).use(store).use(router).use(InstantSearch).mount('#app')
