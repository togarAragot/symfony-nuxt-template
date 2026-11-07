import type { UseFetchOptions } from '#app'

export const useProtectedApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const { public: { apiBaseUri } } = useRuntimeConfig()
  const csrfToken = useCsrf()

  return useFetch(url, {
    ...options,
    baseURL: apiBaseUri,
    credentials: 'include',
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken.state.value?.token ?? '',
    },
  }) as ReturnType<typeof useFetch<T>>
}