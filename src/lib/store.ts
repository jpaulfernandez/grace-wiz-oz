import { create } from 'zustand'
import type { Cohort } from '../config/scenarios'
import type { GuidedStepConfig, ScenarioReflection } from '../config/scenarioTypes'
import { getSessionConfig } from '../config/sidePanel'

interface SessionState {
  sessionId: string | null
  nickname: string
  inviteCode: string
  cohort: Cohort | null
  scenarioId: string | null
  startedAt: Date | null
  consentedAt: Date | null
  guidedCompletedAt: Date | null
  freeRoamStartedAt: Date | null
  completedAt: Date | null
  endedEarly: boolean
  userAgent: string | null
  viewportWidth: number | null
  isModerated: boolean
}

interface UIState {
  currentScreen: string
  isPaused: boolean
  viewAsUser: boolean
  currentStepIndex: number // Relative step index within the current scenario
  moderatorNotes: string
  showNudgeText: boolean
  simulatedCohort: 'jane' | 'grace' | 'legal' | 'clinician' | null
  onboardingComplete: boolean

  // Checklist tracking variables
  chatMessagesCount: number
  chatInputText: string
  journalTextContent: string
  clickedAnnotations: string[]
  incidentNotes: string
  isIncidentsRequested: boolean
  isJournalsRequested: boolean
  providerChatCount: number
  providerNotesCount: number
  letGoButtonClicked: boolean

  // Free Roam global navigation & progress
  freeRoamTab: 'home' | 'companion' | 'journal' | 'resources'
  freeRoamResourceTab: 'stories' | 'pathways' | 'marketplace'
  freeRoamJournalTab: 'reflective' | 'incident'
  freeRoamProgress: Record<string, boolean>

  // Guided Walkthrough State Properties
  currentScenarioIndex: number
  guidedMode: 'step' | 'reflection' | 'scenario-intro'
  completedInstructions: Record<string, string[]>  // stepId -> completed instructionId list
  reflectionAnswers: Record<string, string | number> // microPromptId -> value
}

interface AppState extends SessionState, UIState {
  // Session actions
  setSession: (data: Partial<SessionState>) => void
  setScreen: (screenId: string) => void
  setPaused: (paused: boolean) => void
  toggleViewAsUser: () => void
  setStepIndex: (index: number) => void
  nextStep: () => void
  prevStep: () => void
  setModeratorNotes: (notes: string) => void
  setShowNudgeText: (show: boolean) => void
  setSimulatedCohort: (cohort: 'jane' | 'grace' | 'legal' | 'clinician' | null) => void
  setOnboardingComplete: (complete: boolean) => void
  setChecklistState: (data: Partial<Pick<UIState, 'chatMessagesCount' | 'chatInputText' | 'journalTextContent' | 'clickedAnnotations' | 'incidentNotes' | 'isIncidentsRequested' | 'isJournalsRequested' | 'providerChatCount' | 'providerNotesCount' | 'letGoButtonClicked'>>) => void
  
  // Free Roam actions
  setFreeRoamTab: (tab: UIState['freeRoamTab']) => void
  setFreeRoamResourceTab: (tab: UIState['freeRoamResourceTab']) => void
  setFreeRoamJournalTab: (tab: UIState['freeRoamJournalTab']) => void
  setFreeRoamProgress: (id: string, value: boolean) => void

  // Guided Walkthrough Actions
  markInstructionComplete: (stepId: string, instructionId: string) => void
  recordMicroPromptAnswer: (promptId: string, value: string | number) => void
  resetGuidedProgress: () => void
  setScenarioIndex: (index: number) => void
  setGuidedMode: (mode: 'step' | 'reflection' | 'scenario-intro') => void
  restartToScenario1: () => void

  // Full reset
  reset: () => void
}

