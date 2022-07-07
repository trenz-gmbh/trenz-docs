import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import InstantSearch from 'vue-instantsearch/vue3/es';

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(InstantSearch)
  .mount('#app')
