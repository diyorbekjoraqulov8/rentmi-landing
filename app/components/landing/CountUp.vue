<script setup lang="ts">
/**
 * Count-up number for the stat row. Takes the already-formatted design value
 * (e.g. "10 000+", "98,2%") and, when it first scrolls into view, animates
 * from zero to the target — re-creating the exact format every frame (space
 * thousand groups, comma decimals, and any prefix/suffix like + or %).
 *
 * rAF-driven with an easeOut curve, fired once via IntersectionObserver.
 * Honours prefers-reduced-motion and stays readable without JS (SSR renders
 * the final value).
 */
const props = withDefaults(
  defineProps<{
    value: string
    /** animation length, ms */
    duration?: number
  }>(),
  {
    duration: 1600
  }
)

// --- Parse the formatted string into target + format spec ---
const spec = computed(() => {
  const v = props.value
  const first = v.search(/\d/)
  if (first === -1) return null
  const digits = [...v.matchAll(/\d/g)]
  const last = digits[digits.length - 1]!.index!
  const prefix = v.slice(0, first)
  const suffix = v.slice(last + 1)
  const numeric = v.slice(first, last + 1)
  const grouped = /[\s  ]/.test(numeric)
  const decPart = numeric.split(',')[1]
  const decimals = decPart ? decPart.length : 0
  const target = Number.parseFloat(
    numeric.replace(/[\s  ]/g, '').replace(',', '.')
  )
  return { prefix, suffix, grouped, decimals, target }
})

function format(n: number): string {
  const s = spec.value
  if (!s) return props.value
  const fixed = n.toFixed(s.decimals)
  let [int, dec] = fixed.split('.')
  if (s.grouped) int = int!.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return s.prefix + int + (dec ? ',' + dec : '') + s.suffix
}

// Start at the final value so SSR / no-JS is correct; reset on mount.
const display = ref(props.value)
const root = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null
let raf = 0

function run() {
  const s = spec.value
  if (!s) return
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
    display.value = format(s.target * eased)
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  display.value = format(0)
  io = new IntersectionObserver(
    (entries) => {
      if (entries[0]!.isIntersecting) {
        io?.disconnect()
        run()
      }
    },
    { threshold: 0.4 }
  )
  io.observe(root.value!)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  io?.disconnect()
})
</script>

<template>
  <span ref="root">{{ display }}</span>
</template>
