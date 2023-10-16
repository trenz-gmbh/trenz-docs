import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

store.dispatch('loadWebAppSettings').then(settings => {
    createApp(App)
        .provide('$settings', settings)
        .use(router)
        .use(store)
        .use(vuetify)
        .mount('#app')
})
