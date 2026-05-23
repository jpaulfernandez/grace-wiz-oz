interface ChatMessageProps {
  sender: 'user' | 'ai'
  text: string
  timestamp?: string
}

export function ChatMessage({ sender, text, timestamp }: ChatMessageProps) {
  const isAi = sender === 'ai'

  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4 px-6`}>
      <div
        className={`max-w-[80%] rounded-[16px] p-4 text-sm font-inter leading-relaxed ${
          isAi
            ? 'bg-white text-on-surface border border-border-divider rounded-tl-[4px]'
            : 'bg-primary text-white rounded-tr-[4px]'
        }`}
      >
        <p className="whitespace-pre-line">{text}</p>
        {timestamp ? (
          <span
            className={`block text-[10px] font-mono mt-1.5 text-right ${
              isAi ? 'text-text-muted' : 'text-primary-fixed-dim'
            }`}
          >
            {timestamp}
          </span>
        ) : null}
      </div>
    </div>
  )
}
