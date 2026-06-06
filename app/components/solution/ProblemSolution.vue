<script setup lang="ts">
/**
 * "Muammo & Yechim" — a single elevated card comparing old-way problems (red,
 * left) against Rentmi's solutions (green, right), row by row. `#problem-solution`
 * anchors the side-nav.
 */
import { problemSolutionRows } from '~/data/solution'

const { t } = useI18n()
</script>

<template>
  <section
    id="problem-solution"
    class="scroll-mt-24 mt-24 md:mt-32"
  >
    <div class="container">
      <SolutionRevealOnScroll from="up">
        <div class="rounded-3xl bg-surface p-6 shadow-card sm:p-10">
          <h2 class="text-xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
            {{ t('solution.problemSolution.title') }}
          </h2>
          <p class="mt-2 text-sm text-neutral-500 md:text-base">
            {{ t('solution.problemSolution.subtitle') }}
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <!-- Problem column -->
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex size-6 items-center justify-center rounded-full bg-rose-100 text-rose-600"
                  aria-hidden="true"
                >
                  <Icon
                    name="lucide:x"
                    class="size-4"
                  />
                </span>
                <h3 class="text-base font-semibold text-neutral-900">
                  {{ t('solution.problemSolution.problem') }}
                </h3>
              </div>
              <ul class="mt-4 flex flex-col gap-3">
                <SolutionRevealOnScroll
                  v-for="(row, i) in problemSolutionRows"
                  :key="row.problemKey"
                  as="li"
                  from="right"
                  :delay="60 * i"
                >
                  <span
                    class="flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-neutral-800"
                  >
                    <Icon
                      :name="row.icon"
                      class="size-5 shrink-0 text-rose-500"
                    />
                    {{ t(row.problemKey) }}
                  </span>
                </SolutionRevealOnScroll>
              </ul>
            </div>

            <!-- Solution column -->
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex size-6 items-center justify-center rounded-full bg-success-100 text-success-600"
                  aria-hidden="true"
                >
                  <Icon
                    name="lucide:check"
                    class="size-4"
                  />
                </span>
                <h3 class="text-base font-semibold text-neutral-900">
                  {{ t('solution.problemSolution.solution') }}
                </h3>
              </div>
              <ul class="mt-4 flex flex-col gap-3">
                <SolutionRevealOnScroll
                  v-for="(row, i) in problemSolutionRows"
                  :key="row.solutionKey"
                  as="li"
                  from="left"
                  :delay="60 * i"
                >
                  <span
                    class="flex items-center gap-3 rounded-2xl bg-success-50 px-4 py-3 text-sm font-medium text-neutral-800"
                  >
                    <Icon
                      :name="row.icon"
                      class="size-5 shrink-0 text-success-600"
                    />
                    {{ t(row.solutionKey) }}
                  </span>
                </SolutionRevealOnScroll>
              </ul>
            </div>
          </div>
        </div>
      </SolutionRevealOnScroll>
    </div>
  </section>
</template>
