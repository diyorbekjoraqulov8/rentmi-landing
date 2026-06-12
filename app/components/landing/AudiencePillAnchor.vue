<script setup lang="ts">
/**
 * Invisible landing spot for the traveling audience pill.
 *
 * Renders a non-interactive, exact-size replica of the pill (same classes,
 * same translated labels, spans instead of buttons) with visibility:hidden —
 * it reserves the right layout space in the section and gives the pill a
 * live rect to spring to, with zero JS measuring and zero layout shift.
 * `order` is the pill's tour order down the page; the active anchor is the
 * last one whose top has crossed the viewport's focal line.
 *
 * Keep the replica's structure/classes in lockstep with the real pill in
 * LandingFloatingAudienceTabs.vue — a size drift there shows up as the pill
 * resting off-center.
 */
const props = defineProps<{ order: number }>()

const { t } = useI18n()
const el = ref<HTMLElement | null>(null)

useAudiencePillAnchor(el, props.order)
</script>

<template>
  <!-- w-max: the replica must never be squeezed by a flex/grid parent —
       the real pill is shrink-wrapped, and a narrower anchor would make it
       rest off-center and overhang neighbours. -->
  <div ref="el" class="invisible w-max select-none" aria-hidden="true">
    <div class="inline-flex rounded-full border border-transparent p-1.5">
      <div class="grid grid-cols-2">
        <span
          class="whitespace-nowrap px-6 py-2.5 text-sm font-semibold sm:px-9 sm:py-3 sm:text-base">
          {{ t('landing.audience.owner') }}
        </span>
        <span
          class="whitespace-nowrap px-6 py-2.5 text-sm font-semibold sm:px-9 sm:py-3 sm:text-base">
          {{ t('landing.audience.tenant') }}
        </span>
      </div>
    </div>
  </div>
</template>
