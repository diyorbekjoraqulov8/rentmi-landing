/**
 * Auth composable — OTP → JWT flow against the backend `/auth/` namespace.
 *
 *   1. requestOtp(phone)        → backend sends SMS code
 *   2. verifyOtp(phone, code)   → returns { access, refresh }, stored in cookies
 *   3. logout()                 → clears tokens
 *
 * Tokens live in SSR-safe cookies, read by the axios interceptor per request.
 */
export const useAuth = () => {
  const api = useApi()

  const accessToken = useCookie<string | null>('access_token', { sameSite: 'lax' })
  const refreshToken = useCookie<string | null>('refresh_token', { sameSite: 'lax' })

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  const requestOtp = async (phone: string) => {
    await api.post('/auth/otp/request/', { phone })
  }

  const verifyOtp = async (phone: string, code: string) => {
    const { data } = await api.post('/auth/otp/verify/', { phone, code })
    accessToken.value = data.access
    refreshToken.value = data.refresh
    return data
  }

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
  }

  return { isAuthenticated, requestOtp, verifyOtp, logout }
}