const initialSessionState: SessionState = {
  sessionId: null,
  nickname: '',
  inviteCode: '',
  cohort: null,
  scenarioId: null,
  startedAt: null,
  consentedAt: null,
  guidedCompletedAt: null,
  freeRoamStartedAt: null,
  completedAt: null,
  endedEarly: false,
  userAgent: null,
  viewportWidth: null,
  isModerated: false,
}

const initialUIState: UIState = {
  currentScreen: 'welcome',
  isPaused: false,
  viewAsUser: false,
  currentStepIndex: 0,
  moderatorNotes: '',
  showNudgeText: false,
  simulatedCohort: null,
  onboardingComplete: localStorage.getItem('grace_onboarding_complete') === 'true',

  // Checklist defaults
  chatMessagesCount: 0,
  chatInputText: '',
  journalTextContent: '',
  clickedAnnotations: [],
  incidentNotes: '',
  isIncidentsRequested: false,
  isJournalsRequested: false,
  providerChatCount: 0,
  providerNotesCount: 0,
  letGoButtonClicked: false,

  // Free Roam defaults
  freeRoamTab: 'home',
  freeRoamResourceTab: 'stories',
  freeRoamJournalTab: 'reflective',
  freeRoamProgress: {},

  // Guided walkthrough defaults
  currentScenarioIndex: 0,
  guidedMode: 'step',
  completedInstructions: {},
  reflectionAnswers: {},
}

