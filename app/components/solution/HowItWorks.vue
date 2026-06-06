<script setup lang="ts">
/**
 * "Platforma qanday ishlaydi?" — a scroll-pinned horizontal walkthrough.
 *
 * On desktop the section pins (sticky) and vertical scroll is translated into
 * horizontal motion: the phone steps slide in from the right one-by-one; once
 * the track reaches its end the pin releases and the page scrolls on normally.
 * A progress line under the tabs tracks how far through the walkthrough we are.
 *
 * The flow (and its screenshots) switches with the shared audience toggle —
 * tenant (Ijarachilar uchun) vs owner (Uy egalari uchun) — with identical
 * behaviour, only different images/labels.
 *
 * Accessibility / robustness:
 *  - On small screens, or with prefers-reduced-motion, the pin is disabled and
 *    the steps become a plain horizontal scroll-snap strip (still fully usable,
 *    keyboard-scrollable, no scroll-jacking).
 *  - Only `transform` is animated; the scroll handler is rAF-throttled.
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
const maxTranslate = ref(0) // px the track can travel
const wrapHeight = ref<string>('') // measured desktop height (px) for 1:1 feel

let mql: MediaQueryList | null = null
let ticking = false

function measure() {
  if (!pinned.value || !track.value || !viewport.value) {
    maxTranslate.value = 0
    wrapHeight.value = ''
    return
  }
  const travel = track.value.scrollWidth - viewport.value.clientWidth
  maxTranslate.value = Math.max(0, travel)
  // 1px vertical scroll ≈ 1px horizontal travel, plus one viewport to pin in.
  wrapHeight.value = `${window.innerHeight + maxTranslate.value}px`
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

const translateX = computed(() =>
  pinned.value ? `translate3d(${-progress.value * maxTranslate.value}px,0,0)` : ''
)

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
watch(steps, () => nextTick(() => {
  measure()
  compute()
}))

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
  <section
    id="how-it-works"
    class="scroll-mt-24 mt-24 md:mt-32"
  >
    <div
      ref="wrap"
      :style="pinned && wrapHeight ? { height: wrapHeight } : undefined"
    >
      <div
        class="flex flex-col md:sticky md:top-0 md:h-screen md:justify-center md:overflow-hidden"
      >
        <!-- Heading + tabs + progress (stay put while phones scroll) -->
        <div class="container shrink-0 pt-8 md:pt-0">
          <h2
            class="text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl"
          >
            {{ t('solution.how.title') }}
          </h2>

          <div class="mt-6">
            <LandingAudienceTabs />
          </div>

          <!-- Progress line -->
          <div
            class="mt-8 h-px w-full overflow-hidden bg-neutral-200"
            role="progressbar"
            :aria-valuenow="Math.round(progress * 100)"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              class="h-full origin-left bg-brand-600"
              :style="{ transform: `scaleX(${pinned ? progress : 0})` }"
            />
          </div>
        </div>

        <!-- Steps strip: pinned→translated; else a plain scroll-snap row -->
        <div
          ref="viewport"
          class="mt-8 md:mt-10"
          :class="pinned
            ? 'overflow-hidden'
            : 'overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'"
        >
          <div
            ref="track"
            class="flex gap-6 px-[18px] transition-transform duration-100 ease-out will-change-transform md:gap-10 md:px-[max(18px,calc((100vw-1024px)/2))]"
            :class="pinned ? '' : 'snap-x snap-mandatory'"
            :style="{ transform: translateX }"
          >
            <article
              v-for="(step, i) in steps"
              :key="step.image"
              class="flex w-[78%] shrink-0 snap-start flex-col sm:w-[300px] md:w-[320px]"
            >
              <p
                class="mb-5 border-t-2 border-brand-600 pt-3 text-lg font-semibold text-neutral-900"
              >
                <span class="text-neutral-400">{{ i + 1 }}.</span>
                {{ t(step.labelKey) }}
              </p>
              <div
                class="flex items-start justify-center overflow-hidden rounded-3xl bg-surface p-4 shadow-card md:h-[58vh]"
              >
                <NuxtImg
                  :src="step.image"
                  :alt="t(step.labelKey)"
                  class="h-full w-auto max-w-full object-contain"
                  format="webp"
                  quality="78"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
