/**
 * Property listings — the single source of truth for both the home
 * "Aynan siz uchun mos uylar" carousel and the `/listings/[id]` detail page.
 *
 * Listing *content* (title, address, description) is mock data kept as raw
 * strings; UI chrome and the shared amenity / nearby / audience catalogs are
 * i18n keys resolved with `t()` in the components, so the same listing renders
 * in uz / ru / en. Add or edit a listing here — every consumer updates.
 */

export interface AmenityDef {
  icon: string
  labelKey: string
}

/** Catalog of possible in-flat amenities ("Qulayliklar"). */
export const AMENITIES: Record<string, AmenityDef> = {
  lift: { icon: 'lucide:arrow-up-down', labelKey: 'property.amenities.lift' },
  parking: { icon: 'lucide:square-parking', labelKey: 'property.amenities.parking' },
  balcony: { icon: 'lucide:fence', labelKey: 'property.amenities.balcony' },
  dishwasher: { icon: 'lucide:utensils', labelKey: 'property.amenities.dishwasher' },
  vacuum: { icon: 'lucide:wind', labelKey: 'property.amenities.vacuum' },
  iron: { icon: 'lucide:shirt', labelKey: 'property.amenities.iron' },
  furniture: { icon: 'lucide:armchair', labelKey: 'property.amenities.furniture' },
  gasStove: { icon: 'lucide:flame', labelKey: 'property.amenities.gasStove' },
  hotWater: { icon: 'lucide:droplets', labelKey: 'property.amenities.hotWater' },
  wifi: { icon: 'lucide:wifi', labelKey: 'property.amenities.wifi' }
}

/** Catalog of nearby points of interest ("Atrofdagi qulayliklar"). */
export const NEARBY: Record<string, AmenityDef> = {
  bank: { icon: 'lucide:landmark', labelKey: 'property.nearby.bank' },
  mosque: { icon: 'lucide:moon-star', labelKey: 'property.nearby.mosque' },
  hospital: { icon: 'lucide:cross', labelKey: 'property.nearby.hospital' },
  kindergarten: { icon: 'lucide:baby', labelKey: 'property.nearby.kindergarten' },
  school: { icon: 'lucide:graduation-cap', labelKey: 'property.nearby.school' },
  metro: { icon: 'lucide:train-front', labelKey: 'property.nearby.metro' },
  market: { icon: 'lucide:shopping-cart', labelKey: 'property.nearby.market' }
}

/** "Kimlar uchun" audience tags. */
export const AUDIENCES: Record<string, string> = {
  women: 'property.audience.women',
  youngFamilies: 'property.audience.youngFamilies',
  elderly: 'property.audience.elderly',
  familiesWithKids: 'property.audience.familiesWithKids'
}

export interface NearbyItem {
  /** key into NEARBY catalog */
  key: string
  /** distance label, e.g. "350m", "1,2km" */
  distance?: string
}

export interface Property {
  id: string
  title: string
  address: string
  /** monthly price, pre-formatted, e.g. "25 mln so'm" */
  price: string
  rooms: string
  area: string
  floor: string
  /** gallery images (first is the cover) */
  images: string[]
  description: string
  /** publish timestamp label, e.g. "5-Aprel, 2026  20:45" */
  publishedAt: string
  /** minimum rental term, e.g. "6 oy" */
  minRent: string
  /** security deposit label; omit if none */
  deposit?: string
  views: string
  applications: string
  saved: string
  /** keys into the AMENITIES catalog */
  amenities: string[]
  nearby: NearbyItem[]
  /** keys into the AUDIENCES catalog */
  audiences: string[]
  /** map pin — absent for API-sourced listings (the feed has no coords) */
  location?: { lat: number, lng: number, label: string }
  /** the lead card in carousels: pinned to the dark/active state */
  recommended?: boolean
}

// Placeholder photos shipped in the repo are small; these three actually have
// visible content (the others are near-empty 2×2 stubs). Swap in real listing
// photos later — the gallery/cards pick these up automatically.
const POOL = [
  '/landing/drujba-nrg.webp',
  '/landing/drujba.webp',
  '/landing/mirabad-square.webp'
]

/** Cycle the image pool to fake an n-photo gallery (offset varies per listing). */
function gallery(n: number, offset = 0): string[] {
  return Array.from({ length: n }, (_, i) => POOL[(i + offset) % POOL.length]!)
}

const BASE_AMENITIES = [
  'lift', 'parking', 'balcony', 'dishwasher', 'vacuum',
  'iron', 'furniture', 'gasStove', 'hotWater', 'wifi'
]

const BASE_NEARBY: NearbyItem[] = [
  { key: 'bank' },
  { key: 'mosque', distance: '350m' },
  { key: 'hospital' },
  { key: 'kindergarten', distance: '500m' },
  { key: 'school', distance: '1,2km' },
  { key: 'metro', distance: '800m' },
  { key: 'market' }
]

const LONG_DESC
  = 'Toshkent shahri U-Tower turar-joy majmuasi. 12-qavatda yangi 4 xonali '
    + 'kvartira ijaraga beriladi. Kvartirada kundalik hayot uchun zarur bo\'lgan '
    + 'hamma narsa mavjud: markaziy konditsioner, kir yuvish mashinasi, karavot, '
    + 'mebel, Wi-Fi, oshxona anjomlari va ovqatlanish stoli. Uy yorug\', shinam '
    + 'va metroga yaqin joylashgan. Atrofda maktab, bog\'cha, bank va savdo '
    + 'markazlari mavjud. Uzoq muddatli ijara uchun ideal variant.'

