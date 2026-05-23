import { useState, useEffect } from 'react'
import { useStore } from '../../lib/store'
import { DesktopFrame } from './DesktopFrame'
import { DesktopBrowserFrame } from './DesktopBrowserFrame'
import { MobileFrame } from './MobileFrame'

interface FrameWrapperProps {
  children: React.ReactNode
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  showStepControls?: boolean
  onHelp?: () => void
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isDesktop
}

export function FrameWrapper({
  children,
  onPrev,
  onNext,
  canPrev,
  canNext,
  showStepControls,
  onHelp
}: FrameWrapperProps) {
  const isDesktop = useIsDesktop()
  const { cohort, simulatedCohort } = useStore()

  const isProvider = cohort === 'lawyer' || cohort === 'clinician'

  if (isDesktop) {
    // Provider cohort: default to DesktopBrowserFrame for Jane's view
    // Switch to DesktopFrame (phone chrome) when Simulate Grace is active
    if (isProvider) {
      if (simulatedCohort === 'grace') {
        return (
          <DesktopFrame
            onPrev={onPrev}
            onNext={onNext}
            canPrev={canPrev}
            canNext={canNext}
            showStepControls={showStepControls}
            onHelp={onHelp}
          >
            {children}
          </DesktopFrame>
        )
      }
      // Default: Jane's browser desktop view
      return (
        <DesktopBrowserFrame
          onPrev={onPrev}
          onNext={onNext}
          canPrev={canPrev}
          canNext={canNext}
          showStepControls={showStepControls}
        >
          {children}
        </DesktopBrowserFrame>
      )
    }

    // Women cohort: phone chrome
    return (
      <DesktopFrame
        onPrev={onPrev}
        onNext={onNext}
        canPrev={canPrev}
        canNext={canNext}
        showStepControls={showStepControls}
        onHelp={onHelp}
      >
        {children}
      </DesktopFrame>
    )
  }

  return (
    <MobileFrame
      onPrev={onPrev}
      onNext={onNext}
      canPrev={canPrev}
      canNext={canNext}
      showStepControls={showStepControls}
    >
      {children}
    </MobileFrame>
  )
}
