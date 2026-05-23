import { CheckSquare, Square, ChevronRight } from 'lucide-react'
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

  const handleItemClick = (item: InstructionStep) => {
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
      <div className="p-4 bg-neutral-50 rounded-card border border-neutral-200 text-left">
        <p className="text-xs font-inter text-text-secondary leading-relaxed">
          No structured checklist items for this step. Tap "? I need help" below if you get stuck.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 font-inter text-left">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 font-mono">
        Task Checklist
      </h3>
      <div className="space-y-2.5">
        {items.map((item) => {
          const completed = completedList.includes(item.id)
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              id={`checklist-item-${item.id}`}
              className={`flex items-start space-x-3 p-3 rounded-card border transition-all cursor-pointer select-none ${
                completed
                  ? 'bg-primary-container/20 border-primary-container/40 text-text-muted'
                  : 'bg-white border-border-divider hover:border-primary text-on-surface hover:shadow-sm'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {completed ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted hover:text-primary" />
                )}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className={`text-xs leading-relaxed ${completed ? 'line-through text-text-secondary' : 'font-medium'}`}>
                  {item.label}
                </span>
                {!completed && item.selector && (
                  <span className="text-[10px] font-mono text-primary flex items-center space-x-0.5 opacity-80 hover:opacity-100 transition-opacity ml-2">
                    <span>Show</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
