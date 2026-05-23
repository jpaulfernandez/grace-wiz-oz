import { useState, useEffect, useRef } from 'react'
import { useStore } from '../lib/store'
import { FrameWrapper } from '../components/layout/FrameWrapper'
import { telemetry } from '../lib/telemetry'
import { Button } from '../components/ui'
import {
  Home as HomeIcon,
  MessageSquare,
  BookOpen,
  Compass,
  Heart,
  ShieldAlert,
  ArrowRight,
  Send,
  Lock,
  CheckCircle
} from 'lucide-react'

// Resource directories
import { CommunityStories } from '../components/freeroam/CommunityStories'
import { PathwaysDirectory } from '../components/freeroam/PathwaysDirectory'
import { MarketplaceDirectory } from '../components/freeroam/MarketplaceDirectory'
import { ProviderHubFreeRoam } from '../components/freeroam/ProviderHubFreeRoam'


interface ChatMessageObj {
  sender: 'user' | 'grace'
  text: string
  time: string
}

export default function FreeRoam() {
  const { 
    nickname, 
    freeRoamTab, 
    setFreeRoamTab, 
    freeRoamResourceTab, 
    setFreeRoamResourceTab, 
    freeRoamJournalTab, 
    setFreeRoamJournalTab,
    setFreeRoamProgress,
    simulatedCohort
  } = useStore()
  
  type TabType = 'home' | 'companion' | 'journal' | 'resources'
  
  // Interactive breathing space
  const [showBreathing, setShowBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale')

  // Companion Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessageObj[]>([
    { sender: 'grace', text: `Hello ${nickname || 'there'}. I am Grace, your secure, non-judgmental companion. How are you feeling today?`, time: '1:43 PM' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Journaling state
  const [journalContent, setJournalContent] = useState('')
  const [journalSaved, setJournalSaved] = useState(false)

  // Incident log state
  const [incidentDate, setIncidentDate] = useState('')
  const [incidentLocation, setIncidentLocation] = useState('')
  const [incidentText, setIncidentText] = useState('')
  const [incidentHash, setIncidentHash] = useState('')
  const [isSecuring, setIsSecuring] = useState(false)

  // Breathing sigh loop
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showBreathing) {
      interval = setInterval(() => {
        setBreathingPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'))
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [showBreathing])

  // Scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, isTyping])

  const handleTabChange = (tab: TabType) => {
    telemetry.trackButtonTap(`freeroam-nav-${tab}`)
    setFreeRoamTab(tab)
    if (tab === 'companion') setFreeRoamProgress('companion', true)
    if (tab === 'journal') setFreeRoamProgress('journal', true)
    if (tab === 'resources') setFreeRoamProgress('resources', true)
  }

  // Grace Companion Chat Response Engine
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }])
    setChatInput('')
    setIsTyping(true)

    // Simulate comforting Grace reaction
    setTimeout(() => {
      setIsTyping(false)
      let reply = "I hear you, and your feelings are completely valid. Your safety and peace of mind are what matter most. Please take a deep breath."
      if (userMsg.toLowerCase().includes('help') || userMsg.toLowerCase().includes('harass')) {
        reply = "That sounds incredibly stressful. Please know that you are not alone. Under the Safe Spaces Act (RA 11313), you have clear rights. If you need, we can log this under the Incident tab, or check verified legal aids under Resources."
      } else if (userMsg.toLowerCase().includes('journal') || userMsg.toLowerCase().includes('write')) {
        reply = "Writing down what happened is a powerful way to process somatic anxiety. You can draft entries privately in the Journal tab anytime—they remain locked under local secure storage."
      }

      setChatMessages(prev => [...prev, { sender: 'grace', text: reply, time: 'Just now' }])
    }, 1500)
  }

  // Handle Journal Save
  const handleSaveJournal = () => {
    if (!journalContent.trim()) return
    setJournalSaved(true)
    setTimeout(() => setJournalSaved(false), 3000)
  }

  // Secure Incident Log SHA-256 Generator
  const handleSecureIncident = () => {
    if (!incidentText.trim() || !incidentLocation.trim() || !incidentDate.trim()) return
    setIsSecuring(true)
    setTimeout(() => {
      setIsSecuring(false)
      // Mock SHA-256 hash anchoring signature
      const randomHash = 'sha256-' + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')
      setIncidentHash(randomHash)
    }, 1800)
  }

  return (
    <FrameWrapper>
      {simulatedCohort === 'legal' || simulatedCohort === 'clinician' ? (
        <ProviderHubFreeRoam />
      ) : (
      <div className="flex-1 flex flex-col bg-background h-full overflow-hidden select-none relative">
        
        {/* Scrollable Viewport Chrome wrapper */}
        <div className="flex-1 overflow-y-auto pb-16">
          
          {/* TAB 1: HOME */}
          {freeRoamTab === 'home' && (
            <div className="p-5 space-y-6 text-left animate-fade-in">
              <div>
                <span className="text-[9px] font-mono bg-secondary-container text-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Intake Sandbox
                </span>
                <h1 className="text-xl font-semibold font-newsreader text-on-surface mt-2.5">
                  Welcome, {nickname || 'Tester'}
                </h1>
                <p className="text-xs font-inter text-text-secondary mt-1 leading-relaxed">
                  All features are fully unlocked. Explore the tabs below to test Grace's features.
                </p>
              </div>

              {/* Three Door Cards */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
                  Interact with Grace Modules
                </h3>

                {/* Companion Door */}
                <div 
                  onClick={() => handleTabChange('companion')}
                  className="bg-white border border-border-divider rounded-card p-4 hover:border-primary cursor-pointer transition-all shadow-sm flex items-start space-x-3.5"
                >
                  <div className="p-2.5 bg-primary-container text-primary rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold font-inter text-on-surface">Grace Companion Chat</h4>
                    <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                      Chat securely with Grace about your feelings and safety.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted self-center" />
                </div>

                {/* Journal Door */}
                <div 
                  onClick={() => {
                    handleTabChange('journal')
                    setFreeRoamJournalTab('reflective')
                  }}
                  className="bg-white border border-border-divider rounded-card p-4 hover:border-primary cursor-pointer transition-all shadow-sm flex items-start space-x-3.5"
                >
                  <div className="p-2.5 bg-secondary-container text-secondary rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold font-inter text-on-surface">Private Journal</h4>
                    <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                      Write freely with guided journaling prompts.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted self-center" />
                </div>

                {/* Incident Log Door */}
                <div 
                  onClick={() => {
                    handleTabChange('journal')
                    setFreeRoamJournalTab('incident')
                  }}
                  className="bg-white border border-border-divider rounded-card p-4 hover:border-primary cursor-pointer transition-all shadow-sm flex items-start space-x-3.5"
                >
                  <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold font-inter text-on-surface">Secure Incident Logger</h4>
                    <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                      Log chronological evidence and sign digital tamper-proof receipt signatures.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted self-center" />
                </div>
              </div>

              {/* Breathing Exercise Calming Breath Card */}
              <div className="space-y-3 pt-1">
                <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
                  Somatic Self-Care Tool
                </h3>
                <div 
                  onClick={() => setShowBreathing(true)}
                  className="bg-white border border-border-divider rounded-card p-4 hover:border-primary cursor-pointer transition-all shadow-sm flex items-start space-x-3.5"
                >
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-xs font-semibold font-inter text-on-surface">Vagal Calming Breath</h4>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[8px] font-mono rounded font-semibold uppercase">Active</span>
                    </div>
                    <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                      Down-regulate high anxiety states. Tap to trigger cyclic diaphragmatic box breathing intervals.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted self-center" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANION CHAT */}
          {freeRoamTab === 'companion' && (
            <div className="h-[730px] flex flex-col bg-white animate-fade-in">
              {/* Header */}
              <div className="p-4 border-b border-border-divider flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-newsreader font-semibold">
                    G
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold font-inter text-on-surface">Grace Companion</h3>
                    <p className="text-[9px] font-mono text-green-600 font-semibold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 inline-block animate-pulse" />
                      Active & Secure
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/50">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-xs font-inter leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-on-surface text-white rounded-br-none' 
                        : 'bg-white border border-border-divider text-on-surface rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-mono text-text-muted mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center space-x-1 p-2 bg-white border border-border-divider rounded-full w-14 justify-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-border-divider flex items-center space-x-2 bg-white flex-shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type secure response..."
                  className="flex-1 px-3 py-2 text-xs font-inter border border-border-divider rounded-full bg-neutral-50 text-on-surface focus:outline-none focus:border-primary focus:bg-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-on-surface text-white rounded-full hover:bg-opacity-95 transition-all focus:outline-none"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: JOURNAL & INCIDENT */}
          {freeRoamTab === 'journal' && (
            <div className="p-5 space-y-5 text-left animate-fade-in">
              {/* Segment Toggle */}
              <div className="grid grid-cols-2 gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                <button
                  onClick={() => setFreeRoamJournalTab('reflective')}
                  className={`py-2 text-xs font-inter font-semibold rounded-lg transition-all focus:outline-none ${
                    freeRoamJournalTab === 'reflective'
                      ? 'bg-white text-on-surface shadow-sm'
                      : 'text-text-secondary hover:text-on-surface'
                  }`}
                >
                  Reflective Diary
                </button>
                <button
                  onClick={() => setFreeRoamJournalTab('incident')}
                  className={`py-2 text-xs font-inter font-semibold rounded-lg transition-all focus:outline-none ${
                    freeRoamJournalTab === 'incident'
                      ? 'bg-white text-on-surface shadow-sm'
                      : 'text-text-secondary hover:text-on-surface'
                  }`}
                >
                  Evidentiary Log
                </button>
              </div>

              {/* SUB-TAB A: REFLECTIVE JOURNAL */}
              {freeRoamJournalTab === 'reflective' && (
                <div className="space-y-4">
                  <div className="bg-white border border-border-divider rounded-card p-4 space-y-2">
                    <span className="text-[9px] font-mono text-primary font-semibold uppercase tracking-wider block">Guided Prompt</span>
                    <p className="text-xs font-inter text-text-secondary leading-relaxed font-medium">
                      "Write about the event that stands out most. Do not worry about spelling or grammar—write purely to release the somatic tension you hold."
                    </p>
                  </div>

                  <textarea
                    rows={8}
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    placeholder="Begin writing privately (all text remains sandboxed locally)..."
                    className="w-full text-xs font-inter p-4 border border-border-divider rounded-card focus:outline-none focus:border-primary bg-white shadow-sm resize-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-text-muted">
                      Characters: {journalContent.length}
                    </span>
                    <button
                      onClick={handleSaveJournal}
                      className="px-5 py-2.5 bg-on-surface text-white text-xs font-semibold rounded-input hover:bg-opacity-95 transition-all shadow-sm focus:outline-none"
                    >
                      {journalSaved ? 'Saved Privately!' : 'Save Entry'}
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-TAB B: EVIDENTIARY INCIDENT LOG */}
              {freeRoamJournalTab === 'incident' && (
                <div className="space-y-4">
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-card flex items-start space-x-3">
                    <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-inter text-amber-800 leading-relaxed">
                      Incident logs are chronologically hashed on the device. Once secured, they generate an immutable SHA-256 validation fingerprint.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full text-xs font-inter p-2.5 border border-border-divider rounded-input focus:outline-none focus:border-primary bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Location</label>
                      <input
                        type="text"
                        value={incidentLocation}
                        onChange={(e) => setIncidentLocation(e.target.value)}
                        placeholder="e.g. 3rd Floor Office Desk or Online"
                        className="w-full text-xs font-inter p-2.5 border border-border-divider rounded-input focus:outline-none focus:border-primary bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">What occurred</label>
                      <textarea
                        rows={4}
                        value={incidentText}
                        onChange={(e) => setIncidentText(e.target.value)}
                        placeholder="State facts, comments made, or actions taken..."
                        className="w-full text-xs font-inter p-3 border border-border-divider rounded-card focus:outline-none focus:border-primary bg-white resize-none"
                      />
                    </div>

                    {!incidentHash ? (
                      <button
                        onClick={handleSecureIncident}
                        disabled={isSecuring || !incidentText.trim() || !incidentLocation.trim() || !incidentDate.trim()}
                        className="w-full py-3 bg-secondary hover:bg-secondary-hover text-on-secondary rounded-input text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                      >
                        {isSecuring ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Securing entry timestamp...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Verify & Save Securely</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-4 bg-green-50 border border-green-150 rounded-card space-y-2 animate-scale-up">
                        <div className="flex items-center space-x-2 text-green-800 font-semibold text-xs font-inter">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Incident Secured Successfully!</span>
                        </div>
                        <p className="text-[10px] font-mono text-green-700 leading-relaxed break-all">
                          Timestamp fingerprint: <br /><strong>{incidentHash}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RESOURCES CENTER (Circles, Pathways, Marketplace) */}
          {freeRoamTab === 'resources' && (
            <div className="p-5 space-y-5 text-left animate-fade-in">
              {/* Resources subheaders */}
              <div className="flex border-b border-border-divider font-inter text-xs text-text-muted space-x-4 pb-1">
                <button
                  id="freeroam-nav-resources-stories"
                  onClick={() => {
                    setFreeRoamResourceTab('stories')
                    setFreeRoamProgress('stories', true)
                  }}
                  className={`pb-2.5 font-semibold transition-all relative focus:outline-none ${
                    freeRoamResourceTab === 'stories' ? 'text-primary' : 'hover:text-on-surface'
                  }`}
                >
                  Community
                  {freeRoamResourceTab === 'stories' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded" />}
                </button>

                <button
                  id="freeroam-nav-resources-pathways"
                  onClick={() => {
                    setFreeRoamResourceTab('pathways')
                    setFreeRoamProgress('pathways', true)
                  }}
                  className={`pb-2.5 font-semibold transition-all relative focus:outline-none ${
                    freeRoamResourceTab === 'pathways' ? 'text-primary' : 'hover:text-on-surface'
                  }`}
                >
                  Safe Directory
                  {freeRoamResourceTab === 'pathways' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded" />}
                </button>

                <button
                  id="freeroam-nav-resources-marketplace"
                  onClick={() => {
                    setFreeRoamResourceTab('marketplace')
                    setFreeRoamProgress('marketplace', true)
                  }}
                  className={`pb-2.5 font-semibold transition-all relative focus:outline-none ${
                    freeRoamResourceTab === 'marketplace' ? 'text-primary' : 'hover:text-on-surface'
                  }`}
                >
                  External Help
                  {freeRoamResourceTab === 'marketplace' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded" />}
                </button>
              </div>

              {/* Sub-tab Renders */}
              <div>
                {freeRoamResourceTab === 'stories' && <CommunityStories />}
                {freeRoamResourceTab === 'pathways' && <PathwaysDirectory />}
                {freeRoamResourceTab === 'marketplace' && <MarketplaceDirectory />}
              </div>
            </div>
          )}
        </div>

        {/* Somatic Vagal Breathing Calmer Exercise Modal */}
        {showBreathing && (
          <div className="absolute inset-0 bg-white z-[99] flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
            <div className="space-y-8 max-w-[280px] flex flex-col items-center">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">Somatic Self-Care</span>
                <h3 className="text-xl font-medium font-newsreader text-on-surface">Vagal Calming Breath</h3>
              </div>

              {/* Calming Breath Circle with elegant scale shifts */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className={`absolute w-full h-full bg-green-100 rounded-full transition-all duration-[4000ms] ease-in-out ${
                  breathingPhase === 'inhale' ? 'scale-110 opacity-75' : 'scale-75 opacity-35'
                }`} />
                <div className={`absolute w-32 h-32 bg-green-200 rounded-full transition-all duration-[4000ms] ease-in-out ${
                  breathingPhase === 'inhale' ? 'scale-105 opacity-85' : 'scale-85 opacity-50'
                }`} />
                <div className="absolute w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-lg text-white font-inter text-xs font-semibold">
                  {breathingPhase === 'inhale' ? 'Inhale...' : 'Exhale...'}
                </div>
              </div>

              <p className="text-xs font-inter text-text-secondary leading-relaxed">
                Allow somatic anxiety to release. Relax your chest muscles. Inhale expanding your belly, and release with a long sigh.
              </p>

              <Button
                onClick={() => setShowBreathing(false)}
                variant="secondary"
                className="w-full mt-6"
              >
                Close exercise
              </Button>
            </div>
          </div>
        )}

        {/* Global Bottom Tab Navigation Menu (5 items) */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-border-divider py-2 flex items-center justify-around z-50 flex-shrink-0">
          <button
            id="freeroam-nav-home"
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center justify-center p-1 focus:outline-none ${
              freeRoamTab === 'home' ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[9px] font-inter font-medium mt-0.5">Home</span>
          </button>
          
          <button
            id="freeroam-nav-companion"
            onClick={() => handleTabChange('companion')}
            className={`flex flex-col items-center justify-center p-1 focus:outline-none ${
              freeRoamTab === 'companion' ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] font-inter font-medium mt-0.5">Companion</span>
          </button>

          <button
            id="freeroam-nav-journal"
            onClick={() => {
              handleTabChange('journal')
              setFreeRoamJournalTab('reflective')
            }}
            className={`flex flex-col items-center justify-center p-1 focus:outline-none ${
              freeRoamTab === 'journal' && freeRoamJournalTab === 'reflective' ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-inter font-medium mt-0.5">Journal</span>
          </button>

          <button
            id="freeroam-nav-incident"
            onClick={() => {
              handleTabChange('journal')
              setFreeRoamJournalTab('incident')
              setFreeRoamProgress('incident', true)
            }}
            className={`flex flex-col items-center justify-center p-1 focus:outline-none ${
              freeRoamTab === 'journal' && freeRoamJournalTab === 'incident' ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[9px] font-inter font-medium mt-0.5">Incident</span>
          </button>

          <button
            id="freeroam-nav-resources"
            onClick={() => handleTabChange('resources')}
            className={`flex flex-col items-center justify-center p-1 focus:outline-none ${
              freeRoamTab === 'resources' ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-inter font-medium mt-0.5">Resources</span>
          </button>
        </div>
      </div>
      )}
    </FrameWrapper>
  )
}
