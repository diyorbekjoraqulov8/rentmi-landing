/**
 * Static structure for the landing page.
 *
 * Content here is *structure*, not copy — every user-facing string is an i18n
 * key resolved in the component via `t()`. Sections iterate over these arrays
 * so markup stays declarative and adding/removing an item is a one-line change.
 *
 * The `audience` field marks items that differ between the two hero tabs
 * ("Uy egalari uchun" / "Ijarachilar uchun"). `undefined` = shown for both.
 */

export type Audience = 'owner' | 'tenant'

export interface Stat {
  /** i18n key for the label, e.g. landing.about.stats.properties */
  labelKey: string
  /** raw value, shown as-is (locale-independent number formatting handled in UI) */
  value: string
}

export interface Feature {
  icon: string
  titleKey: string
  /** optional supporting text — only the first feature shows one in the design */
  descKey?: string
}

export interface Listing {
  id: number
  titleKey: string
  /** address i18n key */
  addressKey: string
  price: string
  /** lucide icon hints for the meta row (area / rooms / floor) */
  meta: { icon: string, valueKey: string }[]
  /** badge i18n key (e.g. "TOP", "Rentmi tavsiya") — optional */
  badgeKey?: string
}

export interface Testimonial {
  id: number
  name: string
  avatar: string
  tenureKey: string
  tenure: string
  ratingKey: string
  rating: string
  bodyKey: string
}

export interface FaqItem {
  id: number
  questionKey: string
  answerKey: string
}

export interface BlogPost {
  id: number
  titleKey: string
  image: string
}

/* --- About / stats row --- */
export const stats: Stat[] = [
  { labelKey: 'landing.about.stats.properties', value: '10 000+' },
  { labelKey: 'landing.about.stats.scoredTenants', value: '30 000+' },
  { labelKey: 'landing.about.stats.satisfaction', value: '98,2%' }
]

/* --- Features ("Afzalliklarimiz") — only the first item shows a description --- */
export const features: Feature[] = [
  {
    icon: 'IconsScoringFlame',
    titleKey: 'landing.features.items.scoredTenants.title',
    descKey: 'landing.features.items.scoredTenants.desc'
  },
  {
    icon: 'lucide:key-round',
    titleKey: 'landing.features.items.manage.title'
  },
  {
    icon: 'IconsDocument',
    titleKey: 'landing.features.items.contract.title'
  },
  {
    icon: 'IconsShareLarge',
    titleKey: 'landing.features.items.integration.title'
  }
]

/* --- Listings carousel (placeholder data) --- */
export const listings: Listing[] = [
  {
    id: 1,
    titleKey: 'landing.listings.items.1.title',
    addressKey: 'landing.listings.items.1.address',
    price: '18 mln',
    badgeKey: 'landing.listings.badge.recommended',
    meta: [
      { icon: 'lucide:scan', valueKey: 'landing.listings.items.1.area' },
      { icon: 'lucide:bed', valueKey: 'landing.listings.items.1.rooms' }
    ]
  },
  {
    id: 2,
    titleKey: 'landing.listings.items.2.title',
    addressKey: 'landing.listings.items.2.address',
    price: '24 mln',
    badgeKey: 'landing.listings.badge.top',
    meta: [
      { icon: 'lucide:scan', valueKey: 'landing.listings.items.2.area' },
      { icon: 'lucide:bed', valueKey: 'landing.listings.items.2.rooms' }
    ]
  },
  {
    id: 3,
    titleKey: 'landing.listings.items.3.title',
    addressKey: 'landing.listings.items.3.address',
    price: '15 mln',
    meta: [
      { icon: 'lucide:scan', valueKey: 'landing.listings.items.3.area' },
      { icon: 'lucide:bed', valueKey: 'landing.listings.items.3.rooms' }
    ]
  },
  {
    id: 4,
    titleKey: 'landing.listings.items.4.title',
    addressKey: 'landing.listings.items.4.address',
    price: '30 mln',
    meta: [
      { icon: 'lucide:scan', valueKey: 'landing.listings.items.4.area' },
      { icon: 'lucide:bed', valueKey: 'landing.listings.items.4.rooms' }
    ]
  }
]

/* --- "Qanday boshqarasiz?" management showcase ---
   Three card variants illustrate the lifecycle of a listing:
     'cta'    — a fresh listing with a "publish" button
     'rented' — an active rental (tenant + payment progress + dates)
     'stats'  — a published listing showing view/application/saved counts   */
export type ManageVariant = 'cta' | 'rented' | 'stats'

