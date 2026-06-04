<script setup lang="ts">
/**
 * Site header matching the Figma hero.
 *  Desktop: [ MENU ☰ ]      📍 Rentmi (centered)      [ Ilovani yuklab olish ]
 *  Mobile:  📍 Rentmi  ........................................  [ MENU ☰ ]
 */
const { t } = useI18n()
const localePath = useLocalePath()

const menuOpen = ref(false)
</script>

<template>
  <header class="bg-background">
    <!-- thin brand accent line at the very top (matches design) -->
    <div
      class="mx-auto container px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
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
