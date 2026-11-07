export default defineNuxtConfig({
    runtimeConfig: {
        redisUrl: 'redis://redis:6379',
        apiProxyTarget: 'http://app', // private, server only
        apiBasicUser: '',
        apiBasicPassword: '',
        public: {
            apiBaseUri: '/api',
        },
    },
    $production: {
        runtimeConfig: {
            apiProxyTarget: 'https://app',
        },
    },
    modules: [],
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
})