import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Heart, Phone } from 'lucide-react'
import { Button, Checkbox } from '../components/ui'
import { getConsentForCohort } from '../config/consent'
import { useStore } from '../lib/store'
import { createSession, recordConsent } from '../lib/session'
import { telemetry } from '../lib/telemetry'

// Simple component to render markdown-like text
function FormattedText({ text }: { text: string }) {
  // Split by double newlines for paragraphs
  const paragraphs = text.split('\n\n')

  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        // Check if it's a bold heading (starts with **)
        const boldMatch = para.match(/^\*\*(.+?)\*\*(.*)$/s)
        if (boldMatch) {
          const [, heading, rest] = boldMatch
          return (
            <div key={idx}>
              <p className="font-medium font-inter text-on-surface mb-2">
                {heading}
              </p>
              {rest.trim() && (
                <p className="text-base font-inter text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {rest.trim()}
                </p>
              )}
            </div>
          )
        }
        return (
          <p
            key={idx}
            className="text-base font-inter text-on-surface-variant leading-relaxed whitespace-pre-line"
          >
            {para}
          </p>
        )
      })}
    </div>
  )
}

function TriggerWarning({ text }: { text: string }) {
  return (
    <div className="bg-secondary-container p-5 rounded-card">
      <FormattedText text={text} />
    </div>
  )
}

