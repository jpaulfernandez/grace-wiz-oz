import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, MessageSquare, BookOpen, AlertOctagon, Heart, ChevronRight, Check, ShieldAlert, Lock } from 'lucide-react'
import { useStore, getCurrentStep } from '../lib/store'
import { useGuidedTour } from '../lib/useGuidedTour'
import { FrameWrapper } from '../components/layout/FrameWrapper'
import { telemetry, EventTypes } from '../lib/telemetry'
import { getSessionConfig } from '../config/sidePanel'
import { Button } from '../components/ui'

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

import { CommunityStories } from '../components/freeroam/CommunityStories'
import { PathwaysDirectory } from '../components/freeroam/PathwaysDirectory'
import { MarketplaceDirectory } from '../components/freeroam/MarketplaceDirectory'
import { LawyerHub } from '../components/guided/LawyerHub'
import { ClinicianHub } from '../components/guided/ClinicianHub'

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
    markInstructionComplete,
    currentScreen
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
  const [hasTappedAnnotation, setHasTappedAnnotation] = useState(false)
  const [showCloseGuidance, setShowCloseGuidance] = useState(false)
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
      if (useStore.getState().scenarioId === 'free-01') {
        useStore.getState().setScreen('guided-home')
      } else {
        triggerAdvanceWithModalCheck()
      }
    },
    onJournalHandoff: (summary) => {
      // Transition loader animation then advance to journal
      setCarryOverSummary(summary)
      setJournalText(summary)
      setShowTransitionLoader(true)
      setTimeout(() => {
        setShowTransitionLoader(false)
        if (useStore.getState().scenarioId === 'free-01') {
          useStore.getState().setScreen('journal-editor')
        } else {
          triggerAdvanceWithModalCheck()
        }
      }, 2000)
    },
    onIncidentHandoff: (summary) => {
      // If they click Log Incident, we can set summary and advance
      setCarryOverSummary(summary)
      setIncidentAnythingElse(summary)
      setShowTransitionLoader(true)
      setTimeout(() => {
        setShowTransitionLoader(false)
        if (useStore.getState().scenarioId === 'free-01') {
          useStore.getState().setScreen('incident-log')
        } else {
          triggerAdvanceWithModalCheck()
        }
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
            shouldComplete = true
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

      if (rule.type === 'tap' && rule.selector === '#chat-send-btn') {
        shouldComplete = showHandoff
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
    cohort,
    showHandoff
  ])

  const lastOffPathTimeRef = useRef<number>(0)

  // Event interception and auto-complete during guided scenarios
  useEffect(() => {
    if (!currentStep) return

    const handleGuidedClick = (e: MouseEvent) => {
      if (scenarioId === 'admin-freeroam') return

      const target = e.target as HTMLElement
      if (!target || typeof target.closest !== 'function') return

      // Always allow clicking outer top bar buttons and modal/portal contents (Restart, End, Study Info, Help)
      const path = e.composedPath()
      const text = target.textContent || ''
      const isAllowedGlobally = path.some(el => {
        if (!(el instanceof Element)) return false
        const id = el.id || ''
        const className = el.className || ''
        const classes = typeof className === 'string' ? className : ((className as any).baseVal || '')
        const label = el.getAttribute('aria-label') || ''
        
        return id === 'outer-top-bar' ||
               id === 'study-info-button' ||
               id === 'help-button' ||
               id === 'mobile-mini-guide' ||
               classes.includes('modal-portal') ||
               classes.includes('z-[9999]') ||
               classes.includes('z-9999') ||
               label.includes('Study') ||
               label.includes('Restart') ||
               label.includes('Pause') ||
               label.includes('Help') ||
               label.includes('End')
      }) ||
      text.includes('Restart') ||
      text.includes('Pause') ||
      text.includes('Study Info') ||
      text.includes('End session') ||
      text.includes('Yes, restart')
      if (isAllowedGlobally) return

      const isInsidePhone = target.closest('#phone-viewport') || window.innerWidth < 1024
      if (!isInsidePhone) return

      const isOverride = target.closest('.driver-popover') || 
                         target.closest('.driver-overlay') || 
                         target.closest('.onboarding-overlay') ||
                         target.closest('#right-sidebar-panel') ||
                         target.closest('#mobile-mini-guide') ||
                         target.closest('button[aria-label="View instructions"]') ||
                         target.closest('button[aria-label="Close instructions drawer"]')
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
            if (rule.selector === '#chat-send-btn' && !showHandoff) {
              return
            }
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

  // Pre-fill providerNotes with realistic case notes on mount/cohort change for testing/use cases
  useEffect(() => {
    if (cohort === 'lawyer') {
      setProviderNotes([
        "Note (May 22, 10:30 AM): Reviewed preliminary telemetry logs of elevator/stairs behavior modification. Patterns show consistent avoidance of elevator corridor during Marco's usual break times.",
        "Note (May 21, 2:15 PM): Client called to verify encryption bounds. Confirmed all logs reside locally on sandbox client-side. Advised her to capture specific quotes of Marco's comments."
      ])
    } else if (cohort === 'clinician') {
      setProviderNotes([
        "Note (May 22, 10:30 AM): Reviewed telemetry on elevator/stairs behavior. Patient climbing 14 flights of stairs to avoid Marco. Significant somatic hyperarousal and physical fatigue noted.",
        "Note (May 21, 2:15 PM): Checked in via secure portal. Patient reported chest tightness of 7/10 when approaching the office entrance. Encouraged somatic breathing pause prior to clocking in."
      ])
    }
  }, [cohort])

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

  // Reset local guided/provider state when restarting back to scenario 1 step 0
  useEffect(() => {
    if (currentScenarioIndex === 1 && currentStepIndex === 0) {
      setCarryOverSummary(null)
      setJournalText('')
      setIsRequestingIncidents(false)
      setIsRequestingJournals(false)
      setIsPendingIncidents(false)
      setIsPendingJournals(false)
      setProviderChatMessages([])
      setProviderNotes([])
    }
  }, [currentScenarioIndex, currentStepIndex])

  // Synchronize screen state in telemetry on step transition
  useEffect(() => {
    if (scenarioId === 'free-01') {
      const { currentScreen } = useStore.getState()
      if (currentScreen === 'consent' || !currentScreen) {
        setScreen('guided-home')
      }
    } else if (currentStep) {
      setScreen(currentStep.screenId)
    }
  }, [currentStep, scenarioId, setScreen])

  // Breathing state interval loop (5 seconds in, 5 seconds out)
  const [isBreathingIn, setIsBreathingIn] = useState(false)
  useEffect(() => {
    if (currentStep?.screenId === 'breath-reminder') {
      setIsBreathingIn(true)
      const interval = setInterval(() => {
        setIsBreathingIn(prev => !prev)
      }, 5000)
      return () => clearInterval(interval)
    } else {
      setIsBreathingIn(false)
    }
  }, [currentStep?.screenId])

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
    if (scenarioId === 'free-01') {
      setScreen('post-save-offers')
    } else {
      triggerAdvanceWithModalCheck()
    }
  }

  const handleSaveIncident = () => {
    setShowTimestampSpinner(true)
    setTimeout(() => {
      setShowTimestampSpinner(false)
      telemetry.track(EventTypes.INCIDENT_SAVE, {
        char_count: (SCENARIO_E_INCIDENT_DATA.whatHappened + incidentAnythingElse).length
      })
      if (scenarioId === 'free-01') {
        setScreen('incident-post-save-offers')
      } else {
        triggerAdvanceWithModalCheck()
      }
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
    const activeScreen = (scenarioId === 'free-01') ? (currentScreen || 'guided-home') : (currentStep?.screenId || 'companion-chat')

    if (
      activeScreen.startsWith('journal') ||
      activeScreen === 'post-save-offers' ||
      activeScreen === 'breath-reminder'
    ) {
      return 'journal'
    }
    if (
      activeScreen === 'incident-log' ||
      activeScreen === 'hash-receipt' ||
      activeScreen === 'incident-post-save-offers'
    ) {
      return 'incident'
    }
    return 'companion'
  }

  // Handle bottom navigation taps within guided context
  const handleTabChange = (tabId: 'companion' | 'journal' | 'incident' | 'more') => {
    telemetry.trackButtonTap(`nav-${tabId}-btn`)
    if (scenarioId === 'free-01') {
      if (tabId === 'companion') {
        setScreen('companion-chat')
      } else if (tabId === 'journal') {
        setScreen('journal-modes')
      } else if (tabId === 'incident') {
        setScreen('incident-log')
      } else if (tabId === 'more') {
        setScreen('community-qa')
      }
      return
    }
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
            <p className="text-xs font-inter text-text-muted">Securing entry timestamp</p>
          </div>
        </div>
      )
    }

    if (guidedFinished && scenarioId !== 'free-01') {
      return (
        <div className="flex-1 flex flex-col p-6 text-center bg-white h-full justify-between select-none">
          <div className="my-auto space-y-6 max-w-[320px] mx-auto text-left">
            <h2 className="text-2xl font-semibold font-newsreader text-on-surface">
              Thank you for going through that.
            </h2>
            <div className="text-sm font-inter text-text-secondary space-y-4 leading-relaxed">
              <p>
                You're almost done. We just have a few closing questions to ask before we wrap up.
              </p>
              <p>
                I hope you're doing okay. Take a moment if you need one, then tap below when you're ready.
              </p>
            </div>
          </div>
          <div className="w-full space-y-3 pt-6 border-t border-border-divider mt-auto">
            <Button variant="primary" className="w-full" onClick={handleStartFreeRoam}>
              Continue to closing questions
            </Button>
          </div>
        </div>
      )
    }

    const activeScreen = (scenarioId === 'free-01') ? (currentScreen || 'guided-home') : (currentStep?.screenId || 'guided-home')

    if (!currentStep && scenarioId !== 'free-01') {
      return (
        <div className="flex-1 flex items-center justify-center p-6 bg-white h-full">
          <p className="text-sm font-inter text-text-muted">Loading scenario steps...</p>
        </div>
      )
    }

    switch (activeScreen) {
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
                    if (scenarioId === 'free-01') {
                      setScreen('companion-chat')
                    }
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
                      Chat privately to talk through your thoughts and figure things out.
                    </p>
                  </div>
                </button>

                <button
                  id="journal-card"
                  onClick={() => {
                    telemetry.trackButtonTap('journal-card')
                    if (scenarioId === 'free-01') {
                      setScreen('journal-modes')
                    }
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
                      Write freely. No prompts, no structure.
                    </p>
                  </div>
                </button>

                <button
                  id="incident-card"
                  onClick={() => {
                    telemetry.trackButtonTap('incident-card')
                    if (scenarioId === 'free-01') {
                      setScreen('incident-log')
                    }
                  }}
                  className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group"
                >
                  <div className="p-3 bg-red-50 text-red-600 rounded-input group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <ShieldAlert className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium font-inter text-on-surface mb-0.5">
                      Incident Log
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Keep a secure, timestamped record of incidents for your personal safety.
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
                disableDirectTyping={true}
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
                        Notes from your chat (not saved with your entry)
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
                  placeholder="Start writing what's on your mind... Your entries are private and stored only on your device."
                  className="w-full h-full text-sm font-inter leading-relaxed text-on-surface placeholder:text-text-muted resize-none focus:outline-none bg-transparent border-0 p-0"
                />
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'breath-reminder':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white h-full select-none animate-fade-in relative overflow-hidden">
            <style>{`
              @keyframes ripple-wave-1 {
                0% { transform: translateX(0) translateY(-80%); }
                50% { transform: translateX(-15%) translateY(-80%); }
                100% { transform: translateX(0) translateY(-80%); }
              }
              @keyframes ripple-wave-2 {
                0% { transform: translateX(0) translateY(-95%); }
                50% { transform: translateX(15%) translateY(-95%); }
                100% { transform: translateX(0) translateY(-95%); }
              }
              .animate-ripple-1 {
                animation: ripple-wave-1 7s infinite ease-in-out;
              }
              .animate-ripple-2 {
                animation: ripple-wave-2 11s infinite ease-in-out;
              }
            `}</style>

            {/* Rising water layer */}
            <div
              className="absolute bottom-0 left-0 right-0 transition-all ease-in-out pointer-events-none"
              style={{
                height: isBreathingIn ? '100%' : '15%',
                backgroundColor: isBreathingIn ? '#8B5CF6' : '#FFFFFF',
                transitionDuration: '5000ms', // 5 seconds
              }}
            >
              {/* Ripple Wave 1 (Semi-transparent, offset) */}
              <svg
                className="absolute top-0 left-[-50%] w-[200%] h-16 fill-current animate-ripple-1"
                style={{
                  transition: 'color 5000ms ease-in-out',
                  color: isBreathingIn ? 'rgba(139, 92, 246, 0.45)' : 'rgba(243, 244, 246, 0.6)',
                }}
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <path d="M0,96 C280,192,560,0,840,96 C1120,192,1260,96,1440,32 L1440,320 L0,320 Z" />
              </svg>

              {/* Ripple Wave 2 (Full opacity) */}
              <svg
                className="absolute top-0 left-[-50%] w-[200%] h-16 fill-current animate-ripple-2"
                style={{
                  transition: 'color 5000ms ease-in-out',
                  color: isBreathingIn ? '#8B5CF6' : '#FFFFFF',
                }}
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <path d="M0,128 C240,224,480,32,720,128 C960,224,1200,128,1440,64 L1440,320 L0,320 Z" />
              </svg>
            </div>

            {/* Content floating on top of the water */}
            <div className="z-10 space-y-8 flex flex-col items-center max-w-xs animate-fade-in">
              <span className="text-xs font-mono font-bold uppercase tracking-widest bg-neutral-900/10 backdrop-blur-[2px] px-4 py-1.5 rounded-full text-neutral-800 mix-blend-difference">
                {isBreathingIn ? 'Slowly breathe in' : 'Slowly breathe out'}
              </span>

              <div className="space-y-2">
                <h3 className="text-2xl font-newsreader font-medium text-neutral-900 mix-blend-difference">Take a breath.</h3>
                <p className="text-xs font-inter text-neutral-800 font-normal mix-blend-difference">A short pause to help you feel grounded.</p>
              </div>

              <div className="pt-4">
                <button
                  id="breath-continue-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('breath-continue-btn')
                    triggerAdvanceWithModalCheck()
                  }}
                  className="px-8 py-3 bg-white text-primary border border-purple-200 rounded-full text-xs font-inter font-semibold hover:bg-neutral-50 active:scale-95 transition-all shadow-md focus:outline-none"
                  style={{
                    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)',
                  }}
                >
                  I feel ready to continue
                </button>
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
                  No scores, no unwanted tracking, no pressure. What you write is yours alone.
                </p>
              </div>

              {/* Reflection pathways */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  What you can do now
                </span>

                <button
                  id="just-save-btn"
                  onClick={() => {
                    if (scenarioId === 'free-01') {
                      setScreen('guided-home')
                    } else {
                      advanceTour()
                    }
                  }}
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
                  onClick={() => {
                    if (scenarioId === 'free-01') {
                      setScreen('journal-annotations')
                    } else {
                      advanceTour()
                    }
                  }}
                  className="w-full p-4 bg-white border border-primary text-left rounded-card hover:bg-primary-container/20 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs font-inter text-primary font-medium">Help me notice patterns</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* Soft offers row */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  Other options
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white border border-border-divider rounded-card text-center space-y-2 opacity-80">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center mx-auto text-xs font-medium">2m</div>
                    <span className="block text-xs font-inter font-medium text-on-surface">A quick pause</span>
                    <span className="block text-[10px] font-inter text-text-muted leading-tight">Simple breathing exercise</span>
                  </div>

                  <div className="p-4 bg-white border border-border-divider rounded-card text-center space-y-2 opacity-80">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center mx-auto">
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <span className="block text-xs font-inter font-medium text-on-surface">Next steps</span>
                    <span className="block text-[10px] font-inter text-text-muted leading-tight">See your options</span>
                  </div>
                </div>
              </div>
            </div>

            <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />
          </div>
        )

      case 'journal-annotations':
        return (
          <div className="flex-1 flex flex-col bg-white h-full overflow-hidden relative">
            <ScreenHeader
              title="Things we noticed"
              rightAction={
                <button
                  id="close-annotations-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('close-annotations-btn')
                    if (scenarioId === 'free-01') {
                      setScreen('guided-home')
                    } else if (!hasTappedAnnotation) {
                      setShowCloseGuidance(true)
                    } else {
                      advanceTour()
                    }
                  }}
                  className={`px-4 py-1.5 rounded-input text-xs font-inter font-medium transition-colors shadow-sm focus:outline-none ${
                    !hasTappedAnnotation
                      ? 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'
                      : 'bg-primary text-white hover:bg-opacity-90'
                  }`}
                >
                  Close
                </button>
              }
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col min-h-0">
              <div className="p-4 bg-background border border-border-divider rounded-card text-xs font-inter text-text-secondary leading-relaxed">
                <p>
                  Grace looked at your past entries to find repeating details. Tap the highlighted words below to see what we found, like physical feelings, people who saw you, or repeated habits.
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
                          setHasTappedAnnotation(true)
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

                let categoryLabel = "Physical feeling"
                let cardStyle = "bg-primary-container/20 border-primary/20 text-primary"
                if (annotation.category === 'pattern') {
                  categoryLabel = "Repeated pattern"
                  cardStyle = "bg-[#EDE7F6]/40 border-[#673AB7]/20 text-[#673AB7]"
                } else if (annotation.category === 'witness') {
                  categoryLabel = "Someone who saw you"
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

            {/* Premium Interactive Guidance Modal */}
            {showCloseGuidance && (
              <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center z-[999] select-none animate-fade-in">
                <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xl max-w-[280px] text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold font-inter text-on-surface">
                      Try it first
                    </h4>
                    <p className="text-xs font-inter text-text-secondary leading-relaxed">
                      Please try tapping a highlight before you close this. Tap any colored words (like <strong>"chest felt so tight"</strong>) to see what Grace noticed.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCloseGuidance(false)}
                    className="w-full py-2 bg-primary text-white text-xs font-medium rounded-input hover:bg-opacity-95 active:scale-95 transition-all shadow-sm focus:outline-none"
                  >
                    Got it, I'll try it
                  </button>
                </div>
              </div>
            )}

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
                  Choose how you want to write. You can switch modes anytime—everything is always open.
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
                      Free writing
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Just write whatever you feel, with no rules.
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
                      Guided writing
                    </h3>
                    <p className="text-xs font-inter text-text-secondary">
                      Use gentle questions to help you write down sensitive events.
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
                      A step-by-step form to record exact details, locked in time as a secure record.
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
              title="Guided writing"
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
                This exercise breaks your writing into simple questions. You can change or edit your answers before saving.
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
                <span className="text-[10px] font-mono font-medium text-primary bg-primary-container px-2.5 py-1 rounded-full flex items-center gap-1 select-none">
                  <Lock className="w-3 h-3" /> SECURE
                </span>
              }
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col min-h-0">
              {/* Security info card */}
              <div className="p-4 bg-background border border-border-divider rounded-card text-[11px] font-inter text-text-secondary leading-relaxed flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  The details you fill in here will be locked and saved with a secure timestamp. This makes sure your record can't be changed later. You can add extra notes at the end.
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
                    How your body felt (Physical reactions)
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
                    placeholder="Add any other notes, reflections, or details here..."
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
                  <span>Save this record securely</span>
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
              title="Secure Receipt"
              rightAction={
                <button
                  id="incident-receipt-next-btn"
                  onClick={() => {
                    telemetry.trackButtonTap('incident-receipt-next-btn')
                    if (scenarioId === 'free-01') {
                      setScreen('incident-post-save-offers')
                    } else {
                      advanceTour()
                    }
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
                  Incident secured & saved
                </h3>
                <p className="text-xs font-inter text-text-secondary leading-relaxed">
                  Your record is now safely saved. It has a secure timestamp that proves exactly when it was written, making sure it can never be changed or edited.
                </p>
              </div>

              {/* QR Code receipt card */}
              <div className="p-5 bg-white border border-border-divider rounded-card shadow-sm space-y-4">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted text-center font-bold">
                  Grace Secure Stamp
                </span>

                <div className="flex flex-col items-center space-y-3">
                  {/* Dummy QR Code */}
                  <div className="p-2 bg-white border border-border-divider rounded-input shadow-sm">
                    <img
                      src="/verification-qr.png"
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
                  Scan this code to verify your secure record • Locked with industry-standard encryption
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
                <h4 className="text-xs font-inter font-semibold text-on-surface">Record successfully timestamped and saved</h4>
                <p className="text-[11px] font-inter text-text-secondary leading-relaxed">
                  Your record is secured and saved privately on this device. What would help you most right now?
                </p>
              </div>

              {/* Action options */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-wider uppercase text-text-muted">
                  Write more
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
                  Find support
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
                    if (scenarioId === 'free-01') {
                      setScreen('guided-home')
                    } else {
                      handleManualNext()
                    }
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
      case 'lawyer-booking-detail':
      case 'lawyer-artifacts':
      case 'lawyer-chat':
      case 'lawyer-notes':
      case 'lawyer-export':
        return (
          <LawyerHub
            nickname={nickname}
            advanceTour={advanceTour}
            handleManualNext={handleManualNext}
            isRequestingIncidents={isRequestingIncidents}
            setIsRequestingIncidents={setIsRequestingIncidents}
            isPendingIncidents={isPendingIncidents}
            setIsPendingIncidents={setIsPendingIncidents}
            isRequestingJournals={isRequestingJournals}
            setIsRequestingJournals={setIsRequestingJournals}
            isPendingJournals={isPendingJournals}
            setIsPendingJournals={setIsPendingJournals}
            providerChatMessages={providerChatMessages}
            handleSendProviderMessage={handleSendProviderMessage}
            isProviderChatTyping={isProviderChatTyping}
            providerNotes={providerNotes}
            setProviderNotes={setProviderNotes}
            currentProviderNote={currentProviderNote}
            setCurrentProviderNote={setCurrentProviderNote}
            providerNotesSaved={providerNotesSaved}
            setProviderNotesSaved={setProviderNotesSaved}
            currentStep={currentStep}
            markInstructionComplete={markInstructionComplete}
            activeScreen={activeScreen}
          />
        )

      case 'clinician-dashboard':
      case 'clinician-booking-detail':
      case 'clinician-artifacts':
      case 'clinician-chat':
      case 'clinician-notes':
      case 'clinician-export':
        return (
          <ClinicianHub
            nickname={nickname}
            advanceTour={advanceTour}
            handleManualNext={handleManualNext}
            isRequestingIncidents={isRequestingIncidents}
            setIsRequestingIncidents={setIsRequestingIncidents}
            isPendingIncidents={isPendingIncidents}
            setIsPendingIncidents={setIsPendingIncidents}
            isRequestingJournals={isRequestingJournals}
            setIsRequestingJournals={setIsRequestingJournals}
            isPendingJournals={isPendingJournals}
            setIsPendingJournals={setIsPendingJournals}
            providerChatMessages={providerChatMessages}
            handleSendProviderMessage={handleSendProviderMessage}
            isProviderChatTyping={isProviderChatTyping}
            providerNotes={providerNotes}
            setProviderNotes={setProviderNotes}
            currentProviderNote={currentProviderNote}
            setCurrentProviderNote={setCurrentProviderNote}
            providerNotesSaved={providerNotesSaved}
            setProviderNotesSaved={setProviderNotesSaved}
            currentStep={currentStep}
            markInstructionComplete={markInstructionComplete}
            activeScreen={activeScreen}
          />
        )

      case 'community-qa':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none animate-fade-in text-left">
            <ScreenHeader title="Community Q&A" />
            <div className="flex-1 overflow-y-auto pb-16">
              <CommunityStories />
            </div>
            <BottomNav activeTab="more" onTabChange={handleTabChange} />
          </div>
        )

      case 'pathway':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none animate-fade-in text-left">
            <ScreenHeader title="Safe Directory" />
            <div className="flex-1 overflow-y-auto pb-16">
              <PathwaysDirectory />
            </div>
            <BottomNav activeTab="more" onTabChange={handleTabChange} />
          </div>
        )

      case 'external-help':
        return (
          <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none animate-fade-in text-left">
            <ScreenHeader title="External Help" />
            <div className="flex-1 overflow-y-auto pb-16">
              <MarketplaceDirectory />
            </div>
            <BottomNav activeTab="more" onTabChange={handleTabChange} />
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
          {scenarioId !== 'free-01' && (!currentStep || currentStep.prototypeInteractive === false || guidedMode === 'reflection') && (
            <div className={`absolute inset-0 flex flex-col pointer-events-auto select-none animate-fade-in ${window.innerWidth < 1024 ? 'bg-transparent items-center pt-6 z-20' : 'bg-neutral-900/60 backdrop-blur-[2px] items-center justify-center p-6 text-center z-[999]'}`}>
              <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xl max-w-[280px] text-center">
                <Lock className="w-8 h-8 text-secondary mx-auto mb-3" />
                <p className="text-xs font-inter font-semibold text-on-surface leading-relaxed">
                  {guidedMode === 'reflection'
                    ? (window.innerWidth < 1024 ? "Tap 'Guide' below to answer the reflection." : "Take a moment — answer the questions in the side panel.")
                    : (window.innerWidth < 1024 ? "Tap 'Guide' below to read the instructions." : "Read along — we'll tell you when to tap.")
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
