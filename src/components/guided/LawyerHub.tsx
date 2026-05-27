import { Calendar, Paperclip, BookOpen, Lock, Unlock, CheckCircle2, FileText, Sparkles } from 'lucide-react'
import { Button } from '../ui'
import { telemetry } from '../../lib/telemetry'

interface LawyerHubProps {
  nickname: string
  advanceTour: () => void
  handleManualNext: () => void
  isRequestingIncidents: boolean
  setIsRequestingIncidents: (v: boolean) => void
  isPendingIncidents: boolean
  setIsPendingIncidents: (v: boolean) => void
  isRequestingJournals: boolean
  setIsRequestingJournals: (v: boolean) => void
  isPendingJournals: boolean
  setIsPendingJournals: (v: boolean) => void
  providerChatMessages: any[]
  handleSendProviderMessage: (text: string) => void
  isProviderChatTyping: boolean
  providerNotes: string[]
  setProviderNotes: React.Dispatch<React.SetStateAction<string[]>>
  currentProviderNote: string
  setCurrentProviderNote: (v: string) => void
  providerNotesSaved: boolean
  setProviderNotesSaved: (v: boolean) => void
  currentStep: any
  markInstructionComplete: (stepId: string, insId: string) => void
  activeScreen: string
}

export function LawyerHub({
  nickname,
  advanceTour,
  handleManualNext,
  isRequestingIncidents,
  setIsRequestingIncidents,
  isPendingIncidents,
  setIsPendingIncidents,
  isRequestingJournals,
  setIsRequestingJournals,
  isPendingJournals,
  setIsPendingJournals,
  providerChatMessages,
  handleSendProviderMessage,
  isProviderChatTyping,
  providerNotes,
  setProviderNotes,
  currentProviderNote,
  setCurrentProviderNote,
  providerNotesSaved,
  setProviderNotesSaved,
  currentStep,
  markInstructionComplete,
  activeScreen,
}: LawyerHubProps) {
  switch (activeScreen) {
    case 'lawyer-dashboard':
      return (
        <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
          <div>
            <h1 className="text-xl font-medium font-newsreader text-on-surface mb-1">
              Advocate Hub
            </h1>
            <p className="text-xs font-mono text-text-muted">Logged in as {nickname || 'Lawyer'}</p>
          </div>

          <button
            id="booking-notification"
            onClick={() => {
              telemetry.trackButtonTap('booking-notification')
              advanceTour()
            }}
            className="w-full text-left p-5 bg-white border border-border-divider hover:border-primary rounded-card shadow-sm transition-all focus:outline-none flex items-start space-x-4 group animate-fade-in"
          >
            <div className="p-3 bg-primary-container text-primary rounded-input group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
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
        <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left animate-fade-in">
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
              advanceTour()
            }}
            variant="primary"
            className="w-full py-4 text-sm font-medium animate-fade-in"
          >
            Accept Request
          </Button>
        </div>
      )

    case 'lawyer-artifacts':
      return (
        <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left animate-fade-in">
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
                  <span className="inline-flex items-center gap-1 text-[10px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full font-mono mt-1">
                    <Lock className="w-2.5 h-2.5" /> Redacted & Locked
                  </span>
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
                  <span className="inline-flex items-center gap-1 text-[10px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full font-mono mt-1">
                    <Lock className="w-2.5 h-2.5" /> Redacted & Locked
                  </span>
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
              Chat with Jane's record & journal &rarr;
            </Button>
          )}
        </div>
      )

    case 'lawyer-chat':
      return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none animate-fade-in">
          <div className="p-4 border-b border-border-divider bg-white text-left">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Secured AI Retrieval</span>
            <h3 className="text-sm font-medium font-inter text-on-surface">Client Record Assistant</h3>
          </div>

          <div className="p-3 bg-secondary-container text-secondary text-[11px] leading-relaxed font-inter flex items-start space-x-2 text-left">
            <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
            <span>You are asking questions about entries Jane wrote. The Companion only responds based on direct records and cites all evidence. You cannot message her from here.</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col min-h-0">
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
                    {msg.citations.map((cite: string, cIdx: number) => (
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

          <div className="p-3 bg-white border-t border-border-divider space-y-2 text-left shrink-0">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Suggested Queries</p>
            <div className="flex flex-wrap gap-2">
              <button
                id="chat-suggestion-timeline"
                onClick={() => {
                  telemetry.trackButtonTap('provider-suggestion-timeline')
                  handleSendProviderMessage('Show me the timeline')
                  if (currentStep) {
                    const ins = currentStep.instructionSteps?.find((i: any) => i.id === 'la-chat-timeline' || i.id === 'ca-chat-timeline')
                    if (ins) markInstructionComplete(currentStep.id, ins.id)
                  }
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
                  if (currentStep) {
                    const ins = currentStep.instructionSteps?.find((i: any) => i.id === 'la-chat-evidence' || i.id === 'ca-chat-evidence')
                    if (ins) markInstructionComplete(currentStep.id, ins.id)
                  }
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
                  if (currentStep) {
                    const ins = currentStep.instructionSteps?.find((i: any) => i.id === 'la-chat-named' || i.id === 'ca-chat-named')
                    if (ins) markInstructionComplete(currentStep.id, ins.id)
                  }
                }}
                className="text-[10px] font-inter font-medium text-primary hover:text-on-primary bg-primary-container/30 hover:bg-primary border border-primary-container px-2.5 py-1 rounded-full transition-all focus:outline-none"
              >
                Has she named what happened?
              </button>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-border-divider shrink-0">
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
        <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left animate-fade-in">
          <div>
            <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Intake Notes</h2>
            <p className="text-xs font-mono text-text-muted">Chronological case activity logs</p>
          </div>

          <div className="bg-primary-container/20 border border-primary-container rounded-card p-4 space-y-2">
            <h3 className="text-sm font-semibold text-primary font-inter flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Synthesis (Legal Assessment)</span>
            </h3>
            <div className="text-xs font-inter text-text-secondary leading-relaxed space-y-2">
              <p>
                <strong>Hostile Work Environment Assessment (RA 11313 - Safe Spaces Act):</strong><br />
                The self-reported timeline outlines 3 chronologically consistent incidents involving coworker Marco:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>May 14 (Desk):</strong> Unwanted verbal remarks and gender-based "green jokes" causing high distress.</li>
                <li><strong>May 19 (Lobby):</strong> Physical boundary violations, path blocking, and intimidation near elevator.</li>
                <li><strong>May 23 (Pantry):</strong> Severe workplace boundary intrusion with a corroborating witness J. logged in the blotted intake.</li>
              </ul>
              <p>
                <strong>Behavioral modification:</strong> Telemetry indicates persistent flight behavior (elevator avoidance, climbing 14 flights of stairs daily) to avoid Marco, supporting evidence of a hostile work environment.
              </p>
              <p className="text-[10px] font-semibold text-text-muted mt-2">
                Note: This is an AI-generated summary and should be reviewed by legal counsel.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-white border border-border-divider rounded-card p-4 max-h-[220px] overflow-y-auto">
            {providerNotes.map((note, index) => (
              <div key={index} className="text-xs font-inter border-b border-border-divider pb-2 last:border-b-0">
                <p className="text-on-surface-variant leading-relaxed">{note}</p>
              </div>
            ))}
          </div>

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
                if (currentStep) {
                  const ins = currentStep.instructionSteps?.find((i: any) => i.id === 'la-save-notes' || i.id === 'ca-save-notes')
                  if (ins) markInstructionComplete(currentStep.id, ins.id)
                }
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
        <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto flex flex-col justify-between animate-fade-in text-left">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Evidence Export</h2>
              <p className="text-xs font-mono text-text-muted">Secure ledger certified payload</p>
            </div>

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

          <div className="space-y-3 pt-4 border-t border-border-divider shrink-0">
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
      return null
  }
}
