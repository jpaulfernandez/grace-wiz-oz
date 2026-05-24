import { MessageSquare, BookOpen, ShieldAlert, MoreHorizontal } from 'lucide-react'

interface BottomNavProps {
  activeTab?: 'companion' | 'journal' | 'incident' | 'more'
  onTabChange?: (tab: 'companion' | 'journal' | 'incident' | 'more') => void
  disabled?: boolean
}

export function BottomNav({ activeTab = 'companion', onTabChange, disabled = false }: BottomNavProps) {
  const tabs = [
    { id: 'companion', label: 'Companion', icon: MessageSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'incident', label: 'Incident Log', icon: ShieldAlert },
    { id: 'more', label: 'More', icon: MoreHorizontal }
  ] as const

  return (
    <nav className="h-[72px] bg-white border-t border-border-divider flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] box-content select-none flex-shrink-0 w-full z-10">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            id={tab.id === 'incident' ? 'incident-nav-tab' : `nav-${tab.id}-btn`}
            disabled={disabled}
            onClick={() => onTabChange?.(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-12 transition-colors focus:outline-none disabled:opacity-50 ${
              isActive ? 'text-primary font-medium' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="w-6 h-6 stroke-[1.5px] mb-1" />
            <span className="text-xs font-inter tracking-tight leading-none">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
