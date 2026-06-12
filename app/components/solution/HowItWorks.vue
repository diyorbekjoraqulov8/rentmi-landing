<script setup lang="ts">
/**
 * "Platforma qanday ishlaydi?" — a scroll-pinned horizontal walkthrough.
 *
 * On desktop the section pins (sticky) and vertical scroll is translated into
 * horizontal motion. Rather than sliding the whole strip off-screen, each
 * phone slides left until it butts up against a parked slot on the LEFT and
 * stops, so completed steps pile up into a slightly fanned stack while the
 * next one keeps coming in from the right. The final step glides to a
 * prominent slot on the right (see the design): a deck of phones dealt onto a
 * pile. A card's label fades out as the next card covers it, so only the
 * in-transit / prominent phones stay labelled. A progress line under the tabs
 * tracks how far through the walkthrough we are.
 *
 * The flow (and its screenshots) switches with the shared audience toggle —
 * tenant (Ijarachilar uchun) vs owner (Uy egalari uchun) — with identical
 * behaviour, only different images/labels.
 *
 * Accessibility / robustness:
 *  - On small screens, or with prefers-reduced-motion, the pin is disabled and
 *    the steps become a plain horizontal scroll-snap strip (still fully usable,
 *    keyboard-scrollable, no scroll-jacking).
 *  - Only `transform`/`opacity` are animated; the scroll handler is rAF-throttled.
 */
import { howItWorks } from '~/data/solution'

const { t } = useI18n()
const { audience } = useAudience()

// `audience` is 'owner' | 'tenant'; the data map keys match.
const steps = computed(() => howItWorks[audience.value])

const wrap = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

const pinned = ref(false) // desktop pin active (vs. plain scroll strip)
const progress = ref(0) // 0..1 through the walkthrough
const maxTranslate = ref(0) // px of horizontal travel the scroll drives
const wrapHeight = ref<string>('') // measured desktop height (px) for 1:1 feel

/** Per-card transform + stacking order, recomputed each scroll frame. */
const cardStyles = ref<{ transform: string; zIndex: number }[]>([])
/** Per-card label opacity (1 visible → 0 covered by the next card). */
const labelOpacities = ref<number[]>([])

// Horizontal offset between two adjacent parked phones in the left stack —
// how much of each covered phone peeks out. Recomputed in measure() as a share
// of the card width so each stacked phone stays ~30% visible (never fully
// covered), which also spreads the fan rightward to fill the row.
const STACK_VISIBLE = 0.3
let stackOffset = 56

// Measured layout (set in measure(), read in compute()).
let cardOffsets: number[] = [] // each card's left within the track
let leftPad = 0 // track's left padding = card 0's resting left

let mql: MediaQueryList | null = null
let ticking = false

function measure() {
  if (!pinned.value || !track.value || !viewport.value) {
    maxTranslate.value = 0
    wrapHeight.value = ''
    return
  }
  const cards = Array.from(track.value.children) as HTMLElement[]
  const n = cards.length
  if (n < 2) {
    maxTranslate.value = 0
    wrapHeight.value = ''
    return
  }
  cardOffsets = cards.map((c) => c.offsetLeft)
  leftPad = cardOffsets[0]!
  const cardW = cards[0]!.offsetWidth
  const gap = cardOffsets[1]! - cardOffsets[0]! - cardW
  // Each parked phone keeps ~30% of itself visible past the one covering it.
  stackOffset = Math.round(cardW * STACK_VISIBLE)
  // Drive scroll exactly far enough for the second-to-last card to reach its
  // parked slot; the last card then sits one full step to its right (prominent).
  maxTranslate.value = Math.max(0, (n - 2) * (cardW + gap - stackOffset))
  // 1px vertical scroll ≈ 1px horizontal travel, plus one viewport to pin in.
  wrapHeight.value = `${window.innerHeight + maxTranslate.value}px`
  computeCards()
}

/** Place every card for the current progress: slide left, clamp at its
 *  parked left slot, fan by index, and order later cards on top. */
