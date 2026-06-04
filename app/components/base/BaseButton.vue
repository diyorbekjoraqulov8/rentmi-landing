<script setup lang="ts">
/**
 * Design-system button. Renders as <NuxtLink> when `to` is set, otherwise
 * <button>. Variants/sizes map to the Figma button styles.
 */
type Variant = 'primary' | 'outline' | 'ghost' | 'white'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    to?: string
    variant?: Variant
    size?: Size
    block?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button'
  }
)

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
  white: 'bg-white text-brand-600 hover:bg-neutral-50'
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base'
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-full font-medium',
  'transition-colors duration-150 whitespace-nowrap',
  variants[props.variant],
  sizes[props.size],
  props.block ? 'w-full' : ''
])
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="classes"
  >
    <slot />
  </button>
</template>
