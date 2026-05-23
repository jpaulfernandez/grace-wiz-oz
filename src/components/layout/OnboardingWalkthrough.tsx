import { useState } from 'react'
import { useStore } from '../../lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Smartphone, BookOpen, HelpCircle, Check } from 'lucide-react'

export function OnboardingWalkthrough() {
  const { onboardingComplete, setOnboardingComplete } = useStore()
  const [slide, setSlide] = useState(0)

  if (onboardingComplete) return null

  const slides = [
    {
      title: "This is the App Sandbox",
      description: "In the center, you'll see a fully interactive smartphone screen hosting Grace. Work through the scenarios naturally, chatting with your Companion, saving journal entries, and securing incident logs just like a real user.",
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      targetId: "outer-left-gutter",
      badge: "Step 1 of 4"
    },
    {
      title: "Follow the Right Sidebar",
      description: "The right sidebar holds your moderator and testing instructions. Each instruction is formatted as an interactive checklist task. Perform these tasks inside the phone screen to complete the scenario step.",
      icon: <BookOpen className="w-10 h-10 text-secondary" />,
      targetId: "right-sidebar-panel",
      badge: "Step 2 of 4"
    },
    {
      title: "Mandatory Micro-Prompts",
      description: "Throughout the tour, brief micro-questions will appear in the sidebar. These questions are mandatory for all research testers—ensure you answer all of them to unlock the 'Next' step button.",
      icon: <Sparkles className="w-10 h-10 text-amber-500" />,
      targetId: "micro-prompts-container",
      badge: "Step 3 of 4"
    },
    {
      title: "We are here to help",
      description: "If you get confused or lost at any point, click '? I need help' located in the top header bar. It will instantly highlight the exact action required.",
      icon: <HelpCircle className="w-10 h-10 text-indigo-500" />,
      targetId: "help-buttons-gutter",
      badge: "Step 4 of 4"
    }
  ]

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1)
    } else {
      setOnboardingComplete(true)
    }
  }

  const current = slides[slide]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15">
        
        {/* Spotlight indicator helper styles */}
        <style>{`
          ${current.targetId === 'outer-left-gutter' ? `
            #outer-left-gutter {
              z-index: 9995 !important;
              outline: 3px solid #6200EE !important;
              outline-offset: 4px;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.15) !important;
              border-radius: 12px;
            }
          ` : ''}
          ${current.targetId === 'right-sidebar-panel' ? `
            #right-sidebar-panel {
              z-index: 9995 !important;
              outline: 3px solid #3700B3 !important;
              outline-offset: 4px;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.15) !important;
            }
          ` : ''}
          ${current.targetId === 'micro-prompts-container' ? `
            #micro-prompts-container {
              z-index: 9995 !important;
              outline: 3px solid #FF0266 !important;
              outline-offset: 4px;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.15) !important;
              position: relative;
              background-color: white;
              border-radius: 8px;
              padding: 4px;
            }
          ` : ''}
          ${current.targetId === 'help-buttons-gutter' ? `
            #help-buttons-gutter {
              z-index: 9995 !important;
              outline: 3px solid #6200EE !important;
              outline-offset: 4px;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.15) !important;
              position: relative;
              background-color: white;
              border-radius: 9999px;
            }
          ` : ''}
        `}</style>

        {/* Onboarding Dialog Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white border border-border-divider rounded-card p-8 md:p-10 shadow-2xl relative z-[9998] space-y-6 flex flex-col text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold bg-neutral-100 px-3 py-1 rounded-full text-text-muted uppercase tracking-widest">
              {current.badge}
            </span>
            <div className="flex space-x-1">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === slide ? 'bg-primary w-4' : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon + Title */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl flex-shrink-0 shadow-sm">
              {current.icon}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-newsreader font-semibold text-on-surface">
                {current.title}
              </h2>
              <p className="text-xs font-mono text-text-muted">Grace Testing Sandbox</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm font-inter text-text-secondary leading-relaxed pt-2">
            {current.description}
          </p>

          {/* Actions */}
          <div className="pt-6 border-t border-border-divider flex items-center justify-between">
            <button
              onClick={() => setOnboardingComplete(true)}
              className="text-xs font-inter font-medium text-text-muted hover:text-on-surface transition-colors focus:outline-none"
            >
              Skip introduction
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-on-surface text-white rounded-input text-xs font-semibold hover:bg-opacity-90 transition-all shadow-sm focus:outline-none active:scale-[0.98]"
            >
              {slide === slides.length - 1 ? (
                <>
                  <span>I'm ready for testing</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
