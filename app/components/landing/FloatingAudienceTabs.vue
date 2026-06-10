<script setup lang="ts">
import type { Audience } from '~/data/landing'

/**
 * The single "Uy egalari uchun / Ijarachilar uchun" control that travels with
 * the page. It is not bolted rigidly to the top — it *floats*: a spring driven
 * by scroll makes it drift downward as you scroll (trailing the motion) and
 * then ease smoothly back to its resting spot, so it feels alive rather than
 * pinned. It also drops gently into place when it first appears.
 *
 * Visibility is driven by one IntersectionObserver over the landing section
 * elements: the section with the largest visible ratio is "current". The pill
 * rides Hero → FAQ and fades away once video-reviews owns the viewport (and at
 * the footer below it). The spring runs on rAF only while there is motion to
 * resolve, and a passive scroll listener just feeds it the scroll delta — so
 * scrolling stays smooth.
 *
 * Frosted glass + a sliding active indicator give the premium look without an
 * opaque block covering the content below.
 */
const { t } = useI18n()
const { audience, setAudience, isOwner } = useAudience()

const tabs: { key: Audience, labelKey: string }[] = [
  { key: 'owner', labelKey: 'landing.audience.owner' },
  { key: 'tenant', labelKey: 'landing.audience.tenant' }
]

const floater = ref<HTMLElement | null>(null)

// Sections the pill rides along with; `video-reviews` is observed too but kept
// out of `allowed`, so the pill hides once it owns the reading line (and at the
// footer below it, where no section is active).
const TAB_SECTIONS = [
  'hero',
  'about',
  'features',
  'listings',
  'app-download',
  'testimonials',
  'faq'
]
const allowed = new Set(TAB_SECTIONS)
const active = useActiveSection([...TAB_SECTIONS, 'video-reviews'])
const visible = computed(() => allowed.has(active.value))

const prefersReducedMotion = () =>
  import.meta.client
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---- Spring float -------------------------------------------------------
// `offset` is the pill's vertical displacement from its resting position.
// Scroll nudges it (positive = down); the spring always pulls it back to 0.
const MAX_OFFSET = 56 // px the pill is ever allowed to drift from rest
const STIFFNESS = 0.085 // pull-back strength
const DAMPING = 0.8 // velocity decay (a touch of overshoot, not bouncy)

let offset = 0
let velocity = 0
let raf = 0
let running = false

function paint() {
  if (floater.value) {
    floater.value.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
  }
}

function tick() {
  velocity += (0 - offset) * STIFFNESS
  velocity *= DAMPING
  offset += velocity
  if (Math.abs(offset) < 0.15 && Math.abs(velocity) < 0.15) {
    offset = 0
    velocity = 0
    paint()
    running = false
    return
  }
  paint()
  raf = requestAnimationFrame(tick)
}

function ensureRunning() {
  if (running || prefersReducedMotion()) return
  running = true
  raf = requestAnimationFrame(tick)
}

function nudge(delta: number) {
  offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offset + delta))
  ensureRunning()
}

// ---- Scroll drift -------------------------------------------------------
let lastY = 0
function onScroll() {
  const y = window.scrollY
  const delta = y - lastY
  lastY = y
  // Trail the scroll: a fraction of the scroll delta, the spring undoes it.
  nudge(delta * 0.28)
}

// Drop gently into place from above the moment the pill (re)appears.
watch(visible, (now, was) => {
  if (now && !was) {
    offset = -44
    ensureRunning()
  }
})

onMounted(() => {
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (import.meta.client) window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    class="pointer-events-none fixed left-1/2 top-24 z-40 -translate-x-1/2 transition-opacity duration-500 ease-out"
    :class="visible ? 'opacity-100' : 'opacity-0'"
  >
    <!-- Motion layer: the spring writes translateY here. -->
    <div
      ref="floater"
      class="will-change-transform"
    >
      <div
        class="inline-flex rounded-full border border-neutral-200/70 bg-surface/80 p-1.5 shadow-[0_10px_34px_-14px_rgba(16,24,40,0.4)] backdrop-blur-xl"
        :class="visible ? 'pointer-events-auto' : 'pointer-events-none'"
        role="group"
        :aria-label="t('landing.audience.label')"
      >
        <div class="relative grid grid-cols-2">
          <!-- Sliding active indicator -->
          <span
            aria-hidden="true"
            class="absolute inset-y-0 left-0 w-1/2 rounded-full bg-brand-600 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            :class="isOwner ? 'translate-x-0' : 'translate-x-full'"
          />
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            :aria-pressed="audience === tab.key"
            class="relative z-10 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-9 sm:py-3 sm:text-base"
            :class="audience === tab.key
              ? 'text-white'
              : 'text-neutral-900 hover:text-brand-600'"
            @click="setAudience(tab.key)"
          >
            {{ t(tab.labelKey) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
