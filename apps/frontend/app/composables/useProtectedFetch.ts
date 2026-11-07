export const useProtectedFetch = () => {
    const { public: { apiBaseUri } } = useRuntimeConfig();
    const csrfToken = useCsrf();

    return $fetch.create({
        baseURL: apiBaseUri,
        credentials: 'include',
        onRequest({ options }) {
            const headers = new Headers(options.headers);
            headers.set('X-CSRF-Token', csrfToken.state.value?.token ?? '');
            options.headers = headers;
        },
    });
};