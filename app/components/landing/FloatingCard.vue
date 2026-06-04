<script setup lang="ts">
/**
 * Animation wrapper for the hero's floating cards.
 *
 * Two nested layers so the two motions never fight over `transform`:
 *   • outer (`.hero-rise`)  — one-shot entrance: fade + slide up from below,
 *     staggered via `delay` so cards arrive one after another on load.
 *   • inner (`.hero-float`) — endless, gentle bob that makes the card feel
 *     suspended in the air. Driven by a CSS keyframe on translate3d (GPU),
 *     starting only after the entrance finishes so there's no jump.
 *
 * Both use transform/opacity only and `will-change`, so motion stays on the
 * compositor — smooth, no reflow, no jitter. Honours prefers-reduced-motion,
 * and the endless bob is disabled below `lg` (stacked mobile cards).
 */
const props = withDefaults(
  defineProps<{
    /** entrance stagger, ms */
    delay?: number
    /** continuous float travel, px */
    amplitude?: number
    /** float cycle length, s */
    duration?: number
    /** set false for the central phone (entrance only, no bob) */
    float?: boolean
  }>(),
  {
    delay: 0,
    amplitude: 10,
    duration: 6,
    float: true
  }
)

const shown = ref(false)

onMounted(() => {
  // Paint the hidden state first, then flip on the next frame so the
  // transition actually runs (instead of snapping to the final state).
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      shown.value = true
    })
  )
})
</script>

<template>
  <div
    class="hero-rise"
    :class="{ 'is-in': shown }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <div
      class="hero-float"
      :class="{ 'is-static': !float }"
      :style="{
        '--amp': `${amplitude}px`,
        '--dur': `${duration}s`,
        '--fdelay': `${delay + 650}ms`,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.hero-rise {
  opacity: 0;
  transform: translateY(46px);
  transition:
    opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}

.hero-rise.is-in {
  opacity: 1;
  transform: translateY(0);
}

.hero-float {
  animation: hero-float var(--dur, 6s) ease-in-out var(--fdelay, 0ms) infinite;
  will-change: transform;
}

.hero-float.is-static {
  animation: none;
}

@keyframes hero-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, calc(var(--amp, 10px) * -1), 0);
  }
}

/* Stacked mobile cards: keep the entrance, drop the endless bob. */
@media (max-width: 1023px) {
  .hero-float {
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .hero-float {
    animation: none;
  }
}
</style>
