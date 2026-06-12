<script setup lang="ts">
import type { Audience } from '~/data/landing'
import type { PillAnchorTarget } from '~/composables/useAudiencePill'

/**
 * The single "Uy egalari uchun / Ijarachilar uchun" pill — one instance for
 * the whole landing page, and it TRAVELS.
 *
 * Sections place invisible <LandingAudiencePillAnchor> landing spots (hero
 * top, under the features heading, beside the listings heading, above the
 * download banner, above the testimonials heading, below the FAQ list). As
 * you scroll, the active anchor is the last one whose top has crossed the
 * viewport focal line, and the pill swims across the screen to it on an
 * under-damped spring — leaning into the motion and stretching slightly with
 * speed, like something pulled through water. While the page scrolls the
 * spring naturally trails the moving anchor, which doubles as the water-drag
 * drift; at rest an endless, gentle figure-8 bob keeps it alive.
 *
 * Layering (so the motions never fight over `transform`):
 *   .pill-travel (fixed, JS spring)  >  .pill-drop (one-shot CSS entrance)
 *   >  .pill-bob (endless bob; pauses on hover/focus and while parked
 *   off-screen)  >  the interactive pill.
 *
 * The hero anchor strip (see pages/index.vue) is sticky below lg — there it
 * is the only anchor, so the pill stays pinned under the header like the old
 * sticky pill — and plain in-flow at lg+, where the pill departs with the
 * hero and tours the section anchors instead. Mid-flight the pill ignores
 * pointer events (it must not steal clicks from content it sweeps across),
 * and while parked off-screen it is `inert` so its buttons leave the tab
 * order; after a long idle even the bob sleeps.
 *
 * SSR/no-JS: CSS parks the pill fixed at the hero spot (left 50%, top under
 * the header) — the page is never without its main control. Hydration takes
 * over positioning in the same pre-paint tick, so there is no flash.
 * prefers-reduced-motion: the pill still relocates (it must reach every
 * section) but snaps instead of flying; entrance and bob are off.
 */
const { t } = useI18n()
const { audience, setAudience, isOwner } = useAudience()

const tabs: { key: Audience, labelKey: string }[] = [
  { key: 'owner', labelKey: 'landing.audience.owner' },
  { key: 'tenant', labelKey: 'landing.audience.tenant' }
]

/** Structural el type — see the note in useAudiencePill.ts. */
interface PillEl {
  offsetWidth: number
  offsetHeight: number
  getBoundingClientRect: () => { top: number, left: number }
  style: { transform: string }
}

const wrapEl = ref<PillEl | null>(null)
/** true once JS owns positioning (swaps the CSS fallback off, pre-paint) */
const isJs = ref(false)
/** parked outside the viewport (hero anchor scrolled away) — pause the bob
 *  and drop the buttons from the tab order (`inert`) */
const offstage = ref(false)
/** near enough to its anchor to be a trustworthy click target — mid-flight
 *  the pill must not intercept clicks meant for content it sweeps across */
const interactive = ref(true)
/** settled and untouched long enough that even the bob goes to sleep */
const resting = ref(false)

const registry = usePillAnchorRegistry()

/** Spring feel: soft enough to glide across the page, with a restrained
 *  overshoot — it should dip just past the spot and ease back, not dive deep.
 *  (Raising DAMPING or MAX_SPEED makes the dip deeper; this pair ≈ a third of
 *  the travel the old 0.88/110 tuning had.) */
const STIFFNESS = 0.032
const DAMPING = 0.82
/** px/frame cap so a jump to a far section glides instead of streaking. */
const MAX_SPEED = 90

let x = 0
let y = 0
let vx = 0
let vy = 0
let raf = 0
let running = false
let last = 0
let restTimer = 0
let reduceMq: MediaQueryList | null = null
let ro: ResizeObserver | null = null

/**
 * The pill rests centered on the active anchor: the last anchor (in tour
 * order) whose top has crossed the viewport focal line; before any has, the
 * first visible one. Hidden anchors (zero-width rect, e.g. inside the
 * desktop-only trees while on mobile) never win.
 */
type AnchorRect = ReturnType<PillAnchorTarget['getBoundingClientRect']>

/** Hysteresis: the active anchor keeps winning until it has clearly left,
 *  so layout shifts near the focal line (FAQ answers expanding, audience
 *  swaps) don't flip the target and launch the pill back and forth. Must
 *  exceed the tallest expandable block above an anchor. */
const HYSTERESIS = 100

let activeEl: PillAnchorTarget | null = null

function activeTarget(): { cx: number, cy: number } | null {
  const list = registry.list()
  const focal = window.innerHeight * 0.5
  let rect: AnchorRect | null = null
  let chosen: PillAnchorTarget | null = null
  for (const a of list) {
    const r = a.el.getBoundingClientRect()
    if (r.width <= 0) continue
    const line = a.el === activeEl ? focal + HYSTERESIS : focal
    if (rect === null || r.top < line) {
      rect = r
      chosen = a.el
    }
  }
  if (!rect) {
    activeEl = null
    return null
  }
  activeEl = chosen
  return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 }
}

