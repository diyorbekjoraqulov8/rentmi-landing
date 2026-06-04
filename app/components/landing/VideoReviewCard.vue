<script setup lang="ts">
import type { VideoReview } from '~/data/landing'

/**
 * Vertical video-review card: a marketing headline over a poster, a play
 * button that reveals on hover, and (while playing) a light controls bar
 * (play/pause · mute · progress). Works with a real <video> when `item.src`
 * is set, and degrades to a poster-only mock when it isn't.
 */
const props = defineProps<{ item: VideoReview }>()

const { t } = useI18n()

// Untyped ref to dodge clashing DOM lib types in the editor; it's an
// HTMLVideoElement at runtime (or null when the card is poster-only).
const video = ref()
const playing = ref(false)
const muted = ref(false)
const progress = ref(0)

/** Split a headline on `*` — odd segments are brand-highlighted. */
function segments(str: string) {
  return str.split('*').map((text, i) => ({ text, accent: i % 2 === 1 }))
}

const headline = computed(() => segments(t(props.item.headlineKey)))

function toggle() {
  const v = video.value
  if (v) {
    if (v.paused) {
      v.play()
      playing.value = true
    }
    else {
      v.pause()
      playing.value = false
    }
  }
  else {
    // poster-only mock: still flip the UI to its "playing" state
    playing.value = !playing.value
  }
}

function toggleMute() {
  muted.value = !muted.value
  if (video.value) video.value.muted = muted.value
}

function onTime() {
  const v = video.value
  if (v && v.duration) progress.value = (v.currentTime / v.duration) * 100
}

function onEnded() {
  playing.value = false
  progress.value = 0
}
</script>

<template>
  <div class="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-neutral-100 shadow-card">
    <!-- Media -->
    <video
      v-if="item.src"
      ref="video"
      class="absolute inset-0 size-full object-cover"
      :poster="item.poster"
      playsinline
      preload="metadata"
      @timeupdate="onTime"
      @ended="onEnded"
    >
      <source :src="item.src">
    </video>
    <img
      v-else
      :src="item.poster"
      alt=""
      class="absolute inset-0 size-full object-cover"
      onerror="this.style.visibility='hidden'"
    >

    <!-- Hover dim + play (hidden while playing) -->
    <div
      v-if="!playing"
      class="absolute inset-0 flex items-center justify-center bg-neutral-900/0 opacity-0 transition duration-300 group-hover:bg-neutral-900/30 group-hover:opacity-100"
    >
      <button
        type="button"
        class="inline-flex size-16 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-lg backdrop-blur transition hover:scale-105"
        aria-label="Play"
        @click="toggle"
      >
        <Icon
          name="lucide:play"
          class="size-7 translate-x-0.5"
        />
      </button>
    </div>

    <!-- Headline (hidden while playing) -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 p-6 transition-opacity duration-300"
      :class="playing ? 'opacity-0' : 'opacity-100'"
    >
      <h3 class="text-center text-2xl font-semibold leading-snug md:text-[26px]">
        <span
          v-for="(s, i) in headline"
          :key="i"
          :class="s.accent ? 'text-brand-600' : 'text-neutral-900'"
        >{{ s.text }}</span>
      </h3>
    </div>

    <!-- Avatar badge (hidden while playing) -->
    <img
      v-if="!playing"
      :src="item.avatar"
      alt=""
      class="absolute bottom-4 left-1/2 size-10 -translate-x-1/2 rounded-full bg-neutral-200 object-cover ring-4 ring-white"
      onerror="this.style.visibility='hidden'"
    >

    <!-- Controls (while playing) -->
    <div
      v-else
      class="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-white/70 p-4 backdrop-blur"
    >
      <button
        type="button"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm"
        aria-label="Pause"
        @click="toggle"
      >
        <Icon
          name="lucide:pause"
          class="size-3.5"
        />
      </button>
      <button
        type="button"
        class="text-neutral-600"
        aria-label="Mute"
        @click="toggleMute"
      >
        <Icon
          :name="muted ? 'lucide:volume-x' : 'lucide:volume-2'"
          class="size-4"
        />
      </button>
      <div class="h-1 flex-1 overflow-hidden rounded-full bg-neutral-300">
        <div
          class="h-full rounded-full bg-brand-600 transition-[width] duration-150"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>
