export type Cohort = 'women' | 'lawyer' | 'clinician'

export interface ScenarioConfig {
  inviteCode: string
  cohort: Cohort
  scenarioId: string
  description: string
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    inviteCode: 'GRACE-W-01',
    cohort: 'women',
    scenarioId: 'women-order-a',
    description: 'Women cohort, scenario order A (with AI companion)'
  },
  {
    inviteCode: 'GRACE-W-02',
    cohort: 'women',
    scenarioId: 'women-order-b',
    description: 'Women cohort, scenario order B (counterbalance, no AI)'
  },
  {
    inviteCode: 'GRACE-W-03',
    cohort: 'women',
    scenarioId: 'women-combined',
    description: 'Women cohort, combined scenario (AI + counterbalance)'
  },
  {
    inviteCode: 'GRACE-L-01',
    cohort: 'lawyer',
    scenarioId: 'lawyer-standard',
    description: 'Lawyer cohort'
  },
  {
    inviteCode: 'GRACE-C-01',
    cohort: 'clinician',
    scenarioId: 'clinician-standard',
    description: 'Clinician cohort'
  },
  {
    inviteCode: 'GRACE-ADMIN-01',
    cohort: 'clinician',
    scenarioId: 'admin-freeroam',
    description: 'Admin Free Roam (No Survey, No Guide, Cohort Switcher)'
  },
]

export function lookupScenario(code: string): ScenarioConfig | null {
  const normalized = code.trim().toUpperCase()
  return SCENARIOS.find(s => s.inviteCode === normalized) || null
}
