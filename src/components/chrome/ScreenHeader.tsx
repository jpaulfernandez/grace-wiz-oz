import { ChevronLeft } from 'lucide-react'

interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  rightAction?: React.ReactNode
}

export function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
  return (
    <header className="h-[56px] border-b border-border-divider flex items-center justify-between px-6 bg-white flex-shrink-0 w-full z-10 select-none">
      <div className="flex items-center min-w-0 flex-1">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-3 -ml-2 mr-1 rounded-full text-text-secondary hover:text-primary active:bg-primary-container transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2]" />
          </button>
        ) : null}
        <h1 className="text-base font-medium font-inter text-on-surface truncate">
          {title}
        </h1>
      </div>
      {rightAction ? (
        <div className="flex-shrink-0 ml-4">
          {rightAction}
        </div>
      ) : null}
    </header>
  )
}
