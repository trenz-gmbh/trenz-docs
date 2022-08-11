import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import ApiClient from "@/api/ApiClient";

if (process.env.VUE_APP_API_BASE) {
    ApiClient.setBaseUrl(process.env.VUE_APP_API_BASE);
} else {
    alert('Please set the VUE_APP_API_BASE environment variable (e.g. VUE_APP_API_BASE=https://localhost:7262/api)');

    throw new Error('VUE_APP_API_BASE is not set');
}

if (process.env.VUE_APP_USE_AUTH && process.env.VUE_APP_USE_AUTH === 'true') {
    ApiClient.useAuth = true;
}

loadFonts()

createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .mount('#app')
