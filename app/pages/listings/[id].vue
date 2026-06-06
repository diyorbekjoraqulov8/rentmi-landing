<script setup lang="ts">
/**
 * Listing detail page — /listings/[id].
 * Gallery + lightbox, key facts, clamped description, amenities, nearby POIs,
 * audience tags, a lightweight map and a "similar listings" carousel.
 * Data comes from the static ~/data/properties source (mock).
 */
import {
  getProperty,
  similarProperties,
  AMENITIES,
  NEARBY
} from '~/data/properties'

// Remount on id change so gallery/lightbox state resets cleanly between listings.
definePageMeta({ key: (route) => route.fullPath })

const { t } = useI18n()
const route = useRoute()

const property = getProperty(String(route.params.id))
if (!property) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Listing not found',
    fatal: true
  })
}

const similar = similarProperties(property.id)

const meta = computed(() => [
  { icon: 'lucide:bed-double', label: property!.rooms },
  { icon: 'lucide:maximize-2', label: property!.area },
  { icon: 'lucide:layers', label: property!.floor }
])

const stats = computed(() => [
  {
    icon: 'lucide:eye',
    label: t('property.stats.viewed'),
    value: property!.views
  },
  {
    icon: 'lucide:file-text',
    label: t('property.stats.applications'),
    value: property!.applications
  },
  {
    icon: 'lucide:bookmark',
    label: t('property.stats.saved'),
    value: property!.saved
  }
])

// Resolve catalog entries here so the template iterates plain objects (no
// possibly-undefined index access in markup).
const amenityList = computed(() =>
  property!.amenities
    .map((k) => AMENITIES[k])
    .filter((a): a is NonNullable<typeof a> => !!a)
)
const nearbyList = computed(() =>
  property!.nearby
    .map((n) => {
      const def = NEARBY[n.key]
      return def
        ? { icon: def.icon, labelKey: def.labelKey, distance: n.distance }
        : null
    })
    .filter((n): n is NonNullable<typeof n> => !!n)
)

useSeoMeta({
  title: () => t('property.seo.title', { title: property!.title }),
  description: () =>
    t('property.seo.description', {
      title: property!.title,
      address: property!.address,
      price: property!.price
    }),
  ogTitle: () => `${property!.title} — ${property!.price}`,
  ogDescription: () => property!.description,
  ogType: 'website',
  ogImage: property.images[0],
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'rentmi.uz', item: '/' },
      { name: property.title }
    ]
  }),
  defineProduct({
    name: property.title,
    image: property.images.slice(0, 3),
    description: property.description
  })
])
</script>

