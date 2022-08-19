import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import ApiClient from "@/api/ApiClient";
import {WebappSettings} from "@/WebappSettings";

loadFonts()

ApiClient.setBaseUrl(window.location.origin)
ApiClient.getJson('webapp-settings.json').then(settings => {
    const appSettings: WebappSettings = settings;

    const baseUrl = appSettings.api.baseUrl;
    if (typeof baseUrl === 'undefined') {
        alert('Please add a webapp-settings.json file to the content root.')

        throw new Error('API base url is not set');
    } else {
        ApiClient.setBaseUrl(baseUrl);
    }

    if (appSettings.useAuth) {
        ApiClient.useAuth = true;
    }

    createApp(App)
        .provide('$settings', appSettings)
        .use(router)
        .use(store)
        .use(vuetify)
        .mount('#app')
})
