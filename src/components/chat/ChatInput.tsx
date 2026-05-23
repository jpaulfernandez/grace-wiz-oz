import React, { useState, useEffect, useRef } from 'react'
import { Send, Sparkles } from 'lucide-react'

interface ChatInputProps {
  value?: string
  onChange?: (val: string) => void
  onSend: (text: string) => void
  disabled?: boolean
  suggestion?: string
}

export function ChatInput({
  value: controlledValue,
  onChange,
  onSend,
  disabled = false,
  suggestion
}: ChatInputProps) {
  const [localValue, setLocalValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Sync controlled state
  useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue)
    }
  }, [controlledValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setLocalValue(val)
    onChange?.(val)
  }

  const handleSend = () => {
    const trimmed = localValue.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setLocalValue('')
      onChange?.('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const applySuggestion = () => {
    if (suggestion) {
      setLocalValue(suggestion)
      onChange?.(suggestion)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  return (
    <div className="w-full bg-white border-t border-border-divider p-4 flex flex-col space-y-3 select-none flex-shrink-0 z-10">
      {/* Tap Suggestion Box */}
      {suggestion && !localValue && (
        <button
          onClick={applySuggestion}
          id="chat-suggestion-chip-0"
          className="flex items-start space-x-2.5 p-3 rounded-input bg-primary-container text-on-primary-container border border-primary/10 hover:border-primary transition-all text-left text-xs font-inter leading-relaxed animate-fade-in group w-full"
        >
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
          <div className="flex-1">
            <span className="block font-medium text-[11px] text-primary mb-0.5">Suggested prompt</span>
            <p className="line-clamp-2 text-on-primary-container/80">{suggestion}</p>
          </div>
        </button>
      )}

      {/* Input Form */}
      <div className="flex items-end space-x-3">
        <div className="flex-1 min-h-[48px] rounded-input border border-border-divider px-4 py-3 bg-white focus-within:border-primary transition-colors flex items-center">
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            value={localValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Waiting for Companion...' : 'Type what is on your mind...'}
            className="w-full bg-transparent text-sm font-inter text-on-surface focus:outline-none placeholder:text-text-muted resize-none max-h-[120px] leading-tight align-middle"
            style={{ height: 'auto' }}
          />
        </div>
        <button
          id="chat-send-btn"
          disabled={disabled || !localValue.trim()}
          onClick={handleSend}
          className="w-12 h-12 rounded-input bg-primary text-white hover:bg-opacity-95 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </div>
  )
}
