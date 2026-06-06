<script setup lang="ts">
/**
 * "Ilovani bepul yuklab oling" dialog — opened from the header download CTA.
 * Centered card with the heading, subtitle, both store badges and the app
 * phone mockup. Backdrop blurs the page; the card scales/fades in smoothly.
 */
const { open, hide } = useAppDownloadModal()

const { t } = useI18n()

// Lock body scroll while the modal is open.
watch(open, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') hide()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] bg-neutral-900/20 backdrop-blur-md"
        @click="hide" />
    </Transition>

    <!-- Card -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 scale-95 translate-y-2">
      <div
        v-if="open"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4"
        @click.self="hide">
        <div
          class="relative w-full max-w-[687px]"
          role="dialog"
          aria-modal="true">
          <!-- Close — floats just outside the card's top-right corner -->
          <button
            type="button"
            class="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-surface text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 min-[800px]:-right-14 min-[800px]:top-1"
            :aria-label="t('header.menu')"
            @click="hide">
            <IconsClose class="size-5" />
          </button>

          <!-- Card — phone bleeds to the bottom edge (no bottom padding) -->
          <div
            class="overflow-hidden rounded-3xl bg-surface px-6 pt-12 text-center shadow-2xl sm:px-10 sm:pt-14">
            <h2 class="text-2xl font-bold text-neutral-900 sm:text-4xl">
              {{ t('landing.download.title') }}
            </h2>
            <p class="mx-auto mt-3 max-w-sm text-neutral-500">
              {{ t('landing.download.modalDesc') }}
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <SharedAppStoreBadge />
              <SharedGooglePlayBadge />
            </div>

            <img
              src="/landing/download-app-hand.webp"
              alt="Rentmi app"
              class="mx-auto mt-8 w-full max-w-[460px]"
              loading="lazy"
              decoding="async">
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
