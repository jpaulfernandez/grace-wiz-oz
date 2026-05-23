import { FileText, BookOpen, Compass } from 'lucide-react'

export type HandoffAction = 'log' | 'journal' | 'letgo'

interface HandoffChipsProps {
  onSelect: (action: HandoffAction) => void
  disabled?: boolean
}

export function HandoffChips({ onSelect, disabled = false }: HandoffChipsProps) {
  const chips = [
    {
      id: 'journal' as const,
      label: 'Continue to journal',
      icon: BookOpen
    },
    {
      id: 'log' as const,
      label: 'Log incident',
      icon: FileText
    },
    {
      id: 'letgo' as const,
      label: 'Let go for now',
      icon: Compass
    }
  ]

  return (
    <div className="w-full px-6 py-3 bg-background/90 border-t border-border-divider flex flex-col space-y-2 select-none z-10">
      <span className="text-[10px] font-mono tracking-wider uppercase text-text-muted text-center mb-1">
        AI Suggestion Paths
      </span>
      <div className="grid grid-cols-3 gap-2">
        {chips.map((chip) => {
          const Icon = chip.icon
          const buttonId = chip.id === 'journal' ? 'continue-journal-btn' :
                          chip.id === 'log' ? 'log-incident-btn' :
                          'let-go-btn'
          return (
            <button
              id={buttonId}
              key={chip.id}
              disabled={disabled}
              onClick={() => onSelect(chip.id)}
              className="h-10 flex items-center justify-center space-x-1.5 border border-secondary/30 rounded-input bg-transparent text-secondary hover:bg-secondary-container/10 hover:border-secondary transition-all disabled:opacity-50 text-[11px] font-inter font-medium leading-none px-2 text-center"
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{chip.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
