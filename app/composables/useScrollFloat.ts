import type { Ref } from 'vue'

/**
 * Scroll-linked "water drift" — the shared engine behind the floating hero
 * elements reacting to scroll.
 *
 * One scroll listener + one rAF loop for the whole page. A smoothed copy of
 * scrollY trails the real one; the difference ("lag") is the current pulling
 * the page through the water. Every registered element converts that lag into
 * its own displacement through a small under-damped spring — each with its own
 * strength, lean and settle rate — so on scroll the cards trail downward,
 * overshoot and bob back at different speeds instead of moving as one rigid
 * plank.
 *
 * Physics are normalized to a 60Hz reference timestep via the rAF timestamp,
 * so the drift feels identical on 60/120/144Hz displays. A shared
 * IntersectionObserver marks offscreen elements so scrolling far from the hero
 * costs nothing. Transforms are written straight to `el.style` (no per-frame
 * Vue reactivity) and are transform-only, so motion stays on the compositor.
 * The loop sleeps once every spring has settled. No-ops on SSR; follows
 * prefers-reduced-motion live (drift detaches the moment the OS setting
 * flips on, mirroring the CSS @media layers).
 */

/**
 * Minimal element surface the engine touches. Structural on purpose: template
 * refs in this repo type as happy-dom's HTMLElement (vitest types leak into
 * vue-tsc), which is incompatible with lib.dom's — this shape accepts both.
 */
export interface DriftTarget {
  style: { transform: string }
  offsetParent: unknown
}

export interface ScrollFloatOptions {
  /** px of displacement per px of scroll lag (0.04 heavy … 0.18 lively) */
  factor?: number
  /** lean, deg per px of own displacement (sign = lean direction) */
  tilt?: number
  /** spring pull toward the target; higher = snappier (default cycled) */
  stiffness?: number
  /** velocity kept per frame; closer to 1 = floatier (default cycled) */
  damping?: number
  /** when false, also drifts below the lg breakpoint (default true) */
  desktopOnly?: boolean
}

interface DriftEntry {
  el: DriftTarget
  factor: number
  tilt: number
  stiffness: number
  damping: number
  /** spring state: current displacement + velocity */
  y: number
  v: number
  /** maintained by the shared IntersectionObserver */
  visible: boolean
}

/**
 * Spring feels cycled across registrations, so even cards given identical
 * props never settle in lockstep.
 */
const FEELS = [
  { stiffness: 0.1, damping: 0.86 },
  { stiffness: 0.14, damping: 0.82 },
  { stiffness: 0.08, damping: 0.88 },
  { stiffness: 0.12, damping: 0.84 }
] as const

/** Scroll lag is clamped so anchor jumps don't fling the cards off-screen. */
const MAX_LAG = 90
/** How fast the smoothed scrollY chases the real one (per 60Hz frame). */
const CHASE = 0.12

const entries = new Set<DriftEntry>()
const byEl = new Map<Element, DriftEntry>()
let io: IntersectionObserver | null = null
let feelCursor = 0
let listening = false
let running = false
let smooth = 0
let last = 0

function tick(now: number) {
  // dt in 60Hz-frame units, clamped so a background-tab gap can't explode the
  // springs. Keeps lag, amplitude and settle time refresh-rate independent.
  const dt = last ? Math.min((now - last) / (1000 / 60), 3) : 1
  last = now

  const target = window.scrollY
  smooth += (target - smooth) * (1 - Math.pow(1 - CHASE, dt))
  let lag = target - smooth
  if (lag > MAX_LAG) {
    lag = MAX_LAG
    smooth = target - MAX_LAG
  }
  else if (lag < -MAX_LAG) {
    lag = -MAX_LAG
    smooth = target + MAX_LAG
  }

  let alive = Math.abs(lag) > 0.1
  for (const e of entries) {
    if (!e.visible) continue
    e.v += (lag * e.factor - e.y) * e.stiffness * dt
    e.v *= Math.pow(e.damping, dt)
    e.y += e.v * dt
    if (Math.abs(e.y) > 0.06 || Math.abs(e.v) > 0.06) alive = true
    e.el.style.transform = `translate3d(0, ${e.y.toFixed(2)}px, 0) rotate(${(e.y * e.tilt).toFixed(3)}deg)`
  }

  if (alive && entries.size) {
    requestAnimationFrame(tick)
  }
  else {
    running = false
    last = 0
  }
}

