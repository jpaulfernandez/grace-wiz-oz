import { useState } from 'react'
import { Phone, X, ShieldAlert, HeartHandshake } from 'lucide-react'
import { telemetry, EventTypes } from '../../lib/telemetry'
import { motion, AnimatePresence } from 'framer-motion'

export function CrisisButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleTap = () => {
    setIsOpen(true)
    telemetry.track(EventTypes.CRISIS_BUTTON_TAP, {})
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const hotlines = [
    {
      name: 'Immediate Danger (PNP)',
      number: '911',
      description: 'Call national police hotline'
    },
    {
      name: 'Gender-Based Violence (DSWD)',
      number: '1343',
      description: 'Call anti-trafficking & violence referral'
    },
    {
      name: 'Mental Distress (NCMH)',
      number: '1553',
      description: 'Call national mental health crisis hotline'
    },
    {
      name: 'Women\'s Crisis Center (WCC)',
      number: '02-8921-6783',
      description: 'Call the WCC support desk'
    }
  ]

  return (
    <>
      {/* Floating Circle Button */}
      <button
        onClick={handleTap}
        id="crisis-floating-btn"
        className="fixed bottom-[88px] right-6 z-40 w-14 h-14 rounded-full bg-secondary text-white shadow-[0_4px_12px_rgba(0,137,123,0.25)] hover:bg-opacity-95 transition-all flex items-center justify-center border border-teal-600 focus:outline-none"
        aria-label="Get crisis assistance"
      >
        <Phone className="w-6 h-6 stroke-[1.75]" />
      </button>

      {/* Hotline Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 select-none">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={handleClose} />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-card p-6 shadow-xl border border-border-divider z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2.5">
                  <ShieldAlert className="w-5 h-5 text-secondary" />
                  <h2 className="text-lg font-medium font-newsreader text-on-surface">
                    Crisis & Safety Support
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 text-text-muted hover:text-on-surface transition-colors"
                  aria-label="Close crisis desk"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Advisory */}
              <div className="p-3 bg-secondary-container/40 border border-secondary/20 rounded-input mb-5 flex space-x-2">
                <HeartHandshake className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-xs font-inter text-on-secondary-container leading-relaxed">
                  These are real numbers. Tap any item to prompt your dialer. If you're in physical danger, please call 911 immediately.
                </p>
              </div>

              {/* Hotline items */}
              <div className="space-y-3 mb-4">
                {hotlines.map((hotline, idx) => (
                  <a
                    key={idx}
                    href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}
                    onClick={() => telemetry.track(EventTypes.CRISIS_RESOLVED, { hotline: hotline.name })}
                    className="block p-4 border border-border-divider rounded-input hover:border-secondary hover:bg-secondary-container/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium font-inter text-on-surface group-hover:text-secondary transition-colors">
                        {hotline.name}
                      </span>
                      <span className="text-xs font-mono font-medium text-secondary bg-secondary-container px-2 py-0.5 rounded-full">
                        {hotline.number}
                      </span>
                    </div>
                    <span className="block text-[11px] font-inter text-text-secondary mt-1">
                      {hotline.description}
                    </span>
                  </a>
                ))}
              </div>

              {/* Close footer */}
              <button
                onClick={handleClose}
                className="w-full h-12 rounded-input border border-border-divider text-sm font-inter text-text-secondary hover:text-on-surface hover:bg-background transition-colors"
              >
                Go back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
