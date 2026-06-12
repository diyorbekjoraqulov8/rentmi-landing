/**
 * Property announcements fetched from the backend
 * (`/api/v1/admin/property/homeowner/announcements/list/for-site/` — the
 * backend's public "for site" listing feed).
 *
 * Same contract as `useFaqs`: non-critical, fetched in the background by
 * `plugins/prefetch.client.ts` after hydration; `announcements` stays `null`
 * until a fetch succeeds and the listings carousel falls back to the static
 * mock data meanwhile. Items are mapped into the shared `Property` shape so
 * every existing consumer (carousel card, detail page) renders them as-is.
 */
import type { Property } from '~/data/properties'

interface ApiAnnouncement {
  id: number
  title?: string
  image?: string | null
  address?: string
  area?: number
  floor?: number
  total_floors?: number
  price?: number
  usd_price?: number
  currency?: string
  views?: number
  moderated_status?: string
  is_available?: boolean
}

/** 4800000 UZS → "4,8 mln so'm"; 500001 UZS → "500 001 so'm". */
const formatPrice = (price: number, currency: string): string => {
  if (currency !== 'UZS') return `${price} ${currency}`
  if (price >= 1_000_000) {
    const mln = price / 1_000_000
    const label = Number.isInteger(mln)
      ? String(mln)
      : mln.toFixed(1).replace('.', ',')
    return `${label} mln so'm`
  }
  const grouped = String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${grouped} so'm`
}

/** 59.52 → "59,5m²"; 72 → "72m²"; 0 / missing → "". */
const formatArea = (area?: number): string => {
  if (!area) return ''
  const label = Number.isInteger(area)
    ? String(area)
    : area.toFixed(1).replace('.', ',')
  return `${label}m²`
}

/** floor 15 of 16 → "15/16"; missing parts degrade gracefully. */
const formatFloor = (floor?: number, total?: number): string => {
  if (floor && total) return `${floor}/${total}`
  if (floor) return String(floor)
  return ''
}

const toProperty = (item: ApiAnnouncement, index: number): Property => ({
  id: String(item.id),
  title: item.title ?? '',
  address: item.address ?? '',
  price: formatPrice(item.price ?? 0, item.currency ?? 'UZS'),
  rooms: '',
  area: formatArea(item.area),
  floor: formatFloor(item.floor, item.total_floors),
  images: item.image ? [item.image] : [],
  // Detail-only fields the list endpoint doesn't provide — the detail page
  // hides the corresponding sections when these are empty.
  description: '',
  publishedAt: '',
  minRent: '',
  views: String(item.views ?? 0),
  applications: '—',
  saved: '—',
  amenities: [],
  nearby: [],
  audiences: [],
  // Pin the first card to the carousel's dark "recommended" lead state.
  recommended: index === 0
})

export const useAnnouncements = () => {
  const announcements = useState<Property[] | null>('announcements', () => null)
  const pending = useState('announcements-pending', () => false)

  const load = async () => {
    if (pending.value || announcements.value) return
    pending.value = true

    try {
      // Trailing slash matters: without it the backend 301-redirects to the
      // absolute prod URL, which breaks the dev proxy (cross-origin).
      const { data } = await useApi().get(
        '/admin/property/homeowner/announcements/list/for-site/',
        {
          params: { page_size: 50 },
          // Background request — give up instead of dangling forever.
          timeout: 15_000
        }
      )

      const raw: ApiAnnouncement[] = Array.isArray(data)
        ? data
        : (data?.results ?? [])
      const mapped = raw
        .filter(item =>
          item.moderated_status === 'approved' && item.is_available !== false)
        .map(toProperty)
        .filter(p => p.title && p.images.length)

      if (mapped.length) announcements.value = mapped
    }
    catch {
      // Non-critical: keep the static mock listings on any failure.
    }
    finally {
      pending.value = false
    }
  }

  /** Lookup for the detail page (API-sourced ids miss the static map). */
  const findProperty = (id: string): Property | undefined =>
    announcements.value?.find(p => p.id === id)

  /** Other announcements, for the detail page's "O'xshash e'lonlar" row. */
  const similar = (id: string, limit = 6): Property[] =>
    (announcements.value ?? []).filter(p => p.id !== id).slice(0, limit)

  return { announcements, load, findProperty, similar }
}
