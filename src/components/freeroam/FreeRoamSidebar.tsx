import { useState } from 'react'
import { Sparkles, Info, Check, LogOut, MessageSquare, MapPin, ClipboardList, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { telemetry } from '../../lib/telemetry'

export function FreeRoamSidebar() {
  const navigate = useNavigate()
  const { 
    scenarioId, 
    freeRoamProgress, 
    setFreeRoamTab, 
    setFreeRoamResourceTab, 
    setFreeRoamJournalTab, 
    setFreeRoamProgress: tickProgress,
    completedAt
  } = useStore()

  // Feedback states
  const [overallThoughts, setOverallThoughts] = useState('')
  const [desiredFeatures, setDesiredFeatures] = useState('')
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false)

  const checklistItems = [
    {
      id: 'companion',
      label: 'Try Companion chat',
      desc: 'Simulate disclosing a concern safely.',
      selector: '#freeroam-nav-companion',
      onClick: () => {
        setFreeRoamTab('companion')
        tickProgress('companion', true)
      }
    },
    {
      id: 'journal',
      label: 'Draft a Reflective Diary',
      desc: 'Test the Pennebaker guided prompt.',
      selector: '#freeroam-nav-journal',
      onClick: () => {
        setFreeRoamTab('journal')
        setFreeRoamJournalTab('reflective')
        tickProgress('journal', true)
      }
    },
    {
      id: 'incident',
      label: 'Log an Incident Evidence',
      desc: 'Try the secure timestamping feature.',
      selector: '#freeroam-nav-journal',
      onClick: () => {
        setFreeRoamTab('journal')
        setFreeRoamJournalTab('incident')
        tickProgress('incident', true)
      }
    },
    {
      id: 'stories',
      label: 'Read a Community Story',
      desc: 'See how shared experiences look.',
      selector: '#freeroam-nav-resources',
      onClick: () => {
        setFreeRoamTab('resources')
        setFreeRoamResourceTab('stories')
        tickProgress('stories', true)
      }
    },
    {
      id: 'pathways',
      label: 'View Safe Directory',
      desc: 'Navigate internal company reporting paths.',
      selector: '#freeroam-nav-resources',
      onClick: () => {
        setFreeRoamTab('resources')
        setFreeRoamResourceTab('pathways')
        tickProgress('pathways', true)
      }
    },
    {
      id: 'marketplace',
      label: 'Check External Help',
      desc: 'Explore the trusted referral marketplace.',
      selector: '#freeroam-nav-resources',
      onClick: () => {
        setFreeRoamTab('resources')
        setFreeRoamResourceTab('marketplace')
        tickProgress('marketplace', true)
      }
    }
  ]

  const handleEndSession = () => {
    if (scenarioId === 'admin-freeroam' || completedAt) {
      navigate('/done')
    } else {
      navigate('/survey')
    }
  }

  const handleSubmitFeedback = () => {
    telemetry.trackTextInput('freeroam_overall_thoughts', overallThoughts)
    telemetry.trackTextInput('freeroam_desired_features', desiredFeatures)
    
    setIsFeedbackSubmitted(true)
    setOverallThoughts('')
    setDesiredFeatures('')
    
    setTimeout(() => {
      setIsFeedbackSubmitted(false)
    }, 3000)
  }

  const progressCount = Object.values(freeRoamProgress).filter(Boolean).length
  const progressPct = Math.round((progressCount / checklistItems.length) * 100)

  return (
    <aside className="w-full lg:w-[400px] h-full flex flex-col bg-white border-l border-border-divider overflow-y-auto">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-background flex-shrink-0">
        <div
          className="h-full bg-secondary transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex flex-col justify-between p-6 bg-white border-b border-border-divider">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider uppercase text-secondary font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Free Roam Sandbox</span>
          </span>
          <span className="text-[10px] font-mono bg-neutral-100 text-text-muted px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            Unlocked
          </span>
        </div>
        <h2 className="text-xl font-medium font-newsreader text-on-surface mt-3">
          Explore at your own pace
        </h2>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-6 space-y-6 text-left">
        
        {/* Labeled warning notice */}
        <div className="p-4 bg-secondary-container/30 border border-secondary/15 rounded-card flex items-start space-x-3">
          <Info className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-xs font-inter text-text-secondary leading-relaxed">
            You are in Free Roam. Feel free to explore the prototype. All screens are active.
          </p>
        </div>

        {/* Feature checklist */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
            Explorable Features Checklist
          </h3>

          <div className="space-y-2.5">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                className={`group flex items-start space-x-3 p-3 rounded-card border transition-all cursor-pointer ${
                  freeRoamProgress[item.id]
                    ? 'bg-green-50/50 border-green-200'
                    : 'bg-white border-border-divider hover:border-primary shadow-sm'
                }`}
              >
                {/* Checkbox (Read-only since it auto-ticks) */}
                <div 
                  className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    freeRoamProgress[item.id]
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-text-muted bg-white group-hover:border-primary'
                  }`}
                >
                  {freeRoamProgress[item.id] && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1">
                  <h4 className={`text-xs font-inter font-semibold ${
                    freeRoamProgress[item.id] ? 'text-green-800' : 'text-on-surface'
                  }`}>
                    {item.label}
                  </h4>
                  <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unvisited features summary */}
        <div className="border-t border-border-divider pt-5 space-y-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
            Here are other features not covered in the test:
          </h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-neutral-100 text-text-secondary rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-semibold font-inter text-on-surface">Community</span>
                <span className="block text-[11px] font-inter text-text-secondary leading-relaxed">
                  A peer Q&A discussion board highlighting Safe Spaces Act timelines and local filing support.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-neutral-100 text-text-secondary rounded-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-semibold font-inter text-on-surface">External Help</span>
                <span className="block text-[11px] font-inter text-text-secondary leading-relaxed">
                  A professional booking desk linking survivors directly to counseling centers and labor attorneys.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-neutral-100 text-text-secondary rounded-lg">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-semibold font-inter text-on-surface">Safe Directory</span>
                <span className="block text-[11px] font-inter text-text-secondary leading-relaxed">
                  Intake preparation checklists, reviews, and reporting support protocols for local protection desks.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Free Roam Survey Section */}
        <div className="border-t border-border-divider pt-5 space-y-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>Interactive Feedback</span>
          </h3>
          
          <div className="space-y-4 bg-neutral-50/50 p-4 border border-border-divider rounded-card">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-inter font-medium text-on-surface-variant leading-relaxed">
                1. What are your overall thoughts on the Grace prototype?
              </label>
              <textarea
                value={overallThoughts}
                onChange={(e) => setOverallThoughts(e.target.value)}
                placeholder="Share your general experience, design feedback, or somatic tracking impressions..."
                className="w-full text-xs font-inter p-3 border border-border-divider rounded-input focus:outline-none focus:border-primary bg-white resize-none h-20 shadow-sm"
              />
            </div>

            <div className="space-y-1.5 text-left font-inter">
              <label className="block text-xs font-medium text-on-surface-variant leading-relaxed">
                2. Are there other features you wish Grace had?
              </label>
              <textarea
                value={desiredFeatures}
                onChange={(e) => setDesiredFeatures(e.target.value)}
                placeholder="E.g., offline signing, emergency alerts, lawyer hot-line integrations..."
                className="w-full text-xs font-inter p-3 border border-border-divider rounded-input focus:outline-none focus:border-primary bg-white resize-none h-20 shadow-sm"
              />
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={isFeedbackSubmitted || (!overallThoughts.trim() && !desiredFeatures.trim())}
              className="w-full mt-2 py-2.5 bg-primary text-white rounded-input text-xs font-semibold hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-sm focus:outline-none"
            >
              {isFeedbackSubmitted ? 'Feedback submitted \u2713' : 'Submit feedback'}
            </button>
          </div>
        </div>

      </div>

      {/* Sticky Bottom End Session */}
      <div className="sticky bottom-0 bg-neutral-50 border-t border-border-divider p-6 space-y-3">
        <button
          onClick={handleEndSession}
          className="w-full py-3.5 bg-on-surface text-white rounded-input font-inter font-semibold text-xs hover:bg-opacity-90 flex items-center justify-center space-x-2 shadow transition-all active:scale-[0.98] focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          <span>End Session</span>
        </button>
        <p className="text-[10px] font-mono text-text-muted text-center leading-relaxed">
          Clicking End Session will save your responses and conclude the testing session.
        </p>
      </div>
    </aside>
  )
}
