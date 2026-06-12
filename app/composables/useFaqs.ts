/**
 * FAQ items fetched from the backend (`/api/v1/mobile/faqs/`).
 *
 * Non-critical data: `faqs` stays `null` until a background fetch (kicked off
 * by `plugins/prefetch.client.ts` after hydration) succeeds, and the FAQ
 * section falls back to the static i18n items while it is. Any failure is
 * swallowed — the landing page must never depend on the API being up.
 */

export interface Faq {
  id: number
  question: string
  answer: string
}

/** Raw backend item — tolerate plain and modeltranslation-suffixed fields. */
interface ApiFaq {
  id: number
  [key: string]: unknown
}

export const useFaqs = () => {
  const faqs = useState<Faq[] | null>('faqs', () => null)
  /** locale the current `faqs` were fetched for — guards duplicate fetches */
  const loadedLocale = useState<string | null>('faqs-locale', () => null)
  /** locale a fetch is currently in flight for — dedupes concurrent calls */
  const pendingLocale = useState<string | null>('faqs-pending', () => null)

  const load = async () => {
    const nuxtApp = useNuxtApp()
    const locale = nuxtApp.$i18n?.locale?.value ?? 'uz'
    if (loadedLocale.value === locale || pendingLocale.value === locale) return
    pendingLocale.value = locale

    try {
      const { data } = await useApi().get('/mobile/faqs/', {
        headers: { 'Accept-Language': locale },
        // Background request — give up instead of dangling forever.
        timeout: 15_000
      })
      console.log('data: ', data)

      // Paginated response: `{ page, count, results: [{ id, title, description }] }`.
      const raw: ApiFaq[] = Array.isArray(data) ? data : (data?.results ?? [])
      const text = (item: ApiFaq, field: string): string => {
        const value = item[`${field}_${locale}`] ?? item[field]
        return typeof value === 'string' ? value : ''
      }
      const mapped = raw
        .map(item => ({
          id: item.id,
          question: text(item, 'title'),
          answer: text(item, 'description')
        }))
        .filter(faq => faq.question && faq.answer)

      // If the user switched locale mid-flight, a newer fetch owns the state.
      if ((nuxtApp.$i18n?.locale?.value ?? 'uz') !== locale) return

      if (mapped.length) {
        faqs.value = mapped
        loadedLocale.value = locale
      }
    }
    catch {
      // Non-critical: keep the static i18n fallback on any failure.
    }
    finally {
      if (pendingLocale.value === locale) pendingLocale.value = null
    }
  }

  return { faqs, load }
}
