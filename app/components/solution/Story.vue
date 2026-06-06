<script setup lang="ts">
/**
 * "Bizning Hikoyamiz" — section heading, a sub-question and the story
 * paragraphs. `#story` anchors the side-nav scroll-spy.
 */
import { storyParagraphs } from '~/data/solution'

const { t } = useI18n()
</script>

<template>
  <section id="story" class="scroll-mt-24 mt-24 md:mt-32">
    <div class="container">
      <div class="gap-8 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-16">
        <SolutionRevealOnScroll from="right">
          <h2
            class="text-2xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            {{ t('solution.story.title') }}
          </h2>
        </SolutionRevealOnScroll>

        <div class="mt-4">
          <SolutionRevealOnScroll from="up">
            <h3 class="text-lg font-semibold text-neutral-900 md:text-2xl">
              {{ t('solution.story.subtitle') }}
            </h3>
          </SolutionRevealOnScroll>

          <SolutionRevealOnScroll
            v-for="(p, i) in storyParagraphs"
            :key="p"
            from="up"
            :delay="80 * (i + 1)"
            as="p">
            <span class="mt-0 block text-base leading-relaxed text-neutral-700">
              {{ t(p) }}
            </span>
          </SolutionRevealOnScroll>
        </div>
      </div>
    </div>
  </section>
</template>