<template>
  <div v-if="property" class="pb-28 lg:pb-16">
    <div class="mx-auto w-full max-w-330 px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <div class="grid gap-x-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <!-- LEFT: gallery + facts + sections -->
        <div class="min-w-0">
          <ListingsGallery
            :images="property.images"
            :alt="property.title"
            :meta="meta" />

          <!-- Title / address / price -->
          <div class="mt-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
                {{ property.title }}
              </h1>
              <div class="hidden flex-wrap gap-2 md:flex">
                <span
                  v-for="m in meta"
                  :key="m.label"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700">
                  <Icon :name="m.icon" class="size-4 text-neutral-500" />
                  {{ m.label }}
                </span>
              </div>
            </div>
            <p class="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
              <IconsMapPin class="size-4 shrink-0" />
              {{ property.address }}
            </p>
            <p class="mt-4 text-2xl font-bold text-neutral-900">
              {{ property.price }}
              <span class="text-base font-normal text-neutral-400">
                / {{ t('landing.listings.perMonth') }}</span
              >
            </p>
          </div>

          <hr class="my-8 border-neutral-200" />

          <!-- Tavsif -->
          <section>
            <h2 class="text-xl font-bold text-neutral-900">
              {{ t('property.sections.description') }}
            </h2>
            <div class="mt-4">
              <BaseReadMore :text="property.description" :lines="5" />
            </div>
          </section>

          <!-- Qulayliklar -->
          <section class="mt-10">
            <h2 class="text-xl font-bold text-neutral-900">
              {{ t('property.sections.amenities') }}
            </h2>
            <div class="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              <div
                v-for="a in amenityList"
                :key="a.labelKey"
                class="flex flex-col gap-2.5 rounded-xl p-4 transition-colors bg-white hover:bg-neutral-50">
                <Icon :name="a.icon" class="size-5 text-neutral-600" />
                <span class="text-sm text-neutral-700">{{
                  t(a.labelKey)
                }}</span>
              </div>
            </div>
          </section>

          <!-- Atrofdagi qulayliklar -->
          <section class="mt-10">
            <h2 class="text-xl font-bold text-neutral-900">
              {{ t('property.sections.nearby') }}
            </h2>
            <div class="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              <div
                v-for="n in nearbyList"
                :key="n.labelKey"
                class="flex flex-col gap-2.5 rounded-xl transition-colors bg-white hover:bg-neutral-50 p-4">
                <Icon :name="n.icon" class="size-5 text-neutral-600" />
                <span class="text-sm text-neutral-700">
                  {{ t(n.labelKey) }}
                  <span v-if="n.distance" class="text-neutral-400"
                    >({{ n.distance }})</span
                  >
                </span>
              </div>
            </div>
          </section>

          <!-- Kimlar uchun -->
          <section class="mt-10">
            <h2 class="text-xl font-bold text-neutral-900">
              {{ t('property.sections.audience') }}
            </h2>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span
                v-for="key in property.audiences"
                :key="key"
                class="rounded-full bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                {{ t(`property.audience.${key}`) }}
              </span>
            </div>
          </section>

          <!-- Manzil -->
          <section class="mt-10">
            <div class="rounded-2xl bg-surface p-5 shadow-card">
              <h2 class="text-lg font-bold text-neutral-900">
                {{ t('property.sections.location') }}
              </h2>
              <p
                class="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                <IconsMapPin class="size-4 shrink-0" />
                {{ property.address }}
              </p>
              <div class="mt-4">
                <ListingsMap
                  :lat="property.location.lat"
                  :lng="property.location.lng"
                  :label="property.title" />
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT: stats + apply (desktop, sticky) -->
        <aside class="top-24 hidden lg:sticky lg:block">
          <!-- Stats -->
          <div
            class="flex items-stretch rounded-2xl bg-surface p-2 shadow-card">
            <div
              v-for="(s, i) in stats"
              :key="s.label"
              class="flex flex-1 flex-col gap-1 px-3 py-2"
              :class="
                i < stats.length - 1 ? 'border-r border-neutral-200' : ''
              ">
              <span class="text-xs text-neutral-400">{{ s.label }}</span>
              <span
                class="flex items-center gap-1.5 text-base font-semibold text-neutral-900">
                {{ s.value }}
                <Icon :name="s.icon" class="size-4 text-neutral-400" />
              </span>
            </div>
          </div>

          <!-- Apply card -->
          <div class="mt-4 rounded-2xl bg-surface p-5 shadow-card">
            <p class="text-xl font-bold text-neutral-900">
              {{ property.price }}
              <span class="text-sm font-normal text-neutral-400">
                / {{ t('landing.listings.perMonth') }}</span
              >
            </p>

            <div class="mt-3 text-sm text-neutral-500">
              <p>{{ t('property.published') }}</p>
              <p class="mt-1 flex items-center gap-1.5 text-neutral-700">
                <Icon name="lucide:clock" class="size-4 text-neutral-400" />
                {{ property.publishedAt }}
              </p>
            </div>

            <div class="mt-4 space-y-2.5">
              <div
                class="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm">
                <span class="text-neutral-500">{{
                  t('property.minRent')
                }}</span>
                <span class="font-semibold text-neutral-900">{{
                  property.minRent
                }}</span>
              </div>
              <div
                v-if="property.deposit"
                class="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm">
                <span class="text-neutral-500">{{
                  t('property.deposit')
                }}</span>
                <span
                  class="flex items-center gap-1.5 font-semibold text-neutral-900">
                  {{ property.deposit }}
                  <Icon
                    name="lucide:shield-check"
                    class="size-4 text-amber-500" />
                </span>
              </div>
            </div>

            <BaseButton block size="lg" class="mt-5">
              {{ t('property.apply') }}
            </BaseButton>
          </div>
        </aside>
      </div>
    </div>

    <!-- O'xshash e'lonlar (full width) -->
    <ListingsCarousel
      :title="t('property.sections.similar')"
      :items="similar" />

    <!-- Mobile sticky CTA -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-neutral-200 bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
      <p class="flex-1 text-base font-bold text-neutral-900">
        {{ property.price }}
        <span class="text-xs font-normal text-neutral-400">
          / {{ t('landing.listings.perMonth') }}</span
        >
      </p>
      <BaseButton size="lg">{{ t('property.apply') }}</BaseButton>
    </div>
  </div>
</template>
