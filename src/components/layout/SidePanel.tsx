import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { useStore, getCurrentStep, getCurrentReflection, canAdvance, canContinueReflection } from '../../lib/store'
import { telemetry, EventTypes } from '../../lib/telemetry'
import { getSessionConfig } from '../../config/sidePanel'
import { StepChecklist } from './StepChecklist'
import { FreeRoamSidebar } from '../freeroam/FreeRoamSidebar'
import { Markdown } from '../ui/Markdown'

// Introductory screen for a new scenario
function ScenarioIntroPanel({ scenario, onStart }: { scenario: any; onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-semibold text-on-surface text-left">
          {scenario.label}
        </h1>
        {scenario.description && <Markdown source={scenario.description} />}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 bg-primary text-white rounded-input text-sm font-semibold hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-md focus:outline-none"
      >
        Start Scenario
      </button>
    </div>
  )
}

// Reflection panel gating at scenario boundaries or session ends
function ReflectionPanel({
  reflection,
  answers,
  onChange,
  onSubmit,
  disabled
}: {
  reflection: any
  answers: Record<string, any>
  onChange: (id: string, value: any) => void
  onSubmit: () => void
  disabled: boolean
}) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-255px)] pr-1">
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
            Reflection
          </h3>
          <h2 className="text-xl font-serif font-semibold text-on-surface">
            {reflection.title}
          </h2>
          {reflection.description && <Markdown source={reflection.description} />}
        </div>

        <div className="space-y-5">
          {reflection.microPrompts.map((prompt: any) => {
            const value = answers[prompt.id]
            return (
              <div key={prompt.id} className="py-4 border-t border-border-divider first:border-t-0 first:py-0 text-left">
                <p className="text-sm font-inter text-on-surface leading-relaxed mb-3">
                  {prompt.question} {prompt.required !== false && <span className="text-red-500">*</span>}
                </p>

                {prompt.type === 'likert-5' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const isSelected = value === num
                        return (
                          <label
                            key={num}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 border rounded-input cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? 'border-primary bg-primary-container/20 text-primary font-semibold'
                                : 'border-border-divider hover:border-primary/45 bg-white text-on-surface'
                            }`}
                          >
                            <input
                              type="radio"
                              name={prompt.id}
                              value={num}
                              checked={isSelected}
                              onChange={() => onChange(prompt.id, num)}
                              className="sr-only"
                            />
                            <span className="text-xs font-inter font-medium">{num}</span>
                          </label>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-[10px] font-medium font-mono text-text-muted px-0.5">
                      <span>Strongly disagree</span>
                      <span>Strongly agree</span>
                    </div>
                  </div>
                )}

                {prompt.type === 'single-choice' && prompt.options && (
                  <div className="flex flex-col gap-2">
                    {prompt.options.map((opt: string) => {
                      const isSelected = value === opt
                      return (
                        <label
                          key={opt}
                          className={`flex items-start gap-3 p-3 border rounded-input cursor-pointer transition-all duration-150 text-left ${
                            isSelected
                              ? 'border-primary bg-primary-container/20 text-primary font-semibold'
                              : 'border-border-divider hover:border-primary/45 bg-white text-on-surface'
                          }`}
                        >
                          <input
                            type="radio"
                            name={prompt.id}
                            value={opt}
                            checked={isSelected}
                            onChange={() => onChange(prompt.id, opt)}
                            className="sr-only"
                          />
                          <span className="text-xs font-inter leading-relaxed">{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {prompt.type === 'text-short' && (
                  <textarea
                    value={value || ''}
                    onChange={(e) => onChange(prompt.id, e.target.value)}
                    placeholder="Type your reaction..."
                    className="w-full h-20 p-3 text-xs font-inter rounded-input border border-border-divider bg-white text-on-surface placeholder:text-text-muted focus:outline-none focus:border-primary resize-none shadow-sm"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button
        disabled={disabled}
        onClick={onSubmit}
        className="w-full py-3.5 bg-on-surface text-white rounded-input text-sm font-semibold hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md focus:outline-none active:scale-[0.98]"
      >
        Submit & Continue
      </button>
    </div>
  )
}

interface SidePanelProps {
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  showStepControls?: boolean
}

export function SidePanel({
  onPrev: _onPrev,
  onNext: _onNext,
  canPrev: _canPrev,
  canNext: _canNext,
  showStepControls
}: SidePanelProps) {
  const navigate = useNavigate()
  const isFreeRoam = window.location.pathname.includes('/free')

  if (isFreeRoam) {
    return <FreeRoamSidebar />
  }

  const {
    scenarioId,
    currentScenarioIndex,
    currentStepIndex,
    guidedMode,
    reflectionAnswers,
    recordMicroPromptAnswer,
    nextStep,
    moderatorNotes,
    setModeratorNotes,
    showNudgeText
  } = useStore()

  const session = scenarioId ? getSessionConfig(scenarioId) : null
  const currentScenario = session?.scenarios[currentScenarioIndex]
  const currentStep = getCurrentStep(useStore.getState())
  const currentReflection = getCurrentReflection(useStore.getState())

  // URL check for mod notes (?mod=1)
  const isModerated = new URLSearchParams(window.location.search).has('mod')

  // Auto-save debounce logic for moderator notes
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showSavedToast, setShowSavedToast] = useState(false)

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setModeratorNotes(value)

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      telemetry.track(EventTypes.MODERATOR_NOTE, { notes: value })
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 2000)
    }, 3000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleExitScenario = () => {
    telemetry.track(EventTypes.TOUR_SKIPPED, {
      step_id: currentStep?.id,
      step_index: currentStepIndex
    })
    navigate('/survey?partial=1')
  }

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-background border-l border-border-divider">
        <p className="text-sm font-inter text-text-muted">No scenario instructions loaded.</p>
      </div>
    )
  }

  // Progress percentage across scenarios in the session
  const totalScenarios = session.scenarios.length
  let progressPct = 0
  if (totalScenarios > 0) {
    const relativeScenarioWeight = 100 / totalScenarios
    let basePct = currentScenarioIndex * relativeScenarioWeight

    if (guidedMode === 'step' && currentScenario) {
      const stepFraction = (currentStepIndex + 1) / currentScenario.steps.length
      basePct += stepFraction * relativeScenarioWeight
    } else if (guidedMode === 'reflection' || guidedMode === 'scenario-intro') {
      basePct += relativeScenarioWeight
    }
    progressPct = Math.min(100, Math.round(basePct))
  }

  // Selectors from global store
  const canAdvanceManually = useStore(canAdvance)
  const canSubmitReflection = useStore(canContinueReflection)

  const handleStartScenario = () => {
    if (currentScenario) {
      telemetry.track(EventTypes.SCENARIO_STARTED, {
        sessionId: session.id,
        scenarioId: currentScenario.id
      })
    }
    nextStep()
  }

  const handleSubmitReflection = () => {
    if (currentReflection) {
      telemetry.track(EventTypes.REFLECTION_COMPLETED, {
        sessionId: session.id,
        scenarioId: currentReflection.id,
        answers: reflectionAnswers
      })
    }
    
    if (guidedMode === 'reflection' && currentScenarioIndex === session.scenarios.length) {
      const now = new Date()
      useStore.setState({
        guidedCompletedAt: now,
        freeRoamStartedAt: now,
        currentScreen: 'free-roam-home'
      })
      navigate('/survey')
    } else {
      nextStep()
    }
  }

  // Determine header context
  let headerLabel = session.label
  let headerSub = ''
  if (currentScenario) {
    headerLabel = currentScenario.label
    if (guidedMode === 'step') {
      headerSub = `Step ${currentStepIndex + 1} of ${currentScenario.steps.length}`
    } else if (guidedMode === 'reflection') {
      headerSub = 'Reflective pause'
    } else if (guidedMode === 'scenario-intro') {
      headerSub = 'Introduction'
    }
  }

  return (
    <aside id="right-sidebar-panel" className="w-full lg:w-[400px] h-full flex flex-col bg-white border-l border-border-divider overflow-y-auto">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-background flex-shrink-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex flex-col justify-between p-6 bg-white border-b border-border-divider">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider uppercase text-text-muted">
            {headerLabel}
          </span>
          <div className="flex items-center space-x-3">
            {currentScenario?.id === 'scenario-0-orientation' && guidedMode !== 'reflection' && (
              <button
                onClick={() => {
                  const state = useStore.getState()
                  const nextScenarioIndex = state.currentScenarioIndex + 1
                  if (currentScenario?.reflection) {
                    useStore.setState({ guidedMode: 'reflection' })
                  } else if (nextScenarioIndex < session.scenarios.length) {
                    const nextScenario = session.scenarios[nextScenarioIndex]
                    useStore.setState({
                      currentScenarioIndex: nextScenarioIndex,
                      currentStepIndex: 0,
                      guidedMode: nextScenario.description ? 'scenario-intro' : 'step'
                    })
                  } else {
                    useStore.setState({ guidedMode: 'reflection' })
                  }
                }}
                className="text-xs font-inter font-medium text-secondary hover:underline"
              >
                Skip orientation
              </button>
            )}
            <button
              onClick={handleExitScenario}
              className="text-xs font-inter font-medium text-primary hover:underline"
            >
              Exit scenario
            </button>
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <h2 className="text-lg font-semibold font-serif text-on-surface">
            {session.label}
          </h2>
          {headerSub && (
            <span className="text-xs font-mono text-text-secondary">
              {headerSub}
            </span>
          )}
        </div>
      </div>

      {/* Mode-based Subpanel rendering */}
      {guidedMode === 'scenario-intro' && currentScenario && (
        <ScenarioIntroPanel scenario={currentScenario} onStart={handleStartScenario} />
      )}

      {guidedMode === 'reflection' && currentReflection && (
        <ReflectionPanel
          reflection={currentReflection}
          answers={reflectionAnswers}
          onChange={recordMicroPromptAnswer}
          onSubmit={handleSubmitReflection}
          disabled={!canSubmitReflection}
        />
      )}

      {guidedMode === 'step' && currentStep && (
        <div className="flex-1 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <Markdown source={currentStep.sidePanelInstruction} />

            {currentStep.instructionSteps && currentStep.instructionSteps.length > 0 && (
              <div className="border-t border-border-divider pt-5">
                <StepChecklist
                  step={currentStep}
                  onTriggerHelp={() => (window as any).graceTriggerHelp?.()}
                />
              </div>
            )}

            {/* Inactivity/Idle Nudge Info Box */}
            {showNudgeText && (
              <div className="p-4 bg-primary-container/40 border border-primary/20 rounded-card animate-fade-in text-sm font-inter text-on-primary-container leading-relaxed">
                Looking for something? Try tapping the highlighted area, or use the manual step controls to skip ahead.
              </div>
            )}
          </div>

          {/* Step controls inside sidebar (backup for mobile drawer) */}
          {showStepControls && (
            <div className="flex flex-col space-y-2 pt-4 border-t border-border-divider">
              <div className="flex items-center space-x-2">
                {(currentStep.advanceOn.type === 'manual_next' || currentStep.advanceOn.type === 'all_instructions_done') && (
                  <button
                    onClick={nextStep}
                    disabled={!canAdvanceManually}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-full border border-primary bg-primary text-on-primary text-xs font-inter font-medium hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span>Next step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sticky Moderator Notes Footer */}
      {isModerated && (
        <div className="sticky bottom-0 bg-surface-bright border-t border-border-divider p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-wider uppercase text-text-muted">
              Moderator notes
            </span>
            {showSavedToast && (
              <span className="flex items-center text-[11px] font-mono text-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Auto-saved
              </span>
            )}
          </div>
          <textarea
            value={moderatorNotes}
            onChange={handleNotesChange}
            placeholder="Type observations, tester feedback, or distress indicators... (saves automatically)"
            className="w-full h-24 p-3 text-sm font-inter rounded-input border border-border-divider bg-white text-on-surface placeholder:text-text-muted focus:outline-none focus:border-primary resize-none shadow-sm"
          />
        </div>
      )}
    </aside>
  )
}
