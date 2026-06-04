<script setup lang="ts">
/**
 * Site header matching the Figma hero.
 *  Desktop: [ MENU ☰ ]      📍 Rentmi (centered)      [ Ilovani yuklab olish ]
 *  Mobile:  📍 Rentmi  ........................................  [ MENU ☰ ]
 */
const { t } = useI18n()
const localePath = useLocalePath()

const mobileOpen = ref(false)
</script>

<template>
  <header class="bg-background">
    <!-- thin brand accent line at the very top (matches design) -->
    <div class="h-1 bg-brand-600" />

    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
      <!-- Left slot: MENU on desktop, logo on mobile -->
      <div class="flex flex-1 items-center">
        <!-- desktop MENU -->
        <button
          type="button"
          class="hidden md:inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-surface px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
          @click="mobileOpen = !mobileOpen"
        >
          {{ t('header.menu') }}
          <IconsMenu class="size-5" />
        </button>

        <!-- mobile logo -->
        <NuxtLink
          :to="localePath('/')"
          class="md:hidden flex items-center gap-1.5 text-xl font-extrabold text-brand-600"
        >
          <IconsLocationPin class="size-6" />
          Rentmi
        </NuxtLink>
      </div>

      <!-- Center: logo (desktop only) -->
      <NuxtLink
        :to="localePath('/')"
        class="hidden md:flex items-center gap-2 text-2xl font-extrabold text-brand-600"
      >
        <IconsLocationPin class="size-7" />
        Rentmi
      </NuxtLink>

      <!-- Right slot: download (desktop), MENU (mobile) -->
      <div class="flex flex-1 justify-end">
        <div class="hidden md:block">
          <BaseButton
            :to="localePath('/download')"
            size="lg"
          >
            {{ t('header.download') }}
          </BaseButton>
        </div>

        <button
          type="button"
          class="md:hidden inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-surface px-5 py-2.5 text-sm font-semibold text-neutral-900"
          :aria-label="t('header.menu')"
          @click="mobileOpen = !mobileOpen"
        >
          {{ t('header.menu') }}
          <IconsClose
            v-if="mobileOpen"
            class="size-5"
          />
          <IconsMenu
            v-else
            class="size-5"
          />
        </button>
      </div>
    </div>

    <!-- Simple dropdown drawer -->
    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="mx-auto max-w-[1320px] px-4 sm:px-6 pb-4"
      >
        <div class="rounded-2xl bg-surface shadow-card p-4 space-y-3">
          <NuxtLink
            v-for="link in [
              { to: '/announcements', key: 'header.nav.listings' },
              { to: '/about', key: 'header.nav.about' },
              { to: '/faq', key: 'footer.useful.faq' },
            ]"
            :key="link.to"
            :to="localePath(link.to)"
            class="block rounded-lg px-3 py-2 text-neutral-700 hover:bg-neutral-100"
            @click="mobileOpen = false"
          >
            {{ t(link.key) }}
          </NuxtLink>
          <BaseButton
            :to="localePath('/download')"
            block
            size="md"
          >
            {{ t('header.download') }}
          </BaseButton>
          <LangSwitcher />
        </div>
      </div>
    </Transition>
  </header>
</template>
