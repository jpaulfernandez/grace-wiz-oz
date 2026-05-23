import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { recordSessionComplete } from '../lib/session'
import { Mail } from 'lucide-react'

export default function Done() {
  const location = useLocation()
  const { sessionId } = useStore()

  const params = new URLSearchParams(location.search)
  const endedEarly = params.get('ended') === '1' || params.get('partial') === '1'

  useEffect(() => {
    if (sessionId) {
      recordSessionComplete(sessionId, endedEarly).catch((err) => {
        console.error('Failed to log session completion:', err)
      })
    }
  }, [sessionId, endedEarly])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border-divider rounded-card p-8 text-center space-y-6">
        
        {/* Monospaced Indicator */}
        <span className="text-label-sm text-text-muted uppercase tracking-wider font-mono">
          Session complete
        </span>

        {/* Serif Headline */}
        <h1 className="text-headline-lg font-newsreader text-on-surface">
          Thank you for your participation
        </h1>

        {/* Description */}
        <p className="text-body-md text-text-secondary font-inter leading-relaxed">
          {endedEarly
            ? 'You have successfully concluded your session early. Your recorded feedback is invaluable to our research.'
            : 'You have successfully completed the research session. Your contribution will help us build safer systems.'}
        </p>

        <div className="bg-neutral-50 p-6 rounded-2xl border border-border-divider">
          <h2 className="text-sm font-semibold font-inter text-on-surface mb-2">Have suggestions or feedback?</h2>
          <p className="text-xs font-inter text-text-secondary leading-relaxed">
            If you have any additional thoughts, feature requests, or encountered any issues during your session, please let us know:
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm font-mono text-primary bg-primary-container/20 py-3 rounded-xl">
            <Mail className="w-4 h-4" />
            <span>hello@weve.org</span>
          </div>
        </div>

        {/* Grounding note */}
        <div className="pt-6 border-t border-border-divider">
          <p className="text-label-sm text-text-muted font-inter">
            You can safely close this browser window or tab.
          </p>
        </div>

      </div>
    </div>
  )
}
