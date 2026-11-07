import { defineConfig } from 'oxlint'

export default defineConfig({
    plugins: ['typescript', 'vue', 'unicorn', 'oxc'],

    categories: {
        correctness: 'deny',
        suspicious: 'deny',
        pedantic: 'deny',
        perf: 'warn',
        style: 'warn',
    },

    options: {
        typeAware: true,
    },
})