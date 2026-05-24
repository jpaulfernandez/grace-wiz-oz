import { useState, useEffect } from 'react'
import { Info, HelpCircle } from 'lucide-react'
import { useStore } from '../../lib/store'
import { SideDrawer } from './SideDrawer'
import { SidePanel } from './SidePanel'
import { PauseAffordance } from './PauseAffordance'
import { StudyInfoModal } from './StudyInfoModal'

interface MobileFrameProps {
  children: React.ReactNode
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  showStepControls?: boolean
}

export function MobileFrame({
  children,
  onPrev,
  onNext,
  canPrev,
  canNext,
  showStepControls
}: MobileFrameProps) {
  const { cohort, simulatedCohort, setSimulatedCohort, guidedMode, currentScenarioIndex } = useStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showStudyInfo, setShowStudyInfo] = useState(false)

  const isProvider = cohort === 'lawyer' || cohort === 'clinician'

  useEffect(() => {
    if (guidedMode === 'reflection' || currentScenarioIndex === 0) {
      setIsDrawerOpen(true)
    }
  }, [guidedMode, currentScenarioIndex])

  return (
    <div className="flex lg:hidden w-screen h-[100dvh] bg-background flex-col relative overflow-hidden">

      {/* Outer Top Bar */}
      <div className="flex-shrink-0 h-11 w-full bg-white border-b border-border-divider flex items-center justify-between px-4 z-30">
        <div className="flex items-center space-x-1 -ml-2">
          <button
            id="help-button"
            onClick={() => (window as any).graceTriggerHelp?.()}
            className="p-2 text-text-muted hover:text-primary transition-colors"
            aria-label="Request help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            id="study-info-button"
            onClick={() => setShowStudyInfo(true)}
            className="p-2 text-text-muted hover:text-primary transition-colors"
            aria-label="Study information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Simulate Jane / Grace (provider only) */}
        {isProvider && (
          <div className="flex items-center space-x-1 bg-neutral-100 border border-neutral-200 rounded-full p-0.5">
            <button
              onClick={() => setSimulatedCohort('jane')}
              className={`px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                simulatedCohort !== 'grace'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-text-muted'
              }`}
            >
              Jane
            </button>
            <button
              onClick={() => setSimulatedCohort('grace')}
              className={`px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full transition-all focus:outline-none ${
                simulatedCohort === 'grace'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-text-muted'
              }`}
            >
              Grace
            </button>
          </div>
        )}

        <PauseAffordance />
      </div>

      {/* Screen Viewport */}
      <main className="flex-1 overflow-y-auto relative min-h-0">
        {children}
      </main>

      {/* Prominent Guide Button outside phone (sticky at bottom) */}
      {showStepControls && (
        <div className="flex-shrink-0 h-14 bg-white border-t border-border-divider flex items-center justify-center px-4 pt-1 pb-[calc(4px+env(safe-area-inset-bottom))] box-content">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full h-full flex items-center justify-center space-x-2 rounded-full bg-primary text-on-primary text-sm font-inter font-medium shadow-sm hover:bg-opacity-90 active:scale-[0.98] transition-all"
            aria-label="View instructions"
          >
            <Info className="w-4 h-4" />
            <span>Open Guide</span>
          </button>
        </div>
      )}

      {/* Fallback floating instructions button (when no step controls shown) */}
      {!showStepControls && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 p-3.5 rounded-full bg-primary text-on-primary shadow-crisis hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center"
          aria-label="View instructions"
        >
          <Info className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Instruction Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <SidePanel
          onPrev={onPrev}
          onNext={onNext}
          canPrev={canPrev}
          canNext={canNext}
          showStepControls={showStepControls}
        />
      </SideDrawer>

      {/* Study Info Modal */}
      {showStudyInfo && <StudyInfoModal onClose={() => setShowStudyInfo(false)} />}
    </div>
  )
}
