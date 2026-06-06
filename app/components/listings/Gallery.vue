<script setup lang="ts">
/**
 * Listing photo gallery.
 *  - Desktop: one large cover + two stacked thumbnails; the last shows a
 *    "+N" overlay when there are more than 3 photos.
 *  - Mobile: a single tappable cover with the meta badges overlaid.
 * Any tap opens the <ListingLightbox> at that photo. Thumbnails are lazy.
 */
const props = withDefaults(
  defineProps<{
    images: string[]
    alt?: string
    /** meta chips overlaid on the mobile cover (rooms / area / floor) */
    meta?: { icon: string; label: string }[]
  }>(),
  { alt: '', meta: () => [] }
)

const { t } = useI18n()

const lightboxOpen = ref(false)
const startIndex = ref(0)
function open(i: number) {
  startIndex.value = i
  lightboxOpen.value = true
}

const thumbs = computed(() => props.images.slice(1, 3))
const extra = computed(() => Math.max(0, props.images.length - 3))
</script>

<template>
  <div>
    <!-- Mobile: single cover with meta badges -->
    <button
      type="button"
      class="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200 md:hidden"
      :aria-label="t('property.gallery.open')"
      @click="open(0)">
      <NuxtImg
        :src="images[0]"
        :alt="alt"
        class="h-full w-full object-cover"
        sizes="100vw"
        preload />
      <span
        v-if="meta.length"
        class="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        <span
          v-for="(m, i) in meta"
          :key="m.label"
          class="flex items-center gap-1">
          <span v-if="i" class="-ml-1 mr-1 h-3 w-px bg-white/30" />
          <Icon :name="m.icon" class="size-3.5" />{{ m.label }}
        </span>
      </span>
    </button>

    <!-- Desktop: one big cover (2×2) + two stacked thumbnails in the 3rd column.
         A single grid with a fixed aspect locks every cell to the same height,
         so the thumbnails always align with the cover at any width. -->
    <div class="hidden aspect-5/2 grid-cols-3 grid-rows-2 gap-3 md:grid">
      <button
        type="button"
        class="col-span-2 row-span-2 overflow-hidden rounded-2xl bg-neutral-200"
        :aria-label="t('property.gallery.open')"
        @click="open(0)">
        <NuxtImg
          :src="images[0]"
          :alt="alt"
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          sizes="md:66vw"
          preload />
      </button>

      <button
        v-for="(img, i) in thumbs"
        :key="i"
        type="button"
        class="relative overflow-hidden rounded-2xl bg-neutral-200"
        :aria-label="t('property.gallery.open')"
        @click="open(i + 1)">
        <NuxtImg
          :src="img"
          :alt="alt"
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          sizes="md:33vw"
          loading="lazy" />
        <!-- +N overlay on the last visible thumbnail -->
        <span
          v-if="i === thumbs.length - 1 && extra > 0"
          class="absolute inset-0 grid place-items-center bg-black/55 text-2xl font-semibold text-white backdrop-blur-[2px]">
          +{{ extra }}
        </span>
      </button>
    </div>

    <ListingsLightbox
      v-model:open="lightboxOpen"
      :images="images"
      :index="startIndex"
      :alt="alt" />
  </div>
</template>