const SHORT_DESC
  = 'Mirobod prospekti turar-joy majmuasi. 8-qavatda yangi ikki xonali kvartira '
    + 'ijaraga beriladi. Kvartirada kundalik hayot uchun zarur bo\'lgan hamma '
    + 'narsa mavjud: markaziy konditsioner, kir yuvish mashinasi, mebel, Wi-Fi.'

interface Seed {
  id: string
  title: string
  address: string
  price: string
  rooms: string
  area: string
  floor: string
  photos: number
  long?: boolean
  deposit?: string
  recommended?: boolean
  lat: number
  lng: number
}

const SEEDS: Seed[] = [
  { id: '1', title: 'Drujba NRG | U Tower', address: 'Toshkent, Yashnobod t. Tolariq k. 40', price: '25 mln so\'m', rooms: '4 xonali', area: '120m²', floor: '12/16', photos: 15, long: true, deposit: '15 mln so\'m', recommended: true, lat: 41.2995, lng: 69.2401 },
  { id: '2', title: 'Mirabad Square | Penthouse', address: 'Toshkent, Mirobod t. Mirobod Avenue, Block D, 34', price: '24 mln so\'m', rooms: '4 xonali', area: '180m²', floor: '14/16', photos: 8, deposit: '12 mln so\'m', lat: 41.2856, lng: 69.2742 },
  { id: '3', title: 'Yunusobod Residence', address: 'Toshkent, Yunusobod t. Amir Temur 108', price: '15 mln so\'m', rooms: '2 xonali', area: '75m²', floor: '7/12', photos: 6, lat: 41.3641, lng: 69.2895 },
  { id: '4', title: 'Dream City Lux', address: 'Toshkent, Sergeli t. Yangi Sergeli 5', price: '30 mln so\'m', rooms: '5 xonali', area: '210m²', floor: '9/10', long: true, photos: 12, deposit: '20 mln so\'m', lat: 41.2233, lng: 69.2197 },
  { id: '5', title: 'Drujba NRG | U Tower', address: 'Toshkent, Yashnobod t. Tolariq k. 40', price: '18 mln so\'m', rooms: '3 xonali', area: '120m²', floor: '12/16', photos: 5, lat: 41.3001, lng: 69.2410 },
  { id: '6', title: 'Duplex Yakkasaroy', address: 'Toshkent, Yakkasaroy t. Shota Rustaveli 21', price: '56 mln so\'m', rooms: '6 xonali', area: '320m²', floor: '1/2', long: true, photos: 18, deposit: '40 mln so\'m', lat: 41.2901, lng: 69.2520 },
  { id: '7', title: 'Mirabad Square | Penthouse', address: 'Toshkent, Mirobod t. Mirobod Avenue, Block D, 34', price: '12 mln so\'m', rooms: '2 xonali', area: '64m²', floor: '5/16', photos: 7, lat: 41.2860, lng: 69.2750 },
  { id: '8', title: 'Yunusobod Towers', address: 'Toshkent, Yunusobod t. Bodomzor 14', price: '21 mln so\'m', rooms: '3 xonali', area: '98m²', floor: '11/14', photos: 9, deposit: '10 mln so\'m', lat: 41.3550, lng: 69.2890 },
  { id: '9', title: 'Chilonzor Comfort', address: 'Toshkent, Chilonzor t. Bunyodkor 48', price: '14 mln so\'m', rooms: '2 xonali', area: '70m²', floor: '4/9', photos: 6, lat: 41.2750, lng: 69.2040 },
  { id: '10', title: 'Olmazor Residence', address: 'Toshkent, Olmazor t. Universitet 7', price: '17 mln so\'m', rooms: '3 xonali', area: '88m²', floor: '8/12', photos: 10, deposit: '8 mln so\'m', lat: 41.3480, lng: 69.2030 }
]

export const properties: Property[] = SEEDS.map((s, i) => ({
  id: s.id,
  title: s.title,
  address: s.address,
  price: s.price,
  rooms: s.rooms,
  area: s.area,
  floor: s.floor,
  images: gallery(s.photos, i),
  description: s.long ? LONG_DESC : SHORT_DESC,
  publishedAt: '5-Aprel, 2026  20:45',
  minRent: '6 oy',
  deposit: s.deposit,
  views: '125',
  applications: '3',
  saved: '45',
  amenities: BASE_AMENITIES,
  nearby: BASE_NEARBY,
  audiences: ['women', 'youngFamilies', 'elderly', 'familiesWithKids'],
  location: { lat: s.lat, lng: s.lng, label: s.address },
  recommended: s.recommended
}))

/** O(1) lookup by route id. */
const byId = new Map(properties.map((p) => [p.id, p]))
export const getProperty = (id: string): Property | undefined => byId.get(id)

/** Up to `limit` listings other than `id` — for the "O'xshash e'lonlar" row. */
export function similarProperties(id: string, limit = 6): Property[] {
  return properties.filter((p) => p.id !== id).slice(0, limit)
}
