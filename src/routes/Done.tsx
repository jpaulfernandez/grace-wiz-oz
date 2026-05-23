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

        <div className="bg-neutral-50 p-6 rounded-2xl border border-border-divider text-left space-y-4">
          <div>
            <h2 className="text-sm font-semibold font-inter text-on-surface">Have suggestions or feedback?</h2>
            <p className="text-xs font-inter text-text-secondary leading-relaxed mt-1">
              If you have any questions about this study or have additional feedback, please reach out to the researchers at the **Asian Institute of Management** (Master in Innovation and Business):
            </p>
          </div>

          <div className="space-y-3 border-t border-border-divider pt-3">
            <div className="flex items-start space-x-2.5 text-xs font-inter">
              <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-on-surface">Jan Paul Fernandez (Lead Contact)</p>
                <a href="mailto:jfernandez.MIB2026B@aim.edu" className="text-primary hover:underline font-mono">jfernandez.MIB2026B@aim.edu</a>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 text-xs font-inter">
              <Mail className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-secondary">Marc Julian E. De Leon</p>
                <a href="mailto:mdeleon.MIB2026B@aim.edu" className="text-text-secondary hover:text-on-surface hover:underline font-mono">mdeleon.MIB2026B@aim.edu</a>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 text-xs font-inter">
              <Mail className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-secondary">April Y. Barrinuevo</p>
                <a href="mailto:abarrinuevo.MIB2026B@aim.edu" className="text-text-secondary hover:text-on-surface hover:underline font-mono">abarrinuevo.MIB2026B@aim.edu</a>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 text-xs font-inter">
              <Mail className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-secondary">Mark Cyrille O. Yano</p>
                <a href="mailto:myano.MIB2026B@aim.edu" className="text-text-secondary hover:text-on-surface hover:underline font-mono">myano.MIB2026B@aim.edu</a>
              </div>
            </div>
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
