import { Wifi, Battery, Signal } from 'lucide-react'

interface PhoneChromeProps {
  children: React.ReactNode
}

export function PhoneChrome({ children }: PhoneChromeProps) {
  const time = '1:43'

  return (
    <div className="w-[390px] h-[844px] bg-white rounded-[48px] border-[12px] border-on-surface shadow-[0_24px_64px_-16px_rgba(0,0,0,0.15)] flex flex-col relative overflow-hidden select-none">
      {/* Phone Notch/Status Bar Area */}
      <div className="h-[44px] w-full px-8 bg-white flex items-center justify-between text-on-surface text-[12px] font-inter font-medium z-40 relative flex-shrink-0">
        <span>{time}</span>
        {/* Dynamic Notch Shape */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[110px] h-[30px] bg-on-surface rounded-b-[20px] flex items-center justify-center">
          <div className="w-[40px] h-[4px] bg-zinc-800 rounded-full mb-1" />
        </div>
        <div className="flex items-center space-x-1.5">
          <Signal className="w-3.5 h-3.5 stroke-[2]" />
          <Wifi className="w-3.5 h-3.5 stroke-[2]" />
          <Battery className="w-4 h-4 stroke-[2] fill-on-surface" />
        </div>
      </div>

      {/* Screen Viewport Wrapper */}
      <div id="phone-viewport" className="flex-1 overflow-hidden relative min-h-0 bg-background flex flex-col">
        {children}
      </div>

      {/* Home Indicator Swipe Bar */}
      <div className="h-[24px] w-full bg-white flex items-center justify-center z-40 relative flex-shrink-0">
        <div className="w-[134px] h-[5px] bg-on-surface opacity-30 rounded-full" />
      </div>
    </div>
  )
}
