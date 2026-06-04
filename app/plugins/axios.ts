import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig
} from 'axios'

/**
 * Single axios instance for the whole app.
 *
 * Auth model: OTP → JWT (access + refresh). The request interceptor attaches
 * the access token; the response interceptor catches 401, refreshes ONCE via a
 * shared promise (mutex), and retries the original request. Concurrent 401s
 * share that one in-flight refresh — never add a second/parallel refresh path
 * (this rule is shared across all RentMe clients).
 *
 * SSR-safe: tokens are read per-request from cookies (useCookie), never from a
 * module-level variable, so one user's token can't leak across SSR requests.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    headers: { 'Content-Type': 'application/json' }
  })

  // --- token storage (cookies, SSR-safe) ---
  const accessToken = () =>
    useCookie<string | null>('access_token', { sameSite: 'lax' })
  const refreshToken = () =>
    useCookie<string | null>('refresh_token', { sameSite: 'lax' })

  // --- request: attach access token ---
  api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
    const token = accessToken().value
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
  })

  // --- response: refresh-once mutex ---
  let refreshPromise: Promise<string | null> | null = null

  const doRefresh = async (): Promise<string | null> => {
    const refresh = refreshToken().value
    if (!refresh) return null
    try {
      // Plain axios (no interceptors) to avoid recursion on the refresh call.
      const { data } = await axios.post(
        `${config.public.apiBase}/auth/token/refresh/`,
        { refresh }
      )
      const newAccess: string = data.access
      accessToken().value = newAccess
      if (data.refresh) refreshToken().value = data.refresh
      return newAccess
    }
    catch {
      accessToken().value = null
      refreshToken().value = null
      return null
    }
  }

  api.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const original = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined

      if (
        error.response?.status === 401
        && original
        && !original._retry
        && refreshToken().value
      ) {
        original._retry = true
        // Mutex: only one refresh runs; all callers await the same promise.
        refreshPromise = refreshPromise ?? doRefresh()
        const newAccess = await refreshPromise
        refreshPromise = null

        if (newAccess) {
          original.headers.Authorization = `Bearer ${newAccess}`
          return api(original)
        }
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: { api }
  }
})
