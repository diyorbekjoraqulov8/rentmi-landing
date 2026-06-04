/**
 * Route guard for authenticated-only pages.
 * Usage in a page:  definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  const localePath = useLocalePath()

  if (!isAuthenticated.value) {
    return navigateTo(localePath('/login') + `?redirect=${to.fullPath}`)
  }
})
