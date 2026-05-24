import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { COHORT_SURVEYS, PRICING_THROUGH_QUESTION } from '../config/surveys'
import { LikertItem } from '../components/survey/LikertItem'
import { SUSForm } from '../components/survey/SUSForm'
import { calculateSUSScore } from '../lib/sus'
import { saveSurveyResponses } from '../lib/session'
import { Button } from '../components/ui'
import { telemetry, EventTypes } from '../lib/telemetry'

export default function EndSurvey() {
  const navigate = useNavigate()
  const { sessionId, cohort } = useStore()

  // Fallback to 'women' if cohort is not set (e.g. during a direct link navigation)
  const activeCohort = cohort || 'women'
  const surveyConfig = COHORT_SURVEYS[activeCohort]

  // Custom Likerts state
  const [likertAnswers, setLikertAnswers] = useState<Record<string, number>>({})

  // SUS answers state (10 items)
  const [susAnswers, setSusAnswers] = useState<(number | null)[]>(Array(10).fill(null))

  // Open-text state
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({})

  // Pricing throwaway state
  const [pricingAnswer, setPricingAnswer] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validation: Likerts are required
  const allLikertsAnswered = surveyConfig.likertQuestions.every(
    (q) => likertAnswers[q.id] !== undefined
  )

  // Validation: SUS is required
  const allSUSAnswered = susAnswers.every((val) => val !== null)

  // Validation: Open reflections are required
  const allOpenAnswered = surveyConfig.openQuestions.every(
    (q) => openAnswers[q.id]?.trim() !== '' && openAnswers[q.id] !== undefined
  )

  // Validation: Pricing is required if applicable
  const pricingAnswered = !surveyConfig.hasPricingThrowaway || pricingAnswer.trim() !== ''

  const isFormValid = allLikertsAnswered && allSUSAnswered && allOpenAnswered && pricingAnswered

  const handleLikertChange = (qId: string, value: number) => {
    setLikertAnswers((prev) => {
      const updated = { ...prev, [qId]: value }
      telemetry.track(EventTypes.SURVEY_ANSWER, { question_id: qId, answer: value })
      return updated
    })
  }

  const handleSUSChange = (index: number, value: number) => {
    setSusAnswers((prev) => {
      const updated = [...prev]
      updated[index] = value
      telemetry.track(EventTypes.SURVEY_ANSWER, { question_id: `sus_${index + 1}`, answer: value })
      return updated
    })
  }

  const handleOpenChange = (qId: string, value: string) => {
    setOpenAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleOpenBlur = (qId: string, value: string) => {
    telemetry.trackTextInput(`survey_${qId}`, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !sessionId) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Calculate SUS score
      const susResult = calculateSUSScore(susAnswers as number[])

      // Compile end survey answers
      const endSurveyPayload = {
        ...likertAnswers,
        ...openAnswers
      }

      // Save to database
      await saveSurveyResponses(
        sessionId,
        endSurveyPayload,
        susResult,
        surveyConfig.hasPricingThrowaway ? pricingAnswer : undefined
      )

      telemetry.track(EventTypes.SUS_COMPLETE, { score: susResult.score })

      // Proceed
      navigate('/post-survey')
    } catch (err: unknown) {
      console.error('Failed to submit survey:', err)
      const msg = err instanceof Error ? err.message : 'Submission failed'
      setError(`Failed to submit: ${msg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-6 sm:py-10 px-2 sm:px-4">
      <div className="w-full max-w-2xl bg-white border border-border-divider rounded-card p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="border-b border-border-divider pb-6">
          <span className="text-label-sm text-text-muted uppercase tracking-wider font-mono">
            {activeCohort} cohort survey
          </span>
          <h1 className="text-headline-lg font-newsreader text-on-surface mt-2">
            Feedback questionnaire
          </h1>
          <p className="text-body-md text-text-secondary mt-2 font-inter">
            Thank you for helping us evaluate Grace. Your responses are kept confidential within the research team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Custom Cohort Likerts */}
          <div className="space-y-4">
            <h2 className="text-headline-md font-newsreader text-on-surface mb-2">
              General feedback
            </h2>
            <div className="flex flex-col">
              {surveyConfig.likertQuestions.map((q) => (
                <LikertItem
                  key={q.id}
                  questionId={q.id}
                  questionText={q.text}
                  value={likertAnswers[q.id] || null}
                  onChange={(val) => handleLikertChange(q.id, val)}
                />
              ))}
            </div>
          </div>

          {/* SUS Scale */}
          <SUSForm answers={susAnswers} onChange={handleSUSChange} />

          {/* Cohort Open-text Questions */}
          <div className="space-y-6 pt-4 border-t border-border-divider">
            <h2 className="text-headline-md font-newsreader text-on-surface mb-2">
              Reflections
            </h2>
            {surveyConfig.openQuestions.map((q) => (
              <div key={q.id} className="flex flex-col gap-2">
                <label htmlFor={q.id} className="text-body-lg text-on-surface font-inter">
                  {q.text} <span className="text-primary font-normal text-sm">(required)</span>
                </label>
                <textarea
                  id={q.id}
                  rows={3}
                  value={openAnswers[q.id] || ''}
                  onChange={(e) => handleOpenChange(q.id, e.target.value)}
                  onBlur={(e) => handleOpenBlur(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full border border-border-divider rounded-input p-3 font-inter text-body-md bg-white focus:outline-none focus:border-primary resize-y"
                />
              </div>
            ))}
          </div>

          {/* Pricing Throwaway */}
          {surveyConfig.hasPricingThrowaway && (
            <div className="space-y-4 pt-6 border-t border-border-divider">
              <h2 className="text-headline-md font-newsreader text-on-surface">
                Platform considerations
              </h2>
              <div className="flex flex-col gap-2">
                <label htmlFor="pricing" className="text-body-lg text-on-surface font-inter">
                  {PRICING_THROUGH_QUESTION} <span className="text-primary font-normal text-sm">(required)</span>
                </label>
                <textarea
                  id="pricing"
                  rows={3}
                  value={pricingAnswer}
                  onChange={(e) => setPricingAnswer(e.target.value)}
                  onBlur={(e) => telemetry.trackTextInput('survey_pricing', e.target.value)}
                  placeholder="Share your professional feedback..."
                  className="w-full border border-border-divider rounded-input p-3 font-inter text-body-md bg-white focus:outline-none focus:border-primary resize-y"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-container rounded-input border border-error text-on-error-container text-body-md font-inter">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-6 border-t border-border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-label-sm text-text-muted font-inter">
              {!isFormValid && 'Please complete all numbered Likert, reflection, and pricing questions to submit.'}
              {isFormValid && 'All required fields completed.'}
            </p>
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting}
              isLoading={isSubmitting}
              className="px-8 self-end"
            >
              Submit answers
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
