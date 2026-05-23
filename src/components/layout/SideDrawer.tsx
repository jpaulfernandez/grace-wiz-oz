import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function SideDrawer({ isOpen, onClose, children }: SideDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black lg:hidden"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white rounded-t-sheet shadow-crisis lg:hidden flex flex-col"
          >
            {/* Grab handle / drag indicator */}
            <div className="flex justify-center py-3 border-b border-border-divider relative flex-shrink-0">
              <div className="w-10 h-1 bg-surface-dim rounded-full" />
              <button
                onClick={onClose}
                className="absolute right-4 top-2 p-1 rounded-full hover:bg-surface-bright text-text-muted hover:text-on-surface transition-colors"
                aria-label="Close instructions drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents wrapper */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
