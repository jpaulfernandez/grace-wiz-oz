import { useState, useEffect } from 'react'
import { SidePanel } from './SidePanel'
import { PauseAffordance } from './PauseAffordance'
import { StudyInfoModal } from './StudyInfoModal'
import { ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Info } from 'lucide-react'
import { useStore } from '../../lib/store'

interface DesktopBrowserFrameProps {
  children: React.ReactNode
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  showStepControls?: boolean
}

export function DesktopBrowserFrame({
  children,
  onPrev,
  onNext,
  canPrev,
  canNext,
  showStepControls
}: DesktopBrowserFrameProps) {
  const { cohort, simulatedCohort, setSimulatedCohort, guidedMode } = useStore()
  const [showStudyInfo, setShowStudyInfo] = useState(false)
  const isFreeRoam = window.location.pathname.includes('/free')

  // Auto-select provider simulation by default on first load
  useEffect(() => {
    if (simulatedCohort === null && (cohort === 'lawyer' || cohort === 'clinician')) {
      setSimulatedCohort(cohort === 'lawyer' ? 'legal' : 'clinician')
    }
  }, [cohort, simulatedCohort, setSimulatedCohort])

  const mockUrl = cohort === 'lawyer'
    ? 'https://provider.grace.app/lawyer/dashboard'
    : 'https://provider.grace.app/clinician/dashboard'

  const tabTitle = cohort === 'lawyer'
    ? 'Grace Advocate Portal — Legal Dashboard'
    : 'Grace Clinician Portal — Somatic & Attachment Dashboard'

  return (
    <div className="hidden lg:flex w-screen h-screen bg-background overflow-hidden flex-col">
      {/* Outer Top Bar */}
      <div id="outer-top-bar" className="flex-shrink-0 h-12 w-full bg-white border-b border-border-divider flex items-center justify-between px-6 z-30">
        {/* Left: Study info */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStudyInfo(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-text-muted hover:text-primary hover:bg-primary-container/30 transition-colors text-xs font-inter font-medium"
            aria-label="Study information"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Study Info</span>
          </button>
        </div>

        {/* Center: Simulate Jane / Grace toggle */}
        <div className="flex items-center space-x-1 bg-neutral-100 border border-neutral-200 rounded-full p-0.5">
          {cohort === 'lawyer' || cohort === 'clinician' ? (
            <>
              <button
                onClick={() => setSimulatedCohort(cohort === 'lawyer' ? 'legal' : 'clinician')}
                className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${simulatedCohort === 'legal' || simulatedCohort === 'clinician'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-text-muted hover:text-on-surface'
                  }`}
              >
                {cohort === 'lawyer' ? 'Simulate Legal' : 'Simulate Clinician'}
              </button>
              <button
                onClick={() => setSimulatedCohort('jane')}
                className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${simulatedCohort === 'jane'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-text-muted hover:text-on-surface'
                  }`}
              >
                Simulate Jane
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSimulatedCohort('jane')}
                className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${simulatedCohort !== 'grace'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-text-muted hover:text-on-surface'
                  }`}
              >
                Simulate Jane
              </button>
              <button
                onClick={() => setSimulatedCohort('grace')}
                className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${simulatedCohort === 'grace'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-text-muted hover:text-on-surface'
                  }`}
              >
                Simulate Grace
              </button>
            </>
          )}
        </div>

        {/* Right: Pause / End */}
        <PauseAffordance />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Centered browser chrome */}
        <div className="flex-1 h-full flex flex-col p-8 bg-surface-bright border-r border-border-divider overflow-hidden min-w-0 relative">

          {/* Mock OS Browser Window */}
          <div className="flex-1 w-full bg-white rounded-card border border-border-divider shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">

            {/* OS Window Bar & Tabs */}
            <div className="h-10 w-full bg-surface-bright border-b border-border-divider flex items-center px-4 flex-shrink-0 select-none">
              {/* macOS Window Controls */}
              <div className="flex space-x-2 mr-6">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>

              {/* Active Browser Tab */}
              <div className="h-8 bg-white border border-b-0 border-border-divider rounded-t-[8px] px-4 flex items-center text-xs font-inter font-medium text-on-surface-variant max-w-[280px] truncate mt-2">
                <span className="truncate">{tabTitle}</span>
              </div>
            </div>

            {/* Browser Address & Navigation Bar */}
            <div className="h-11 w-full bg-white border-b border-border-divider flex items-center px-4 space-x-4 flex-shrink-0">
              {/* Nav Arrows */}
              <div className="flex items-center space-x-3 text-text-muted">
                <ArrowLeft className="w-4 h-4 hover:text-on-surface transition-colors cursor-pointer" />
                <ArrowRight className="w-4 h-4 hover:text-on-surface transition-colors cursor-pointer" />
                <RotateCw className="w-3.5 h-3.5 hover:text-on-surface transition-colors cursor-pointer" />
              </div>

              {/* Mock URL Input */}
              <div className="flex-1 h-7 bg-surface-bright rounded-input border border-border-divider px-3 flex items-center justify-between text-xs font-inter font-normal text-on-surface-variant max-w-xl mx-auto select-all">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  <span className="truncate">{mockUrl}</span>
                </div>
              </div>
            </div>

            {/* Actual Web Page Content */}
            <div className="flex-1 overflow-y-auto bg-background min-h-0 relative">
              {children}
            </div>


          </div>

          {/* If in reflection mode, dim and show arrow pointing towards the side panel */}
          {guidedMode === 'reflection' && !isFreeRoam && (
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] z-[1000] flex flex-col items-center justify-center p-8 text-center animate-fade-in pointer-events-auto">
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-2xl max-w-sm flex flex-col items-center space-y-4 relative animate-scale-in">
                <span className="text-3xl animate-bounce">📝</span>
                <h3 className="font-newsreader text-lg font-bold text-on-surface">Time for Reflection</h3>
                <p className="text-xs font-inter text-text-secondary leading-relaxed">
                  Please read the information and answer the reflection questions in the side panel.
                </p>

                {/* Arrow pointing right towards the sidepanel */}
                <div className="flex items-center space-x-2.5 pt-2 text-primary font-semibold text-xs font-inter">
                  <span>Look at the side panel</span>
                  <svg className="w-5 h-5 animate-pulse text-primary fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Moderator Side Panel */}
        <SidePanel
          onPrev={onPrev}
          onNext={onNext}
          canPrev={canPrev}
          canNext={canNext}
          showStepControls={showStepControls}
        />
      </div>

      {/* Study Info Modal */}
      {showStudyInfo && <StudyInfoModal onClose={() => setShowStudyInfo(false)} />}
    </div>
  )
}
