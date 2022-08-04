const {defineConfig} = require('@vue/cli-service')
const fs = require('fs')

let https = false
let serverPort = 8080
let serverOpts = {}
if (process.env.CERT_PATH && process.env.CERT_PASSPHRASE) {
    https = true
    serverPort = 443
    serverOpts = {
        type: 'https',
        options: {
            pfx: fs.readFileSync(process.env.CERT_PATH),
            passphrase: process.env.CERT_PASSPHRASE,
        },
    }
}

module.exports = defineConfig({
    transpileDependencies: true,

    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    },

    devServer: {
        https,
        port: serverPort,
        allowedHosts: 'all',
        server: serverOpts,
    },
})
