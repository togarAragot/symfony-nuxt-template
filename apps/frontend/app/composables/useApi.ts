import type { UseFetchOptions } from "#app"

export const useApi = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const { public: { apiBaseUri } } = useRuntimeConfig()

  return useFetch(url, {
    ...options,
    baseURL: apiBaseUri,
    credentials: 'include',
  }) as ReturnType<typeof useFetch<T>>
}