function tick(now: number) {
  const el = wrapEl.value
  const target = activeTarget()
  if (!el || !target) {
    running = false
    last = 0
    return
  }

  // dt in 60Hz-frame units so the flight feels identical on 60/120/144Hz.
  const dt = last ? Math.min((now - last) / (1000 / 60), 3) : 1
  last = now

  const tx = target.cx - el.offsetWidth / 2
  const ty = target.cy - el.offsetHeight / 2

  let settled: boolean
  if (reduceMq?.matches) {
    // Reduced motion: position without animating.
    x = tx
    y = ty
    vx = 0
    vy = 0
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    settled = true
  }
  else {
    vx += (tx - x) * STIFFNESS * dt
    vy += (ty - y) * STIFFNESS * dt
    const keep = Math.pow(DAMPING, dt)
    vx *= keep
    vy *= keep
    const speed = Math.hypot(vx, vy)
    if (speed > MAX_SPEED) {
      vx *= MAX_SPEED / speed
      vy *= MAX_SPEED / speed
    }
    x += vx * dt
    y += vy * dt

    settled
      = Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5 && speed < 0.5
    if (settled) {
      x = tx
      y = ty
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`
    }
    else {
      // Lean into the horizontal motion and stretch a touch with speed —
      // the "pulled through water" feel.
      const lean = Math.max(-7, Math.min(7, vx * 0.35))
      const stretch = 1 + Math.min(speed * 0.0008, 0.045)
      el.style.transform
        = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${lean.toFixed(2)}deg) scale(${stretch.toFixed(3)})`
    }
  }

  offstage.value
    = y < -(el.offsetHeight + 8) || y > window.innerHeight + 8
  // Mid-flight the pill sweeps over content — don't steal its clicks.
  interactive.value = Math.hypot(tx - x, ty - y) < 24

  if (settled) {
    running = false
    last = 0
    // After two-ish idle bob cycles, let the compositor sleep too (touch
    // devices never get the hover/focus pause).
    clearTimeout(restTimer)
    restTimer = window.setTimeout(() => {
      resting.value = true
    }, 15000)
  }
  else {
    raf = requestAnimationFrame(tick)
  }
}

function wake() {
  clearTimeout(restTimer)
  resting.value = false
  if (running) return
  running = true
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')

  // Take over from the CSS fallback in the same pre-paint tick AT THE SAME
  // visual position: the fallback spot and the hero anchor differ slightly,
  // so seed the spring where the pill already is and let it glide the last
  // stretch to the anchor — part of the entrance, instead of a visible hop.
  // (Reduced motion: no glide, position on the anchor directly.)
  const el = wrapEl.value
  if (el) {
    if (reduceMq.matches) {
      const target = activeTarget()
      if (target) {
        x = target.cx - el.offsetWidth / 2
        y = target.cy - el.offsetHeight / 2
      }
    }
    else {
      const rect = el.getBoundingClientRect()
      x = rect.left
      y = rect.top
    }
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
  }
  isJs.value = true

  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('resize', wake, { passive: true })
  // Layout changes without scroll (accordion toggles, audience switches,
  // locale swaps) move the anchors — follow them.
  ro = new ResizeObserver(wake)
  ro.observe(document.body)
  registry.subscribe(wake)
  wake()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', wake)
  window.removeEventListener('resize', wake)
  ro?.disconnect()
  ro = null
  registry.unsubscribe()
  cancelAnimationFrame(raf)
  clearTimeout(restTimer)
  running = false
})
</script>

<template>
  <div
    ref="wrapEl"
    class="pill-travel pointer-events-none fixed z-40"
    :class="isJs ? 'left-0 top-0' : 'left-1/2 top-20 -translate-x-1/2 sm:top-24'"
    :inert="offstage">
    <div class="pill-drop">
      <div class="pill-bob" :class="{ 'is-offstage': offstage || resting }">
        <div
          class="inline-flex rounded-full border border-neutral-200/70 bg-surface/80 p-1.5 shadow-[0_10px_34px_-14px_rgba(16,24,40,0.4)] backdrop-blur-xl"
          :class="interactive ? 'pointer-events-auto' : 'pointer-events-none'"
          role="group"
          :aria-label="t('landing.audience.label')">
          <div class="relative grid grid-cols-2">
            <!-- Sliding active indicator -->
            <span
              aria-hidden="true"
              class="absolute inset-y-0 left-0 w-1/2 rounded-full bg-brand-600 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              :class="isOwner ? 'translate-x-0' : 'translate-x-full'" />
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              :aria-pressed="audience === tab.key"
              class="relative z-10 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-9 sm:py-3 sm:text-base"
              :class="audience === tab.key
                ? 'text-white'
                : 'text-neutral-900 hover:text-brand-600'"
              @click="setAudience(tab.key)">
              {{ t(tab.labelKey) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pill-travel {
  will-change: transform;
}

/* One-shot entrance: drops down from above and fades in. Pure CSS (plays
   without JS, before hydration, and replays never) — `backwards` holds the
   hidden state through the small delay. */
.pill-drop {
  animation: pill-drop-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 120ms backwards;
}

@keyframes pill-drop-in {
  from {
    opacity: 0;
    transform: translateY(-28px) scale(0.96);
  }
}

.pill-bob {
  animation: pill-bob 7.5s ease-in-out 1s infinite;
  will-change: transform;
}

/* The water stills when you reach for a tab — pointer or keyboard. */
.pill-bob:hover,
.pill-bob:focus-within {
  animation-play-state: paused;
}

/* Parked off-screen (hero anchor scrolled away): stop re-sampling the
   backdrop blur for nothing. */
.pill-bob.is-offstage {
  animation-play-state: paused;
}

@keyframes pill-bob {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  25% {
    transform: translate3d(3px, -3px, 0) rotate(0.35deg);
  }
  50% {
    transform: translate3d(1px, -5px, 0) rotate(-0.2deg);
  }
  75% {
    transform: translate3d(-2.5px, -2px, 0) rotate(-0.35deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pill-travel {
    will-change: auto;
  }
  .pill-drop {
    animation: none;
  }
  .pill-bob {
    animation: none;
    will-change: auto;
  }
}
</style>
