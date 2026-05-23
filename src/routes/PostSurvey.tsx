import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { telemetry, EventTypes } from '../lib/telemetry'

export default function PostSurvey() {
  const navigate = useNavigate()

  const handleFreeRoam = () => {
    telemetry.trackButtonTap('free_roam_accept')
    telemetry.track(EventTypes.FREE_ROAM_START, {})
    navigate('/free')
  }

  const handleDone = () => {
    telemetry.trackButtonTap('free_roam_decline')
    navigate('/done')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border-divider rounded-card p-8 text-center space-y-6">
        
        {/* Monospaced tag */}
        <span className="text-label-sm text-text-muted uppercase tracking-wider font-mono">
          Survey submitted
        </span>

        {/* Serif Headline */}
        <h1 className="text-headline-lg font-newsreader text-on-surface">
          Thank you for your feedback
        </h1>

        {/* Sans-serif Description */}
        <p className="text-body-md text-text-secondary font-inter leading-relaxed">
          Your feedback has been successfully recorded. Would you like to explore the Grace app prototype on your own in free-roaming mode? All features are unlocked.
        </p>

        {/* Austere, stark buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            type="button"
            variant="primary"
            className="w-full"
            onClick={handleFreeRoam}
          >
            Explore freely
          </Button>
          <button
            type="button"
            className="w-full py-3 text-body-md font-medium text-text-secondary hover:text-on-surface font-inter transition-colors focus:outline-none"
            onClick={handleDone}
          >
            I'm done
          </button>
        </div>

      </div>
    </div>
  )
}
