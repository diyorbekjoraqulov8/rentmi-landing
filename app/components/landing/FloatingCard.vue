<script setup lang="ts">
/**
 * Animation wrapper for the hero's floating elements.
 *
 * Three nested layers so the motions never fight over `transform`:
 *   • outer (`.hero-rise`)  — one-shot entrance: fade + slide up from below,
 *     staggered via `delay`. Pure CSS keyframe with `backwards` fill, so it
 *     plays without JS, before hydration, and replays when a tab switch
 *     remounts the set.
 *   • middle (`.hero-drift`) — scroll-linked water drag via useScrollFloat():
 *     while you scroll, the card trails downward by its own `drift` amount and
 *     springs back with a small overshoot, each card on its own spring so the
 *     set never moves as one rigid plank.
 *   • inner (`.hero-float`) — endless figure-8 bob (y + sideways sway + a tiny
 *     lean) that makes the card feel suspended in water. Driven by a CSS
 *     keyframe on transform (GPU), starting only after the entrance finishes.
 *
 * Everything is transform/opacity only, so motion stays on the compositor.
 * The bob and drift run only at `lg`+ (64rem — the same token that switches
 * the hero's mobile/desktop trees) and honour prefers-reduced-motion; the
 * stacked mobile cards keep the entrance only.
 */
const props = withDefaults(
  defineProps<{
    /** entrance stagger, ms */
    delay?: number
    /** continuous float travel, px */
    amplitude?: number
    /** float cycle length, s */
    duration?: number
    /** sideways sway of the bob, px (negative flips direction) */
    sway?: number
    /** max lean while bobbing, deg (negative flips direction) */
    tilt?: number
    /** scroll drift strength — px per px of scroll lag (0 anchors the card) */
    drift?: number
    /** set false for a static anchor (entrance + drift only, no bob) */
    float?: boolean
  }>(),
  {
    delay: 0,
    amplitude: 10,
    duration: 6,
    sway: 6,
    tilt: 0.8,
    drift: 0.1,
    float: true
  }
)

const driftEl = ref<HTMLElement | null>(null)

// The drift lean follows the bob lean direction so the card reads as one body.
useScrollFloat(driftEl, {
  factor: props.drift,
  tilt: props.tilt * 0.05
})
</script>

<template>
  <div
    class="hero-rise"
    :style="{ animationDelay: `${delay}ms` }"
  >
    <div ref="driftEl" class="hero-drift">
      <div
        class="hero-float"
        :class="{ 'is-static': !float }"
        :style="{
          '--amp': `${amplitude}px`,
          '--sway': `${sway}px`,
          '--tilt': `${tilt}deg`,
          '--dur': `${duration}s`,
          '--fdelay': `${delay + 650}ms`,
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* One-shot entrance. A keyframe (not a JS-toggled transition) so the card is
   visible by default in SSR HTML — no-JS, failed-bundle and slow-hydration
   all paint correctly — and `backwards` holds the hidden state through the
   stagger delay. */
.hero-rise {
  animation: hero-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(46px);
  }
}

.hero-float.is-static {
  animation: none;
}

/* The bob (and the drift layer's compositor hint) exist only where the
   desktop hero tree does — `lg`, 64rem, the exact same token. Below it the
   stacked mobile cards keep the entrance only. */
@media (width >= 64rem) {
  .hero-drift {
    will-change: transform;
  }

  .hero-float {
    animation: hero-float var(--dur, 6s) ease-in-out var(--fdelay, 0ms)
      infinite;
    will-change: transform;
  }

  .hero-float.is-static {
    animation: none;
    will-change: auto;
  }
}

/* A lopsided figure-8: the card never retraces the same straight line, so the
   motion reads as water, not a piston. */
@keyframes hero-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  25% {
    transform: translate3d(var(--sway, 6px), calc(var(--amp, 10px) * -0.55), 0)
      rotate(var(--tilt, 0.8deg));
  }
  50% {
    transform: translate3d(
        calc(var(--sway, 6px) * 0.35),
        calc(var(--amp, 10px) * -1),
        0
      )
      rotate(calc(var(--tilt, 0.8deg) * -0.5));
  }
  75% {
    transform: translate3d(
        calc(var(--sway, 6px) * -0.75),
        calc(var(--amp, 10px) * -0.4),
        0
      )
      rotate(calc(var(--tilt, 0.8deg) * -1));
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise {
    animation: none;
  }
  .hero-drift,
  .hero-float {
    animation: none;
    will-change: auto;
  }
}
</style>
