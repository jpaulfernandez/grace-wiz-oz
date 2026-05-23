export interface LikertQuestion {
  id: string
  text: string
}

export interface OpenTextQuestion {
  id: string
  text: string
  placeholder?: string
}

export interface CohortSurveyConfig {
  likertQuestions: LikertQuestion[]
  openQuestions: OpenTextQuestion[]
  hasPricingThrowaway: boolean
}

export const COHORT_SURVEYS: Record<'women' | 'lawyer' | 'clinician', CohortSurveyConfig> = {
  women: {
    likertQuestions: [
      { id: 'w_write_interest', text: 'I would write what is happening to me in this app.' },
      { id: 'w_trust_words', text: 'I trust this app with my words.' },
      { id: 'w_tell_others', text: 'I would tell another woman about this app.' }
    ],
    openQuestions: [
      { id: 'w_safe_unsafe', text: 'What about this app made you feel safe, or unsafe?', placeholder: 'Describe your thoughts...' },
      { id: 'w_not_write', text: 'Was there anything you would not write into this app, even if it were happening to you?', placeholder: 'Describe your thoughts...' },
      { id: 'w_worse_factor', text: 'What would make this worse for someone you know?', placeholder: 'Describe your thoughts...' }
    ],
    hasPricingThrowaway: false
  },
  lawyer: {
    likertQuestions: [
      { id: 'l_synthesis_utility', text: 'The legal lens synthesis would be useful for case preparation.' },
      { id: 'l_hash_defensibility', text: 'The hash-receipt and timestamp model, if implemented as described, would be defensible under cross-examination.' },
      { id: 'l_accept_links', text: 'I would accept shared Grace links from clients as a receiving provider on this platform.' }
    ],
    openQuestions: [
      { id: 'l_admissibility_fields', text: 'Which fields in the incident log are essential for admissibility, and what\'s missing?', placeholder: 'Describe your thoughts...' },
      { id: 'l_chat_breakdown', text: 'Where does the citation-chip / corpus-chat model break down?', placeholder: 'Describe your thoughts...' },
      { id: 'l_changes_needed', text: 'What would have to change before you\'d use this with an actual client matter?', placeholder: 'Describe your thoughts...' }
    ],
    hasPricingThrowaway: true
  },
  clinician: {
    likertQuestions: [
      { id: 'c_synthesis_utility', text: 'The clinical lens synthesis would be useful for session preparation.' },
      { id: 'c_refer_patients', text: 'I would recommend a patient use this between sessions.' },
      { id: 'c_accept_links', text: 'I would accept shared links from patients as a receiving provider on this platform.' }
    ],
    openQuestions: [
      { id: 'c_pseudotherapy_line', text: 'Was there any Companion exchange that crossed a line into pseudo-therapy?', placeholder: 'Describe your thoughts...' },
      { id: 'c_synthesis_missing', text: 'What\'s missing from the synthesis that you\'d need for session prep?', placeholder: 'Describe your thoughts...' },
      { id: 'c_changes_needed', text: 'What would have to change before you\'d refer a patient to this app?', placeholder: 'Describe your thoughts...' }
    ],
    hasPricingThrowaway: true
  }
}

export const PRICING_THROUGH_QUESTION = 'If this platform charged providers for receiving client links and using the corpus chat, what would feel reasonable, and what would feel disqualifying?'

export const SUS_STATEMENTS = [
  'I think that I would like to use this app frequently.',
  'I found the app unnecessarily complex.',
  'I thought the app was easy to use.',
  'I think that I would need the support of a technical person to be able to use this app.',
  'I found the various functions in this app were well integrated.',
  'I thought there was too much inconsistency in this app.',
  'I would imagine that most people would learn to use this app very quickly.',
  'I found the app very cumbersome to use.',
  'I felt very confident using the app.',
  'I needed to learn a lot of things before I could get going with this app.'
]
