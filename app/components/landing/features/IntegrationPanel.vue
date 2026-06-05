<script setup lang="ts">
/**
 * "Integration" feature illustration: a platform-import card (OLX / UyBor /
 * Joyme + a link field) with a "share listing" card overlapping the
 * bottom-right. Display-only mock.
 */
import IconsTelegram from '~/components/icons/Telegram.vue'
import IconsInstagram from '~/components/icons/Instagram.vue'
import IconsFacebook from '~/components/icons/Facebook.vue'

const { t } = useI18n()

// `comp` is a local icon component; `icon` falls back to a lucide name.
const socials = [
  { key: 'telegram', comp: IconsTelegram, class: 'text-[#229ED9]' },
  { key: 'instagram', comp: IconsInstagram, class: 'text-[#E1306C]' },
  { key: 'facebook', comp: IconsFacebook, class: 'text-[#1877F2]' },
  { key: 'whatsapp', icon: 'lucide:message-circle', class: 'text-[#25D366]' }
] as const
</script>

<template>
  <div class="relative w-full sm:min-h-[440px]">
    <!-- Import card -->
    <div class="w-full max-w-[330px] rounded-2xl bg-surface p-5 shadow-card">
      <p class="text-center font-semibold leading-snug text-neutral-900">
        {{ t('landing.features.panels.integration.title') }}
      </p>

      <!-- Platform tiles -->
      <div class="mt-4 grid grid-cols-3 gap-3">
        <span
          class="flex h-14 items-center justify-center rounded-xl bg-neutral-50 ring-1 ring-black/5">
          <span class="text-lg font-extrabold tracking-tight text-[#002F34]"
            >ol<span class="rounded bg-[#002F34] px-1 text-white">x</span></span
          >
        </span>
        <span
          class="flex h-14 items-center justify-center rounded-xl bg-neutral-50 ring-1 ring-black/5">
          <span class="text-lg font-extrabold tracking-tight"
            ><span class="text-[#FF7A00]">Uy</span
            ><span class="text-neutral-900">Bor</span></span
          >
        </span>
        <span
          class="flex h-14 items-center justify-center rounded-xl bg-neutral-50 ring-1 ring-black/5">
          <span class="text-lg font-extrabold tracking-tight"
            ><span class="text-neutral-900">Joy</span
            ><span class="text-brand-600">me</span></span
          >
        </span>
      </div>

      <!-- Link field -->
      <p class="mt-5 text-sm font-semibold text-neutral-900">
        {{ t('landing.features.panels.integration.linkLabel') }}
      </p>
      <p class="mt-1 text-xs leading-snug text-neutral-400">
        {{ t('landing.features.panels.integration.linkDesc') }}
      </p>
      <div
        class="mt-3 flex items-center rounded-xl border border-neutral-200 px-3 py-2.5 text-xs text-neutral-500">
        <span class="truncate"
          >https://www.olx.uz/d/obyavlenie/zhk-mirabad…</span
        >
      </div>
      <div
        class="mt-3 w-full rounded-full bg-brand-600 py-2.5 text-center text-sm font-medium text-white">
        {{ t('landing.features.panels.integration.send') }}
      </div>
    </div>

    <!-- Share card (overlaps bottom-right) -->
    <div
      class="mt-4 w-full max-w-[290px] rounded-2xl bg-surface p-4 shadow-card ring-1 ring-black/5 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0">
      <p class="font-semibold text-neutral-900">
        {{ t('landing.features.panels.integration.shareTitle') }}
      </p>

      <!-- Mini listing -->
      <div class="mt-3 flex gap-3 rounded-xl bg-neutral-50 p-2">
        <img
          src="/landing/drujba.png"
          alt="Drujba NRG | U Tower"
          class="size-14 shrink-0 rounded-lg bg-neutral-200 object-cover"
          onerror="this.style.visibility = 'hidden'" />
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-neutral-900">
            Drujba NRG | U Tower
          </p>
          <p
            class="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-500">
            <IconsMapPin class="size-3 shrink-0" />Toshkent, Shayhontohur t.
          </p>
          <p class="mt-1 text-xs font-bold text-neutral-900">
            23 000 000 UZS
            <span class="text-[9px] font-normal text-neutral-400"
              >/ {{ t('landing.listings.perMonth') }}</span
            >
          </p>
        </div>
      </div>

      <!-- Copy code -->
      <div
        class="mt-3 flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 text-xs">
        <span class="font-mono text-neutral-600">eqHCaW9f2sCSa</span>
        <span class="text-neutral-400">
          <Icon name="lucide:copy" class="size-4" />
        </span>
      </div>

      <!-- Socials -->
      <div class="mt-3 flex justify-between">
        <span
          v-for="s in socials"
          :key="s.key"
          class="flex flex-col items-center gap-1 text-[10px] text-neutral-500">
          <span
            class="inline-flex size-9 items-center justify-center rounded-full bg-neutral-50 ring-1 ring-black/5"
            :class="s.class">
            <component :is="s.comp" v-if="'comp' in s" class="size-5" />
            <Icon v-else :name="s.icon" class="size-5" />
          </span>
          <span class="capitalize">{{ s.key }}</span>
        </span>
      </div>

      <div
        class="mt-3 w-full rounded-full bg-brand-600 py-2.5 text-center text-sm font-medium text-white">
        {{ t('landing.features.panels.integration.send') }}
      </div>
    </div>
  </div>
</template>
