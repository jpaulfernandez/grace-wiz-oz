import { supabase } from './supabase'

// All telemetry event types
export const EventTypes = {
  SESSION_START: 'session_start',
  CONSENT_GIVEN: 'consent_given',
  CONSENT_DECLINED: 'consent_declined',
  SESSION_PAUSED: 'session_paused',
  SESSION_RESUMED: 'session_resumed',
  SESSION_RESET: 'session_reset',
  SESSION_COMPLETED: 'session_completed',
  SCREEN_ENTER: 'screen_enter',
  SCREEN_EXIT: 'screen_exit',
  BUTTON_TAP: 'button_tap',
  TEXT_INPUT: 'text_input',
  CHAT_SEND: 'chat_send',
  CHAT_AI_REPLY: 'chat_ai_reply',
  HANDOFF_CHIP_TAP: 'handoff_chip_tap',
  JOURNAL_SAVE: 'journal_save',
  INCIDENT_SAVE: 'incident_save',
  CRISIS_BUTTON_TAP: 'crisis_button_tap',
  CRISIS_RESOLVED: 'crisis_resolved',
  MICRO_PROMPT_ANSWER: 'micro_prompt_answer',
  SURVEY_ANSWER: 'survey_answer',
  SUS_COMPLETE: 'sus_complete',
  MODERATOR_NOTE: 'moderator_note',
  FREE_ROAM_START: 'free_roam_start',
  VIEW_AS_USER_TOGGLE: 'view_as_user_toggle',
  PDF_DOWNLOAD: 'pdf_download',
  TOUR_STEP_SHOWN: 'tour_step_shown',
  TOUR_STEP_ADVANCED: 'tour_step_advanced',
  TOUR_IDLE_30S: 'tour_idle_30s',
  TOUR_IDLE_60S: 'tour_idle_60s',
  TOUR_IDLE_90S: 'tour_idle_90s',
  TOUR_OFF_PATH: 'tour_off_path',
  TOUR_SKIPPED: 'tour_skipped',
  SCENARIO_STARTED: 'scenario_started',
  SCENARIO_COMPLETED: 'scenario_completed',
  REFLECTION_COMPLETED: 'reflection_completed',
  INSTRUCTION_HIGHLIGHTED: 'instruction_highlighted',
  INSTRUCTION_AUTO_COMPLETED: 'instruction_auto_completed',
  MICRO_PROMPT_ANSWERED: 'microprompt_answered',
  EMAIL_COLLECTED: 'email_collected',
} as const

export type EventType = (typeof EventTypes)[keyof typeof EventTypes]

export interface QueuedEvent {
  session_id: string
  ts: string
  screen_id?: string
  event_type: EventType
  payload: Record<string, unknown>
}

const STORAGE_KEY = 'grace_telemetry_backup'
const FLUSH_INTERVAL_MS = 5000 // 5 seconds
const MAX_BACKUP_EVENTS = 100

class TelemetryManager {
  private queue: QueuedEvent[] = []
  private sessionId: string | null = null
  private currentScreen: string | null = null
  private flushIntervalId: ReturnType<typeof setInterval> | null = null
  private isInitialized = false

  init(sessionId: string, initialScreen: string = 'welcome') {
    if (this.isInitialized) {
      console.warn('Telemetry already initialized')
      return
    }

    this.sessionId = sessionId
    this.currentScreen = initialScreen
    this.isInitialized = true

    // Load any backed-up events from previous sessions
    this.loadBackup()

    // Start flush interval
    this.flushIntervalId = setInterval(() => this.flush(), FLUSH_INTERVAL_MS)

    // Set up page unload handler for final flush
    window.addEventListener('beforeunload', this.boundHandleBeforeUnload)
    window.addEventListener('unload', this.boundHandleUnload)

    // Log session start
    this.track(EventTypes.SESSION_START, {
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
    })
  }

