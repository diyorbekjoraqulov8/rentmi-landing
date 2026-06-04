<script setup lang="ts">
/**
 * Scroll-linked word reveal (the "Biz haqimizda" lead paragraph).
 *
 * The text is split into words; as the block scrolls through the viewport each
 * word eases from dimmed (gray) to full (near-black), left-to-right — the
 * effect popular on modern marketing sites. A soft `window` of a few words is
 * always mid-transition so the leading edge reads as a smooth gradient rather
 * than a hard cursor.
 *
 * Only `opacity` is animated (compositor-friendly), updates are throttled with
 * rAF and gated by an IntersectionObserver, so scrolling stays smooth with no
 * jank. Honours prefers-reduced-motion (text shown fully) and degrades to
 * fully-readable text when JS is off.
 */
const props = withDefaults(
  defineProps<{
    text: string
    /** dimmed starting opacity for not-yet-revealed words */
    from?: number
    /** how many words share the soft transition edge */
    softness?: number
  }>(),
  {
    from: 0.2,
    softness: 6
  }
)

const root = ref<HTMLElement | null>(null)
const words = computed(() => props.text.split(/\s+/).filter(Boolean))

let els: HTMLElement[] = []
let ticking = false
let visible = false
let io: IntersectionObserver | null = null

function compute() {
  ticking = false
  const el = root.value
  if (!el || !els.length) return

  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight

  // p = 0 when the block's top enters at 90% of the viewport,
  // p = 1 once its bottom passes the 30% line — tied to block height so
  // longer paragraphs reveal over a longer scroll.
  const startLine = vh * 0.9
  const endLine = vh * 0.3
  const denom = startLine - endLine + rect.height
  let p = (startLine - rect.top) / denom
  p = p < 0 ? 0 : p > 1 ? 1 : p

  const n = els.length
  const soft = props.softness
  const head = p * (n + soft)

  for (let i = 0; i < n; i++) {
    let local = (head - i) / soft
    local = local < 0 ? 0 : local > 1 ? 1 : local
    // smoothstep for a gentle ease in/out
    const e = local * local * (3 - 2 * local)
    els[i]!.style.opacity = String(props.from + (1 - props.from) * e)
  }
}

function onScroll() {
  if (!visible || ticking) return
  ticking = true
  requestAnimationFrame(compute)
}

function collect() {
  els = Array.from(root.value?.querySelectorAll<HTMLElement>('[data-word]') ?? [])
}

onMounted(() => {
  collect()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(e => (e.style.opacity = '1'))
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]!.isIntersecting
      if (visible) requestAnimationFrame(compute)
    },
    { rootMargin: '10% 0px' }
  )
  io.observe(root.value!)

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  compute()
})

// Re-bind when the copy changes (e.g. locale switch).
watch(words, () => nextTick().then(() => {
  collect()
  compute()
}))

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  io?.disconnect()
})
</script>

<template>
  <p ref="root">
    <span
      v-for="(w, i) in words"
      :key="i"
      data-word
      class="reveal-word"
    >{{ w }}{{ i < words.length - 1 ? ' ' : '' }}</span>
  </p>
</template>

<style scoped>
.reveal-word {
  /* Readable by default (SSR / no-JS); JS dims then reveals on scroll. */
  opacity: 1;
  transition: opacity 0.12s linear;
  will-change: opacity;
}

@media (prefers-reduced-motion: reduce) {
  .reveal-word {
    opacity: 1 !important;
  }
}
</style>
