<script setup lang="ts">
/**
 * Lightweight, dependency-free location map. Embeds OpenStreetMap (free, no API
 * key) via an iframe that is only mounted once the block scrolls near the
 * viewport (IntersectionObserver) — so the heavy tiles never load above the
 * fold and the page stays fast. Read-only; just shows where the listing is.
 */
const props = withDefaults(
  defineProps<{ lat: number, lng: number, label?: string }>(),
  { label: '' }
)

const { t } = useI18n()

const root = ref<HTMLElement | null>(null)
const visible = ref(false)
let io: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    visible.value = true
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        visible.value = true
        io?.disconnect()
      }
    },
    { rootMargin: '200px' }
  )
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())

const PAD = 0.004
const src = computed(() => {
  const { lat, lng } = props
  const bbox = `${lng - PAD},${lat - PAD},${lng + PAD},${lat + PAD}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
})
const externalLink = computed(
  () =>
    `https://www.openstreetmap.org/?mlat=${props.lat}&mlon=${props.lng}#map=16/${props.lat}/${props.lng}`
)
</script>

<template>
  <div
    ref="root"
    class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 md:aspect-[21/9]">
    <iframe
      v-if="visible"
      :src="src"
      :title="label || t('property.sections.location')"
      class="h-full w-full border-0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade" />
    <div v-else class="absolute inset-0 grid place-items-center text-neutral-300">
      <IconsMapPin class="size-8" />
    </div>

    <a
      :href="externalLink"
      target="_blank"
      rel="noopener noreferrer"
      class="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur transition-colors hover:text-brand-600">
      <IconsMapPin class="size-3.5" />
      {{ t('property.openMap') }}
    </a>
  </div>
</template>
