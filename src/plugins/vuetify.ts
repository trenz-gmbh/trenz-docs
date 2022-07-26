// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import {createVuetify} from 'vuetify'

import { en, de } from 'vuetify/locale'
import {ThemeDefinition} from "vuetify/dist/vuetify";

export default createVuetify({
    locale: {
        defaultLocale: 'de',
        fallbackLocale: 'en',
        messages: { en, de },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: process.env.VUE_APP_PRIMARY_COLOR ?? '#ddd',
                    'on-primary': process.env.VUE_APP_ON_PRIMARY_COLOR ?? '#000',
                }
            } as ThemeDefinition,
            dark: {
                dark: true,
                colors: {
                    primary: process.env.VUE_APP_PRIMARY_COLOR ?? '#222',
                    'on-primary': process.env.VUE_APP_ON_PRIMARY_COLOR ?? '#fff',
                }
            } as ThemeDefinition,
        },
    }
})
