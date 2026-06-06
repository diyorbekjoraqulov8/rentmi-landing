<script setup lang="ts">
/**
 * Fullscreen image lightbox with a buttery, jank-free swiper.
 *
 * Smoothness comes from native CSS scroll-snap (GPU-composited, momentum touch
 * scrolling) rather than JS-driven transforms. Only the current slide and its
 * immediate neighbours mount an <img> (windowed) so memory stays flat and
 * images load lazily as you swipe. Arrows / ←→ keys / Esc all work; clicking
 * the empty area or backdrop closes.
 */
const props = withDefaults(
  defineProps<{ images: string[], index?: number, alt?: string }>(),
  { index: 0, alt: '' }
)
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const scroller = ref<HTMLElement | null>(null)
const current = ref(props.index)

// "Fill" mode — drops the letterbox padding so the photo spans the whole
// viewport edge-to-edge (object-cover). Off by default = fully-visible contain.
const filled = ref(false)
function toggleFilled() {
  filled.value = !filled.value
}

function scrollToIndex(i: number, smooth = true) {
  const el = scroller.value
  if (!el) return
  el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' })
}

function go(dir: 1 | -1) {
  const next = Math.min(props.images.length - 1, Math.max(0, current.value + dir))
  if (next === current.value) return
  current.value = next
  scrollToIndex(next)
}

// Keep `current` in sync with the scroll position (rAF-throttled).
let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const el = scroller.value
    if (el) current.value = Math.round(el.scrollLeft / el.clientWidth)
    ticking = false
  })
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') open.value = false
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

watch(open, async (isOpen) => {
  if (import.meta.server) return
  if (isOpen) {
    current.value = props.index
    document.body.style.overflow = 'hidden'
    await nextTick()
    scrollToIndex(props.index, false)
  } else {
    document.body.style.overflow = ''
    filled.value = false
  }
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})

// Only render images within ±1 of the current slide.
const near = (i: number) => Math.abs(i - current.value) <= 1
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] bg-black/95"
        role="dialog"
        aria-modal="true">
        <!-- Counter -->
        <div
          class="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 text-sm font-medium text-white/80">
          {{ current + 1 }} / {{ images.length }}
        </div>

        <!-- Top-right controls: fullscreen + close -->
        <div class="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            :aria-label="t(filled ? 'property.gallery.exitFullscreen' : 'property.gallery.fullscreen')"
            @click="toggleFilled">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-75"
              leave-active-class="transition duration-150 ease-in"
              leave-to-class="opacity-0 scale-75">
              <Icon
                :key="filled ? 'min' : 'max'"
                :name="filled ? 'lucide:minimize' : 'lucide:maximize'"
                class="size-5" />
            </Transition>
          </button>
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            :aria-label="t('property.gallery.close')"
            @click="open = false">
            <IconsClose class="size-5" />
          </button>
        </div>

        <!-- Prev / Next -->
        <button
          v-if="current > 0"
          type="button"
          class="absolute left-3 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:inline-flex"
          :aria-label="t('property.gallery.prev')"
          @click.stop="go(-1)">
          <IconsChevronLeft class="size-6" />
        </button>
        <button
          v-if="current < images.length - 1"
          type="button"
          class="absolute right-3 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:inline-flex"
          :aria-label="t('property.gallery.next')"
          @click.stop="go(1)">
          <IconsChevronRight class="size-6" />
        </button>

        <!-- Swiper track -->
        <div
          ref="scroller"
          class="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          @scroll.passive="onScroll">
          <div
            v-for="(img, i) in images"
            :key="i"
            class="flex h-full w-full shrink-0 snap-center items-center justify-center transition-[padding] duration-300 ease-out"
            :class="filled ? 'p-0' : 'p-4 md:p-14'"
            @click.self="open = false">
            <img
              v-if="near(i)"
              :src="img"
              :alt="alt ? `${alt} — ${i + 1}` : ''"
              loading="lazy"
              decoding="async"
              draggable="false"
              class="h-full w-full select-none transition-all duration-300 ease-out"
              :class="filled
                ? 'rounded-none object-cover'
                : 'max-h-full max-w-full rounded-lg object-contain'"
              @click.stop>
            <IconsSpinner v-else class="size-8 animate-spin text-white/40" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
