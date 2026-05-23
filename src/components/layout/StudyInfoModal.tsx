import { X, Shield, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface StudyInfoModalProps {
  onClose: () => void
}

export function StudyInfoModal({ onClose }: StudyInfoModalProps) {
  return (
    <AnimatePresence>
      {createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-card shadow-xl overflow-hidden"
          >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-divider">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
                Research Study
              </span>
              <h2 className="text-lg font-medium font-newsreader text-on-surface mt-0.5">
                About This Study
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-on-surface transition-colors rounded-full hover:bg-background"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Researchers info */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary-container text-primary rounded-input flex-shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    School & Course
                  </p>
                  <p className="text-sm font-inter text-on-surface font-semibold">Asian Institute of Management</p>
                  <p className="text-xs font-inter text-text-secondary">Master in Innovation and Business</p>
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    Researchers
                  </p>
                  <ul className="text-xs font-inter text-on-surface space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>Jan Paul M. Fernandez</strong><br />
                      <a href="mailto:jfernandez.MIB2026B@aim.edu" className="text-primary hover:underline">jfernandez.MIB2026B@aim.edu</a>
                    </li>
                    <li>
                      <strong>Marc Julian E. De Leon</strong><br />
                      <a href="mailto:mdeleon.MIB2026B@aim.edu" className="text-primary hover:underline">mdeleon.MIB2026B@aim.edu</a>
                    </li>
                    <li>
                      <strong>April Y. Barrinuevo</strong><br />
                      <a href="mailto:abarrinuevo.MIB2026B@aim.edu" className="text-primary hover:underline">abarrinuevo.MIB2026B@aim.edu</a>
                    </li>
                    <li>
                      <strong>Mark Cyrille O. Yano</strong><br />
                      <a href="mailto:myano.MIB2026B@aim.edu" className="text-primary hover:underline">myano.MIB2026B@aim.edu</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IRB/Ethics note */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-background text-text-muted rounded-input flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Ethics & Consent
                </p>
                <p className="text-xs font-inter text-text-secondary leading-relaxed">
                  This prototype is part of an ongoing student research project for ISJ2. Your participation is voluntary, and you are free to end the session at any time. If you have any questions about the prototype or the study, please contact the researchers via the details listed above.
                </p>
              </div>
            </div>

            {/* Participation note */}
            <div className="p-4 bg-background border border-border-divider rounded-card text-xs font-inter text-text-secondary leading-relaxed">
              All data collected in this session is anonymized and used only for academic research purposes. No personally identifying information is stored beyond your chosen nickname.
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-on-surface text-white rounded-input text-sm font-inter font-medium hover:bg-opacity-90 transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>,
      document.body
    )}
    </AnimatePresence>
  )
}
