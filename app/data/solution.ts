/**
 * Static content model for the "/solution" page ("Uy topish va ijaraga berish
 * endi muammo emas"). Mirrors the team page convention: names/copy live in i18n
 * (resolved via t(...Key) in components); this file only holds structure,
 * icons, image paths and the section map used by the fixed side-nav.
 */

/** A section that the fixed left nav scroll-spies. `id` is the in-page anchor. */
export interface SolutionNavItem {
  id: string
  labelKey: string
}

/**
 * Side-nav order = visual order down the page. Mission/Vision/Values share one
 * section visually but each column carries its own id so the nav highlights as
 * they reveal one-by-one.
 */
export const solutionNav: SolutionNavItem[] = [
  { id: 'story', labelKey: 'solution.nav.story' },
  { id: 'problem-solution', labelKey: 'solution.nav.problemSolution' },
  { id: 'mission', labelKey: 'solution.nav.mission' },
  { id: 'vision', labelKey: 'solution.nav.vision' },
  { id: 'values', labelKey: 'solution.nav.values' },
  { id: 'how-it-works', labelKey: 'solution.nav.howItWorks' },
  { id: 'why-rentmi', labelKey: 'solution.nav.why' }
]

/** Story paragraphs (Bizning hikoyamiz). */
export const storyParagraphs = [
  'solution.story.p1',
  'solution.story.p2',
  'solution.story.p3'
]

/** One row of the Muammo (problem) / Yechim (solution) comparison card. */
export interface ProblemSolutionRow {
  icon: string
  problemKey: string
  solutionKey: string
}

export const problemSolutionRows: ProblemSolutionRow[] = [
  {
    icon: 'lucide:file-warning',
    problemKey: 'solution.problemSolution.rows.fake.problem',
    solutionKey: 'solution.problemSolution.rows.fake.solution'
  },
  {
    icon: 'lucide:clock',
    problemKey: 'solution.problemSolution.rows.slow.problem',
    solutionKey: 'solution.problemSolution.rows.slow.solution'
  },
  {
    icon: 'lucide:phone-off',
    problemKey: 'solution.problemSolution.rows.calls.problem',
    solutionKey: 'solution.problemSolution.rows.calls.solution'
  },
  {
    icon: 'lucide:user-x',
    problemKey: 'solution.problemSolution.rows.trust.problem',
    solutionKey: 'solution.problemSolution.rows.trust.solution'
  }
]

/** Qadriyatlarimiz (values) — title + description i18n keys. */
export interface SolutionValue {
  titleKey: string
  descKey: string
}

export const values: SolutionValue[] = [
  { titleKey: 'solution.values.items.trust.title', descKey: 'solution.values.items.trust.desc' },
  { titleKey: 'solution.values.items.transparency.title', descKey: 'solution.values.items.transparency.desc' },
  { titleKey: 'solution.values.items.convenience.title', descKey: 'solution.values.items.convenience.desc' },
  { titleKey: 'solution.values.items.speed.title', descKey: 'solution.values.items.speed.desc' },
  { titleKey: 'solution.values.items.userCentric.title', descKey: 'solution.values.items.userCentric.desc' }
]

/** One step in the "Platforma qanday ishlaydi?" horizontal walkthrough. */
export interface HowStep {
  labelKey: string
  /** Full phone screenshot (frame included) from /public/solution. */
  image: string
}

/**
 * Two flows behind the audience toggle. Tenant uses phone-1..5, owner uses
 * phone-6..10 (note the source typo `pohne-2.png`). Order = left→right reveal.
 */
export const howItWorks: Record<'tenant' | 'owner', HowStep[]> = {
  tenant: [
    { labelKey: 'solution.how.tenant.download', image: '/solution/phone-1.png' },
    { labelKey: 'solution.how.tenant.filter', image: '/solution/pohne-2.png' },
    { labelKey: 'solution.how.tenant.browse', image: '/solution/phone-3.png' },
    { labelKey: 'solution.how.tenant.contact', image: '/solution/phone-4.png' },
    { labelKey: 'solution.how.tenant.find', image: '/solution/phone-5.png' }
  ],
  owner: [
    { labelKey: 'solution.how.owner.download', image: '/solution/phone-6.png' },
    { labelKey: 'solution.how.owner.publish', image: '/solution/phone-7.png' },
    { labelKey: 'solution.how.owner.requests', image: '/solution/phone-8.png' },
    { labelKey: 'solution.how.owner.contact', image: '/solution/phone-9.png' },
    { labelKey: 'solution.how.owner.contract', image: '/solution/phone-10.png' }
  ]
}

/** "Nega aynan Rentmi?" feature cards. */
export interface WhyFeature {
  icon: string
  /** Tailwind text-color class for the icon tile. */
  tone: string
  titleKey: string
  descKey: string
}

export const whyFeatures: WhyFeature[] = [
  { icon: 'lucide:shield-check', tone: 'text-brand-600', titleKey: 'solution.why.items.trusted.title', descKey: 'solution.why.items.trusted.desc' },
  { icon: 'lucide:search', tone: 'text-sky-500', titleKey: 'solution.why.items.search.title', descKey: 'solution.why.items.search.desc' },
  { icon: 'lucide:smartphone', tone: 'text-violet-500', titleKey: 'solution.why.items.mobile.title', descKey: 'solution.why.items.mobile.desc' },
  { icon: 'lucide:gauge', tone: 'text-success-600', titleKey: 'solution.why.items.scoring.title', descKey: 'solution.why.items.scoring.desc' },
  { icon: 'lucide:bar-chart-3', tone: 'text-amber-500', titleKey: 'solution.why.items.stats.title', descKey: 'solution.why.items.stats.desc' },
  { icon: 'lucide:building-2', tone: 'text-rose-500', titleKey: 'solution.why.items.curated.title', descKey: 'solution.why.items.curated.desc' }
]
