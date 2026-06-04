<script setup lang="ts">
/**
 * Site header matching the Figma hero.
 *  Desktop: [ MENU ☰ ]      📍 Rentmi (centered)      [ Ilovani yuklab olish ]
 *  Mobile:  📍 Rentmi  ........................................  [ MENU ☰ ]
 */
const { t } = useI18n()
const localePath = useLocalePath()

const menuOpen = ref(false)

// Frosted-glass once the page is scrolled; transparent (blends with the page)
// at the very top. rAF-throttled passive listener so scrolling stays smooth.
const scrolled = ref(false)
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 8
    ticking = false
  })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b transition-colors duration-300"
    :class="scrolled
      ? 'border-neutral-200/70 bg-surface/80 shadow-[0_6px_24px_-16px_rgba(16,24,40,0.45)] backdrop-blur-xl'
      : 'border-transparent bg-background'">
    <div
      class="mx-auto container px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300"
      :class="scrolled ? 'h-16' : 'h-20'">
      <!-- Left slot: MENU on desktop, logo on mobile -->
      <div class="flex flex-1 items-center">
        <!-- desktop MENU -->
        <button
          type="button"
          class="hidden md:inline-flex items-center gap-3 rounded-full border border-neutral-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
          @click="menuOpen = true">
          {{ t('header.menu') }}
          <IconsMenu class="size-5" />
        </button>

        <!-- mobile logo -->
        <NuxtLink
          :to="localePath('/')"
          class="md:hidden flex items-center gap-1.5 text-xl text-brand-600">
          <IconsLocationPin class="size-6" />
          Rentmi
        </NuxtLink>
      </div>

      <!-- Center: logo (desktop only) -->
      <NuxtLink
        :to="localePath('/')"
        class="hidden md:flex items-center gap-2 text-2xl font-bold text-brand-600">
        <IconsLocationPin class="size-7" />
        Rentmi
      </NuxtLink>

      <!-- Right slot: download (desktop), MENU (mobile) -->
      <div class="flex flex-1 justify-end">
        <div class="hidden md:block">
          <BaseButton :to="localePath('/download')" size="lg">
            {{ t('header.download') }}
          </BaseButton>
        </div>

        <button
          type="button"
          class="md:hidden inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-surface px-5 py-2.5 text-sm font-semibold text-neutral-900"
          :aria-label="t('header.menu')"
          @click="menuOpen = true">
          {{ t('header.menu') }}
          <IconsMenu class="size-5" />
        </button>
      </div>
    </div>

    <!-- Slide-in navigation drawer -->
    <LayoutNavDrawer v-model:open="menuOpen" />
  </header>
</template>
