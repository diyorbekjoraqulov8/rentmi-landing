<script setup lang="ts">
/**
 * "Manage" feature illustration: an in-app analytics card ("Tahlil va
 * statistika") — date-range toggle, a four-up stat grid and a "Dinamika" mini
 * line chart — with a listing card peeking from the top-right corner.
 * Display-only mock: static, non-interactive HTML.
 */
const { t } = useI18n()

const ranges = [
  { key: 'd7', active: true },
  { key: 'd30', active: false },
  { key: 'd90', active: false }
] as const

const stats = [
  { key: 'views', value: '28' },
  { key: 'requests', value: '15', delta: '+2' },
  { key: 'likes', value: '35' },
  { key: 'calls', value: '48' }
] as const

// Decorative line chart — y is inverted (0 = top) for the SVG viewBox 0..100.
const days = ['Chor', 'Pay', 'Ju', 'Sha', 'Yak', 'Du', 'Se']
const points = [38, 30, 12, 22, 8, 18, 5]
const path = points
  .map((y, i) => `${(i / (points.length - 1)) * 100},${y}`)
  .join(' ')
const area = `0,${points[0]} ${path} 100,${points.at(-1)} 100,50 0,50`
</script>

<template>
  <div class="relative pt-6 sm:pt-10">
    <!-- Analytics card (opaque, on top — keeps all stats visible) -->
    <div
      class="relative z-10 w-full max-w-[330px] rounded-2xl bg-surface p-5 shadow-card">
      <p class="font-semibold text-neutral-900">
        {{ t('landing.features.panels.analytics.title') }}
      </p>

      <!-- Date-range toggle -->
      <div class="mt-4 flex rounded-xl bg-neutral-100 p-1 text-xs">
        <span
          v-for="r in ranges"
          :key="r.key"
          class="flex-1 rounded-lg py-1.5 text-center font-medium transition-colors"
          :class="
            r.active
              ? 'bg-surface text-neutral-900 shadow-sm'
              : 'text-neutral-400'
          ">
          {{ t(`landing.features.panels.analytics.ranges.${r.key}`) }}
        </span>
      </div>

      <!-- Stat grid -->
      <div class="mt-4 grid grid-cols-4 gap-2">
        <div
          v-for="s in stats"
          :key="s.key"
          class="rounded-xl bg-neutral-50 px-2 py-3 text-center">
          <p
            class="flex items-start justify-center text-xl font-bold leading-none text-neutral-900">
            {{ s.value }}
            <span
              v-if="s.delta"
              class="ml-0.5 text-[10px] font-semibold text-success-600"
              >{{ s.delta }}</span
            >
          </p>
          <p class="mt-1.5 text-[10px] leading-tight text-neutral-400">
            {{ t(`landing.features.panels.analytics.stats.${s.key}`) }}
          </p>
        </div>
      </div>

      <!-- Dinamika chart -->
      <p class="mt-5 text-xs font-medium text-neutral-500">
        {{ t('landing.features.panels.analytics.dynamics') }}
      </p>
      <div class="mt-2">
        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          class="h-24 w-full overflow-visible">
          <defs>
            <linearGradient id="dynFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stop-color="var(--color-brand-500)"
                stop-opacity="0.22" />
              <stop
                offset="100%"
                stop-color="var(--color-brand-500)"
                stop-opacity="0" />
            </linearGradient>
          </defs>
          <polygon :points="area" fill="url(#dynFill)" />
          <polyline
            :points="path"
            fill="none"
            stroke="var(--color-brand-600)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke" />
        </svg>
        <div class="mt-2 flex justify-between text-[9px] text-neutral-400">
          <span v-for="d in days" :key="d">{{ d }}</span>
        </div>
      </div>
    </div>

    <!-- Listing card peeking from behind the top-right corner -->
    <div
      class="absolute right-0 top-0 z-0 hidden w-[210px] overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-black/5 sm:block">
      <div class="relative aspect-[16/10] bg-neutral-200">
        <img
          src="/landing/mirabad-square.png"
          alt="Dream City 3 xonali"
          class="h-full w-full object-cover"
          onerror="this.style.visibility = 'hidden'" />
        <span
          class="absolute bottom-2 right-2 inline-flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[10px] text-white backdrop-blur">
          <span class="flex items-center gap-1"
            ><Icon name="lucide:scan" class="size-3" />120m²</span
          >
          <span class="flex items-center gap-1"
            ><Icon name="lucide:layers" class="size-3" />12/16</span
          >
        </span>
      </div>
      <div class="p-3">
        <p class="text-sm font-semibold text-neutral-900">
          Dream City 3 xonali
        </p>
        <p class="mt-1 flex items-center gap-1 text-[10px] text-neutral-500">
          <IconsMapPin class="size-3 shrink-0" />Toshkent, Shayhontohur t.
        </p>
        <p class="mt-1.5 text-sm font-bold text-neutral-900">
          23 mln so'm
          <span class="text-[10px] font-normal text-neutral-400"
            >/ {{ t('landing.listings.perMonth') }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
