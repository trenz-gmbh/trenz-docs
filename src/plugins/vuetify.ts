// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import {createVuetify} from 'vuetify'

import {de, en} from 'vuetify/locale'
import {ThemeDefinition} from "vuetify/dist/vuetify";

export default createVuetify({
    locale: {
        defaultLocale: 'de',
        fallbackLocale: 'en',
        messages: {en, de},
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#ddd',
                    'on-primary': '#000',
                }
            } as ThemeDefinition,
            dark: {
                dark: true,
                colors: {
                    primary: '#222',
                    'on-primary': '#fff',
                }
            } as ThemeDefinition,
        },
    }
})
