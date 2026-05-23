import { useState } from 'react'
import { telemetry } from '../../lib/telemetry'
import { useStore } from '../../lib/store'
import { Button } from '../../components/ui'
import {
  BookOpen,
  Calendar,
  Paperclip,
  ShieldAlert,
  Unlock,
  CheckCircle2,
  FileText,
  Sparkles
} from 'lucide-react'

export function ProviderHubFreeRoam() {
  const { nickname, simulatedCohort } = useStore()
  const isLawyer = simulatedCohort === 'legal'
  
  // Local state for the provider flow in free roam
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'booking-detail' | 'artifacts' | 'chat' | 'notes' | 'export'>('dashboard')
  const [isBookingAccepted, setIsBookingAccepted] = useState(false)
  const [isRequestingIncidents, setIsRequestingIncidents] = useState(false)
  const [isRequestingJournals, setIsRequestingJournals] = useState(false)
  const [isPendingIncidents, setIsPendingIncidents] = useState(false)
  const [isPendingJournals, setIsPendingJournals] = useState(false)

  const [chatMessages, setChatMessages] = useState<{ sender: 'provider' | 'ai'; text: string; citations?: string[] }[]>([
    { sender: 'ai', text: isLawyer ? "Secure Pattern Retrieval engine active. Ask any questions about Jane's shared incident timeline." : "Secure Somatic Retrieval engine active. Ask any questions about Grace's somatic tension events." }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatTyping, setIsChatTyping] = useState(false)

  const handleSendChat = (text: string) => {
    if (!text.trim()) return
    setChatMessages(prev => [...prev, { sender: 'provider', text }])
    setChatInput('')
    setIsChatTyping(true)

    setTimeout(() => {
      setIsChatTyping(false)
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'This is a simulated AI response based on the secure corpus.',
        citations: ['Simulated Record']
      }])
    }, 1500)
  }

  if (currentScreen === 'dashboard') {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
        <div>
          <h1 className="text-xl font-medium font-newsreader text-on-surface mb-1">
            {isLawyer ? 'Advocate Hub' : 'Clinician Hub'}
          </h1>
          <p className="text-xs font-mono text-text-muted">Logged in as {nickname || (isLawyer ? 'Lawyer' : 'Clinician')}</p>
        </div>

        <button
          onClick={() => {
            telemetry.trackButtonTap('freeroam-booking-notification')
            setCurrentScreen('booking-detail')
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
              Jane has requested a {isLawyer ? 'legal' : 'clinical'} consultation. Click to review the intake profile.
            </p>
          </div>
        </button>
      </div>
    )
  }

  if (currentScreen === 'booking-detail') {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
        <button onClick={() => setCurrentScreen('dashboard')} className="text-xs text-text-muted mb-2 inline-block">&larr; Back to Dashboard</button>
        <div>
          <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Intake Details</h2>
          <p className="text-xs font-mono text-text-muted">Case ref: GRACE-FR-01</p>
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
              <span className={`font-medium ${!isBookingAccepted ? 'blur-sm select-none' : ''}`}>Jane Doe</span>
            </div>
            <div className="flex">
              <span className="w-24 text-text-muted">Location:</span>
              <span className={`font-medium ${!isBookingAccepted ? 'blur-sm select-none' : ''}`}>Metro Manila, Philippines</span>
            </div>
            <div className="flex">
              <span className="w-24 text-text-muted">Issue:</span>
              <span className={`font-medium ${!isBookingAccepted ? 'blur-sm select-none' : ''}`}>Seeking legal counsel for workplace harassment.</span>
            </div>
          </div>
          
          <h3 className="text-sm font-medium font-inter text-on-surface uppercase tracking-wider text-text-secondary pt-2 border-t border-border-divider">Synthesis</h3>
          
          {!isBookingAccepted ? (
            <div className="space-y-3">
              <p className="text-sm font-inter text-text-secondary leading-relaxed blur-sm select-none">
                The user's self-reported timeline outlines a series of workplace intrusions by coworker Marco matching gender-based hostile work environment criteria.
              </p>
              <p className="text-xs font-mono text-text-muted italic bg-neutral-100 p-2 text-center rounded">
                Client details are hidden to protect privacy. Accept the consultation request to reveal full context and request evidence access.
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm font-inter text-text-secondary leading-relaxed">
                The user's self-reported timeline outlines a series of workplace intrusions by coworker Marco matching gender-based hostile work environment criteria.
              </p>
              <div className="p-3 bg-primary-container/20 rounded-input border border-primary-container text-xs font-mono text-primary flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Somatic flags: 3 instances of chest tightness logged during encounters. Behavior modification detected: elevator avoidance (stair climbing).</span>
              </div>
            </div>
          )}
        </div>

        {!isBookingAccepted ? (
          <Button
            onClick={() => {
              telemetry.trackButtonTap('freeroam-accept-booking')
              setIsBookingAccepted(true)
            }}
            variant="primary"
            className="w-full py-4 text-sm font-medium"
          >
            Accept Request
          </Button>
        ) : (
          <Button
            onClick={() => {
              telemetry.trackButtonTap('freeroam-request-access')
              setCurrentScreen('artifacts')
            }}
            variant="secondary"
            className="w-full py-4 text-sm font-medium"
          >
            Request Jane's Data Access
          </Button>
        )}
      </div>
    )
  }

  if (currentScreen === 'artifacts') {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto">
        <button onClick={() => setCurrentScreen('booking-detail')} className="text-xs text-text-muted mb-2 inline-block">&larr; Back to Details</button>
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
                onClick={() => {
                  telemetry.trackButtonTap('freeroam-request-incident')
                  setIsPendingIncidents(true)
                  setTimeout(() => {
                    setIsPendingIncidents(false)
                    setIsRequestingIncidents(true)
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
                onClick={() => {
                  telemetry.trackButtonTap('freeroam-request-journal')
                  setIsPendingJournals(true)
                  setTimeout(() => {
                    setIsPendingJournals(false)
                    setIsRequestingJournals(true)
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
            <span>Verification Authority matches. Data is successfully decrypted and ready for assessment.</span>
          </div>
        )}

        {isRequestingIncidents && isRequestingJournals && (
          <Button
            onClick={() => {
              telemetry.trackButtonTap('freeroam-artifacts-next')
              setCurrentScreen('chat')
            }}
            variant="primary"
            className="w-full animate-fade-in"
          >
            Continue to corpus chat &rarr;
          </Button>
        )}
      </div>
    )
  }

  if (currentScreen === 'chat') {
    return (
      <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none">
        {/* Header */}
        <div className="p-4 border-b border-border-divider bg-white text-left flex items-center space-x-3">
          <button onClick={() => setCurrentScreen('artifacts')} className="text-xs text-text-muted">&larr;</button>
          <div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Secured AI Retrieval</span>
            <h3 className="text-sm font-medium font-inter text-on-surface">Client Record Assistant</h3>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-secondary-container text-secondary text-[11px] leading-relaxed font-inter flex items-start space-x-2 text-left">
          <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <span>You are asking questions about entries Jane wrote. The Companion only responds based on direct records and cites all evidence.</span>
        </div>

        {/* Message log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'provider' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-input text-xs font-inter max-w-[80%] text-left ${
                msg.sender === 'provider' 
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
          {isChatTyping && (
            <div className="flex items-center space-x-2 p-3 bg-white border border-border-divider rounded-input text-xs font-mono text-text-muted max-w-[70%] text-left">
              <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
              <span>Searching secure ledger...</span>
            </div>
          )}
        </div>

        {/* Suggestion Pills */}
        <div className="px-4 pb-2 space-y-2">
          <button 
            id="chat-suggestion-timeline"
            onClick={() => handleSendChat('Show me the timeline')}
            className="block w-full text-left p-3 text-xs font-inter border border-border-divider rounded-input text-primary hover:bg-primary-container/20"
          >
            Show me the timeline
          </button>
          <button 
            id="chat-suggestion-evidence"
            onClick={() => handleSendChat('What evidence is attached?')}
            className="block w-full text-left p-3 text-xs font-inter border border-border-divider rounded-input text-primary hover:bg-primary-container/20"
          >
            What evidence is attached?
          </button>
          <button 
            id="chat-suggestion-named"
            onClick={() => handleSendChat('Has she named what happened?')}
            className="block w-full text-left p-3 text-xs font-inter border border-border-divider rounded-input text-primary hover:bg-primary-container/20"
          >
            Has she named what happened?
          </button>
        </div>

        {/* Manual Input */}
        <div className="p-4 bg-white border-t border-border-divider flex items-center space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat(chatInput)}
            placeholder="Ask about the evidence..."
            className="flex-1 px-3 py-2 text-sm border border-border-divider rounded-input focus:outline-none focus:border-primary"
          />
          <Button onClick={() => handleSendChat(chatInput)} variant="primary">
            Send
          </Button>
        </div>

        <div className="p-4">
          <Button onClick={() => setCurrentScreen('notes')} variant="secondary" className="w-full">
            Proceed to Notes &rarr;
          </Button>
        </div>
      </div>
    )
  }

  if (currentScreen === 'notes') {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left">
        <button onClick={() => setCurrentScreen('chat')} className="text-xs text-text-muted mb-2 inline-block">&larr; Back to Chat</button>
        <div>
          <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Intake Notes</h2>
          <p className="text-xs font-mono text-text-muted">Draft findings and observations</p>
        </div>
        
        <div className="bg-primary-container/20 border border-primary-container rounded-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary font-inter flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Synthesis</span>
          </h3>
          <p className="text-xs font-inter text-text-secondary leading-relaxed">
            Based on incident logs and journals, indicators of {isLawyer ? 'RA 11313 (Safe Spaces Act)' : 'hyperarousal and somatic stress'} are present. 
            <br/><br/>
            <strong>Note:</strong> This is an AI-generated summary and should be reviewed by {isLawyer ? 'legal counsel' : 'a clinician'}.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface">Your Confidential Notes</label>
          <textarea 
            className="w-full h-32 p-3 border border-border-divider rounded-input text-sm font-inter focus:outline-none focus:border-primary"
            placeholder="Type your observations here..."
          ></textarea>
        </div>

        <Button onClick={() => setCurrentScreen('export')} variant="primary" className="w-full">
          Save Note & Continue to certified export
        </Button>
      </div>
    )
  }

  if (currentScreen === 'export') {
    return (
      <div className="flex-1 p-6 space-y-6 bg-background h-full overflow-y-auto text-left">
        <button onClick={() => setCurrentScreen('notes')} className="text-xs text-text-muted mb-2 inline-block">&larr; Back to Notes</button>
        <div>
          <h2 className="text-xl font-medium font-newsreader text-on-surface mb-1">Certified Export</h2>
          <p className="text-xs font-mono text-text-muted">Review the final documentation</p>
        </div>

        <div className="bg-white border border-border-divider rounded-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-on-surface font-inter flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>PDF Document Extract</span>
          </h3>
          <div className="bg-neutral-100 p-4 rounded-input border border-border-divider text-xs font-mono text-text-secondary leading-relaxed h-64 overflow-y-auto">
            [PDF PREVIEW]<br/>
            Subject: Evidence Logs<br/>
            Client: Jane Doe<br/>
            Timeline: <br/>
            - May 14: Desk intrusion.<br/>
            - May 19: Lobby blocking.<br/>
            - May 23: Pantry intrusion.<br/>
            <br/>
            Witnesses: J. observed pantry interaction.<br/>
            Somatic flags: Chest tightness, avoidance behaviors.<br/>
            <br/>
            Authority Hash: SHA-256 (Anchored)
          </div>
        </div>

        <Button 
          onClick={() => {
            alert('Review completed in Free Roam mode!')
            setCurrentScreen('dashboard')
            setIsBookingAccepted(false)
            setIsRequestingIncidents(false)
            setIsRequestingJournals(false)
          }} 
          variant="primary" 
          className="w-full py-4 text-sm font-medium"
        >
          End Review
        </Button>
      </div>
    )
  }

  return null
}
