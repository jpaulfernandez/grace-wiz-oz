import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { lookupScenario } from '../config/scenarios'
import { useStore } from '../lib/store'
import { getStoredSession, validateStoredSession, clearStoredSession, type StoredSession } from '../lib/session'
import { telemetry, EventTypes } from '../lib/telemetry'

interface FormInputs {
  nickname: string
  inviteCode: string
  email?: string
}

export default function Welcome() {
  const navigate = useNavigate()
  const [codeError, setCodeError] = useState<string | null>(null)
  const [resumeSession, setResumeSession] = useState<StoredSession | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      nickname: '',
      inviteCode: '',
      email: '',
    },
  })

  useEffect(() => {
    const checkStoredSession = async () => {
      const stored = getStoredSession()
      if (stored) {
        const { valid, completed } = await validateStoredSession(stored)
        if (valid && !completed) {
          setResumeSession(stored)
          // Restore Zustand state
          useStore.setState({
            sessionId: stored.sessionId,
            nickname: stored.nickname,
            inviteCode: stored.inviteCode,
            cohort: stored.cohort,
            scenarioId: stored.scenarioId,
          })
        }
      }
      setIsCheckingSession(false)
    }

    checkStoredSession()
  }, [])

  const onSubmit = handleSubmit((data) => {
    setCodeError(null)

    const scenario = lookupScenario(data.inviteCode)

    if (!scenario) {
      setCodeError('Code not recognized — check with your moderator')
      return
    }

    if (data.email) {
      telemetry.track('email_collected', { email: data.email })
    }

    // Store in Zustand
    useStore.setState({
      nickname: data.nickname.trim(),
      inviteCode: data.inviteCode.trim().toUpperCase(),
      cohort: scenario.cohort,
      scenarioId: scenario.scenarioId,
      currentScreen: 'consent',
    })

    // Navigate to consent
    navigate('/consent')
  })

  const handleResume = () => {
    if (resumeSession) {
      telemetry.init(resumeSession.sessionId, resumeSession.lastScreenId)
      telemetry.track(EventTypes.SESSION_RESUMED, {})
      navigate('/guided')
    }
  }

  const handleStartOver = () => {
    telemetry.track(EventTypes.SESSION_RESET, {})
    clearStoredSession()
    setResumeSession(null)
  }

  const inviteCodeValue = watch('inviteCode')

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <p className="text-base font-inter text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (resumeSession) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-edge py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-12">
              <h1 className="text-2xl font-medium font-newsreader text-on-surface mb-2">
                Welcome back
              </h1>
              <p className="text-base font-inter text-text-secondary">
                You have an incomplete session, {resumeSession.nickname}
              </p>
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={handleResume}
              >
                Resume session
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleStartOver}
              >
                Start over
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-edge py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-medium font-newsreader text-on-surface mb-2">
              Welcome
            </h1>
            <p className="text-base font-inter text-text-secondary">
              Let's get started with the session
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Nickname"
              placeholder="How would you like to be called?"
              error={errors.nickname?.message}
              {...register('nickname', {
                required: 'Please enter a nickname',
                minLength: {
                  value: 2,
                  message: 'Nickname must be at least 2 characters',
                },
                maxLength: {
                  value: 30,
                  message: 'Nickname must be 30 characters or less',
                },
              })}
            />

            <Input
              label="Invite code"
              placeholder="e.g. GRACE-W-01"
              error={codeError || errors.inviteCode?.message}
              {...register('inviteCode', {
                required: 'Please enter your invite code',
                onChange: () => setCodeError(null),
              })}
            />

            <Input
              label="Email address (Optional)"
              placeholder="e.g. jane@example.com"
              type="email"
              error={errors.email?.message}
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            
            <p className="text-[11px] font-inter text-text-muted mt-2">
              If you want to receive early news on our product, you may add your email address.
            </p>

            {inviteCodeValue && !codeError && lookupScenario(inviteCodeValue) && (
              <div className="text-sm font-inter text-primary mt-2">
                ✓ Code recognized
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="pb-8 px-edge">
        <p className="text-center text-sm font-inter text-text-muted">
          You can pause or end the session at any time
        </p>
      </div>
    </div>
  )
}
