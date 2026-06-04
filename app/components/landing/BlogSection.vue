<script setup lang="ts">
/**
 * "Foydali maqolalar" — image + title cards (the "8 ta foydali funksiya"
 * block in the design). Images are placeholders for now.
 */
import { blogPosts } from '~/data/landing'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section
    id="blog"
    class="mx-auto max-w-6xl px-4 py-16 md:py-24"
  >
    <BaseSectionHeading
      :title="t('landing.blog.title')"
      align="center"
    />

    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="post in blogPosts"
        :key="post.id"
        :to="localePath('/blog')"
        class="group"
      >
        <BaseCard
          :padded="false"
          hover
          class="h-full"
        >
          <div class="relative aspect-[16/10] bg-neutral-200">
            <div class="absolute inset-0 flex items-center justify-center text-neutral-400">
              <Icon
                name="lucide:image"
                class="size-10"
              />
            </div>
          </div>
          <div class="p-5">
            <h3 class="font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">
              {{ t(post.titleKey) }}
            </h3>
            <span class="mt-3 inline-flex items-center gap-1 text-sm text-brand-600">
              {{ t('landing.blog.readMore') }}
              <Icon
                name="lucide:arrow-right"
                class="size-4"
              />
            </span>
          </div>
        </BaseCard>
      </NuxtLink>
    </div>
  </section>
</template>