export const useStore = create<AppState>((set) => ({
  ...initialSessionState,
  ...initialUIState,

  setSession: (data) => set((state) => {
    let simulatedCohort = state.simulatedCohort
    if (data.cohort === 'lawyer') simulatedCohort = 'legal'
    else if (data.cohort === 'clinician') simulatedCohort = 'clinician'
    
    return {
      ...state,
      ...data,
      ...(data.cohort ? { simulatedCohort } : {})
    }
  }),

  setScreen: (screenId) => set({ currentScreen: screenId }),

  setPaused: (paused) => set({ isPaused: paused }),

  toggleViewAsUser: () => set((state) => ({ viewAsUser: !state.viewAsUser })),

  setStepIndex: (index) => set({ currentStepIndex: index }),

  nextStep: () => set((state) => {
    const session = state.scenarioId ? getSessionConfig(state.scenarioId) : null
    if (!session) return {}

    const currentScenario = session.scenarios[state.currentScenarioIndex]
    if (!currentScenario) return {}

    // 1. If currently in 'scenario-intro' mode, transition to first step of scenario
    if (state.guidedMode === 'scenario-intro') {
      return {
        guidedMode: 'step',
        currentStepIndex: 0
      }
    }

    // 2. If in 'step' mode
    if (state.guidedMode === 'step') {
      // Check if there are more steps in current scenario
      if (state.currentStepIndex < currentScenario.steps.length - 1) {
        return {
          currentStepIndex: state.currentStepIndex + 1
        }
      }

      // No more steps. Does this scenario have an end-of-scenario reflection?
      if (currentScenario.reflection) {
        return {
          guidedMode: 'reflection'
        }
      }

      // No reflection. Try to advance to the next scenario
      const nextScenarioIndex = state.currentScenarioIndex + 1
      if (nextScenarioIndex < session.scenarios.length) {
        const nextScenario = session.scenarios[nextScenarioIndex]
        return {
          currentScenarioIndex: nextScenarioIndex,
          currentStepIndex: 0,
          guidedMode: nextScenario.description ? 'scenario-intro' : 'step'
        }
      }

      // No more scenarios. Check for post-session reflection
      if (session.postSessionReflection) {
        return {
          guidedMode: 'reflection',
          currentScenarioIndex: session.scenarios.length
        }
      }

      // Finished!
      return {
        guidedCompletedAt: new Date()
      }
    }

    // 3. If in 'reflection' mode
    if (state.guidedMode === 'reflection') {
      const isPostSession = state.currentScenarioIndex === session.scenarios.length
      if (isPostSession) {
        return {
          guidedCompletedAt: new Date()
        }
      }

      // It was a scenario reflection. Move to next scenario
      const nextScenarioIndex = state.currentScenarioIndex + 1
      if (nextScenarioIndex < session.scenarios.length) {
        const nextScenario = session.scenarios[nextScenarioIndex]
        return {
          currentScenarioIndex: nextScenarioIndex,
          currentStepIndex: 0,
          guidedMode: nextScenario.description ? 'scenario-intro' : 'step'
        }
      }

      // Check for post-session reflection
      if (session.postSessionReflection) {
        return {
          guidedMode: 'reflection',
          currentScenarioIndex: session.scenarios.length
        }
      }

      // Finished!
      return {
        guidedCompletedAt: new Date()
      }
    }

    return {}
  }),

  prevStep: () => set((state) => {
    const session = state.scenarioId ? getSessionConfig(state.scenarioId) : null
    if (!session) return {}

    // 1. If in post-session reflection
    if (state.guidedMode === 'reflection' && state.currentScenarioIndex === session.scenarios.length) {
      const lastScenarioIndex = session.scenarios.length - 1
      const lastScenario = session.scenarios[lastScenarioIndex]
      if (lastScenario.reflection) {
        return {
          currentScenarioIndex: lastScenarioIndex,
          guidedMode: 'reflection'
        }
      } else {
        return {
          currentScenarioIndex: lastScenarioIndex,
          currentStepIndex: lastScenario.steps.length - 1,
          guidedMode: 'step'
        }
      }
    }

    const currentScenario = session.scenarios[state.currentScenarioIndex]
    if (!currentScenario) return {}

    // 2. If in reflection mode for a scenario
    if (state.guidedMode === 'reflection') {
      return {
        guidedMode: 'step',
        currentStepIndex: currentScenario.steps.length - 1
      }
    }

    // 3. If in scenario-intro mode
    if (state.guidedMode === 'scenario-intro') {
      const prevScenarioIndex = state.currentScenarioIndex - 1
      if (prevScenarioIndex >= 0) {
        const prevScenario = session.scenarios[prevScenarioIndex]
        if (prevScenario.reflection) {
          return {
            currentScenarioIndex: prevScenarioIndex,
            guidedMode: 'reflection'
          }
        } else {
          return {
            currentScenarioIndex: prevScenarioIndex,
            currentStepIndex: prevScenario.steps.length - 1,
            guidedMode: 'step'
          }
        }
      }
      return {}
    }

    // 4. If in step mode
    if (state.guidedMode === 'step') {
      if (state.currentStepIndex > 0) {
        return {
          currentStepIndex: state.currentStepIndex - 1
        }
      }

      // We are at step 0. Go back to previous scenario
      const prevScenarioIndex = state.currentScenarioIndex - 1
      if (prevScenarioIndex >= 0) {
        const prevScenario = session.scenarios[prevScenarioIndex]
        if (prevScenario.reflection) {
          return {
            currentScenarioIndex: prevScenarioIndex,
            guidedMode: 'reflection'
          }
        } else {
          return {
            currentScenarioIndex: prevScenarioIndex,
            currentStepIndex: prevScenario.steps.length - 1,
            guidedMode: 'step'
          }
        }
      }
    }

    return {}
  }),

  setModeratorNotes: (notes) => set({ moderatorNotes: notes }),

  setShowNudgeText: (show) => set({ showNudgeText: show }),

  setSimulatedCohort: (cohort) => set({ simulatedCohort: cohort }),

  setOnboardingComplete: (complete) => {
    localStorage.setItem('grace_onboarding_complete', complete ? 'true' : 'false')
    set({ onboardingComplete: complete })
  },

  setChecklistState: (data) => set((state) => ({ ...state, ...data })),

  setFreeRoamTab: (tab) => set({ freeRoamTab: tab }),
  setFreeRoamResourceTab: (tab) => set({ freeRoamResourceTab: tab }),
  setFreeRoamJournalTab: (tab) => set({ freeRoamJournalTab: tab }),
  setFreeRoamProgress: (id, value) => set((state) => ({
    freeRoamProgress: { ...state.freeRoamProgress, [id]: value }
  })),
  setFreeRoamState: (data: Partial<UIState>) => set((state) => ({ ...state, ...data })),

  markInstructionComplete: (stepId, instructionId) => set((state) => {
    const list = state.completedInstructions[stepId] ?? []
    if (list.includes(instructionId)) return {}
    return {
      completedInstructions: {
        ...state.completedInstructions,
        [stepId]: [...list, instructionId]
      }
    }
  }),

  recordMicroPromptAnswer: (promptId, value) => set((state) => ({
    reflectionAnswers: {
      ...state.reflectionAnswers,
      [promptId]: value
    }
  })),

  resetGuidedProgress: () => set({
    currentScenarioIndex: 0,
    currentStepIndex: 0,
    guidedMode: 'step',
    completedInstructions: {},
    reflectionAnswers: {},
  }),

  setScenarioIndex: (index) => set({ currentScenarioIndex: index }),

  setGuidedMode: (mode) => set({ guidedMode: mode }),

  restartToScenario1: () => set((state) => {
    const session = state.scenarioId ? getSessionConfig(state.scenarioId) : null
    if (!session) return {}
    const scenario1 = session.scenarios[1]
    const mode = scenario1?.description ? 'scenario-intro' : 'step'
    return {
      currentScenarioIndex: 1,
      currentStepIndex: 0,
      guidedMode: mode,
      completedInstructions: {},
      reflectionAnswers: {},

      // Reset checklist/interactive elements state
      chatMessagesCount: 0,
      chatInputText: '',
      journalTextContent: '',
      clickedAnnotations: [],
      incidentNotes: '',
      isIncidentsRequested: false,
      isJournalsRequested: false,
      providerChatCount: 0,
      providerNotesCount: 0,
      letGoButtonClicked: false,

      // Reset session state
      isPaused: false,
      guidedCompletedAt: null,
      freeRoamStartedAt: null
    }
  }),

  reset: () => set({
    ...initialSessionState,
    ...initialUIState,
  }),
}))

