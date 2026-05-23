import { Check, ChevronRight } from 'lucide-react'
import { useStore } from '../../lib/store'
import type { GuidedStepConfig, InstructionStep } from '../../config/scenarioTypes'

interface StepChecklistProps {
  step: GuidedStepConfig
  onTriggerHelp?: () => void
}

export function StepChecklist({ step, onTriggerHelp }: StepChecklistProps) {
  // Read completed list reactively
  const completedList = useStore(state => state.completedInstructions[step.id] ?? [])
  const items = step.instructionSteps || []

  // Find the first incomplete instruction step (the active step)
  const activeIndex = items.findIndex(item => !completedList.includes(item.id))

  const handleItemClick = (item: InstructionStep, isUpcoming: boolean) => {
    if (isUpcoming) return // Upcoming steps are disabled

    const completed = completedList.includes(item.id)
    if (!completed) {
      if (item.selector) {
        // Trigger manual highlight of this instruction step
        (window as any).graceHighlightInstruction?.(item)
      } else {
        onTriggerHelp?.()
      }
    }
  }

  if (items.length === 0) {
    return (
      <div className="p-4 bg-neutral-50 rounded-card border border-neutral-200 text-left animate-fade-in">
        <p className="text-xs font-inter text-text-secondary leading-relaxed">
          No structured checklist items for this step. Tap "? I need help" below if you get stuck.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 font-inter text-left animate-fade-in">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 font-mono">
        Steps to Follow
      </h3>
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const completed = completedList.includes(item.id)
          const isActive = index === activeIndex
          const isUpcoming = activeIndex !== -1 && index > activeIndex

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item, isUpcoming)}
              id={`checklist-item-${item.id}`}
              className={`group flex items-start space-x-3 p-3 rounded-card border transition-all duration-200 select-none ${
                completed
                  ? 'bg-neutral-50/55 border-neutral-200/50 text-text-muted cursor-pointer opacity-70'
                  : isActive
                  ? 'bg-primary-container/10 border-primary text-on-surface shadow-sm cursor-pointer'
                  : isUpcoming
                  ? 'bg-white border-border-divider text-text-muted cursor-not-allowed opacity-45 pointer-events-none'
                  : 'bg-white border-border-divider hover:border-primary text-on-surface hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {completed ? (
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-scale-up">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full bg-primary border border-primary text-white flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 text-text-muted flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className={`text-xs leading-relaxed ${completed ? 'line-through text-text-secondary' : 'font-semibold'}`}>
                    {item.label}
                  </span>
                  {isActive && item.selector && (
                    <span className="text-[10px] font-mono text-primary flex items-center space-x-0.5 opacity-80 hover:opacity-100 transition-opacity ml-2">
                      <span>Show</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                {isActive && item.popover?.description && (
                  <p className="text-[11px] font-normal text-text-secondary leading-relaxed mt-1.5 animate-fade-in font-inter">
                    {item.popover.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