  setScreen(screenId: string) {
    if (this.currentScreen) {
      this.track(EventTypes.SCREEN_EXIT, { screen: this.currentScreen })
    }
    this.currentScreen = screenId
    this.track(EventTypes.SCREEN_ENTER, { screen: screenId })
  }

  track(eventType: EventType, payload: Record<string, unknown> = {}) {
    if (!this.sessionId) {
      console.warn('Telemetry not initialized - call init() first')
      return
    }

    const event: QueuedEvent = {
      session_id: this.sessionId,
      ts: new Date().toISOString(),
      screen_id: this.currentScreen || undefined,
      event_type: eventType,
      payload,
    }

    this.queue.push(event)

    // Immediate flush for certain high-priority events
    const immediateFlushEvents: EventType[] = [
      EventTypes.SCREEN_ENTER,
      EventTypes.SESSION_COMPLETED,
      EventTypes.CONSENT_GIVEN,
    ]

    if (immediateFlushEvents.includes(eventType)) {
      this.flush()
    }
  }

  trackButtonTap(buttonId: string, extra?: Record<string, unknown>) {
    this.track(EventTypes.BUTTON_TAP, {
      button_id: buttonId,
      ...extra,
    })
  }

  trackTextInput(fieldId: string, value: string, extra?: Record<string, unknown>) {
    // Only log final value, never keystroke-level
    this.track(EventTypes.TEXT_INPUT, {
      field_id: fieldId,
      value_length: value.length,
      ...extra,
    })
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const eventsToFlush = [...this.queue]
    this.queue = []

    try {
      const { error } = await supabase.from('events').insert(eventsToFlush)

      if (error) {
        console.error('Telemetry flush failed:', error)
        // Put events back in queue and back up to localStorage
        this.queue = [...eventsToFlush, ...this.queue]
        this.backupQueue()
      }
    } catch (e) {
      console.error('Telemetry flush error:', e)
      this.queue = [...eventsToFlush, ...this.queue]
      this.backupQueue()
    }
  }

  private backupQueue() {
    try {
      // Keep only most recent MAX_BACKUP_EVENTS
      const toBackup = this.queue.slice(-MAX_BACKUP_EVENTS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toBackup))
    } catch (e) {
      console.error('Failed to backup telemetry:', e)
    }
  }

  private loadBackup() {
    try {
      const backup = localStorage.getItem(STORAGE_KEY)
      if (backup) {
        const backedUpEvents = JSON.parse(backup) as QueuedEvent[]
        this.queue = [...backedUpEvents, ...this.queue]
        localStorage.removeItem(STORAGE_KEY)
        // Flush backed up events soon
        setTimeout(() => this.flush(), 1000)
      }
    } catch (e) {
      console.error('Failed to load telemetry backup:', e)
    }
  }

  private readonly boundHandleBeforeUnload: (e: BeforeUnloadEvent) => void
  private readonly boundHandleUnload: () => void

  constructor() {
    this.boundHandleBeforeUnload = this.handleBeforeUnload.bind(this)
    this.boundHandleUnload = this.handleUnload.bind(this)
  }

  private handleBeforeUnload(_e: BeforeUnloadEvent) {
    // Flush synchronously if we have events
    if (this.queue.length > 0) {
      this.flush()
    }
  }

  private handleUnload() {
    // Last attempt: backup to localStorage
    if (this.queue.length > 0) {
      try {
        this.backupQueue()
      } catch {
        // Best effort only
      }
    }
  }

  async flushAndShutdown(): Promise<void> {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId)
      this.flushIntervalId = null
    }
    window.removeEventListener('beforeunload', this.boundHandleBeforeUnload)
    window.removeEventListener('unload', this.boundHandleUnload)

    await this.flush()
    this.isInitialized = false
  }

  // For testing: get queue state
  getQueueForTest(): readonly QueuedEvent[] {
    return [...this.queue]
  }

  // For testing: clear queue
  clearQueueForTest() {
    this.queue = []
  }
}

// Singleton instance
export const telemetry = new TelemetryManager()

// Convenience exports
export { EventTypes as Events }
