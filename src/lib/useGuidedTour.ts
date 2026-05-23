import { useEffect, useRef, useState } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useStore, getCurrentStep } from './store'
import { telemetry, EventTypes } from './telemetry'
import type { GuidedStepConfig, InstructionStep } from '../config/scenarioTypes'

function isElementVisible(el: HTMLElement): boolean {
  if (!el) return false
  const style = window.getComputedStyle(el)
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false
  const rect = el.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return false
  return true
}

export function useGuidedTour() {
  const {
    currentScenarioIndex,
    currentStepIndex,
    guidedMode,
    nextStep,
    showNudgeText,
    setShowNudgeText
  } = useStore()

  const currentStep = useStore(getCurrentStep)
  const [currentlyHighlighted, setCurrentlyHighlighted] = useState<string | null>(null)

  const driverInstanceRef = useRef<ReturnType<typeof driver> | null>(null)

  // Reactive listener to completed steps
  const completedList = useStore(state => currentStep ? (state.completedInstructions[currentStep.id] ?? []) : [])

  const getNextIncompleteInstruction = (step: GuidedStepConfig): InstructionStep | null => {
    if (!step.instructionSteps || step.instructionSteps.length === 0) return null
    const completed = useStore.getState().completedInstructions[step.id] ?? []
    return step.instructionSteps.find(ins => !completed.includes(ins.id)) || null
  }

  const highlightInstruction = (ins: InstructionStep, trigger: 'mount' | 'checklist_tap' | 'redirect' = 'mount') => {
    if (!ins.selector) return

    const initDriver = () => {
      const el = document.querySelector(ins.selector!) as HTMLElement | null
      if (!el || !isElementVisible(el)) return

      if (driverInstanceRef.current) {
        driverInstanceRef.current.destroy()
      }

      const d = driver({
        showProgress: false,
        allowClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.45)',
        popoverClass: 'grace-tour-popover',
        onHighlightStarted: () => {
          telemetry.track(EventTypes.TOUR_STEP_SHOWN, {
            step_id: currentStep?.id,
            instruction_id: ins.id,
            trigger
          })
        },
        onDestroyed: () => {
          setCurrentlyHighlighted(null)
        }
      })

      driverInstanceRef.current = d
      setCurrentlyHighlighted(ins.selector!)

      d.highlight({
        element: ins.selector!,
        popover: {
          title: ins.popover?.title || '',
          description: ins.popover?.description || '',
          side: ins.popover?.side || 'right',
          align: ins.popover?.align || 'start',
          showButtons: []
        }
      })
    }

    const selector = ins.selector!
    const found = document.querySelector(selector)
    if (found) {
      initDriver()
    } else if (ins.waitForElement !== false) {
      let elapsed = 0
      const interval = setInterval(() => {
        const check = document.querySelector(selector)
        if (check) {
          clearInterval(interval)
          initDriver()
        } else {
          elapsed += 100
          if (elapsed >= 2000) {
            clearInterval(interval)
          }
        }
      }, 100)
    }
  }

  // Reactive effect to destroy highlights on step transition, mode change, or task completion
  useEffect(() => {
    if (driverInstanceRef.current) {
      driverInstanceRef.current.destroy()
    }
    setCurrentlyHighlighted(null)

    return () => {
      if (driverInstanceRef.current) {
        driverInstanceRef.current.destroy()
      }
      setCurrentlyHighlighted(null)
    }
  }, [currentStepIndex, currentScenarioIndex, guidedMode, completedList.length])

  // MutationObserver to automatically adjust bounds when phone screen shifts (e.g. Chat lists growing)
  useEffect(() => {
    if (!currentlyHighlighted) return

    const phoneFrame = document.querySelector('#phone-frame-root')
    if (!phoneFrame) return

    const observer = new MutationObserver(() => {
      const el = document.querySelector(currentlyHighlighted) as HTMLElement | null
      if (el && isElementVisible(el)) {
        if (driverInstanceRef.current) {
          try {
            (driverInstanceRef.current as any).refresh()
          } catch (e) {
            // driver.js refresh error shield
          }
        }
      } else {
        if (driverInstanceRef.current) {
          driverInstanceRef.current.destroy()
        }
      }
    })

    observer.observe(phoneFrame, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    })

    return () => {
      observer.disconnect()
    }
  }, [currentlyHighlighted])

  // Inactivity nudge timer tracking
  useEffect(() => {
    if (guidedMode !== 'step' || !currentStep) {
      setShowNudgeText(false)
      return
    }

    const nextIncomplete = getNextIncompleteInstruction(currentStep)
    if (!nextIncomplete || !nextIncomplete.selector) {
      setShowNudgeText(false)
      return
    }

    let idle30sTimeout: ReturnType<typeof setTimeout> | null = null
    let idle60sTimeout: ReturnType<typeof setTimeout> | null = null
    let idle90sTimeout: ReturnType<typeof setTimeout> | null = null

    const resetIdleTimers = () => {
      setShowNudgeText(false)

      const targetEl = document.querySelector(nextIncomplete.selector!)
      if (targetEl) {
        targetEl.classList.remove('animate-pulse')
      }

      if (idle30sTimeout) clearTimeout(idle30sTimeout)
      if (idle60sTimeout) clearTimeout(idle60sTimeout)
      if (idle90sTimeout) clearTimeout(idle90sTimeout)

      const idleBaseTime = currentStep.idleTimeoutMs || 30000

      // 30 Seconds: Pulse target
      idle30sTimeout = setTimeout(() => {
        telemetry.track(EventTypes.TOUR_IDLE_30S, { step_id: currentStep.id, instruction_id: nextIncomplete.id })
        const el = document.querySelector(nextIncomplete.selector!)
        if (el) {
          el.classList.add('animate-pulse')
        }
      }, idleBaseTime)

      // 60 Seconds: Side panel text nudge
      idle60sTimeout = setTimeout(() => {
        setShowNudgeText(true)
        telemetry.track(EventTypes.TOUR_IDLE_60S, { step_id: currentStep.id, instruction_id: nextIncomplete.id })
      }, idleBaseTime * 2)

      // 90 Seconds: Force re-highlight
      idle90sTimeout = setTimeout(() => {
        telemetry.track(EventTypes.TOUR_IDLE_90S, { step_id: currentStep.id, instruction_id: nextIncomplete.id })
        highlightInstruction(nextIncomplete, 'mount')
      }, idleBaseTime * 3)
    }

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimers, { passive: true })
    })

    resetIdleTimers()

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimers)
      })
      if (idle30sTimeout) clearTimeout(idle30sTimeout)
      if (idle60sTimeout) clearTimeout(idle60sTimeout)
      if (idle90sTimeout) clearTimeout(idle90sTimeout)

      const el = document.querySelector(nextIncomplete.selector!)
      if (el) {
        el.classList.remove('animate-pulse')
      }
    }
  }, [currentStepIndex, currentScenarioIndex, guidedMode, completedList.length])

  // Bind trigger links to window context
  useEffect(() => {
    (window as any).graceHighlightInstruction = (ins: InstructionStep) => {
      highlightInstruction(ins, 'checklist_tap')
    }
    (window as any).graceTriggerHelp = () => {
      if (currentStep) {
        const nextIncomplete = getNextIncompleteInstruction(currentStep)
        if (nextIncomplete) {
          highlightInstruction(nextIncomplete, 'redirect')
        }
      }
    }

    return () => {
      delete (window as any).graceHighlightInstruction
      delete (window as any).graceTriggerHelp
    }
  }, [currentStep, currentStepIndex])

  const advanceTour = () => {
    telemetry.track(EventTypes.TOUR_STEP_ADVANCED, {
      step_id: currentStep?.id,
      step_index: currentStepIndex
    })
    nextStep()
  }

  return {
    currentStep,
    showNudgeText,
    advanceTour
  }
}
