<script setup lang="ts">
/**
 * "Bizning jamoa" (/team) — the people behind Rentmi.
 * Hero + group photo, Founder quote, then Advice board / Management / Developers
 * grids. Reached from the nav drawer. Mirrors the Figma "BIzning jamoa" frame.
 */
import {
  founder,
  advisors,
  management,
  developers,
  allMembers
} from '~/data/team'

const { t } = useI18n()

useSeoMeta({
  title: () => t('team.seo.title'),
  description: () => t('team.seo.description'),
  ogTitle: () => t('team.seo.og.title'),
  ogDescription: () => t('team.seo.og.description'),
  ogType: 'website',
  ogImage: '/team/team.webp',
  twitterCard: 'summary_large_image'
})

// Structured data: the organisation plus a Person node for everyone on the page.
useSchemaOrg([
  defineOrganization({ name: 'rentmi.uz', logo: '/landing/rentme-logo.webp' }),
  ...allMembers.map((m) =>
    definePerson({ name: m.name, jobTitle: t(m.roleKey), image: m.image })
  )
])
</script>

<template>
  <div class="pb-24">
    <!-- Hero -->
    <section class="pt-12 md:pt-20">
      <div class="container">
        <div class="max-w-2xl">
          <h1
            class="text-5xl font-bold leading-[1.05] tracking-tight text-neutral-900 md:text-8xl">
            {{ t('team.hero.title') }}
          </h1>
          <p class="mt-6 max-w-[328px] text-base text-neutral-600 md:text-xl">
            {{ t('team.hero.subtitle') }}
          </p>
        </div>

        <!-- Group photo -->
        <div
          class="mt-10 overflow-hidden rounded-3xl bg-neutral-100 shadow-card md:mt-14">
          <NuxtImg
            src="/team/team.webp"
            :alt="t('team.hero.title')"
            class="aspect-[1024/503] w-full object-cover"
            sizes="100vw md:1024px"
            preload />
        </div>
      </div>
    </section>

    <!-- Founder -->
    <section class="mt-20 md:mt-28">
      <div class="container">
        <BaseSectionHeading :title="t('team.sections.founder')" />

        <div class="mt-8 grid grid-cols-1 gap-10 sm:gap-8 md:grid-cols-3">
          <!-- Same card as the other sections, just one grid column wide. -->
          <TeamMemberCard :member="founder" />

          <blockquote class="flex gap-5 md:col-span-2 md:gap-7">
            <!-- Two slanted slab marks (matches the Figma quote glyph). -->
            <span
              class="flex shrink-0 gap-2 self-start pt-1 md:gap-2.5 md:pt-2"
              aria-hidden="true">
              <span
                class="block h-14 w-4 -skew-x-12 rounded-[3px] bg-neutral-200 md:h-17 md:w-5.5" />
              <span
                class="block h-14 w-4 -skew-x-12 rounded-[3px] bg-neutral-200 md:h-17 md:w-5.5" />
            </span>
            <p
              class="max-w-md text-base font-semibold leading-relaxed text-neutral-900 md:text-lg">
              {{ t('team.founderQuote') }}
            </p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Advice board -->
    <section class="mt-20 md:mt-28">
      <div class="container">
        <BaseSectionHeading :title="t('team.sections.advice')" />
        <div class="mt-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
          <TeamMemberCard
            v-for="member in advisors"
            :key="member.name"
            :member="member" />
        </div>
      </div>
    </section>

    <!-- Management -->
    <section class="mt-20 md:mt-28">
      <div class="container">
        <BaseSectionHeading :title="t('team.sections.management')" />
        <div class="mt-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
          <TeamMemberCard
            v-for="member in management"
            :key="member.name"
            :member="member" />
        </div>
      </div>
    </section>

    <!-- Developers -->
    <section class="mt-20 md:mt-28">
      <div class="container">
        <BaseSectionHeading :title="t('team.sections.developers')" />
        <div class="mt-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
          <TeamMemberCard
            v-for="member in developers"
            :key="member.name"
            :member="member" />
        </div>
      </div>
    </section>
  </div>
</template>
