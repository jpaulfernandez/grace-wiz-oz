import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
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
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