function computeCards() {
  const n = cardOffsets.length
  if (!pinned.value || n < 2) {
    cardStyles.value = []
    labelOpacities.value = []
    return
  }
  const slide = -progress.value * maxTranslate.value
  const tx: number[] = []
  for (let i = 0; i < n; i++) {
    // The card can travel left no further than its parked slot in the stack.
    const parkedShift = leftPad + i * stackOffset - cardOffsets[i]!
    tx[i] = Math.max(parkedShift, slide)
  }
  cardStyles.value = tx.map((x, i) => ({
    transform: `translate3d(${x.toFixed(2)}px,0,0)`,
    zIndex: i
  }))
  // Fade a label out as the next card slides over it; the last card (no
  // follower) keeps its label as the prominent step.
  labelOpacities.value = tx.map((x, i) => {
    if (i === n - 1) return 1
    const spacing = cardOffsets[i + 1]! + tx[i + 1]! - (cardOffsets[i]! + x)
    const full = cardOffsets[i + 1]! - cardOffsets[i]!
    const o = (spacing - stackOffset) / (full - stackOffset)
    return o < 0 ? 0 : o > 1 ? 1 : o
  })
}

function compute() {
  ticking = false
  if (!pinned.value || !wrap.value) return
  const rect = wrap.value.getBoundingClientRect()
  const range = rect.height - window.innerHeight
  const p = range > 0 ? -rect.top / range : 0
  progress.value = p < 0 ? 0 : p > 1 ? 1 : p
  computeCards()
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

// Re-measure when the flow's images swap (tab change) since widths may differ.
watch(steps, () =>
  nextTick(() => {
    measure()
    compute()
  })
)

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
  <section id="how-it-works" class="scroll-mt-24 mt-24 md:mt-32">
    <div
      ref="wrap"
      :style="pinned && wrapHeight ? { height: wrapHeight } : undefined">
      <div
        class="flex flex-col md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <!-- Heading + tabs + progress (stay put while phones scroll) -->
        <div class="container shrink-0 pt-8 md:pt-0">
          <h2
            class="text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            {{ t('solution.how.title') }}
          </h2>

          <div class="mt-6">
            <LandingAudienceTabs />
          </div>

          <!-- Progress line -->
          <div
            class="mt-8 h-0.5 w-full overflow-hidden rounded-full bg-neutral-200"
            role="progressbar"
            :aria-valuenow="Math.round(progress * 100)"
            aria-valuemin="0"
            aria-valuemax="100">
            <div
              class="h-full origin-left bg-brand-600"
              :style="{ transform: `scaleX(${pinned ? progress : 0})` }" />
          </div>
        </div>

        <!-- Steps strip: pinned→translated; else a plain scroll-snap row.
             Pinned, it sits just under the line; the tall phones bleed off the
             bottom edge (cut off) on their own, matching the design. -->
        <div
          ref="viewport"
          class="mt-8"
          :class="
            pinned
              ? 'overflow-hidden md:mt-6'
              : 'overflow-x-auto pb-4 md:mt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          ">
          <div
            ref="track"
            class="flex gap-6 px-[18px] md:gap-10 md:px-[max(18px,calc((100vw-1024px)/2))]"
            :class="pinned ? '' : 'snap-x snap-mandatory'">
            <article
              v-for="(step, i) in steps"
              :key="step.image"
              class="relative flex w-[78%] shrink-0 snap-start flex-col transition-transform duration-100 ease-out will-change-transform sm:w-[300px] md:w-auto"
              :style="pinned ? cardStyles[i] : undefined">
              <p
                class="mb-4 text-sm font-semibold text-neutral-900 transition-opacity duration-100 md:text-base"
                :style="pinned ? { opacity: labelOpacities[i] } : undefined">
                {{ t(step.labelKey) }}
              </p>
              <div
                class="flex items-start justify-center overflow-hidden rounded-3xl bg-surface p-12 shadow-card md:h-[80vh]">
                <NuxtImg
                  :src="step.image"
                  :alt="t(step.labelKey)"
                  class="h-full w-auto max-w-full object-contain object-top"
                  format="webp"
                  quality="78"
                  loading="lazy"
                  decoding="async" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
