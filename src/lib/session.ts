import { supabase, type SessionInsert } from './supabase'
import { telemetry, EventTypes } from './telemetry'
import { useStore } from './store'
import type { Cohort } from '../config/scenarios'

const SESSION_STORAGE_KEY = 'grace_session'

export interface StoredSession {
  sessionId: string
  nickname: string
  inviteCode: string
  cohort: Cohort
  scenarioId: string
  lastScreenId: string
}

export async function createSession(data: {
  nickname: string
  inviteCode: string
  cohort: Cohort
  scenarioId: string
  isModerated: boolean
}): Promise<string> {
  const sessionData: SessionInsert = {
    invite_code: data.inviteCode.toUpperCase(),
    cohort: data.cohort,
    scenario_id: data.scenarioId,
    nickname: data.nickname,
    started_at: new Date().toISOString(),
    user_agent: navigator.userAgent,
    viewport_width: window.innerWidth,
    is_moderated: data.isModerated,
  }

  const { data: result, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`)
  }

  const sessionId = result.id

  // Reset the store to clear any leftover in-memory progress from previous runs
  useStore.getState().reset()

  // Store in Zustand
  useStore.setState({
    sessionId,
    nickname: data.nickname,
    inviteCode: data.inviteCode,
    cohort: data.cohort,
    scenarioId: data.scenarioId,
    startedAt: new Date(),
    isModerated: data.isModerated,
  })

  // Store in localStorage for resume
  const stored: StoredSession = {
    sessionId,
    nickname: data.nickname,
    inviteCode: data.inviteCode,
    cohort: data.cohort,
    scenarioId: data.scenarioId,
    lastScreenId: 'guided',
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stored))

  return sessionId
}

export async function recordConsent(sessionId: string): Promise<void> {
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('sessions')
    .update({ consented_at: now })
    .eq('id', sessionId)

  if (error) {
    console.error('Failed to record consent:', error)
  }

  // Update Zustand
  useStore.setState({
    consentedAt: new Date(now),
  })

  // Log event
  telemetry.track(EventTypes.CONSENT_GIVEN, {
    timestamp: now,
  })
}

export async function saveSurveyResponses(
  sessionId: string,
  endSurvey: Record<string, any>,
  susResponses: { responses: number[]; score: number },
  pricingResponse?: string
): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({
      end_survey: endSurvey,
      sus_responses: susResponses,
      pricing_response: pricingResponse || null
    })
    .eq('id', sessionId)

  if (error) {
    console.error('Failed to save survey responses:', error)
    throw error
  }
}

export async function recordSessionComplete(sessionId: string, endedEarly: boolean = false): Promise<void> {
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('sessions')
    .update({
      completed_at: now,
      ended_early: endedEarly,
    })
    .eq('id', sessionId)

  if (error) {
    console.error('Failed to record session completion:', error)
  }

  telemetry.track(EventTypes.SESSION_COMPLETED, {
    ended_early: endedEarly,
  })

  // Clear stored session
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function getStoredSession(): StoredSession | null {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as StoredSession
  } catch {
    return null
  }
}

export async function validateStoredSession(stored: StoredSession): Promise<{ valid: boolean; completed: boolean }> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('completed_at, consented_at')
      .eq('id', stored.sessionId)
      .single()

    if (error || !data) {
      return { valid: false, completed: false }
    }

    // Valid if not completed
    return {
      valid: data.consented_at !== null,
      completed: data.completed_at !== null,
    }
  } catch {
    return { valid: false, completed: false }
  }
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  useStore.getState().reset()
  telemetry.track(EventTypes.SESSION_RESET, {})
}

export function updateStoredScreen(screenId: string): void {
  const stored = getStoredSession()
  if (stored) {
    stored.lastScreenId = screenId
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stored))
  }
}
