import { useState, useEffect } from 'react'
import { X, Pause, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { useStore } from '../../lib/store'
import { telemetry, EventTypes } from '../../lib/telemetry'
import { recordSessionComplete } from '../../lib/session'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

interface PauseAffordanceProps {
  onEndSession?: () => void
}

export function PauseAffordance({ onEndSession }: PauseAffordanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false)
  const isPaused = useStore((state) => state.isPaused)
  const sessionId = useStore((state) => state.sessionId)
  const setPaused = useStore((state) => state.setPaused)
  const restartToScenario1 = useStore((state) => state.restartToScenario1)
  const navigate = useNavigate()

  const handlePauseClick = () => {
    setIsModalOpen(true)
    setPaused(true)
    telemetry.track(EventTypes.SESSION_PAUSED, {})
  }

  const handleResume = () => {
    setIsModalOpen(false)
    setPaused(false)
    telemetry.track(EventTypes.SESSION_RESUMED, {})
  }

  const handleEndSession = async () => {
    if (sessionId) {
      try {
        await recordSessionComplete(sessionId, true)
      } catch (err) {
        console.error('Error logging session completion:', err)
      }
    }
    setIsModalOpen(false)
    setPaused(false)
    onEndSession?.()
    navigate('/done?ended=1')
  }

  const handleRestartClick = () => {
    setIsRestartModalOpen(true)
    setPaused(true)
    telemetry.track(EventTypes.SESSION_PAUSED, { reason: 'restart_clicked' })
  }

  const handleCancelRestart = () => {
    setIsRestartModalOpen(false)
    setPaused(false)
    telemetry.track(EventTypes.SESSION_RESUMED, { reason: 'restart_cancelled' })
  }

  const handleConfirmRestart = () => {
    restartToScenario1()
    setIsRestartModalOpen(false)
    navigate('/guided')
  }

  // Sync Zustand state with modal state (for pause only)
  useEffect(() => {
    if (isPaused && !isModalOpen && !isRestartModalOpen) {
      setIsModalOpen(true)
    }
  }, [isPaused, isModalOpen, isRestartModalOpen])

  return (
    <div className="flex items-center space-x-2">
      {/* Restart Button */}
      <button
        onClick={handleRestartClick}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-outline shadow-sm text-on-surface-variant hover:text-primary hover:border-primary transition-colors text-xs font-inter font-medium"
        aria-label="Restart session"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Restart</span>
      </button>

      {/* Labeled Pill Button — placed in outer frame header by parent */}
      <button
        onClick={handlePauseClick}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-outline shadow-sm text-on-surface-variant hover:text-primary hover:border-primary transition-colors text-xs font-inter font-medium"
        aria-label="Pause or end session"
      >
        <Pause className="w-3.5 h-3.5" />
        <span>Pause / End</span>
      </button>

      {/* Pause Modal */}
      {isModalOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4 modal-portal"
          onClick={handleResume}
        >
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-card p-6 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium font-newsreader text-on-surface">
                Session paused
              </h2>
              <button
                onClick={handleResume}
                className="p-1 text-text-muted hover:text-on-surface transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message */}
            <p className="text-base font-inter text-text-secondary mb-8 leading-relaxed">
              Take a break — your progress is saved. You can resume anytime.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleResume}
              >
                Resume now
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleEndSession}
              >
                End session
              </Button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Restart Confirmation Modal */}
      {isRestartModalOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4 modal-portal"
          onClick={handleCancelRestart}
        >
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-card p-6 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium font-newsreader text-on-surface">
                Restart session?
              </h2>
              <button
                onClick={handleCancelRestart}
                className="p-1 text-text-muted hover:text-on-surface transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message */}
            <p className="text-sm font-inter text-text-secondary mb-8 leading-relaxed">
              Are you sure you want to restart back to Scenario 1? This will reset all your progress in the guided scenarios.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleConfirmRestart}
              >
                Yes, restart session
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCancelRestart}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  )
}