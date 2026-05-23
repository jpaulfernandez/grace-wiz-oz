import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, MessageSquare, BookOpen, AlertOctagon, Heart, ChevronRight, Check, ShieldAlert, Unlock, CheckCircle2, Calendar, Paperclip, FileText } from 'lucide-react'
import { useStore, getCurrentStep } from '../lib/store'
import { useGuidedTour } from '../lib/useGuidedTour'
import { FrameWrapper } from '../components/layout/FrameWrapper'
import { telemetry, EventTypes } from '../lib/telemetry'
import { getSessionConfig } from '../config/sidePanel'
import { Button } from '../components/ui'
import { OnboardingWalkthrough } from '../components/layout/OnboardingWalkthrough'

// Custom chrome components
import { BottomNav } from '../components/chrome/BottomNav'
import { ScreenHeader } from '../components/chrome/ScreenHeader'

// Chat components
import { ChatMessage } from '../components/chat/ChatMessage'
import { ChatInput } from '../components/chat/ChatInput'
import { HandoffChips, HandoffAction } from '../components/chat/HandoffChips'
import { TypingIndicator } from '../components/chat/TypingIndicator'

// Scripted chat hook
import { useScriptedChat } from '../lib/scriptedChat'

// Preloaded content for Scenario C, D, E
import {
  SCENARIO_C_JOURNAL_SEGMENTS,
  SCENARIO_C_ANNOTATIONS,
  SCENARIO_D_PROMPTS,
  SCENARIO_E_INCIDENT_DATA,
  IncidentFields
} from '../config/preloadedContent'

