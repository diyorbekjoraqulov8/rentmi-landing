<script setup lang="ts">
/**
 * Tenant "profile & settings" feature illustration: a profile summary card
 * (avatar, name, completion progress, scoring CTA) overlapping the top-right
 * of the in-app settings menu. Display-only mock.
 */
import IconsHeart from '~/components/icons/Heart.vue'
import IconsFileExport from '~/components/icons/FileExport.vue'
import IconsBell from '~/components/icons/Bell.vue'
import IconsRefresh from '~/components/icons/Refresh.vue'
import IconsSettings from '~/components/icons/Settings.vue'
import IconsHeadset from '~/components/icons/Headset.vue'
import IconsInfo from '~/components/icons/Info.vue'
import IconsDoorExit from '~/components/icons/DoorExit.vue'

const { t } = useI18n()

const completion = 82

const menu = [
  { key: 'wishlist', comp: IconsHeart, tint: 'text-brand-600' },
  { key: 'requests', comp: IconsFileExport, tint: 'text-brand-600' },
  { key: 'notifications', comp: IconsBell, tint: 'text-brand-600', badge: '16', chevron: true },
  { key: 'switchRole', comp: IconsRefresh, tint: 'text-brand-600', chevron: true },
  { key: 'appSettings', comp: IconsSettings, tint: 'text-brand-600', chevron: true },
  { key: 'support', comp: IconsHeadset, tint: 'text-brand-600', chevron: true },
  { key: 'terms', comp: IconsInfo, tint: 'text-brand-600', chevron: true },
  { key: 'logout', comp: IconsDoorExit, tint: 'text-red-500', danger: true, chevron: true }
] as const
</script>

<template>
  <div class="relative pt-4 sm:pt-0">
    <!-- Settings menu -->
    <div class="w-full max-w-[300px] overflow-hidden rounded-2xl bg-surface shadow-card sm:mt-28">
      <ul class="divide-y divide-neutral-100">
        <li
          v-for="m in menu"
          :key="m.key"
          class="flex items-center gap-3 px-4 py-3 text-sm"
        >
          <span :class="m.tint">
            <component
              :is="m.comp"
              class="size-4.5"
            />
          </span>
          <span
            class="flex-1 font-medium"
            :class="m.danger ? 'text-red-500' : 'text-neutral-800'"
          >{{ t(`landing.features.tpanels.profile.menu.${m.key}`) }}</span>
          <span
            v-if="m.badge"
            class="text-xs text-neutral-400"
          >{{ m.badge }}</span>
          <Icon
            v-if="m.chevron"
            name="lucide:chevron-right"
            class="size-4 text-neutral-300"
          />
        </li>
      </ul>
    </div>

    <!-- Profile card (overlaps top-right) -->
    <div
      class="mt-4 w-full max-w-[270px] rounded-2xl bg-surface p-5 shadow-card ring-1 ring-black/5 sm:absolute sm:right-0 sm:top-0 sm:mt-0"
    >
      <span
        class="ml-auto flex w-fit items-center gap-1 rounded-lg bg-neutral-50 px-2.5 py-1 text-xs text-neutral-500"
      >
        <IconsEditPencil class="size-3" />Tahrirlash
      </span>
      <div class="flex flex-col items-center text-center">
        <img
          src="/landing/avatar-owner.png"
          alt="Murod Talipov"
          class="size-16 rounded-full bg-neutral-200 object-cover ring-2 ring-brand-100"
          onerror="this.style.visibility='hidden'"
        >
        <p class="mt-2 font-bold text-neutral-900">
          Murod Talipov
        </p>
        <p class="text-xs text-neutral-400">
          +998 93 484 70 50
        </p>
      </div>

      <!-- Completion -->
      <p class="mt-4 text-[11px] text-neutral-500">
        Profil <span class="font-semibold text-neutral-900">{{ completion }}%</span> {{ t('landing.features.tpanels.profile.filled') }}
      </p>
      <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          class="h-full rounded-full bg-success-500"
          :style="{ width: `${completion}%` }"
        />
      </div>

      <div
        class="mt-4 w-full rounded-xl bg-neutral-100 py-2.5 text-center text-sm font-semibold text-neutral-700"
      >
        {{ t('landing.features.tpanels.profile.passScore') }}
      </div>
    </div>
  </div>
</template>