export default function Consent() {
  const navigate = useNavigate()
  const store = useStore()
  const cohort = store.cohort
  const nickname = store.nickname
  const inviteCode = store.inviteCode
  const scenarioId = store.scenarioId

  const [step, setStep] = useState<'consent' | 'trigger_warning' | 'back_later'>('consent')

  // Proactively clear previous session walkthrough progress and checklist variables to avoid bugs
  useEffect(() => {
    store.setSession({
      guidedCompletedAt: null,
      freeRoamStartedAt: null,
      completedAt: null
    })
    useStore.setState({
      currentScenarioIndex: 0,
      currentStepIndex: 0,
      guidedMode: 'step',
      completedInstructions: {},
      reflectionAnswers: {},
      chatMessagesCount: 0,
      chatInputText: '',
      journalTextContent: '',
      clickedAnnotations: [],
      incidentNotes: '',
      isIncidentsRequested: false,
      isJournalsRequested: false,
      providerChatCount: 0,
      providerNotesCount: 0,
      letGoButtonClicked: false
    })
  }, [])
  const [understoodCheckbox, setUnderstoodCheckbox] = useState(false)
  const [canPauseCheckbox, setCanPauseCheckbox] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isModerated = new URLSearchParams(window.location.search).has('mod')

  const canSubmit = understoodCheckbox && canPauseCheckbox

  if (!cohort || !scenarioId) {
    // Missing cohort/scenario - go back to welcome
    navigate('/')
    return null
  }

  const consent = getConsentForCohort(cohort)

  const handleBack = () => {
    navigate('/')
  }

  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Create session first
      const sessionId = await createSession({
        nickname,
        inviteCode,
        cohort,
        scenarioId,
        isModerated,
      })

      // Initialize telemetry
      telemetry.init(sessionId, 'consent')

      // Record consent
      await recordConsent(sessionId)

      // Set default screen for free roam admin
      if (scenarioId === 'free-01') {
        useStore.setState({ currentScreen: 'guided-home' })
      }

      // Navigate to guided
      navigate('/guided')
    } catch (e: unknown) {
      console.error('Failed to create session:', e)
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      setError(`Failed to create session: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render trigger warning headspace step
  if (step === 'trigger_warning') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center px-edge py-12">
        <div className="max-w-xl mx-auto w-full space-y-8 animate-fade-in text-left">
          
          <div className="bg-rose-50/60 border border-rose-200 p-6 rounded-card shadow-sm flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold font-inter text-rose-950">
                Sensitive Content Warning
              </h2>
              <p className="text-sm font-inter text-rose-900 leading-relaxed">
                This study is evaluating prototype features that support women navigating gender-based harm. The upcoming scenarios depict and describe real-world instances of <strong>Sexual Harassment</strong>, workplace intrusions, and somatic distress.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-base font-inter text-on-surface-variant leading-relaxed">
              We care deeply about your emotional and mental well-being. Please reflect on your current headspace before choosing to proceed.
            </p>
            <p className="text-sm font-inter text-text-secondary leading-relaxed font-medium">
              You are welcome to pause, skip, or terminate your session at any point without any impact on your standing or compensation.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-error-container rounded-card">
              <p className="text-sm font-inter text-on-error-container">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1 py-4 text-sm font-semibold"
              onClick={handleSubmit}
            >
              I am in proper headspace
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              className="flex-1 py-4 text-sm font-semibold"
              onClick={() => setStep('back_later')}
            >
              I will be back later
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render take care step
  if (step === 'back_later') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center px-edge py-12">
        <div className="max-w-md mx-auto w-full bg-neutral-50/50 border border-border-divider p-8 rounded-card shadow-lg text-left space-y-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Heart className="w-6 h-6 fill-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface">
                Take care of yourself
              </h2>
              <p className="text-xs font-mono text-text-muted">Your well-being comes first</p>
            </div>
          </div>

          <p className="text-sm font-inter text-text-secondary leading-relaxed">
            Thank you for prioritizing your well-being today. It is completely okay to step away and return at a time that works better for you. There is absolutely no pressure or penalty—your health and comfort always come first.
          </p>

          <div className="border-t border-border-divider pt-5 space-y-4">
            <h3 className="text-xs font-semibold text-on-surface font-inter uppercase tracking-wider">
              Philippine Support Resources
            </h3>
            
            <div className="space-y-3">
              <div className="bg-white border border-border-divider p-4 rounded-xl space-y-1">
                <span className="text-xs font-semibold font-inter text-on-surface block">Lunas Collective</span>
                <span className="text-[11px] font-inter text-text-secondary leading-normal block">
                  A feminist, chat-based helpline for gender-based violence support and referral.
                </span>
                <a
                  href="https://lunascollective.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-medium hover:underline inline-block pt-1 font-mono"
                >
                  lunascollective.org
                </a>
              </div>

              <div className="bg-white border border-border-divider p-4 rounded-xl space-y-1">
                <span className="text-xs font-semibold font-inter text-on-surface block">National Mental Health Crisis Hotline</span>
                <span className="text-[11px] font-inter text-text-secondary leading-normal block">
                  24/7 national helpline provided by the Department of Health (DOH).
                </span>
                <div className="text-xs text-text-secondary space-y-0.5 pt-1 font-mono">
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary shrink-0" /> Dial: 1553 (Luzon toll-free)</p>
                  <p className="pl-5">Mobile: 0917-899-8727 / 0966-351-4518</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={handleBack}
            >
              Return to welcome screen
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default: consent form step
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center h-14 px-4 border-b border-border-divider">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="ml-2 text-base font-medium font-inter text-on-surface">
          Consent
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-edge py-8 space-y-8">
          {/* Trigger Warning */}
          <TriggerWarning text={consent.triggerWarning} />

          {/* Consent Text */}
          <div>
            <h2 className="text-xl font-medium font-newsreader text-on-surface mb-4">
              Consent
            </h2>
            <FormattedText text={consent.consentText} />
          </div>

          {/* Distress Disclosure (women cohort only) */}
          {consent.distressDisclosure && (
            <div className="bg-primary-container p-5 rounded-card">
              <p className="text-base font-inter text-on-primary-container leading-relaxed">
                {consent.distressDisclosure}
              </p>
            </div>
          )}

          {/* Checkboxes */}
          <div className="space-y-4 pt-4">
            <Checkbox
              checked={understoodCheckbox}
              onCheckedChange={(checked) =>
                setUnderstoodCheckbox(checked === true)
              }
              label="I understand and want to continue"
            />
            <Checkbox
              checked={canPauseCheckbox}
              onCheckedChange={(checked) =>
                setCanPauseCheckbox(checked === true)
              }
              label="I understand I can pause or stop at any time"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-error-container rounded-card">
              <p className="text-sm font-inter text-on-error-container">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="pb-8">
            <Button
              type="button"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!canSubmit}
              className="w-full"
              onClick={() => setStep('trigger_warning')}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
