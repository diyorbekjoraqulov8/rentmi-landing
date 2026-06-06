/**
 * Static team roster for the "Bizning jamoa" (/team) page.
 * Names are proper nouns kept as-is across locales; only roles are i18n keys
 * (resolved via t(roleKey) in the components). Photos live in /public/team/.
 */
export interface TeamMember {
  name: string
  roleKey: string
  image: string
}

export const founder: TeamMember = {
  name: 'Abrorxo‘ja Turdaliyev',
  roleKey: 'team.roles.founder',
  image: '/team/founder.png'
}

export const advisors: TeamMember[] = [
  { name: 'Shokhpur Gulturaev', roleKey: 'team.roles.cto', image: '/team/cto.png' },
  { name: 'Laylo Xondamirovna', roleKey: 'team.roles.cmo', image: '/team/cmo.png' }
]

export const management: TeamMember[] = [
  { name: 'Abdulloh Shokirov', roleKey: 'team.roles.manager', image: '/team/manager.png' }
]

export const developers: TeamMember[] = [
  { name: 'Aziza Azimova', roleKey: 'team.roles.backend', image: '/team/backend.png' },
  { name: 'Doston Abdullayev', roleKey: 'team.roles.frontend', image: '/team/frontend.png' },
  { name: 'Sherzod Valiyev', roleKey: 'team.roles.solution', image: '/team/solution-architecture.png' },
  { name: 'Alibek Madaminov', roleKey: 'team.roles.devops', image: '/team/devops.png' },
  { name: 'Malika Rahimova', roleKey: 'team.roles.smm', image: '/team/smm-manager.png' },
  { name: 'Murod Talipov', roleKey: 'team.roles.product', image: '/team/product-disign.png' }
]

/** Flat list — handy for schema.org Person markup. */
export const allMembers: TeamMember[] = [founder, ...advisors, ...management, ...developers]
