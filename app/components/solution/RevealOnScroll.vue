<script setup lang="ts">
/**
 * Generic "reveal on first view" wrapper. The slotted content starts shifted +
 * transparent and eases into place the first time it scrolls into view (once).
 *
 * Uses a single IntersectionObserver, animates only `opacity`/`transform`
 * (compositor-friendly), and fully respects prefers-reduced-motion — when the
 * user opts out, content is shown immediately with no transform. SSR renders
 * the content visible-but-pre-animation; it's revealed on mount so there's no
 * flash of empty space for no-JS users (the `revealed` fallback below).
 */
const props = withDefaults(
  defineProps<{
    /** Slide-in direction. */
    from?: 'up' | 'down' | 'left' | 'right'
    /** Stagger delay in ms. */
    delay?: number
    /** Travel distance in px. */
    distance?: number
    /** Render as this tag. */
    as?: string
  }>(),
  {
    from: 'up',
    delay: 0,
    distance: 28,
    as: 'div'
  }
)

const el = ref<HTMLElement | null>(null)
const revealed = ref(false)
let io: IntersectionObserver | null = null

const offset = computed(() => {
  const d = props.distance
  switch (props.from) {
    case 'down': return `translate3d(0, -${d}px, 0)`
    case 'left': return `translate3d(${d}px, 0, 0)`
    case 'right': return `translate3d(-${d}px, 0, 0)`
    default: return `translate3d(0, ${d}px, 0)`
  }
})

onMounted(() => {
  if (
    !el.value
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    revealed.value = true
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        revealed.value = true
        io?.disconnect()
        io = null
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
  )
  io.observe(el.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="reveal"
    :class="{ 'reveal--in': revealed }"
    :style="{
      '--reveal-offset': offset,
      '--reveal-delay': `${delay}ms`,
    }"
  >
    <slot />
  </component>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: var(--reveal-offset);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay);
  will-change: opacity, transform;
}

.reveal--in {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
