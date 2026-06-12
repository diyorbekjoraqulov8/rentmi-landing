<script setup lang="ts">
/**
 * "Missiyamiz · Bizning qarashimiz · Qadriyatlarimiz" — three staggered columns
 * laid out as a descending staircase.
 *
 * On desktop the section pins (sticky) and vertical scroll is scrubbed into a
 * sequential reveal: column 1 (Missiya) stands alone first, then as the reader
 * scrolls column 2 (Bizning qarashimiz) rises up from below into place beside
 * it, then column 3 (Qadriyatlarimiz) rises in the same way. Once all three are
 * settled the pin holds briefly, then releases and the page scrolls on.
 *
 * Each column keeps its own id (#mission, #vision, #values) so the side-nav
 * scroll-spy still highlights them in turn.
 *
 * Robustness / a11y — mirrors the HowItWorks pin:
 *  - On small screens, or with prefers-reduced-motion, the pin is disabled and
 *    the three columns simply stack, fully visible (no scroll-jacking).
 *  - Only `opacity`/`transform` are animated; the scroll handler is rAF-throttled.
 */
import { values } from '~/data/solution'

const { t } = useI18n()

const wrap = ref<HTMLElement | null>(null)

const pinned = ref(false) // desktop pin active (vs. plain stacked columns)
const progress = ref(0) // 0..1 through the reveal
const wrapHeight = ref<string>('') // measured desktop height (px) for the pin

// How far (px) each column travels up as it rises into place.
const RISE = 120
// Scroll windows [start, end] in 0..1 progress for each column's reveal.
// Column 0 (Missiya) is shown from the start; the others rise in sequentially.
// The last reveal finishes near the very end (0.9) so the pin releases almost
// immediately after — keeping the section compact with little dead scroll.
const WINDOWS: [number, number][] = [
  [0, 0], // mission — visible immediately
  [0.1, 0.5], // vision
  [0.46, 0.9] // values
]

let mql: MediaQueryList | null = null
let ticking = false

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)

function reveal(i: number) {
  if (!pinned.value) return 1
  const [start, end] = WINDOWS[i]!
  if (end <= start) return 1
  const raw = (progress.value - start) / (end - start)
  return easeOut(raw < 0 ? 0 : raw > 1 ? 1 : raw)
}

// Per-column inline style: rise from below + fade. Empty when not pinned so the
// columns render plainly visible (CSS default).
const colStyle = (i: number) => {
  if (!pinned.value) return undefined
  const r = reveal(i)
  return {
    opacity: r,
    transform: `translate3d(0, ${((1 - r) * RISE).toFixed(2)}px, 0)`
  }
}

function measure() {
  if (!pinned.value) {
    wrapHeight.value = ''
    return
  }
  // One viewport to pin in, plus ~0.8 viewports of scroll to scrub the reveal —
  // just enough to stage the rise-in, then the pin releases quickly.
  wrapHeight.value = `${Math.round(window.innerHeight * 1.8)}px`
}

function compute() {
  ticking = false
  if (!pinned.value || !wrap.value) return
  const rect = wrap.value.getBoundingClientRect()
  const range = rect.height - window.innerHeight
  const p = range > 0 ? -rect.top / range : 0
  progress.value = p < 0 ? 0 : p > 1 ? 1 : p
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(compute)
}

function applyMode() {
  const wide = window.matchMedia('(min-width: 768px)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  pinned.value = wide && !reduce
  nextTick(() => {
    measure()
    compute()
  })
}

onMounted(() => {
  applyMode()
  mql = window.matchMedia('(min-width: 768px)')
  mql.addEventListener('change', applyMode)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', applyMode, { passive: true })
})

onBeforeUnmount(() => {
  mql?.removeEventListener('change', applyMode)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', applyMode)
})
</script>

<template>
  <section class="mt-24 md:mt-32">
    <div
      ref="wrap"
      :style="pinned && wrapHeight ? { height: wrapHeight } : undefined"
    >
      <div class="md:sticky md:top-0 md:flex md:h-screen md:items-start md:pt-32">
        <div class="container w-full">
          <div class="grid gap-12 md:grid-cols-3 md:gap-8">
            <!-- Mission -->
            <div
              id="mission"
              class="scroll-mt-28 will-change-[opacity,transform]"
              :style="colStyle(0)"
            >
              <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                {{ t('solution.mission.title') }}
              </h2>
              <p class="mt-4 max-w-xs text-base leading-relaxed text-neutral-600">
                {{ t('solution.mission.body') }}
              </p>
            </div>

            <!-- Vision -->
            <div
              id="vision"
              class="scroll-mt-28 will-change-[opacity,transform]"
              :style="colStyle(1)"
            >
              <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                {{ t('solution.vision.title') }}
              </h2>
              <p class="mt-4 max-w-xs text-base leading-relaxed text-neutral-600">
                {{ t('solution.vision.body') }}
              </p>
            </div>

            <!-- Values -->
            <div
              id="values"
              class="scroll-mt-28 will-change-[opacity,transform]"
              :style="colStyle(2)"
            >
              <h2 class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                {{ t('solution.values.title') }}
              </h2>
              <ul class="mt-5 flex flex-col gap-3">
                <li
                  v-for="item in values"
                  :key="item.titleKey"
                  class="text-base leading-relaxed text-neutral-600"
                >
                  <span class="font-semibold text-neutral-900">{{ t(item.titleKey) }}</span>
                  — {{ t(item.descKey) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
