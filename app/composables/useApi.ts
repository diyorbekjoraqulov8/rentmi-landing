import type { AxiosInstance } from 'axios'

/**
 * Access the shared axios instance provided by `plugins/axios.ts`.
 * Use this everywhere instead of importing axios directly, so the JWT
 * interceptor + refresh mutex apply uniformly.
 *
 *   const api = useApi()
 *   const { data } = await api.get('/mobile/announcements/', { params })
 */
export const useApi = (): AxiosInstance => {
  return useNuxtApp().$api as AxiosInstance
}
