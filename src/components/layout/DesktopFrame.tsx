import { useState } from 'react'
import { SidePanel } from './SidePanel'
import { PhoneChrome } from './PhoneChrome'
import { PauseAffordance } from './PauseAffordance'
import { StudyInfoModal } from './StudyInfoModal'
import { useStore } from '../../lib/store'
import { HelpCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react'

interface DesktopFrameProps {
  children: React.ReactNode
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  showStepControls?: boolean
  onHelp?: () => void
}

export function DesktopFrame({
  children,
  onPrev,
  onNext,
  canPrev,
  canNext,
  showStepControls,
  onHelp
}: DesktopFrameProps) {
  const [showStudyInfo, setShowStudyInfo] = useState(false)
  const { cohort, simulatedCohort, setSimulatedCohort, scenarioId, setSession, guidedMode } = useStore()
  const isProvider = cohort === 'lawyer' || cohort === 'clinician'
  const isFreeRoam = window.location.pathname.includes('/free')

  return (
    <div className="hidden lg:flex w-screen h-screen bg-background overflow-hidden flex-col">
      {/* Outer Top Bar */}
      <div className="flex-shrink-0 h-12 w-full bg-white border-b border-border-divider flex items-center justify-between px-6 z-30">
        {/* Left: Study info + Help */}
        <div className="flex items-center space-x-2.5">
          <button
            id="study-info-button"
            onClick={() => setShowStudyInfo(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-xs font-inter font-semibold focus:outline-none shadow-sm"
            aria-label="Study information"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Study Info</span>
          </button>

          {onHelp && (
            <div id="help-buttons-gutter" className="flex items-center">
              <button
                id="help-button"
                onClick={onHelp}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 hover:bg-amber-500 hover:text-white transition-all text-xs font-inter font-semibold focus:outline-none shadow-sm animate-pulse"
                aria-label="Help"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>? I need help</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Admin Switcher or Simulated Cohort Switcher */}
        {scenarioId === 'admin-freeroam' ? (
          <div className="flex items-center space-x-1 bg-neutral-100 border border-neutral-200 rounded-full p-0.5 z-40">
            <button
              onClick={() => {
                setSession({ cohort: 'women' })
                setSimulatedCohort('grace')
              }}
              className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                cohort === 'women'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-text-muted hover:text-on-surface'
              }`}
            >
              Survivor (Grace)
            </button>
            <button
              onClick={() => {
                setSession({ cohort: 'lawyer' })
                setSimulatedCohort('jane')
              }}
              className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                cohort === 'lawyer'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-text-muted hover:text-on-surface'
              }`}
            >
              Legal (Jane)
            </button>
            <button
              onClick={() => {
                setSession({ cohort: 'clinician' })
                setSimulatedCohort('jane')
              }}
              className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                cohort === 'clinician'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-text-muted hover:text-on-surface'
              }`}
            >
              Clinician (Jane)
            </button>
          </div>
        ) : (
          isProvider && (
            <div className="flex items-center space-x-1 bg-neutral-100 border border-neutral-200 rounded-full p-0.5">
              <button
                onClick={() => setSimulatedCohort('jane')}
                className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                  simulatedCohort !== 'grace'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                Simulate Jane
              </button>
              <button
                onClick={() => setSimulatedCohort('grace')}
                className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                  simulatedCohort === 'grace'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-text-muted hover:text-on-surface'
                }`}
              >
                Simulate Grace
              </button>
            </div>
          )
        )}

        {/* Right: Pause / End */}
        <PauseAffordance />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left gutter: phone + nav controls */}
        <div id="outer-left-gutter" className="flex-1 h-full flex flex-col items-center justify-center p-6 bg-surface-bright border-r border-border-divider relative min-w-0">
          <PhoneChrome>
            {children}
          </PhoneChrome>

          {/* Prev / Next step controls — outside phone */}
          {showStepControls && (
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={onPrev}
                disabled={!canPrev}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-border-divider bg-white text-xs font-inter font-medium text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                onClick={onNext}
                disabled={!canNext}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-primary bg-primary text-on-primary text-xs font-inter font-medium hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

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

        {/* Instructor/Moderator instructions docked on the right */}
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
