import { Sparkles, Info, Users, ArrowRight, Heart, MessageSquare, BookOpen, FileText, AlertOctagon, HelpCircle, Compass, ShieldAlert, ClipboardList } from 'lucide-react'
import { useStore } from '../../lib/store'
import { telemetry, EventTypes } from '../../lib/telemetry'

export function AdminFeatureSidebar() {
  const {
    cohort,
    setSession,
    setScreen,
    currentScreen,
  } = useStore()

  const handleCohortChange = (newCohort: 'women' | 'lawyer' | 'clinician') => {
    telemetry.track(EventTypes.BUTTON_TAP, { button_id: 'admin_cohort_simulated', cohort: newCohort })
    setSession({ cohort: newCohort })
    
    // Auto-navigate to respective dashboard when switching roles
    if (newCohort === 'lawyer') {
      setScreen('lawyer-dashboard')
    } else if (newCohort === 'clinician') {
      setScreen('clinician-dashboard')
    } else {
      setScreen('guided-home')
    }
  }

  const features = [
    {
      id: 'guided-home',
      label: 'Three Doors (Home)',
      desc: 'Simulate the home selection screen',
      icon: Heart,
      color: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
      screenId: 'guided-home',
    },
    {
      id: 'companion-chat',
      label: 'Companion Chat',
      desc: 'AI Companion chat with sample pills',
      icon: MessageSquare,
      color: 'bg-violet-500/10 text-violet-500 hover:bg-violet-500/20',
      screenId: 'companion-chat',
    },
    {
      id: 'post-save-offers',
      label: 'Continue to Journal',
      desc: 'Handoff summary card after chat',
      icon: ArrowRight,
      color: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
      screenId: 'post-save-offers',
    },
    {
      id: 'journal-modes',
      label: 'Journal with Summary',
      desc: 'Explore journaling entry hub',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
      screenId: 'journal-modes',
    },
    {
      id: 'breath-reminder',
      label: 'Breathe Exercise',
      desc: 'Somatic Vagal calming breath pause',
      icon: Compass,
      color: 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20',
      screenId: 'breath-reminder',
    },
    {
      id: 'journal-annotations',
      label: 'Annotations in Journal',
      desc: 'Somatic stress patterns and highlighting',
      icon: Sparkles,
      color: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
      screenId: 'journal-annotations',
    },
    {
      id: 'journal-editor',
      label: 'Journal Free Entry',
      desc: 'Blank slate private freeflow journal',
      icon: FileText,
      color: 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20',
      screenId: 'journal-editor',
    },
    {
      id: 'journal-guided-editor',
      label: 'Journal Guided',
      desc: 'Reflective guided prompts and writing',
      icon: ClipboardList,
      color: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
      screenId: 'journal-guided-editor',
    },
    {
      id: 'incident-log',
      label: 'Incident Logs',
      desc: 'Secure timestamping and legal intake log',
      icon: AlertOctagon,
      color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
      screenId: 'incident-log',
    },
    {
      id: 'community-qa',
      label: 'Community Q&A',
      desc: 'Survivor discussion directory & safety FAQ',
      icon: HelpCircle,
      color: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
      screenId: 'community-qa',
    },
    {
      id: 'pathway',
      label: 'Pathway Directory',
      desc: 'Company reporting policies & guidelines',
      icon: ClipboardList,
      color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
      screenId: 'pathway',
    },
    {
      id: 'external-help',
      label: 'External Help',
      desc: 'NGO referral and legal aid booking hub',
      icon: ShieldAlert,
      color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      screenId: 'external-help',
    },
  ]

  // Add provider screens if clinician/lawyer
  const providerFeatures = cohort === 'lawyer' ? [
    {
      id: 'lawyer-dashboard',
      label: 'Lawyer Dashboard',
      desc: 'Secure intake, hashes, and files list',
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
      screenId: 'lawyer-dashboard',
    },
    {
      id: 'lawyer-chat',
      label: 'Lawyer Secure Chat',
      desc: 'Interactive context query engine',
      icon: MessageSquare,
      color: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
      screenId: 'lawyer-chat',
    },
    {
      id: 'lawyer-notes',
      label: 'Lawyer Notes',
      desc: 'Secure case study notes diary',
      icon: FileText,
      color: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
      screenId: 'lawyer-notes',
    }
  ] : cohort === 'clinician' ? [
    {
      id: 'clinician-dashboard',
      label: 'Clinician Dashboard',
      desc: 'Grounding logs and clinical files overview',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      screenId: 'clinician-dashboard',
    },
    {
      id: 'clinician-chat',
      label: 'Clinician Secure Chat',
      desc: 'Somatic trends and patterns check-in',
      icon: MessageSquare,
      color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      screenId: 'clinician-chat',
    },
    {
      id: 'clinician-notes',
      label: 'Clinician Notes',
      desc: 'Intake consultation session logs',
      icon: FileText,
      color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      screenId: 'clinician-notes',
    }
  ] : []

  return (
    <aside className="w-full lg:w-[400px] h-full flex flex-col bg-white border-l border-border-divider overflow-y-auto">
      {/* Dynamic Header */}
      <div className="sticky top-0 z-10 flex flex-col justify-between p-6 bg-white border-b border-border-divider">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider uppercase text-secondary font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>FREE-01 Free Roam Admin</span>
          </span>
          <span className="text-[10px] font-mono bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            Cohort: {cohort || 'women'}
          </span>
        </div>
        <h2 className="text-xl font-medium font-newsreader text-on-surface mt-3">
          Interactive Feature Deck
        </h2>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-6 space-y-6 text-left">
        {/* Labeled warning notice */}
        <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-card flex items-start space-x-3">
          <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-inter text-text-secondary leading-relaxed">
            Click any feature row to jump directly to it inside the phone screen on the left. Toggle cohorts to simulate User, Legal, and Clinician views.
          </p>
        </div>

        {/* Cohort Simulator Swapper */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
            Cohort Simulation
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'women', label: 'User (Default)' },
              { id: 'lawyer', label: 'Legal' },
              { id: 'clinician', label: 'Clinic' },
            ].map((role) => {
              const active = cohort === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => handleCohortChange(role.id as any)}
                  className={`py-2 px-1 text-center rounded-input text-xs font-inter font-medium transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm font-semibold'
                      : 'bg-neutral-100 border border-neutral-200 text-text-secondary hover:border-purple-300'
                  }`}
                >
                  {role.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
            App Modules (User)
          </h3>
          <div className="space-y-2">
            {features.map((feat) => {
              const Icon = feat.icon
              const isCurrent = currentScreen === feat.screenId
              return (
                <button
                  key={feat.id}
                  onClick={() => setScreen(feat.screenId)}
                  className={`w-full text-left flex items-start space-x-3.5 p-3 rounded-card border transition-all ${
                    isCurrent
                      ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-300'
                      : 'bg-white border-border-divider hover:border-purple-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${feat.color} transition-colors`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold font-inter text-on-surface flex items-center justify-between">
                      <span>{feat.label}</span>
                      {isCurrent && <span className="text-[9px] uppercase tracking-wider bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded">Active</span>}
                    </h4>
                    <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Provider features list (if selected) */}
        {providerFeatures.length > 0 && (
          <div className="space-y-3 border-t border-border-divider pt-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              Provider Hub Modules ({cohort === 'lawyer' ? 'Legal' : 'Clinic'})
            </h3>
            <div className="space-y-2">
              {providerFeatures.map((feat) => {
                const Icon = feat.icon
                const isCurrent = currentScreen === feat.screenId
                return (
                  <button
                    key={feat.id}
                    onClick={() => setScreen(feat.screenId)}
                    className={`w-full text-left flex items-start space-x-3.5 p-3 rounded-card border transition-all ${
                      isCurrent
                        ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-300'
                        : 'bg-white border-border-divider hover:border-purple-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${feat.color} transition-colors`}>
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold font-inter text-on-surface flex items-center justify-between">
                        <span>{feat.label}</span>
                        {isCurrent && <span className="text-[9px] uppercase tracking-wider bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded">Active</span>}
                      </h4>
                      <p className="text-[11px] font-inter text-text-secondary mt-0.5 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}