export interface ManageListing {
  id: number
  variant: ManageVariant
  title: string
  addressKey: string
  price: string
  area: string
  floor: string
  /** 'rented' only */
  tenant?: string
  paid?: number
  total?: number
  badgeKey?: string
  /** 'stats' only — viewed / applications / saved */
  stats?: { icon: string, value: string, labelKey: string }[]
}

export const manageListings: ManageListing[] = [
  {
    id: 1,
    variant: 'cta',
    title: 'Dream City 3 xonali',
    addressKey: 'landing.manage.addr.dreamCity',
    price: '23 mln so\'m',
    area: '120m²',
    floor: '12/16'
  },
  {
    id: 2,
    variant: 'rented',
    title: 'Mirabad Square | Penthouse',
    addressKey: 'landing.manage.addr.mirabad',
    price: '24,5 mln so\'m',
    area: '185m²',
    floor: '12/12',
    tenant: 'Abdullayev Sarvar',
    paid: 6,
    total: 8
  },
  {
    id: 3,
    variant: 'stats',
    title: 'Duplex Yakkasaroy',
    addressKey: 'landing.manage.addr.duplex',
    price: '18 mln so\'m',
    area: '120m²',
    floor: '12/16',
    badgeKey: 'landing.manage.vacant',
    stats: [
      { icon: 'IconsEye', value: '24', labelKey: 'landing.manage.stats.viewed' },
      { icon: 'IconsFileExport', value: '2', labelKey: 'landing.manage.stats.applications' },
      { icon: 'IconsBookmark', value: '31', labelKey: 'landing.manage.stats.saved' }
    ]
  },
  {
    id: 4,
    variant: 'stats',
    title: 'Drujba NRG | U Tower',
    addressKey: 'landing.manage.addr.drujba',
    price: '18 mln so\'m',
    area: '120m²',
    floor: '12/16',
    badgeKey: 'landing.manage.vacant',
    stats: [
      { icon: 'IconsEye', value: '125', labelKey: 'landing.manage.stats.viewed' },
      { icon: 'IconsFileExport', value: '3', labelKey: 'landing.manage.stats.applications' },
      { icon: 'IconsBookmark', value: '45', labelKey: 'landing.manage.stats.saved' }
    ]
  },
  {
    id: 5,
    variant: 'rented',
    title: 'Yunusobod 3 xonali',
    addressKey: 'landing.manage.addr.yunusobod',
    price: '50 mln so\'m',
    area: '185m²',
    floor: '12/12',
    tenant: 'Bekzodov Mahmud',
    paid: 6,
    total: 8
  }
]

/* --- Testimonials --- */
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Abullayeva Munira',
    avatar: '/landing/testimonial-1.png',
    tenureKey: 'landing.testimonials.tenure',
    tenure: '2',
    ratingKey: 'landing.testimonials.rating',
    rating: '5.0',
    bodyKey: 'landing.testimonials.items.1'
  },
  {
    id: 2,
    name: 'Bekzodov Anvar',
    avatar: '/landing/testimonial-2.png',
    tenureKey: 'landing.testimonials.tenure',
    tenure: '3',
    ratingKey: 'landing.testimonials.rating',
    rating: '4.9',
    bodyKey: 'landing.testimonials.items.2'
  },
  {
    id: 3,
    name: 'Elmurod Haqnazarov',
    avatar: '/landing/testimonial-3.png',
    tenureKey: 'landing.testimonials.tenure',
    tenure: '1',
    ratingKey: 'landing.testimonials.rating',
    rating: '4.8',
    bodyKey: 'landing.testimonials.items.3'
  }
]

/* --- FAQ accordion --- */
export const faqItems: FaqItem[] = [
  { id: 1, questionKey: 'landing.faq.items.1.q', answerKey: 'landing.faq.items.1.a' },
  { id: 2, questionKey: 'landing.faq.items.2.q', answerKey: 'landing.faq.items.2.a' },
  { id: 3, questionKey: 'landing.faq.items.3.q', answerKey: 'landing.faq.items.3.a' },
  { id: 4, questionKey: 'landing.faq.items.4.q', answerKey: 'landing.faq.items.4.a' },
  { id: 5, questionKey: 'landing.faq.items.5.q', answerKey: 'landing.faq.items.5.a' }
]

/* --- Blog / "useful features" cards --- */
export const blogPosts: BlogPost[] = [
  { id: 1, titleKey: 'landing.blog.items.1', image: '' },
  { id: 2, titleKey: 'landing.blog.items.2', image: '' },
  { id: 3, titleKey: 'landing.blog.items.3', image: '' }
]