// Reactive Selector Helpers
export function getCurrentStep(state: AppState): GuidedStepConfig | null {
  const session = state.scenarioId ? getSessionConfig(state.scenarioId) : null
  if (!session) return null
  const scenario = session.scenarios[state.currentScenarioIndex]
  if (!scenario) return null
  if (state.guidedMode !== 'step') return null
  return scenario.steps[state.currentStepIndex] || null
}

export function getCurrentReflection(state: AppState): ScenarioReflection | null {
  const session = state.scenarioId ? getSessionConfig(state.scenarioId) : null
  if (!session) return null
  if (state.guidedMode !== 'reflection') return null

  if (state.currentScenarioIndex === session.scenarios.length) {
    return session.postSessionReflection || null
  }

  const scenario = session.scenarios[state.currentScenarioIndex]
  return scenario?.reflection || null
}

export function canAdvance(state: AppState): boolean {
  const step = getCurrentStep(state)
  if (!step) return true // If not in step mode, we can always advance manually

  if (step.advanceOn.type === 'manual_next') return true

  if (step.advanceOn.type === 'all_instructions_done') {
    const completed = state.completedInstructions[step.id] ?? []
    return (step.instructionSteps ?? []).every(ins => completed.includes(ins.id))
  }

  return false
}

export function canContinueReflection(state: AppState): boolean {
  const reflection = getCurrentReflection(state)
  if (!reflection) return true

  return reflection.microPrompts.every(p => {
    if (p.required === false) return true
    const answer = state.reflectionAnswers[p.id]
    if (answer === undefined || answer === null) return false
    if (typeof answer === 'string' && answer.trim() === '') return false
    return true
  })
}
