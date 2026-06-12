<script setup lang="ts">
import type { Faq } from '~/composables/useFaqs'

const props = defineProps<{
  item: Faq
  open: boolean
}>()

const emit = defineEmits<{ toggle: [id: number] }>()
</script>

<template>
  <div class="rounded-2xl bg-surface shadow-card">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
      :aria-expanded="open"
      @click="emit('toggle', props.item.id)"
    >
      <span class="text-base md:text-lg font-medium text-neutral-900">{{ item.question }}</span>
      <IconsPlus
        class="size-5 shrink-0 text-neutral-500 transition-transform duration-200"
        :class="open ? 'rotate-45' : ''"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-40"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-40"
      leave-to-class="opacity-0 max-h-0"
    >
      <p
        v-if="open"
        class="overflow-hidden px-7 pb-5 text-sm leading-relaxed text-neutral-500"
      >
        {{ item.answer }}
      </p>
    </Transition>
  </div>
</template>
