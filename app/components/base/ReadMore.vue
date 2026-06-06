<script setup lang="ts">
/**
 * Clamp long text to `lines` (default 5) with a "show more / less" toggle.
 * The toggle only appears when the text actually overflows the clamp — measured
 * on mount and on resize, so short text renders with no button.
 */
const props = withDefaults(defineProps<{ text: string, lines?: number }>(), {
  lines: 5
})

const { t } = useI18n()

const expanded = ref(false)
const clampable = ref(false)
const el = ref<HTMLElement | null>(null)

// Kebab-case keys so Vue applies them via setProperty — camelCase `WebkitLineClamp`
// is silently dropped, leaving the text unclamped.
const clampStyle = computed<Record<string, string> | undefined>(() =>
  expanded.value
    ? undefined
    : {
        'display': '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': String(props.lines),
        'overflow': 'hidden'
      }
)

function measure() {
  const node = el.value
  if (!node || expanded.value) return
  // 1px tolerance for sub-pixel rounding
  clampable.value = node.scrollHeight - node.clientHeight > 1
}

onMounted(async () => {
  // Wait for web fonts so the clamped height is measured accurately.
  if (import.meta.client && document.fonts?.ready) {
    await document.fonts.ready.catch(() => {})
  }
  measure()
  window.addEventListener('resize', measure, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
watch(() => props.text, () => nextTick(measure))
</script>

<template>
  <div>
    <p
      ref="el"
      :style="clampStyle"
      class="text-sm leading-relaxed text-neutral-600 md:text-base">
      {{ text }}
    </p>
    <button
      v-if="clampable"
      type="button"
      class="mt-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
      @click="expanded = !expanded">
      {{ expanded ? t('property.readLess') : t('property.readMore') }}
    </button>
  </div>
</template>