export default function Guided() {
  const navigate = useNavigate()
  const {
    scenarioId,
    currentStepIndex,
    nickname,
    setScreen,
    cohort,
    guidedMode,
    completedInstructions,
    markInstructionComplete
  } = useStore()

  const currentStep = useStore(getCurrentStep)
  const { advanceTour } = useGuidedTour()
  const session = scenarioId ? getSessionConfig(scenarioId) : null
  const steps = session ? (session.scenarios.flatMap(s => s.steps)) : []

  // Dynamic scenario key mapping based on step
  const scenarioKey = (currentStep?.id === 'scenario-b-chat' || currentStep?.id === 'combined-scenario-b-chat') ? 'scenario-b' : 'scenario-a'

  // Handoff bridge carry-over summary
  const [carryOverSummary, setCarryOverSummary] = useState<string | null>(null)
  const [showTransitionLoader, setShowTransitionLoader] = useState(false)

  // Journal writing text
  const [journalText, setJournalText] = useState('')

  // Guided completed check
  const [guidedFinished, setGuidedFinished] = useState(false)

  // Booking details state

  const currentScenarioIndex = useStore(state => state.currentScenarioIndex)
  const canPrevWalkthrough = currentScenarioIndex > 0 || currentStepIndex > 0 || guidedMode !== 'step'

  const triggerAdvanceWithModalCheck = () => {
    advanceTour()
  }



  // Message scroll control
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Provider Guided Scenarios State
  const [isRequestingIncidents, setIsRequestingIncidents] = useState(false)
  const [isRequestingJournals, setIsRequestingJournals] = useState(false)
  const [isPendingIncidents, setIsPendingIncidents] = useState(false)
  const [isPendingJournals, setIsPendingJournals] = useState(false)

  const [providerChatMessages, setProviderChatMessages] = useState<{ sender: 'provider' | 'ai'; text: string; citations?: string[] }[]>([])
  const [providerNotes, setProviderNotes] = useState<string[]>([])
  const [currentProviderNote, setCurrentProviderNote] = useState('')
  const [providerNotesSaved, setProviderNotesSaved] = useState(false)

  useEffect(() => {
    if (cohort === 'lawyer') {
      setProviderNotes([
        'Note 1 (May 23, 10:00 AM): Redacted intake overview matches RA 11313 timeline criteria.',
        'Note 2 (May 23, 10:45 AM): Confirmed client shared incident log hashes correspond to verified ledger entries.',
        'Note 3 (May 23, 11:30 AM): Scheduled follow up advisory for face-to-face consultative review.'
      ])
      setProviderChatMessages([
        { sender: 'ai', text: 'Secure Pattern Retrieval engine active. Ask any questions about Jane\'s shared incident timeline or self-reported somatic logs. The engine will only respond based on what has been securely shared.' }
      ])
    } else if (cohort === 'clinician') {
      setProviderNotes([
        'Note 1 (May 23, 10:00 AM): Preloaded somatic logs confirm chronic fight/flight hyperarousal markers.',
        'Note 2 (May 23, 10:45 AM): Target intake grounding focus: vagal calming and diaphragmatic expansion.',
        'Note 3 (May 23, 11:30 AM): Somatic grounding exercise ready for intake consultation.'
      ])
      setProviderChatMessages([
        { sender: 'ai', text: 'Secure Somatic Retrieval engine active. Ask any questions about Grace\'s somatic tension events, breathing trends, or avoidance indicators.' }
      ])
    }
  }, [cohort])

  const [isProviderChatTyping, setIsProviderChatTyping] = useState(false)

  const handleSendProviderMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg = { sender: 'provider' as const, text }
    setProviderChatMessages(prev => [...prev, userMsg])
    setIsProviderChatTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let aiText = ''
      let citations: string[] = []

      const query = text.toLowerCase()
      if (cohort === 'lawyer') {
        if (query.includes('evidence') || query.includes('proof') || query.includes('witness')) {
          aiText = 'Based on Incident Log entries (May 14, May 19), evidence consists of a corroborating witness J. who observed avoidant exit from pantry counter, and physical boundary intrusion. No photo attachment is uploaded.'
          citations = ['Incident Log #3', 'Journal Entry #5']
        } else if (query.includes('timeline') || query.includes('chronology') || query.includes('dates')) {
          aiText = 'Timeline summary: 3 incidents logged. Chronology: May 14 (desk intrusion), May 19 (lobby blocking), May 23 (pantry intrusion). Consistent behavior modifications (avoiding elevator, walking 14 flights) logged concurrently.'
          citations = ['Incident Logs #1-3']
        } else if (query.includes('name') || query.includes('harass') || query.includes('law')) {
          aiText = 'AI Pattern Analysis retrieval: Client describes the coworker jokes as "green jokes". AI system identifies indicators corresponding to verbal sexual harassment under Safe Spaces Act (RA 11313). Client has not formally used the term "harassment" in personal journals, which matches trauma-informed restraint protocols.'
          citations = ['Journal Entry #2', 'Journal Entry #5']
        } else {
          aiText = 'I retrieve from the client\'s journal and incident log, and I flag pattern-of-conduct evidence relevant to RA 9262, RA 11313, and RA 8505. I do not provide legal advice. No other specific matches were retrieved in this scope.'
          citations = ['General Intake Analysis']
        }
      } else {
        // Clinician
        if (query.includes('somatic') || query.includes('tension') || query.includes('body')) {
          aiText = 'Somatic tracking indicates 3 instances of "chest tightening", 4 instances of "stomach knots", and 2 instances of "shallow breathing" associated with proximity to coworker Marco.'
          citations = ['Somatic Journals #1', 'Somatic Journal #3', 'Somatic Journal #4']
        } else if (query.includes('panic') || query.includes('anxiety') || query.includes('heart')) {
          aiText = 'Immediate somatic nervous response shows elevated heart rate, shallow breathing, and freezing reactions. Coping behaviors include flight modification (walking stairs, early exits).'
          citations = ['Clinical Logs #1', 'Clinical Log #2']
        } else if (query.includes('attachment') || query.includes('relationship') || query.includes('style')) {
          aiText = 'Self-reflection journal prompts show anxious-avoidant cues when managing boundaries. Focuses heavily on personal blame ("am I the problem?") rather than external threat naming.'
          citations = ['Somatic Journal #4', 'Somatic Journal #6']
        } else {
          aiText = 'I surface patterns from the client\'s writing. I do not diagnose. No additional somatic cues were identified in this query.'
          citations = ['General Clinical Intake']
        }
      }

      setProviderChatMessages(prev => [...prev, { sender: 'ai', text: aiText, citations }])
      setIsProviderChatTyping(false)
    }, 1200)
  }

  // Phase 4 specific states
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null)
  const [incidentAnythingElse, setIncidentAnythingElse] = useState('')
  const [showTimestampSpinner, setShowTimestampSpinner] = useState(false)
  const [incidentForm] = useState<IncidentFields>(SCENARIO_E_INCIDENT_DATA)

  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, string>>({
    'guided-q1': SCENARIO_D_PROMPTS[0].preloadedAnswer,
    'guided-q2': SCENARIO_D_PROMPTS[1].preloadedAnswer,
    'guided-q3': SCENARIO_D_PROMPTS[2].preloadedAnswer,
  })

  // Instantiate the WoZ state machine chat hook
  const {
    messages,
    isTyping,
    showHandoff,
    sendMessage,
    selectHandoff: handleSelectHandoff,
    suggestionPrompt
  } = useScriptedChat({
    scenarioKey,
    onComplete: () => {
      // Scenario A completed (Let go for now)
      triggerAdvanceWithModalCheck()
    },
    onJournalHandoff: (summary) => {
      // Transition loader animation then advance to journal
      setCarryOverSummary(summary)
      setJournalText(summary)
      setShowTransitionLoader(true)
      setTimeout(() => {
        setShowTransitionLoader(false)
        triggerAdvanceWithModalCheck()
      }, 2000)
    },
    onIncidentHandoff: (summary) => {
      // If they click Log Incident, we can set summary and advance
      setCarryOverSummary(summary)
      setIncidentAnythingElse(summary)
      setShowTransitionLoader(true)
      setTimeout(() => {
        setShowTransitionLoader(false)
        triggerAdvanceWithModalCheck()
      }, 2000)
    }
  })

  // Synchronize checklist state variables to store
  const setChecklistState = useStore((state) => state.setChecklistState)
  const selectHandoff = (action: 'log' | 'journal' | 'letgo') => {
    if (action === 'letgo') {
      setChecklistState({ letGoButtonClicked: true })
    }
    handleSelectHandoff(action)
  }
  const isPendingIncidentsVal = isPendingIncidents
  const isPendingJournalsVal = isPendingJournals

  useEffect(() => {
    setChecklistState({
      chatMessagesCount: messages.length,
      chatInputText: suggestionPrompt || '',
      journalTextContent: journalText,
      clickedAnnotations: activeAnnotationId ? [activeAnnotationId] : [],
      incidentNotes: incidentAnythingElse,
      isIncidentsRequested: isRequestingIncidents || isPendingIncidentsVal,
      isJournalsRequested: isRequestingJournals || isPendingJournalsVal,
      providerChatCount: providerChatMessages.length,
      providerNotesCount: providerNotes.length
    })
  }, [
    messages.length,
    suggestionPrompt,
    journalText,
    activeAnnotationId,
    incidentAnythingElse,
    isRequestingIncidents,
    isPendingIncidentsVal,
    isRequestingJournals,
    isPendingJournalsVal,
    providerChatMessages.length,
    providerNotes.length,
    setChecklistState
  ])

  // Auto-complete instructions reactively based on UI checklist variables
  const currentScreen = useStore(state => state.currentScreen)

  useEffect(() => {
    if (!currentStep || !currentStep.instructionSteps) return

    currentStep.instructionSteps.forEach(ins => {
      const isCompleted = completedInstructions[currentStep.id]?.includes(ins.id)
      if (isCompleted) return

      const rule = ins.completedWhen
      if (!rule) return

      let shouldComplete = false

      if (rule.type === 'input') {
        if (currentStep.id === 'journal-handoff' || currentStep.id === 'combined-journal-handoff') {
          if (ins.id === 'jh-write') {
            shouldComplete = journalText.trim().length > 0
          }
        }
        if (currentStep.id === 'scenario-e-log') {
          if (ins.id === 'sel-write') {
            shouldComplete = incidentAnythingElse.trim().length > 0
          }
        }
        if (currentStep.id === 'blank-journal' || currentStep.id === 'combined-blank-journal') {
          if (ins.id === 'bj-write') {
            shouldComplete = journalText.trim().length > 0
          }
        }
      }

      if (rule.type === 'route') {
        if (rule.screenId && currentScreen === rule.screenId) {
          shouldComplete = true
        }
      }

      // Check if it is a provider action
      if (cohort === 'lawyer' || cohort === 'clinician') {
        if (ins.id === 'la-request-incident' || ins.id === 'ca-request-incident') {
          shouldComplete = isRequestingIncidents || isPendingIncidents
        }
        if (ins.id === 'la-request-journal' || ins.id === 'ca-request-journal') {
          shouldComplete = isRequestingJournals || isPendingJournals
        }
        if (ins.id === 'la-read-all' || ins.id === 'ca-read-all') {
          shouldComplete = (isRequestingIncidents || isPendingIncidents) && (isRequestingJournals || isPendingJournals)
        }
        if (ins.id === 'lc-type-msg' || ins.id === 'cc-type-msg') {
          shouldComplete = providerChatMessages.length > 1
        }
        if (ins.id === 'lc-send-msg' || ins.id === 'cc-send-msg') {
          shouldComplete = providerChatMessages.length > 1
        }
        if (ins.id === 'ln-view-notes' || ins.id === 'cn-view-notes') {
          shouldComplete = providerNotes.length > 3
        }
        if (ins.id === 'ln-add-note' || ins.id === 'cn-add-note') {
          shouldComplete = providerNotes.length > 3
        }
      }

      if (shouldComplete) {
        markInstructionComplete(currentStep.id, ins.id)
        telemetry.track(EventTypes.INSTRUCTION_AUTO_COMPLETED, {
          stepId: currentStep.id,
          instructionId: ins.id
        })
      }
    })
  }, [
    currentStep,
    currentScreen,
    journalText,
    incidentAnythingElse,
    isRequestingIncidents,
    isPendingIncidents,
    isRequestingJournals,
    isPendingJournals,
    providerChatMessages.length,
    providerNotes.length,
    completedInstructions,
    markInstructionComplete,
    cohort
  ])

  const lastOffPathTimeRef = useRef<number>(0)

  // Event interception and auto-complete during guided scenarios
  useEffect(() => {
    if (!currentStep) return

    const handleGuidedClick = (e: MouseEvent) => {
      if (scenarioId === 'admin-freeroam') return

      const target = e.target as HTMLElement
      const isInsidePhone = target.closest('#phone-viewport')
      if (!isInsidePhone) return

      const isOverride = target.closest('.driver-popover') || target.closest('.driver-overlay') || target.closest('.onboarding-overlay')
      if (isOverride) return

      // Always allow input and textarea focus clicks to ensure smooth typing
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('input') || target.closest('textarea')) {
        return
      }

      // Always allow back button click or next button clicks inside custom screens
      if (target.closest('a[href="/guided"]') || target.closest('button.btn-back') || target.closest('#close-annotations-btn')) {
        return
      }

      // 1. Scan incomplete instruction steps for auto-complete tap rules
      const incomplete = currentStep.instructionSteps?.filter(ins => !(completedInstructions[currentStep.id] ?? []).includes(ins.id)) || []
      incomplete.forEach(ins => {
        const rule = ins.completedWhen
        if (rule && rule.type === 'tap' && rule.selector) {
          const matched = target.closest(rule.selector)
          if (matched) {
            markInstructionComplete(currentStep.id, ins.id)
            telemetry.track(EventTypes.INSTRUCTION_AUTO_COMPLETED, {
              stepId: currentStep.id,
              instructionId: ins.id
            })
          }
        }
      })

      // 2. Check for auto-advancing on tap if advanceOn matches
      if (currentStep.advanceOn.type === 'tap' && currentStep.advanceOn.selector) {
        const matched = target.closest(currentStep.advanceOn.selector)
        if (matched) {
          // Handoff chips manage their own delayed advancement via useScriptedChat
          if (['#let-go-btn', '#continue-journal-btn', '#log-incident-btn'].includes(currentStep.advanceOn.selector)) {
            return
          }
          advanceTour()
          return
        }
      }

      const allowed = currentStep.allowedSelectors || []
      let isAllowed = false

      for (const selector of allowed) {
        try {
          if (selector.startsWith('[id^=annotation-]')) {
            if (target.closest('[id^=annotation-]')) {
              isAllowed = true
              break
            }
          }
          const allowedElements = Array.from(document.querySelectorAll(selector))
          if (allowedElements.some(el => el.contains(target) || el === target)) {
            isAllowed = true
            break
          }
        } catch (err) {
          console.error(err)
        }
      }

      if (!isAllowed && allowed.length > 0) {
        e.preventDefault()
        e.stopPropagation()

        const now = Date.now()
        const diff = now - lastOffPathTimeRef.current

        if (diff < 3000) {
          // Stage 2: Re-trigger spotlight highlight overlay
          lastOffPathTimeRef.current = 0
          telemetry.track(EventTypes.TOUR_OFF_PATH, { step_id: currentStep.id, clicked_element: target.tagName, stage: 2 })
            ; (window as any).graceTriggerHelp?.()
        } else {
          // Stage 1: Pulse active incomplete checklist row
          lastOffPathTimeRef.current = now
          telemetry.track(EventTypes.TOUR_OFF_PATH, { step_id: currentStep.id, clicked_element: target.tagName, stage: 1 })

          const nextIncomplete = incomplete.find(ins => ins.selector)
          if (nextIncomplete) {
            const row = document.getElementById(`checklist-item-${nextIncomplete.id}`)
            if (row) {
              row.classList.add('animate-pulse-row')
              setTimeout(() => row.classList.remove('animate-pulse-row'), 800)
            }
          }
        }
      }
    }

    document.addEventListener('click', handleGuidedClick, true)
    return () => {
      document.removeEventListener('click', handleGuidedClick, true)
    }
  }, [currentStep, scenarioId, completedInstructions, markInstructionComplete])

  // Pre-fill carryOverSummary if user jumps directly to journal-handoff for testing
  useEffect(() => {
    if (currentStep?.id === 'journal-handoff' && !carryOverSummary) {
      const fallbackSummary = `You've been feeling anxious going into work because of sexual jokes made by your workmate. The anxiety causes tightness in your chest. The joke occurred today and you had to sit through a meeting afterwards.`
      setCarryOverSummary(fallbackSummary)
      if (!journalText) {
        setJournalText(fallbackSummary)
      }
    }
  }, [currentStep?.id, carryOverSummary, journalText])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const guidedCompletedAt = useStore(state => state.guidedCompletedAt)

  useEffect(() => {
    if (guidedCompletedAt) {
      setGuidedFinished(true)
    } else {
      setGuidedFinished(false)
    }
  }, [guidedCompletedAt])

  // Synchronize screen state in telemetry on step transition
  useEffect(() => {
    if (currentStep) {
      setScreen(currentStep.screenId)
    }
  }, [currentStep, setScreen])

  // Auto-advance for breathing reminder
  useEffect(() => {
    if (currentStep?.screenId === 'breath-reminder') {
      const timer = setTimeout(() => {
        triggerAdvanceWithModalCheck()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentStep?.id])

  const handleManualNext = () => {
    if (currentStepIndex < steps.length - 1) {
      triggerAdvanceWithModalCheck()
    } else {
      setGuidedFinished(true)
      telemetry.track(EventTypes.SESSION_COMPLETED, { partial: false })
    }
  }

  const handleManualPrev = () => {
    if (currentStepIndex > 0) {
      useStore.getState().prevStep()
    }
  }

  const handleSaveJournal = () => {
    telemetry.track(EventTypes.JOURNAL_SAVE, { char_count: journalText.length })
    triggerAdvanceWithModalCheck()
  }

  const handleSaveIncident = () => {
    setShowTimestampSpinner(true)
    setTimeout(() => {
      setShowTimestampSpinner(false)
      telemetry.track(EventTypes.INCIDENT_SAVE, {
        char_count: (SCENARIO_E_INCIDENT_DATA.whatHappened + incidentAnythingElse).length
      })
      triggerAdvanceWithModalCheck()
    }, 600)
  }

  const handleStartFreeRoam = () => {
    const now = new Date()
    useStore.setState({
      guidedCompletedAt: now,
      freeRoamStartedAt: now,
      currentScreen: 'free-roam-home'
    })
    telemetry.track(EventTypes.FREE_ROAM_START, {})
    navigate('/survey') // Route to ending evaluation survey
  }

  // Helper to resolve active tab based on active guided screen
  const getActiveTab = () => {
    if (!currentStep) return 'companion'
    if (
      currentStep.screenId.startsWith('journal') ||
      currentStep.screenId === 'post-save-offers' ||
      currentStep.screenId === 'breath-reminder'
    ) {
      return 'journal'
    }
    if (
      currentStep.screenId === 'incident-log' ||
      currentStep.screenId === 'hash-receipt' ||
      currentStep.screenId === 'incident-post-save-offers'
    ) {
      return 'incident'
    }
    return 'companion'
  }

  // Handle bottom navigation taps within guided context
  const handleTabChange = (tabId: 'companion' | 'journal' | 'incident' | 'more') => {
    telemetry.trackButtonTap(`nav-${tabId}-btn`)
    // Advance tour if currently waiting for a tab change
    if (
      currentStep?.advanceOn?.type === 'tap' &&
      currentStep.advanceOn.selector === `#nav-${tabId}-btn`
    ) {
      advanceTour()
    }
  }

  // Renders the correct inner app screen depending on step's screenId
  const renderInnerContent = () => {
    if (showTransitionLoader) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white h-full select-none">
          <div className="space-y-4">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-base font-newsreader font-medium text-on-surface">Carrying this over...</p>
            <p className="text-xs font-inter text-text-muted">Synthesizing somatic cues securely</p>
          </div>
        </div>
      )
    }

    if (showTimestampSpinner) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white h-full select-none">
          <div className="space-y-4">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-base font-newsreader font-medium text-on-surface">Timestamping...</p>
            <p className="text-xs font-inter text-text-muted">Securing entry fingerprint to blockchain authority</p>
          </div>
        </div>
      )
    }

    if (guidedFinished) {
      return (
        <div className="flex-1 flex flex-col p-6 text-center bg-white h-full justify-between select-none">
          <div className="my-auto space-y-6 max-w-[320px] mx-auto">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-medium font-newsreader text-on-surface">
              Orientation complete
            </h2>
            <p className="text-sm font-inter text-text-secondary leading-relaxed">
              Excellent job, {nickname || 'Jane'}! You've successfully finished the guided orientation scenarios. You can now transition to the final evaluation survey.
            </p>
          </div>
          <div className="w-full space-y-3 pt-6 border-t border-border-divider mt-auto">
            <Button variant="primary" className="w-full" onClick={handleStartFreeRoam}>
              Proceed to Evaluation
            </Button>
          </div>
        </div>
      )
    }

    if (!currentStep) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 bg-white h-full">
          <p className="text-sm font-inter text-text-muted">Loading scenario steps...</p>
        </div>
      )
    }

    switch (currentStep.screenId) {
      case 'guided-home':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none">
            <ScreenHeader title="A space to breathe." />

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="py-2">
                <p className="text-sm font-inter text-text-secondary">Welcome back, {nickname || 'there'}.</p>
              </div>

              {/* Home Selection cards */}
              <div className="space-y-4">
                <button
                  id="companion-card"
                  onClick={() => {
                    telemetry.trackButtonTap('companion-card')
                  }}
                  className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group"
                >
                  <div className="p-3 bg-primary-container text-primary rounded-input group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <MessageSquare className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium font-inter text-on-surface mb-0.5">
                      Companion
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Chat safely with a virtual companion to process somatic stress.
                    </p>
                  </div>
                </button>

                <button
                  id="journal-card"
                  onClick={() => {
                    telemetry.trackButtonTap('journal-card')
                  }}
                  className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group"
                >
                  <div className="p-3 bg-secondary-container text-secondary rounded-input group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <BookOpen className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium font-inter text-on-surface mb-0.5">
                      Reflective Journal
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Secure, unguided free writing space to write your own story.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'companion-chat':
        return (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            <ScreenHeader title="A space to think." />

            {/* Messages scrolling stack */}
            <div className="flex-1 overflow-y-auto py-4 bg-background min-h-0 flex flex-col">
              <div className="flex-1" />
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  sender={msg.sender}
                  text={msg.text}
                  timestamp={msg.timestamp}
                />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Conditional input / handoff chips rendering */}
            {showHandoff ? (
              <HandoffChips
                onSelect={(action: HandoffAction) => selectHandoff(action)}
                disabled={isTyping}
              />
            ) : (
              <ChatInput
                onSend={(text) => sendMessage(text)}
                disabled={isTyping}
                suggestion={suggestionPrompt}
              />
            )}

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'journal-editor':
        return (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            <ScreenHeader
              title="Reflective Journal"
              rightAction={
                <button
                  id="save-journal-btn"
                  onClick={handleSaveJournal}
                  className="px-4 py-1.5 bg-primary text-white rounded-input text-xs font-inter font-medium hover:bg-opacity-90 transition-colors shadow-sm focus:outline-none"
                >
                  Save entry
                </button>
              }
            />

            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
              {/* Carry-over Summary Card */}
              {carryOverSummary && (
                <div className="m-6 p-4 bg-[#EDE7F6]/60 border border-primary/20 rounded-card relative select-none animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-[10px] font-mono tracking-wider uppercase text-primary mb-1">
                        From your chat (not saved with entry)
                      </span>
                      <p className="text-xs font-inter text-on-surface-variant leading-relaxed">
                        {carryOverSummary}
                      </p>
                    </div>
                    <button
                      onClick={() => setCarryOverSummary(null)}
                      className="p-1 -mr-1 -mt-1 text-text-muted hover:text-on-surface transition-colors"
                      aria-label="Clear summary"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}

              {/* Fullscreen editor input */}
              <div className="flex-1 px-6 pb-6">
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Start typing what is on your mind... This entry is private and stored only on your device."
                  className="w-full h-full text-sm font-inter leading-relaxed text-on-surface placeholder:text-text-muted resize-none focus:outline-none bg-transparent border-0 p-0"
                />
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'breath-reminder':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white h-full select-none animate-fade-in">
            <div className="space-y-8 flex flex-col items-center">
              {/* Animated breathing circles */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="w-20 h-20 bg-primary/25 border border-primary/30 rounded-full flex items-center justify-center animate-pulse" style={{ animationDuration: '2s' }}>
                  <div className="w-10 h-10 bg-primary/45 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-newsreader font-medium text-on-surface">Take a breath.</h3>
                <p className="text-xs font-inter text-text-muted">Grounding somatic cues securely</p>
              </div>
            </div>
          </div>
        )

      case 'post-save-offers':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none">
            <ScreenHeader title="Saved." />

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Core saved feedback card */}
              <div className="p-5 bg-white border border-border-divider rounded-card text-center space-y-3">
                <div className="w-10 h-10 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-newsreader font-medium text-on-surface">
                  Your writing is safe.
                </h3>
                <p className="text-xs font-inter text-text-secondary leading-relaxed">
                  No gamification, no analysis, no pressure. What you write next is yours alone.
                </p>
              </div>

              {/* Reflection pathways */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  Reflection Options
                </span>

                <button
                  id="just-save-btn"
                  onClick={advanceTour}
                  className="w-full p-4 bg-white border border-border-divider text-left rounded-card hover:bg-background-hover transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-xs font-inter font-medium text-on-surface-variant">Just save it</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </button>

                <div className="w-full p-4 bg-white border border-border-divider text-left rounded-card opacity-60 flex items-center justify-between">
                  <span className="text-xs font-inter text-on-surface-variant">Read it back to me</span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </div>

                <button
                  id="help-notice-patterns-btn"
                  onClick={advanceTour}
                  className="w-full p-4 bg-white border border-primary text-left rounded-card hover:bg-primary-container/20 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs font-inter text-primary font-medium">Help me notice patterns</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* Soft offers row */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  Soft Offers
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white border border-border-divider rounded-card text-center space-y-2 opacity-80">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center mx-auto text-xs font-medium">2m</div>
                    <span className="block text-xs font-inter font-medium text-on-surface">A quick pause</span>
                    <span className="block text-[10px] font-inter text-text-muted leading-tight">Simple breathing card</span>
                  </div>

                  <div className="p-4 bg-white border border-border-divider rounded-card text-center space-y-2 opacity-80">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center mx-auto">
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <span className="block text-xs font-inter font-medium text-on-surface">Options pathways</span>
                    <span className="block text-[10px] font-inter text-text-muted leading-tight">See what's out there</span>
                  </div>
                </div>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'journal-annotations':
        return (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            <ScreenHeader
              title="Patterns surfed"
              rightAction={
                <button
                  id="close-annotations-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('close-annotations-btn')
                    advanceTour()
                  }}
                  className="px-4 py-1.5 bg-primary text-white rounded-input text-xs font-inter font-medium hover:bg-opacity-90 transition-colors shadow-sm focus:outline-none"
                >
                  Close
                </button>
              }
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col min-h-0">
              <div className="p-4 bg-background border border-border-divider rounded-card text-xs font-inter text-text-secondary leading-relaxed">
                <p>
                  Grace analyzed your past entries in the background. Tap the highlighted words below to explore identified somatic sensations, witness details, or recurring behavioral patterns.
                </p>
              </div>

              {/* Editorial Journal Content */}
              <div className="flex-1 p-5 border border-border-divider bg-background/50 rounded-card font-newsreader text-base leading-relaxed text-on-surface">
                {SCENARIO_C_JOURNAL_SEGMENTS.map((segment, index) => {
                  if (segment.annotationId) {
                    const annotation = SCENARIO_C_ANNOTATIONS.find(a => a.id === segment.annotationId)
                    const isSelected = activeAnnotationId === segment.annotationId

                    let highlightClass = "underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer transition-colors px-0.5 "
                    if (annotation?.category === 'somatic') {
                      highlightClass += isSelected ? " bg-primary/20 text-primary decoration-primary" : " text-primary decoration-primary/60 hover:bg-primary/5"
                    } else if (annotation?.category === 'pattern') {
                      highlightClass += isSelected ? " bg-[#EDE7F6] text-[#673AB7] decoration-[#673AB7]" : " text-[#673AB7] decoration-[#673AB7]/60 hover:bg-[#EDE7F6]/5"
                    } else {
                      highlightClass += isSelected ? " bg-[#E8F5E9] text-[#2E7D32] decoration-[#2E7D32]" : " text-[#2E7D32] decoration-[#2E7D32]/60 hover:bg-[#E8F5E9]/5"
                    }

                    return (
                      <span
                        key={index}
                        id={`annotation-${segment.annotationId}`}
                        onClick={() => {
                          telemetry.track('micro_prompt_answer', { annotation_id: segment.annotationId })
                          setActiveAnnotationId(isSelected ? null : (segment.annotationId ?? null))
                        }}
                        className={highlightClass}
                      >
                        {segment.text}
                      </span>
                    )
                  }
                  return <span key={index}>{segment.text}</span>
                })}
              </div>

              {/* Dynamic Annotation Drawer card */}
              {activeAnnotationId && (() => {
                const annotation = SCENARIO_C_ANNOTATIONS.find(a => a.id === activeAnnotationId)
                if (!annotation) return null

                let categoryLabel = "Somatic sensation"
                let cardStyle = "bg-primary-container/20 border-primary/20 text-primary"
                if (annotation.category === 'pattern') {
                  categoryLabel = "Behavioral pattern"
                  cardStyle = "bg-[#EDE7F6]/40 border-[#673AB7]/20 text-[#673AB7]"
                } else if (annotation.category === 'witness') {
                  categoryLabel = "Potential witness"
                  cardStyle = "bg-[#E8F5E9]/40 border-[#2E7D32]/20 text-[#2E7D32]"
                }

                return (
                  <div className={`p-4 border rounded-card space-y-2 animate-fade-in ${cardStyle}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                        {categoryLabel}
                      </span>
                      <button
                        onClick={() => setActiveAnnotationId(null)}
                        className="text-text-muted hover:text-on-surface text-xs font-bold"
                      >
                        &times;
                      </button>
                    </div>
                    <p className="text-xs font-inter leading-relaxed text-on-surface">
                      {annotation.note}
                    </p>
                  </div>
                )
              })()}
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'journal-modes':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none">
            <ScreenHeader title="How do you want to write?" />

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="py-2">
                <p className="text-xs font-inter text-text-secondary leading-relaxed">
                  Select a reflection interface. You can change modes at any point—no features are locked.
                </p>
              </div>

              {/* Mode list */}
              <div className="space-y-4">
                <div
                  className="w-full text-left p-5 bg-white border border-border-divider rounded-card shadow-sm flex items-start space-x-4 opacity-40 cursor-not-allowed"
                >
                  <div className="p-3 bg-secondary-container text-secondary rounded-input">
                    <BookOpen className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium font-inter text-on-surface mb-0.5">
                      Free flow
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Just write. Unstructured, raw journaling.
                    </p>
                  </div>
                </div>

                <button
                  id="guided-journal-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('guided-mode-card')
                  }}
                  className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group"
                >
                  <div className="p-3 bg-primary-container text-primary rounded-input group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Sparkles className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium font-inter text-on-surface mb-0.5">
                      Guided Mode
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Pennebaker prompted writing designed to process sensitive events.
                    </p>
                  </div>
                </button>

                <div
                  className="w-full text-left p-5 bg-white border border-border-divider rounded-card shadow-sm flex items-start space-x-4 opacity-40 cursor-not-allowed"
                >
                  <div className="p-3 bg-red-50 text-red-500 rounded-input">
                    <AlertOctagon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium font-inter text-on-surface mb-0.5">
                      Incident Log
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Structured, timestamped fields optimized for evidentiary weight.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'journal-guided-editor':
        return (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            <ScreenHeader
              title="Guided reflection"
              rightAction={
                <button
                  id="save-guided-btn"
                  onClick={() => {
                    telemetry.track(EventTypes.JOURNAL_SAVE, {
                      char_count: Object.values(guidedAnswers).join('').length,
                      prompted: true
                    })
                    advanceTour()
                  }}
                  className="px-4 py-1.5 bg-primary text-white rounded-input text-xs font-inter font-medium hover:bg-opacity-90 transition-colors shadow-sm focus:outline-none"
                >
                  Save entry
                </button>
              }
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col min-h-0">
              <div className="p-4 bg-[#EDE7F6]/30 border border-[#673AB7]/10 rounded-card text-xs font-inter text-text-secondary leading-relaxed">
                This structured Pennebaker guided exercise splits reflection into clear prompts. Feel free to review or edit the responses before saving.
              </div>

              {/* Prompt inputs */}
              <div className="space-y-5 flex-1">
                {SCENARIO_D_PROMPTS.map((prompt) => (
                  <div key={prompt.id} className="space-y-2">
                    <label className="block text-xs font-inter font-medium text-on-surface">
                      {prompt.question}
                    </label>
                    <textarea
                      value={guidedAnswers[prompt.id]}
                      onChange={(e) => setGuidedAnswers({ ...guidedAnswers, [prompt.id]: e.target.value })}
                      rows={3}
                      className="w-full text-xs font-inter leading-relaxed text-on-surface placeholder:text-text-muted resize-none bg-background border border-border-divider p-3 rounded-input focus:border-primary transition-colors focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'incident-log':
        return (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            <ScreenHeader
              title="Incident Log"
              rightAction={
                <span className="text-[10px] font-mono font-medium text-primary bg-primary-container px-2 py-1 rounded-full flex items-center select-none">
                  🔒 SECURE
                </span>
              }
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col min-h-0">
              {/* Security info card */}
              <div className="p-4 bg-background border border-border-divider rounded-card text-[11px] font-inter text-text-secondary leading-relaxed flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  Structured facts are locked and timestamped for legal admissibility. You can add extra details in the final field.
                </p>
              </div>

              {/* Form Fields Stack */}
              <div className="space-y-4 flex-1">
                {/* Date / Time */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value="November 23, 2026 — 2:30 PM"
                    readOnly
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface font-medium"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={incidentForm.location}
                    readOnly
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface font-medium"
                  />
                </div>

                {/* Who was present */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Who was present
                  </label>
                  <input
                    type="text"
                    value={incidentForm.who}
                    readOnly
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface font-medium"
                  />
                </div>

                {/* What happened */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Details of the event
                  </label>
                  <textarea
                    value={incidentForm.whatHappened}
                    readOnly
                    rows={4}
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface resize-none leading-relaxed"
                  />
                </div>

                {/* Direct quotes */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Direct quotes
                  </label>
                  <input
                    type="text"
                    value={incidentForm.quotes}
                    readOnly
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface font-medium"
                  />
                </div>

                {/* Witnesses */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Witnesses
                  </label>
                  <input
                    type="text"
                    value={incidentForm.witnesses}
                    readOnly
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface font-medium"
                  />
                </div>

                {/* Somatic feelings */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-inter font-medium text-text-secondary uppercase tracking-wider">
                    Physical/Somatic feelings
                  </label>
                  <input
                    type="text"
                    value={incidentForm.feltDuring}
                    readOnly
                    className="w-full text-xs font-inter bg-background border border-border-divider p-3 rounded-input outline-none cursor-not-allowed text-on-surface font-medium"
                  />
                </div>

                {/* Anything else (Editable) */}
                <div className="space-y-2 pt-2 border-t border-border-divider">
                  <label className="block text-xs font-inter font-semibold text-on-surface">
                    Anything else to add? (Optional)
                  </label>
                  <textarea
                    value={incidentAnythingElse}
                    onChange={(e) => setIncidentAnythingElse(e.target.value)}
                    placeholder="Enter any additional reflections, evidence details, or notes here..."
                    rows={3}
                    className="w-full text-xs font-inter leading-relaxed text-on-surface placeholder:text-text-muted resize-none focus:outline-none bg-background border border-border-divider p-3 rounded-input focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-border-divider">
                <Button
                  id="save-incident-btn"
                  variant="primary"
                  className="w-full shadow-sm flex items-center justify-center space-x-2"
                  onClick={handleSaveIncident}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Save incident securely</span>
                </Button>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'hash-receipt':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none animate-fade-in">
            <ScreenHeader
              title="Timestamp Proof"
              rightAction={
                <button
                  id="incident-receipt-next-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('incident-receipt-next-btn')
                    advanceTour()
                  }}
                  className="px-4 py-1.5 bg-primary text-white rounded-input text-xs font-inter font-medium hover:bg-opacity-90 transition-colors shadow-sm focus:outline-none"
                >
                  Next
                </button>
              }
            />

            <div className="flex-1 p-6 space-y-6 overflow-y-auto flex flex-col justify-center">
              <div className="text-center space-y-2">
                <h3 className="text-base font-newsreader font-medium text-on-surface">
                  Incident secured & verified
                </h3>
                <p className="text-xs font-inter text-text-secondary leading-relaxed">
                  Your incident log is frozen in time. A cryptographic fingerprint has been anchored so it cannot be altered or backdated.
                </p>
              </div>

              {/* QR Code receipt card */}
              <div className="p-5 bg-white border border-border-divider rounded-card shadow-sm space-y-4">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted text-center font-bold">
                  Grace Timestamp Authority
                </span>

                <div className="flex flex-col items-center space-y-3">
                  {/* Dummy QR Code */}
                  <div className="p-2 bg-white border border-border-divider rounded-input shadow-sm">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://grace.app/verify/85c8a06c&format=png&color=1a1a1a&bgcolor=ffffff"
                      alt="Verification QR Code"
                      width={140}
                      height={140}
                      className="rounded"
                    />
                  </div>

                  <div className="w-full font-mono text-[9px] bg-background border border-border-divider p-3 rounded-input text-on-surface-variant space-y-1 leading-relaxed text-left">
                    <p><strong>Time:</strong> 2026-05-23T14:30:08+08:00</p>
                    <p className="text-text-muted">Verify: grace.app/verify/85c8a06c</p>
                  </div>
                </div>

                <div className="text-[10px] font-inter text-text-muted text-center">
                  Scan QR to verify fingerprint • SHA-256 (256-bit)
                </div>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'incident-post-save-offers':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none animate-fade-in">
            <ScreenHeader title="What next?" />

            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              <div className="p-4 bg-white border border-border-divider rounded-card text-center space-y-2">
                <div className="w-8 h-8 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-inter font-semibold text-on-surface">Fingerprint anchored successfully</h4>
                <p className="text-[11px] font-inter text-text-secondary leading-relaxed">
                  Your record is secured and saved privately on this device. What would help you most right now?
                </p>
              </div>

              {/* Action options */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  Reflection Pathways
                </span>

                <button
                  onClick={() => telemetry.trackButtonTap('incident-offer-journal')}
                  className="w-full p-4 bg-white border border-border-divider text-left rounded-card opacity-50 cursor-not-allowed flex items-center justify-between"
                  disabled
                >
                  <span className="text-xs font-inter text-on-surface-variant font-medium">Journal about this incident</span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  External Pathways
                </span>

                <button
                  onClick={() => telemetry.trackButtonTap('incident-offer-call')}
                  className="w-full p-4 bg-white border border-border-divider text-left rounded-card opacity-50 cursor-not-allowed flex items-center justify-between"
                  disabled
                >
                  <span className="text-xs font-inter text-on-surface-variant font-medium">Call supportive services</span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </button>

                <button
                  onClick={() => telemetry.trackButtonTap('incident-offer-community')}
                  className="w-full p-4 bg-white border border-border-divider text-left rounded-card opacity-50 cursor-not-allowed flex items-center justify-between"
                  disabled
                >
                  <span className="text-xs font-inter text-on-surface-variant font-medium">Find community circles</span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {/* Do nothing option */}
              <div className="pt-2">
                <button
                  id="do-nothing-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('do-nothing-btn')
                    handleManualNext()
                  }}
                  className="w-full p-4 bg-white border border-primary text-left rounded-card hover:bg-primary-container/20 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs font-inter text-primary font-semibold">Do nothing for now</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'lawyer-dashboard':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
            <div>
              <h1 className="text-xl font-medium font-newsreader text-on-surface mb-1">
                Advocate Hub
              </h1>
              <p className="text-xs font-mono text-text-muted">Logged in as {nickname || 'Lawyer'}</p>
            </div>

            {/* Notification alert banner */}
            <button
              id="booking-notification"
              onClick={() => {
                telemetry.trackButtonTap('booking-notification')
                advanceTour()
              }}
              className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group"
            >
              <div className="p-3 bg-primary-container text-primary rounded-input group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium font-inter text-on-surface">
                    Request for Consultation - Jane
                  </h3>
                  <span className="px-2 py-0.5 bg-secondary-container text-secondary text-[10px] font-mono rounded-full font-medium">
                    1m ago
                  </span>
                </div>
                <p className="text-sm font-inter text-text-secondary leading-normal">
                  Jane has requested a legal consultation. Click to review the intake profile and secure evidence.
                </p>
              </div>
            </button>
          </div>
        )

      case 'lawyer-booking-detail':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Intake Details</h2>
              <p className="text-xs font-mono text-text-muted">Case ref: GRACE-L-01</p>
            </div>

            <div className="bg-white border border-border-divider rounded-card p-5 space-y-4">
              <div className="flex items-center space-x-3 text-text-secondary text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Requested Appt: <strong>Today, 3:00 PM</strong></span>
              </div>
              <div className="flex items-center space-x-3 text-text-secondary text-sm">
                <Paperclip className="w-4 h-4 text-primary" />
                <span>Verification State: <strong>Anchored (SHA-256 Authority)</strong></span>
              </div>
            </div>

            <div className="bg-white border border-border-divider rounded-card p-5 space-y-4">
              <h3 className="text-sm font-medium font-inter text-on-surface uppercase tracking-wider text-text-secondary">Client Profile</h3>

              <div className="space-y-2 mb-4 text-sm font-inter">
                <div className="flex">
                  <span className="w-24 text-text-muted">Name:</span>
                  <span className="font-medium">Jane Doe</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-text-muted">Location:</span>
                  <span className="font-medium">Metro Manila, Philippines</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-text-muted">Issue:</span>
                  <span className="font-medium">Seeking legal counsel for workplace harassment.</span>
                </div>
              </div>

              <h3 className="text-sm font-medium font-inter text-on-surface uppercase tracking-wider text-text-secondary pt-2 border-t border-border-divider">Synthesis</h3>

              <div className="redacted-profile-info space-y-3">
                <p className="text-sm font-inter text-text-secondary leading-relaxed blur-sm select-none">
                  The user's self-reported timeline outlines a series of workplace intrusions by coworker Marco matching gender-based hostile work environment criteria (RA 11313 - Safe Spaces Act).
                </p>
                <p className="text-xs font-mono text-text-muted italic bg-neutral-100 p-2 text-center rounded">
                  Client details are hidden to protect privacy. Accept the consultation request to reveal full context and request evidence access.
                </p>
              </div>
            </div>

            <Button
              id="accept-booking-btn"
              onClick={() => {
                telemetry.trackButtonTap('accept-booking-btn')
                advanceTour() // Move to next task (artifacts screen)
              }}
              variant="primary"
              className="w-full py-4 text-sm font-medium"
            >
              Accept Request
            </Button>
          </div>
        )

      case 'lawyer-artifacts':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Secure Client Data</h2>
              <p className="text-xs font-inter text-text-secondary leading-relaxed mt-2">
                This secure vault contains encrypted client logs. You must request permission from Jane to decrypt and review these artifacts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-border-divider rounded-card p-5 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-semibold text-on-surface font-inter">Incident Logs</h4>
                  <p className="text-xs text-text-secondary">3 chronological factsheets</p>
                  {isRequestingIncidents && (
                    <span className="inline-block text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-mono mt-1">Approved & Decrypted</span>
                  )}
                  {isPendingIncidents && (
                    <span className="inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono animate-pulse mt-1">Requesting client approval...</span>
                  )}
                  {!isRequestingIncidents && !isPendingIncidents && (
                    <span className="inline-block text-[10px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full font-mono mt-1">🔒 Redacted & Locked</span>
                  )}
                </div>
                {!isRequestingIncidents && !isPendingIncidents && (
                  <Button
                    id="request-incident-btn"
                    onClick={() => {
                      telemetry.trackButtonTap('request-incident-btn')
                      setIsPendingIncidents(true)
                      setTimeout(() => {
                        setIsPendingIncidents(false)
                        setIsRequestingIncidents(true)
                        if (isRequestingJournals) {
                          advanceTour()
                        }
                      }, 2000)
                    }}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    Request Access
                  </Button>
                )}
                {isRequestingIncidents && <Unlock className="w-5 h-5 text-green-600" />}
              </div>

              <div className="bg-white border border-border-divider rounded-card p-5 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-semibold text-on-surface font-inter">Somatic Journals</h4>
                  <p className="text-xs text-text-secondary">12 verbatim reflections</p>
                  {isRequestingJournals && (
                    <span className="inline-block text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-mono mt-1">Approved & Decrypted</span>
                  )}
                  {isPendingJournals && (
                    <span className="inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono animate-pulse mt-1">Requesting client approval...</span>
                  )}
                  {!isRequestingJournals && !isPendingJournals && (
                    <span className="inline-block text-[10px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full font-mono mt-1">🔒 Redacted & Locked</span>
                  )}
                </div>
                {!isRequestingJournals && !isPendingJournals && (
                  <Button
                    id="request-journal-btn"
                    onClick={() => {
                      telemetry.trackButtonTap('request-journal-btn')
                      setIsPendingJournals(true)
                      setTimeout(() => {
                        setIsPendingJournals(false)
                        setIsRequestingJournals(true)
                        if (isRequestingIncidents) {
                          advanceTour()
                        }
                      }, 2000)
                    }}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    Request Access
                  </Button>
                )}
                {isRequestingJournals && <Unlock className="w-5 h-5 text-green-600" />}
              </div>
            </div>

            {isRequestingIncidents && isRequestingJournals && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-inter rounded-input flex items-start space-x-2 animate-fade-in text-left">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
                <span>Verification Authority matches. Jane's complete incident logging database is successfully decrypted and ready for legal assessment.</span>
              </div>
            )}



            {isRequestingIncidents && isRequestingJournals && (
              <Button
                onClick={() => {
                  telemetry.trackButtonTap('artifacts-next')
                  handleManualNext()
                }}
                variant="primary"
                className="w-full animate-fade-in"
              >
                Continue to corpus chat &rarr;
              </Button>
            )}
          </div>
        )

      case 'lawyer-chat':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none">
            {/* Header */}
            <div className="p-4 border-b border-border-divider bg-white text-left">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Secured AI Retrieval</span>
              <h3 className="text-sm font-medium font-inter text-on-surface">Client Record Assistant</h3>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-secondary-container text-secondary text-[11px] leading-relaxed font-inter flex items-start space-x-2 text-left">
              <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span>You are asking questions about entries Jane wrote. The Companion only responds based on direct records and cites all evidence. You cannot message her from here.</span>
            </div>

            {/* Message log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
              {providerChatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'provider' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-input text-xs font-inter max-w-[80%] text-left ${msg.sender === 'provider'
                    ? 'bg-primary text-on-primary'
                    : 'bg-white border border-border-divider text-on-surface'
                    }`}>
                    {msg.text}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 justify-start">
                      {msg.citations.map((cite, cIdx) => (
                        <span key={cIdx} className="text-[9px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-300">
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isProviderChatTyping && (
                <div className="flex items-center space-x-2 p-3 bg-white border border-border-divider rounded-input text-xs font-mono text-text-muted max-w-[70%] text-left">
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Searching secure ledger...</span>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="p-3 bg-white border-t border-border-divider space-y-2 text-left">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Suggested Queries</p>
              <div className="flex flex-wrap gap-2">
                <button
                  id="chat-suggestion-timeline"
                  onClick={() => {
                    telemetry.trackButtonTap('provider-suggestion-timeline')
                    handleSendProviderMessage('Show me the timeline')
                    const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-chat-timeline' || i.id === 'ca-chat-timeline')
                    if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                  }}
                  className="text-[10px] font-inter font-medium text-primary hover:text-on-primary bg-primary-container/30 hover:bg-primary border border-primary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
                >
                  Show me the timeline
                </button>
                <button
                  id="chat-suggestion-evidence"
                  onClick={() => {
                    telemetry.trackButtonTap('provider-suggestion-evidence')
                    handleSendProviderMessage('What evidence is attached?')
                    const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-chat-evidence' || i.id === 'ca-chat-evidence')
                    if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                  }}
                  className="text-[10px] font-inter font-medium text-primary hover:text-on-primary bg-primary-container/30 hover:bg-primary border border-primary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
                >
                  What evidence is attached?
                </button>
                <button
                  id="chat-suggestion-named"
                  onClick={() => {
                    telemetry.trackButtonTap('provider-suggestion-named')
                    handleSendProviderMessage('Has she named what happened?')
                    const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-chat-named' || i.id === 'ca-chat-named')
                    if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                  }}
                  className="text-[10px] font-inter font-medium text-primary hover:text-on-primary bg-primary-container/30 hover:bg-primary border border-primary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
                >
                  Has she named what happened?
                </button>
              </div>
            </div>

            {/* Manual next bridge */}
            <div className="p-4 bg-white border-t border-border-divider">
              <Button
                onClick={() => {
                  telemetry.trackButtonTap('chat-next')
                  handleManualNext()
                }}
                variant="primary"
                className="w-full text-xs"
              >
                Proceed to case notes &rarr;
              </Button>
            </div>
          </div>
        )

      case 'lawyer-notes':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Intake Notes</h2>
              <p className="text-xs font-mono text-text-muted">Chronological case activity logs</p>
            </div>

            <div className="bg-primary-container/20 border border-primary-container rounded-card p-4 space-y-2">
              <h3 className="text-sm font-semibold text-primary font-inter flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Synthesis</span>
              </h3>
              <p className="text-xs font-inter text-text-secondary leading-relaxed">
                Based on incident logs and journals, indicators of {cohort === 'lawyer' ? 'RA 11313 (Safe Spaces Act)' : 'hyperarousal and somatic stress'} are present.
                <br /><br />
                <strong>Note:</strong> This is an AI-generated summary and should be reviewed by {cohort === 'lawyer' ? 'legal counsel' : 'a clinician'}.
              </p>
            </div>

            {/* Note logs */}
            <div className="space-y-3 bg-white border border-border-divider rounded-card p-4 max-h-[220px] overflow-y-auto">
              {providerNotes.map((note, index) => (
                <div key={index} className="text-xs font-inter border-b border-border-divider pb-2 last:border-b-0">
                  <p className="text-on-surface-variant leading-relaxed">{note}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="space-y-3">
              <label htmlFor="provider-note" className="text-xs font-medium font-inter text-on-surface uppercase tracking-wider text-text-secondary">Add intake note</label>
              <textarea
                id="provider-note"
                rows={3}
                value={currentProviderNote}
                onChange={(e) => setCurrentProviderNote(e.target.value)}
                placeholder="Type casework assessment or interview summary..."
                className="w-full border border-border-divider rounded-input p-3 font-inter text-xs bg-white focus:outline-none focus:border-primary resize-y"
              />
              <Button
                id="save-note-btn"
                disabled={!currentProviderNote.trim()}
                onClick={() => {
                  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  const noteContent = `Note (May 23, ${nowStr}): ${currentProviderNote}`
                  setProviderNotes(prev => [noteContent, ...prev])
                  telemetry.trackTextInput('provider_note_save', currentProviderNote)
                  setCurrentProviderNote('')
                  setProviderNotesSaved(true)
                  // Directly mark the save-note instruction as complete (provider screens are outside #phone-viewport)
                  const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-save-notes' || i.id === 'ca-save-notes')
                  if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                }}
                variant="primary"
                className="w-full"
              >
                Save casework note
              </Button>
            </div>

            {providerNotesSaved && (
              <Button
                id="notes-next-btn"
                onClick={() => {
                  telemetry.trackButtonTap('notes-next')
                  handleManualNext()
                }}
                variant="secondary"
                className="w-full"
              >
                Continue to certified export &rarr;
              </Button>
            )}
          </div>
        )

      case 'lawyer-export':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Evidence Export</h2>
                <p className="text-xs font-mono text-text-muted">Secure ledger certified payload</p>
              </div>

              {/* Embedded PDF */}
              <div className="bg-white border border-border-divider rounded-card overflow-hidden flex flex-col h-[80vh]">
                <div className="px-4 py-3 border-b border-border-divider flex items-center space-x-2 shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-on-surface font-inter">legal-export-sample.pdf</span>
                </div>
                <iframe
                  src="/legal-export-sample.pdf"
                  className="w-full flex-1 h-full border-0"
                  title="Legal Export PDF"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border-divider">
              <Button
                id="export-end-btn"
                onClick={() => {
                  telemetry.trackButtonTap('export-end-btn')
                  handleManualNext()
                }}
                variant="primary"
                className="w-full py-4 text-sm font-medium"
              >
                End Review
              </Button>
            </div>
          </div>
        )

      case 'clinician-dashboard':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
            <div>
              <h1 className="text-xl font-medium font-newsreader text-on-surface mb-1">
                Clinical Preparatory Portal
              </h1>
              <p className="text-xs font-mono text-text-muted">Logged in as {nickname || 'Clinician'}</p>
            </div>

            {/* Notification prep card */}
            <button
              id="booking-notification"
              onClick={() => {
                telemetry.trackButtonTap('booking-notification')
                advanceTour()
              }}
              className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group"
            >
              <div className="p-3 bg-secondary-container text-secondary rounded-input group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium font-inter text-on-surface">
                    Session Prep Flagged
                  </h3>
                  <span className="px-2 py-0.5 bg-primary-container text-primary text-[10px] font-mono rounded-full font-medium">
                    New Prep
                  </span>
                </div>
                <p className="text-sm font-inter text-text-secondary leading-normal">
                  Redacted intake from Tester Grace indicates high somatic anxiety indicators. Click to prepare and review grounding cards.
                </p>
              </div>
            </button>
          </div>
        )

      case 'clinician-booking-detail':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Clinical Intake Details</h2>
              <p className="text-xs font-mono text-text-muted">Case ref: GRACE-C-01</p>
            </div>

            <div className="bg-white border border-border-divider rounded-card p-5 space-y-4">
              <div className="flex items-center space-x-3 text-text-secondary text-sm">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>Requested Appt: <strong>Today, 4:00 PM</strong></span>
              </div>
              <div className="flex items-center space-x-3 text-text-secondary text-sm">
                <Paperclip className="w-4 h-4 text-secondary" />
                <span>Patient State: <strong>Self-Somatic Monitoring</strong></span>
              </div>
            </div>

            <div className="bg-white border border-border-divider rounded-card p-5 space-y-4">
              <h3 className="text-sm font-medium font-inter text-on-surface uppercase tracking-wider text-text-secondary">Somatic Intake Synthesizer</h3>
              <div className="space-y-2">
                <div className="p-3 bg-secondary-container text-secondary text-xs font-mono rounded-input flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>Somatic stress triggers: 3 mentions of chest tightening, 4 mentions of stomach knots. Freezing nerves detected.</span>
                </div>
                <div className="p-3 bg-primary-container text-primary text-xs font-mono rounded-input flex items-start space-x-2">
                  <Heart className="w-4 h-4 flex-shrink-0" />
                  <span>Attachment style indicators: Highly anxious-avoidant attachment cues with heavy personal blame narrative.</span>
                </div>
              </div>
            </div>

            <Button
              id="accept-booking-btn"
              onClick={() => {
                telemetry.trackButtonTap('accept-booking-btn')
                advanceTour()
              }}
              variant="primary"
              className="w-full py-4 text-sm font-medium"
            >
              Accept proposed time & prepare session
            </Button>
          </div>
        )

      case 'clinician-artifacts':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Clinical Prep Checklist</h2>
              <p className="text-xs font-mono text-text-muted">Decrypt intake reflections</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-border-divider rounded-card p-5 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-semibold text-on-surface font-inter">Clinical Narrative Logs</h4>
                  <p className="text-xs text-text-secondary">3 chronological factsheets</p>
                  {isRequestingIncidents && (
                    <span className="inline-block text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-mono mt-1">Approved & Decrypted</span>
                  )}
                  {isPendingIncidents && (
                    <span className="inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono animate-pulse mt-1">Requesting client approval...</span>
                  )}
                  {!isRequestingIncidents && !isPendingIncidents && (
                    <span className="inline-block text-[10px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full font-mono mt-1">🔒 Redacted & Locked</span>
                  )}
                </div>
                {!isRequestingIncidents && !isPendingIncidents && (
                  <Button
                    id="request-incident-btn"
                    onClick={() => {
                      telemetry.trackButtonTap('request-incident-btn')
                      setIsPendingIncidents(true)
                      setTimeout(() => {
                        setIsPendingIncidents(false)
                        setIsRequestingIncidents(true)
                        if (isRequestingJournals) {
                          advanceTour()
                        }
                      }, 2000)
                    }}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    Request Access
                  </Button>
                )}
                {isRequestingIncidents && <Unlock className="w-5 h-5 text-green-600" />}
              </div>

              <div className="bg-white border border-border-divider rounded-card p-5 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-semibold text-on-surface font-inter">Somatic Reflections</h4>
                  <p className="text-xs text-text-secondary">12 verbatim reflections</p>
                  {isRequestingJournals && (
                    <span className="inline-block text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-mono mt-1">Approved & Decrypted</span>
                  )}
                  {isPendingJournals && (
                    <span className="inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono animate-pulse mt-1">Requesting client approval...</span>
                  )}
                  {!isRequestingJournals && !isPendingJournals && (
                    <span className="inline-block text-[10px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full font-mono mt-1">🔒 Redacted & Locked</span>
                  )}
                </div>
                {!isRequestingJournals && !isPendingJournals && (
                  <Button
                    id="request-journal-btn"
                    onClick={() => {
                      telemetry.trackButtonTap('request-journal-btn')
                      setIsPendingJournals(true)
                      setTimeout(() => {
                        setIsPendingJournals(false)
                        setIsRequestingJournals(true)
                        if (isRequestingIncidents) {
                          advanceTour()
                        }
                      }, 2000)
                    }}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    Request Access
                  </Button>
                )}
                {isRequestingJournals && <Unlock className="w-5 h-5 text-green-600" />}
              </div>
            </div>

            {isRequestingIncidents && isRequestingJournals && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-inter rounded-input flex items-start space-x-2 animate-fade-in text-left">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
                <span>Clinical verification Authority matching. Grace's somatic logs are securely decrypted and ready for psych-grounding analysis.</span>
              </div>
            )}

            {isRequestingIncidents && isRequestingJournals && (
              <Button
                onClick={() => {
                  telemetry.trackButtonTap('artifacts-next')
                  handleManualNext()
                }}
                variant="primary"
                className="w-full animate-fade-in"
              >
                Continue to somatic chat &rarr;
              </Button>
            )}
          </div>
        )

      case 'clinician-chat':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none text-left">
            {/* Header */}
            <div className="p-4 border-b border-border-divider bg-white">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Clinical Retrieval Engine</span>
              <h3 className="text-sm font-medium font-inter text-on-surface">Somatic Pattern Assistant</h3>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-secondary-container text-secondary text-[11px] leading-relaxed font-inter flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span>Somatic Pattern Surfacing active. The engine is psych-framed and surfaces somatic cues without diagnosing. You are querying self-reported logs.</span>
            </div>

            {/* Message log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
              {providerChatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'provider' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-input text-xs font-inter max-w-[80%] text-left ${msg.sender === 'provider'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-white border border-border-divider text-on-surface'
                    }`}>
                    {msg.text}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 justify-start">
                      {msg.citations.map((cite, cIdx) => (
                        <span key={cIdx} className="text-[9px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-300">
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isProviderChatTyping && (
                <div className="flex items-center space-x-2 p-3 bg-white border border-border-divider rounded-input text-xs font-mono text-text-muted max-w-[70%]">
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Analyzing somatic cues...</span>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="p-3 bg-white border-t border-border-divider space-y-2">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Suggested Queries</p>
              <div className="flex flex-wrap gap-2">
                <button
                  id="chat-suggestion-timeline"
                  onClick={() => {
                    telemetry.trackButtonTap('provider-suggestion-timeline')
                    handleSendProviderMessage('Show somatic patterns')
                    const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-chat-timeline' || i.id === 'ca-chat-timeline')
                    if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                  }}
                  className="text-[10px] font-inter font-medium text-secondary hover:text-on-secondary bg-secondary-container/45 hover:bg-secondary border border-secondary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
                >
                  Show somatic patterns
                </button>
                <button
                  id="chat-suggestion-evidence"
                  onClick={() => {
                    telemetry.trackButtonTap('provider-suggestion-evidence')
                    handleSendProviderMessage('What are the panic reactions?')
                    const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-chat-evidence' || i.id === 'ca-chat-evidence')
                    if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                  }}
                  className="text-[10px] font-inter font-medium text-secondary hover:text-on-secondary bg-secondary-container/45 hover:bg-secondary border border-secondary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
                >
                  What are the panic reactions?
                </button>
                <button
                  id="chat-suggestion-named"
                  onClick={() => {
                    telemetry.trackButtonTap('provider-suggestion-named')
                    handleSendProviderMessage('What attachment style is noted?')
                    const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-chat-named' || i.id === 'ca-chat-named')
                    if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                  }}
                  className="text-[10px] font-inter font-medium text-secondary hover:text-on-secondary bg-secondary-container/45 hover:bg-secondary border border-secondary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
                >
                  What attachment style is noted?
                </button>
              </div>
            </div>

            {/* Manual next bridge */}
            <div className="p-4 bg-white border-t border-border-divider">
              <Button
                onClick={() => {
                  telemetry.trackButtonTap('chat-next')
                  handleManualNext()
                }}
                variant="primary"
                className="w-full text-xs"
              >
                Proceed to prep notes &rarr;
              </Button>
            </div>
          </div>
        )

      case 'clinician-notes':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Session Prep Notes</h2>
              <p className="text-xs font-mono text-text-muted">Secure clinician reflections</p>
            </div>

            {/* Note logs */}
            <div className="space-y-3 bg-white border border-border-divider rounded-card p-4 max-h-[220px] overflow-y-auto">
              {providerNotes.map((note, index) => (
                <div key={index} className="text-xs font-inter border-b border-border-divider pb-2 last:border-b-0">
                  <p className="text-on-surface-variant leading-relaxed">{note}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="space-y-3">
              <label htmlFor="provider-note" className="text-xs font-medium font-inter text-on-surface uppercase tracking-wider text-text-secondary">Add session prep note</label>
              <textarea
                id="provider-note"
                rows={3}
                value={currentProviderNote}
                onChange={(e) => setCurrentProviderNote(e.target.value)}
                placeholder="Type grounding exercises or intake reflections..."
                className="w-full border border-border-divider rounded-input p-3 font-inter text-xs bg-white focus:outline-none focus:border-primary resize-y"
              />
              <Button
                id="save-note-btn"
                disabled={!currentProviderNote.trim()}
                onClick={() => {
                  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  const noteContent = `Note (May 23, ${nowStr}): ${currentProviderNote}`
                  setProviderNotes(prev => [noteContent, ...prev])
                  telemetry.trackTextInput('provider_note_save', currentProviderNote)
                  setCurrentProviderNote('')
                  setProviderNotesSaved(true)
                  // Directly mark the save-note instruction as complete (provider screens are outside #phone-viewport)
                  const ins = currentStep?.instructionSteps?.find(i => i.id === 'la-save-notes' || i.id === 'ca-save-notes')
                  if (ins && currentStep) markInstructionComplete(currentStep.id, ins.id)
                }}
                variant="primary"
                className="w-full"
              >
                Save prep note
              </Button>
            </div>

            {providerNotesSaved && (
              <Button
                onClick={() => {
                  telemetry.trackButtonTap('notes-next')
                  handleManualNext()
                }}
                variant="secondary"
                className="w-full"
              >
                Continue to certified export &rarr;
              </Button>
            )}
          </div>
        )

      case 'clinician-export':
        return (
          <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Clinical Prep Export</h2>
                <p className="text-xs font-mono text-text-muted">Intake package for somatic prep</p>
              </div>

              {/* Embedded PDF */}
              <div className="bg-white border border-border-divider rounded-card overflow-hidden flex flex-col h-[80vh]">
                <div className="px-4 py-3 border-b border-border-divider flex items-center space-x-2 shrink-0">
                  <FileText className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-semibold text-on-surface font-inter">clinical-export-sample.pdf</span>
                </div>
                <iframe
                  src="/clinical-export-sample.pdf"
                  className="w-full flex-1 h-full border-0"
                  title="Clinical Export PDF"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border-divider">
              <Button
                id="export-end-btn"
                onClick={() => {
                  telemetry.trackButtonTap('export-end-btn')
                  handleManualNext()
                }}
                variant="primary"
                className="w-full py-4 text-sm font-medium"
              >
                End Review
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex-1 flex items-center justify-center p-6 bg-white h-full">
            <p className="text-sm font-inter text-text-muted">Error: Screen not matched.</p>
          </div>
        )
    }
  }

  return (
    <>
      <OnboardingWalkthrough />

      <style>{`
        @keyframes pulseRow {
          0% { background-color: transparent; border-color: var(--color-border-divider); }
          50% { background-color: #FFEDE9; border-color: #FF8A7A; transform: scale(1.01); }
          100% { background-color: transparent; border-color: var(--color-border-divider); }
        }
        .animate-pulse-row {
          animation: pulseRow 0.8s ease-in-out;
        }
      `}</style>

      <FrameWrapper
        onPrev={handleManualPrev}
        onNext={handleManualNext}
        canPrev={canPrevWalkthrough}
        canNext={true}
        showStepControls={!guidedFinished && steps.length > 0}
        onHelp={() => (window as any).graceTriggerHelp?.()}
      >
        <div className="relative h-full w-full flex flex-col overflow-hidden">
          {renderInnerContent()}

          {/* Locks-and-dimming overlay container covering the phone viewport */}
          {(!currentStep || currentStep.prototypeInteractive === false || guidedMode === 'reflection') && (
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] z-[999] flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in pointer-events-auto">
              <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xl max-w-[280px]">
                <span className="text-2xl mb-2 block">🔒</span>
                <p className="text-xs font-inter font-semibold text-on-surface leading-relaxed">
                  {guidedMode === 'reflection'
                    ? "Take a moment — answer the questions in the side panel."
                    : "Read along — we'll tell you when to tap."
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </FrameWrapper>
    </>
  )
}