function wake() {
  if (running) return
  let anyVisible = false
  for (const e of entries) {
    if (e.visible) {
      anyVisible = true
      break
    }
  }
  if (!anyVisible) return
  running = true
  requestAnimationFrame(tick)
}

function ensureObserver() {
  if (io) return io
  io = new IntersectionObserver(
    (observed) => {
      let reentered = false
      for (const o of observed) {
        const e = byEl.get(o.target)
        if (!e) continue
        e.visible = o.isIntersecting
        if (o.isIntersecting) {
          reentered = true
        }
        else {
          // Park the spring so re-entry starts from rest, no stale jump.
          e.y = 0
          e.v = 0
          e.el.style.transform = ''
        }
      }
      if (reentered) {
        // While everything was offscreen the loop slept and `smooth` went
        // stale — resync so re-entering elements ease in instead of flinging.
        if (!running) smooth = window.scrollY
        wake()
      }
    },
    { rootMargin: '64px' }
  )
  return io
}

function register(entry: DriftEntry) {
  if (!entries.size) {
    smooth = window.scrollY
    if (!listening) {
      window.addEventListener('scroll', wake, { passive: true })
      listening = true
    }
  }
  entries.add(entry)
  byEl.set(entry.el as unknown as Element, entry)
  ensureObserver().observe(entry.el as unknown as Element)
  wake()
}

function unregister(entry: DriftEntry) {
  entries.delete(entry)
  byEl.delete(entry.el as unknown as Element)
  io?.unobserve(entry.el as unknown as Element)
  entry.el.style.transform = ''
  if (!entries.size) {
    if (listening) {
      window.removeEventListener('scroll', wake)
      listening = false
    }
    io?.disconnect()
    io = null
  }
}

export function useScrollFloat(
  el: Ref<DriftTarget | null>,
  options: ScrollFloatOptions = {}
) {
  let entry: DriftEntry | null = null
  let mq: MediaQueryList | null = null
  let reduceMq: MediaQueryList | null = null

  const attach = () => {
    const node = el.value
    if (entry || !node) return
    // Skip elements inside a display:none tree (the hero renders separate
    // mobile/desktop DOM, only one of which is visible at a time).
    if (node.offsetParent === null) return
    const feel = FEELS[feelCursor++ % FEELS.length]!
    entry = {
      el: node,
      factor: options.factor ?? 0.1,
      tilt: options.tilt ?? 0.04,
      stiffness: options.stiffness ?? feel.stiffness,
      damping: options.damping ?? feel.damping,
      y: 0,
      v: 0,
      visible: true
    }
    register(entry)
  }

  const detach = () => {
    if (!entry) return
    unregister(entry)
    entry = null
  }

  const sync = () => {
    if (reduceMq && !reduceMq.matches && (!mq || mq.matches)) attach()
    else detach()
  }

  onMounted(() => {
    if ((options.factor ?? 0.1) === 0) return
    // Live, not sampled once: flipping Reduce Motion mid-session must stop
    // the drift immediately, matching the CSS @media layers.
    reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMq.addEventListener('change', sync)
    if (options.desktopOnly !== false) {
      // Same token as Tailwind's `lg` (which switches the hero DOM trees), so
      // the 'change' event fires exactly when visibility flips — including
      // under non-default root font sizes, where 64rem !== 1024px.
      mq = window.matchMedia('(min-width: 64rem)')
      mq.addEventListener('change', sync)
    }
    sync()
  })

  onBeforeUnmount(() => {
    reduceMq?.removeEventListener('change', sync)
    reduceMq = null
    mq?.removeEventListener('change', sync)
    mq = null
    detach()
  })
}
