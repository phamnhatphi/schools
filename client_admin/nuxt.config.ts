// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';

const APP_BASE_URL = (process.env.APP_BASE_URL || '').replace(/\/+$/, '');
const API_BASE_URL = (process.env.API_BASE_URL || '').replace(/\/+$/, '');

const appBaseUrl = `${APP_BASE_URL}/admin`;
const apiBaseUrl = API_BASE_URL ? `${API_BASE_URL}/admin` : `${APP_BASE_URL}/api/admin`;
const appName = process.env.APP_NAME || 'サイト名';

export default defineNuxtConfig({
    ssr: false,
    app: {
        baseURL: appBaseUrl,
        head: {
            htmlAttrs: {
                lang: 'ja',
            },
            title: '読込中',
            titleTemplate: `%s .:. ${appName}`,
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Nuxt 3 Awesome Starter',
                },
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: `${appBaseUrl}/favicon.png` }],
        },
    },
    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.css',
        '@admin/assets/css/default.scss',
    ],
    build: {
        transpile: ['vuetify'],
    },
    imports: {
        dirs: ['stores'],
    },
    nitro: {
        prerender: {
            ignore: ['/_samples'],
        },
    },
    modules: [
        '@vueuse/nuxt',
        ['@pinia/nuxt', { autoImports: ['defineStore'] }],
    ],
    router: {
        options: {
            hashMode: false,
        },
    },
    runtimeConfig: {
        public: {
            apiBaseUrl,
            appName,
            appVersion: process.env.APP_VERSION || '0.0.0',
            companyName: process.env.COMPANY_NAME || 'Global Design',
        },
    },
    typescript: {
        strict: true,
        typeCheck: true,
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },
    alias: {
        '@admin': resolve(__dirname),
    },
});
