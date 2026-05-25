import { useState } from 'react'
import { CHAT_SCRIPTS, ChatTurn } from '../config/chatScripts'
import { telemetry, EventTypes } from './telemetry'

export interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

interface UseScriptedChatProps {
  scenarioKey: 'scenario-a' | 'scenario-b'
  onComplete?: () => void
  onJournalHandoff?: (summary: string) => void
  onIncidentHandoff?: (summary: string) => void
}

export function useScriptedChat({
  scenarioKey,
  onComplete,
  onJournalHandoff,
  onIncidentHandoff
}: UseScriptedChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [turnIndex, setTurnIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showHandoff, setShowHandoff] = useState(false)

  const [prevScenarioKey, setPrevScenarioKey] = useState<string | null>(null)

  if (scenarioKey !== prevScenarioKey) {
    setPrevScenarioKey(scenarioKey)
    setTurnIndex(0)
    setShowHandoff(false)
    setIsTyping(false)
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const welcomeMsg: Message = {
      id: 'welcome-msg',
      sender: 'ai',
      text: scenarioKey === 'scenario-a'
        ? "Take your time. What's on your mind?"
        : "Welcome back. Take your time. What's on your mind today?",
      timestamp: timeStr
    }
    setMessages([welcomeMsg])
  }

  const script = CHAT_SCRIPTS[scenarioKey] || []
  const currentTurn = script[turnIndex] as ChatTurn | undefined

  const sendMessage = async (text: string) => {
    if (isTyping || showHandoff) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    }

    setMessages((prev) => [...prev, userMsg])
    telemetry.track(EventTypes.CHAT_SEND, {
      message_length: text.length,
      turn_index: turnIndex
    })

    if (!currentTurn) return

    // Trigger AI response with typing delay
    setIsTyping(true)
    const delay = Math.floor(Math.random() * (1600 - 900 + 1)) + 900

    setTimeout(() => {
      const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: currentTurn.aiResponse,
        timestamp: aiTimeStr
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
      telemetry.track(EventTypes.CHAT_AI_REPLY, {
        message_length: currentTurn.aiResponse.length,
        turn_index: turnIndex
      })

      if (currentTurn.showHandoff) {
        setShowHandoff(true)
      } else {
        setTurnIndex((prev) => prev + 1)
      }
    }, delay)
  }

  const selectHandoff = (action: 'log' | 'journal' | 'letgo') => {
    telemetry.track(EventTypes.HANDOFF_CHIP_TAP, {
      chip_selected: action,
      scenario: scenarioKey
    })

    // Pre-crafted premium summaries based on scenario
    const summaryScenarioA = `A coworker has been making sexual comments about your body, including yesterday about your underwear. Two officemates have heard it. It's been happening daily.`
    const summaryScenarioB = `You've been feeling anxious going into work because of sexual jokes made by your workmate. The anxiety causes tightness in your chest. The joke occurred today and you had to sit through a meeting afterwards.`

    if (action === 'letgo') {
      setIsTyping(true)
      setTimeout(() => {
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const goodbyeMsg: Message = {
          id: `ai-goodbye-${Date.now()}`,
          sender: 'ai',
          text: "That's a real choice. Whatever you carry, you don't have to carry alone. I'll be here.",
          timestamp: aiTimeStr
        }
        setMessages((prev) => [...prev, goodbyeMsg])
        setIsTyping(false)

        // Fade and clear conversation after 1.5 seconds
        setTimeout(() => {
          setMessages([])
          onComplete?.()
        }, 1500)
      }, 800)
    } else if (action === 'journal') {
      const summary = scenarioKey === 'scenario-a' ? summaryScenarioA : summaryScenarioB
      onJournalHandoff?.(summary)
    } else if (action === 'log') {
      const summary = scenarioKey === 'scenario-a' ? summaryScenarioA : summaryScenarioB
      onIncidentHandoff?.(summary)
    }
  }

  const currentSuggestion = currentTurn ? currentTurn.userPrompt : undefined

  return {
    messages,
    isTyping,
    showHandoff,
    sendMessage,
    selectHandoff,
    suggestionPrompt: currentSuggestion
  }
}
