<script setup lang="ts">
/**
 * Fixed, vertically-centered scroll-spy nav for the /solution page. Lists every
 * in-page section; the item whose section is in view is highlighted (via the
 * shared useActiveSection scroll-spy). Clicking smooth-scrolls to the section.
 *
 * Only shown on wide screens (xl+) where there's gutter room beside the
 * centered 1024px content column; hidden otherwise. Purely supplementary
 * navigation, so it's marked aria-hidden on small screens by simply not
 * rendering. Keyboard-operable as a real <nav> with buttons.
 */
import { solutionNav } from '~/data/solution'

const { t } = useI18n()
const active = useActiveSection(solutionNav.map(s => s.id))

function go(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <nav
    class="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block 2xl:left-10"
    :aria-label="t('solution.story.title')"
  >
    <ul class="flex flex-col gap-1 border-l border-neutral-200 pl-4">
      <li
        v-for="item in solutionNav"
        :key="item.id"
        class="pointer-events-auto"
      >
        <button
          type="button"
          class="group relative -ml-4 flex items-center gap-3 py-1.5 pl-4 text-left text-sm transition-colors"
          :class="active === item.id
            ? 'font-semibold text-neutral-900'
            : 'text-neutral-400 hover:text-neutral-700'"
          :aria-current="active === item.id ? 'true' : undefined"
          @click="go(item.id)"
        >
          <!-- Active accent bar that sits on the vertical rule. -->
          <span
            class="absolute -left-px top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-600 transition-all duration-300"
            :class="active === item.id ? 'opacity-100' : 'opacity-0'"
            aria-hidden="true"
          />
          {{ t(item.labelKey) }}
        </button>
      </li>
    </ul>
  </nav>
</template>
