export interface ChatTurn {
  userPrompt: string // Suggestion prompt to display
  aiResponse: string // What the AI replies with
  showHandoff?: boolean // Whether to render handoff chips
}

export const CHAT_SCRIPTS: Record<string, ChatTurn[]> = {
  'scenario-a': [
    {
      userPrompt: `My workmate keeps making these green jokes around me. Sexual stuff disguised as jokes. He says I'm being uptight when I don't laugh. I don't know if I'm overreacting or if this is really harassment.`,
      aiResponse: `Thank you for putting that down. I'm not a lawyer, so I can't tell you whether what you're describing meets a legal definition — but I can sit with you while you think it through. What about it has been sticking with you?`
    },
    {
      userPrompt: `It happens almost every day now. Other people laugh too so I feel like I'm the problem for being uncomfortable.`,
      aiResponse: `What you're noticing about your own discomfort matters. I won't tell you what to call it — only you can name your own experience. There are a few things you could do from here, and none of them are required. You could log this as an incident so you have a record, you could write more in your journal, or you could let it go for now.`,
      showHandoff: true
    }
  ],
  'scenario-b': [
    {
      userPrompt: `I'm anxious about going to work tomorrow. My workmate is going to be there.`,
      aiResponse: `That makes sense. I'm not a psychologist, so I can't treat what you're feeling — but I can sit with you while you think. Where are you feeling the anxiety most?`
    },
    {
      userPrompt: `In my chest. It's been there since yesterday.`,
      aiResponse: `Your body is paying attention. Has anything happened recently that your body is responding to?`
    },
    {
      userPrompt: `He made another joke today. The kind I told you about — sexual stuff disguised as humor. I had to sit through a whole meeting after.`,
      aiResponse: `Thank you for putting that down. Some people find it helpful to write more about what happened — others find it helpful to log it as an incident. You can also stop here if that's what feels right.`,
      showHandoff: true
    }
  ]
}
