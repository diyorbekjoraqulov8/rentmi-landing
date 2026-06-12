/**
 * Background data prefetch.
 *
 * Every backend request the landing page can use is fired here, *after*
 * hydration (`onNuxtReady` → browser idle), so the API is never on the
 * critical rendering path. Each composable keeps its static fallback until
 * (and unless) its request succeeds — a dead backend costs nothing visible.
 */
import type { Composer } from 'vue-i18n'

export default defineNuxtPlugin((nuxtApp) => {
  const { load: loadFaqs } = useFaqs()
  const { load: loadAnnouncements } = useAnnouncements()

  onNuxtReady(() => {
    loadFaqs()
    loadAnnouncements()
  })

  // Backend localizes via Accept-Language — refetch when the user switches.
  watch((nuxtApp.$i18n as Composer).locale, () => {
    loadFaqs()
  })
})
