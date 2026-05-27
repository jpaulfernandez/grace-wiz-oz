import type { SessionConfig, GuidedStepConfig, ScenarioConfig } from './scenarioTypes'
import { ScreenIds } from '../lib/screenIds'

// Scenario 0 - Orientation (Shared by all participant walkthrough flows)
const SCENARIO_0_ORIENTATION: ScenarioConfig = {
  id: 'scenario-0-orientation',
  label: 'Getting started',
  steps: [
    {
      id: 'orientation-prototype',
      screenId: 'guided-home',
      title: 'Welcome',
      prototypeInteractive: false,
      sidePanelInstruction: `### Welcome

Thanks for helping us test **Grace**—a private, safe space for women to write down and process difficult workplace experiences.

The phone screen on the left is a prototype. You can tap and interact with it like a real app. During this session, the chat replies are written by a real researcher, so it will feel like a real conversation.

Tap **Next step** when you're ready.`,
      mobileSidePanelInstruction: `### Welcome

Thanks for helping us test **Grace**—a private, safe space for women to write down and process difficult workplace experiences.

This screen is a prototype. You can tap and interact with it like a real app. During this session, the chat replies are written by a real researcher, so it will feel like a real conversation.

Tap **Next step** when you're ready.`,
      instructionSteps: [
        {
          id: 'see-prototype',
          label: 'This screen is the prototype',
          selector: '#phone-frame-root',
          popover: {
            title: 'The prototype',
            description: `This is what you'll interact with. We'll show you where to tap as we go.`,
            side: 'right',
            align: 'center',
          },
          waitForElement: true
        }
      ],
      allowedSelectors: [],
      advanceOn: { type: 'manual_next' }
    } as GuidedStepConfig,
    {
      id: 'orientation-side-panel',
      screenId: 'guided-home',
      title: 'This panel guides you',
      prototypeInteractive: false,
      sidePanelInstruction: `### This panel guides you

This panel guides you through the session. For each part, you will see:

- A quick explanation of the situation
- A simple list of steps to follow
- A pointer on the phone showing where to tap

If you ever get stuck, just tap any step in the list and we will show you where to go.

Tap **Next step** to continue.`,
      mobileSidePanelInstruction: `### This drawer guides you

This drawer guides you through the session. For each part, you will see:

- A quick explanation of the situation
- A simple list of steps to follow
- A pointer on the phone showing where to tap

If you ever get lost, just tap the **Guide** button at the bottom of the screen to open this drawer again.

Tap **Next step** to continue.`,
      instructionSteps: [],
      allowedSelectors: [],
      advanceOn: { type: 'manual_next' }
    } as GuidedStepConfig,
    {
      id: 'orientation-help',
      screenId: 'guided-home',
      title: 'If you need help',
      prototypeInteractive: false,
      sidePanelInstruction: `### If you need help

If you need help at any point, click **I need help** at the top of the screen to talk to the researcher. Click **Study info** to read how we protect your privacy.

Remember, you can pause or stop at any time. There are no test scores here, and any answer you give is helpful.

Tap **Next step** to continue.`,
      instructionSteps: [],
      allowedSelectors: ['#help-button', '#study-info-button'],
      advanceOn: { type: 'manual_next' }
    } as GuidedStepConfig,
    {
      id: 'orientation-reflections',
      screenId: 'guided-home',
      title: 'Quick reflections along the way',
      prototypeInteractive: false,
      sidePanelInstruction: `### Quick reflections

Between parts of the study, the screen will pause and ask you a quick question or two in this panel. For example:

> **Example only**
> *I feel comfortable using a phone app to write down sensitive concerns.*
>
> 1 (Strongly disagree) to 5 (Strongly agree)

Please answer honestly. Your feedback helps us make Grace better.

Tap **Next step** to try your first reflection question.`,
      instructionSteps: [],
      allowedSelectors: [],
      advanceOn: { type: 'manual_next' }
    } as GuidedStepConfig
  ],
  reflection: {
    id: 'reflection-orientation',
    title: 'Before we start',
    description: 'One quick question before the first scenario.',
    microPrompts: [
      {
        id: 'welcome-feeling',
        type: 'likert-5',
        question: 'I feel comfortable using a phone app to write down and discuss sensitive personal matters.',
        required: true
      }
    ]
  }
}

export const SCENARIO_0_ORIENTATION_PROVIDER: ScenarioConfig = {
  id: 'scenario-0-orientation',
  label: 'Getting oriented',
  steps: SCENARIO_0_ORIENTATION.steps // Share the same steps but omit the reflection
}

export const SESSIONS: Record<string, SessionConfig> = {
  'women-order-a': {
    id: 'women-order-a',
    label: 'Women Guided — Order A',
    scenarios: [
      SCENARIO_0_ORIENTATION,
      {
        id: 'scenario-a-green-jokes',
        label: 'Scenario A — Green jokes',
        description: `### Scenario A: Green jokes

Your coworker Marco frequently tells inappropriate sexual jokes. You feel uncomfortable but are not sure if it qualifies as harassment.`,
        steps: [
          {
            id: 'scenario-a-home',
            screenId: 'guided-home',
            title: 'Get started',
            sidePanelInstruction: `### Welcome to Grace

Grace is a private space designed to provide emotional safety and structured recording for survivors.

To begin, tap the **Companion** card on the screen to talk with the Companion.`,
            instructionSteps: [
              {
                id: 'tap-companion-card',
                label: 'Tap the Companion card',
                selector: '#companion-card',
                popover: {
                  title: 'Companion',
                  description: 'Open a chat with Grace\'s Companion — your sounding board.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#companion-card' }
              }
            ],
            allowedSelectors: ['#companion-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#companion-card' }
          },
          {
            id: 'scenario-a-chat',
            screenId: 'companion-chat',
            title: 'Scenario A: Green jokes',
            sidePanelInstruction: `### Companion: Harassment Uncertainty

You are in the **Companion** space. The Companion acts as a sounding board with absolute restraint—never defining your experience for you.

1. Tap the **Suggested prompt** chip to fill in a sample message.
2. Tap the **Send** button to send it to the companion.
3. Once the companion replies, tap the **Let go for now** choice to conclude.`,
            instructionSteps: [
              {
                id: 'tap-suggestion-chip',
                label: 'Tap the suggested prompt to fill in the input',
                selector: '#chat-suggestion-chip-0',
                popover: {
                  title: 'Preloaded prompt',
                  description: 'Tap this chip to drop a sample message into the input field. You won\'t have to type anything.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-chip-0' }
              },
              {
                id: 'tap-send',
                label: 'Send the message',
                selector: '#chat-send-btn',
                popover: {
                  title: 'Send',
                  description: 'Send the message to the Companion. The researcher will reply as the Companion would.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-send-btn' }
              },
              {
                id: 'select-let-go',
                label: 'Choose "Let go for now"',
                selector: '#let-go-btn',
                popover: {
                  title: 'Ephemeral choice',
                  description: 'Choose to let this one go without logging it. Grace respects that you may not want a record.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#let-go-btn' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-chip-0', '#chat-send-btn', '#chat-input', '#let-go-btn'],
            advanceOn: { type: 'tap', selector: '#let-go-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-a',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'chat-restraint',
              type: 'single-choice',
              question: 'Did the Companion\'s restraint feel supportive or frustrating?',
              options: ['Supportive', 'Neutral', 'Frustrating'],
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-b-work-anxiety',
        label: 'Scenario B — Work anxiety',
        description: `### Scenario B: Work Anxiety

You feel anxious about work proximity to Marco and want to explore somatic calming techniques or log your feelings.`,
        steps: [
          {
            id: 'scenario-b-home',
            screenId: 'guided-home',
            title: 'Get started',
            sidePanelInstruction: `### Companion Chat

Tap the **Companion** card on the screen to open the Companion.`,
            instructionSteps: [
              {
                id: 'tap-companion-card-b',
                label: 'Tap the Companion card',
                selector: '#companion-card',
                popover: {
                  title: 'Companion',
                  description: 'Open a chat with Grace\'s Companion — your sounding board.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#companion-card' }
              }
            ],
            allowedSelectors: ['#companion-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#companion-card' }
          },
          {
            id: 'scenario-b-chat',
            screenId: 'companion-chat',
            title: 'Scenario B: Work anxiety',
            sidePanelInstruction: `### Somatic Tension & Reflection

1. Tap the **Suggested prompt** chip to explain your somatic symptoms.
2. Tap the **Send** button.
3. Tap **Continue to journal** to carry this conversation into your personal journal.`,
            instructionSteps: [
              {
                id: 'tap-suggestion-chip-b',
                label: 'Tap the suggested prompt to fill in the input',
                selector: '#chat-suggestion-chip-0',
                popover: {
                  title: 'Preloaded prompt',
                  description: 'Tap this chip to drop a sample message into the input field.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-chip-0' }
              },
              {
                id: 'tap-send-b',
                label: 'Send the message',
                selector: '#chat-send-btn',
                popover: {
                  title: 'Send',
                  description: 'Send the message to the Companion.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-send-btn' }
              },
              {
                id: 'select-continue-journal',
                label: 'Choose "Continue to journal"',
                selector: '#continue-journal-btn',
                popover: {
                  title: 'Carry it forward',
                  description: 'Move the conversation into your journal so you can write more about it.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#continue-journal-btn' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-chip-0', '#chat-send-btn', '#chat-input', '#continue-journal-btn'],
            advanceOn: { type: 'tap', selector: '#continue-journal-btn' }
          },
          {
            id: 'journal-handoff',
            screenId: ScreenIds.JOURNAL_EDITOR,
            title: 'Reflective Journaling',
            sidePanelInstruction: `### Free Flow Journal

Your conversation summary is pre-filled. 

1. Write a brief sentence about how you are feeling in the editor.
2. Click **Save entry** in the top-right corner to save privately.`,
            instructionSteps: [
              {
                id: 'jh-write',
                label: 'Write a sentence about how you are feeling',
                selector: 'textarea',
                popover: {
                  title: 'Write freely',
                  description: 'Type a short sentence describing your somatic sensations or thoughts.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'jh-save',
                label: 'Save your entry',
                selector: '#save-journal-btn',
                popover: {
                  title: 'Save',
                  description: 'Save what you\'ve written. Grace doesn\'t celebrate or congratulate — it just saves.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#save-journal-btn' }
              }
            ],
            allowedSelectors: ['#save-journal-btn', 'textarea'],
            advanceOn: { type: 'save', screenId: 'journal-editor' }
          },
          {
            id: 'scenario-b-breath',
            screenId: 'breath-reminder',
            title: 'Pause & breathe',
            sidePanelInstruction: `### Somatic breath pause

Breathe slowly. Follow the somatic expansion circle on the screen to ground your nervous system.

Tap **Next step** when ready.`,
            instructionSteps: [],
            allowedSelectors: [],
            advanceOn: { type: 'manual_next' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-b',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'summary-useful',
              type: 'likert-5',
              question: 'The carry-over summary made it easier to move from chat into the journal.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-c-patterns',
        label: 'Scenario C — Pattern surfacing',
        description: `### Scenario C: Pattern Surfacing

Review recurring themes and patterns across your saved entries.`,
        steps: [
          {
            id: 'scenario-c-offers',
            screenId: ScreenIds.POST_SAVE_OFFERS,
            title: 'Reviewing patterns',
            sidePanelInstruction: `### Looking back

Grace notices patterns over time. 

Tap **Help me notice patterns** to let Grace cross-reference somatic themes.`,
            instructionSteps: [
              {
                id: 'tap-notice-patterns',
                label: 'Tap "Help me notice patterns"',
                selector: '#help-notice-patterns-btn',
                popover: {
                  title: 'Pattern surfacing',
                  description: 'Let Grace highlight repeated themes across your entries.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#help-notice-patterns-btn' }
              }
            ],
            allowedSelectors: ['#help-notice-patterns-btn'],
            advanceOn: { type: 'tap', selector: '#help-notice-patterns-btn' }
          },
          {
            id: 'scenario-c-annotations',
            screenId: ScreenIds.JOURNAL_ANNOTATIONS,
            title: 'Exploring highlighted themes',
            sidePanelInstruction: `### Surfaced themes

1. Tap one of the **highlighted phrases** (colored superscript numbers) on the screen to read what Grace noticed.
2. Tap **Close** to return and complete the scenario.`,
            instructionSteps: [
              {
                id: 'tap-annotation-phrase',
                label: 'Tap a highlighted phrase to see what Grace noticed',
                selector: '[id^=annotation-]',
                popover: {
                  title: 'AI note',
                  description: 'Each highlight is something Grace flagged across your entries. Tap to read.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '[id^=annotation-]' }
              },
              {
                id: 'tap-close-annotation',
                label: 'Tap "Close" when you\'ve reviewed the highlights',
                selector: '#close-annotations-btn',
                popover: {
                  title: 'Close',
                  description: 'Return to your journal.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#close-annotations-btn' }
              }
            ],
            allowedSelectors: ['[id^=annotation-]', '#close-annotations-btn'],
            advanceOn: { type: 'tap', selector: '#close-annotations-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-c',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'annotation-helpful',
              type: 'likert-5',
              question: 'The highlighted annotations helped me better understand what I have been going through.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-d-journaling',
        label: 'Scenario D — Prompted Journaling',
        description: `### Scenario D: Prompted Journaling

Let's try a structured journaling session to process recent stress.`,
        steps: [
          {
            id: 'scenario-d-home',
            screenId: 'guided-home',
            title: 'Structured journaling',
            sidePanelInstruction: `### Reflective Journal card

Tap the **Reflective Journal** card on the screen to begin.`,
            instructionSteps: [
              {
                id: 'tap-journal-card',
                label: 'Tap the Reflective Journal card',
                selector: '#journal-card',
                popover: {
                  title: 'Reflective Journal',
                  description: 'Open your journal to write freely or use a guided prompt.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#journal-card' }
              }
            ],
            allowedSelectors: ['#journal-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#journal-card' }
          },
          {
            id: 'scenario-d-modes',
            screenId: 'journal-modes',
            title: 'Choose journaling mode',
            sidePanelInstruction: `### Journal style

Tap **Guided** to use guided structured prompts.`,
            instructionSteps: [
              {
                id: 'tap-guided-btn',
                label: 'Tap "Guided"',
                selector: '#guided-journal-btn',
                popover: {
                  title: 'Guided mode',
                  description: 'Use guided prompts to structure your reflection.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#guided-journal-btn' }
              }
            ],
            allowedSelectors: ['#guided-journal-btn'],
            advanceOn: { type: 'tap', selector: '#guided-journal-btn' }
          },
          {
            id: 'scenario-d-editor',
            screenId: ScreenIds.JOURNAL_GUIDED_EDITOR,
            title: 'Structured prompts',
            sidePanelInstruction: `### Guided prompt editor

Answer the pre-filled questions or tap **Just save it** to secure the entry.`,
            instructionSteps: [
              {
                id: 'tap-just-save',
                label: 'Tap "Just save it"',
                selector: '#just-save-btn',
                popover: {
                  title: 'Save quietly',
                  description: 'Save your entry without any AI follow-up.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#just-save-btn' }
              }
            ],
            allowedSelectors: ['#just-save-btn'],
            advanceOn: { type: 'tap', selector: '#just-save-btn' }
          }
        ],
        reflection: {
          id: 'reflection-no-ai-comfort',
          title: 'Comparing the two modes',
          microPrompts: [
            {
              id: 'combined-no-ai-comfort',
              type: 'likert-5',
              question: 'The guided journaling prompts helped me process what I was going through, even without an AI companion.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-e-incidents',
        label: 'Scenario E — Incident Logging',
        description: `### Scenario E: Incident Logging

Document an incident with structured fields for date, place, and people involved.`,
        steps: [
          {
            id: 'scenario-e-home',
            screenId: 'guided-home',
            title: 'Structured logging',
            sidePanelInstruction: `### Incident Log Tab

Tap the **Incident Log** tab in the bottom navigation.`,
            instructionSteps: [
              {
                id: 'tap-incident-tab',
                label: 'Tap "Incident Log" in the bottom nav',
                selector: '#incident-nav-tab',
                popover: {
                  title: 'Incident Log',
                  description: 'Document an incident with structured fields.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#incident-nav-tab' }
              }
            ],
            allowedSelectors: ['#incident-nav-tab', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#incident-nav-tab' }
          },
          {
            id: 'scenario-e-log',
            screenId: 'incident-log',
            title: 'Logging an incident',
            sidePanelInstruction: `### Log details

1. Type a short description of the intrusion in the editor.
2. Tap **Save incident** at the bottom.`,
            instructionSteps: [
              {
                id: 'sel-write',
                label: 'Type details in the incident log',
                selector: 'textarea',
                popover: {
                  title: 'Record incident details',
                  description: 'Document who was involved, when, and where.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'sel-save',
                label: 'Tap "Save incident"',
                selector: '#save-incident-btn',
                popover: {
                  title: 'Save',
                  description: 'Save your incident with a secure timestamp.',
                  side: 'bottom',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-incident-btn' }
              }
            ],
            allowedSelectors: ['#save-incident-btn', 'textarea'],
            advanceOn: { type: 'save', screenId: 'incident-log' }
          },
          {
            id: 'scenario-e-hash',
            screenId: ScreenIds.HASH_RECEIPT,
            title: 'Secure timestamp receipt',
            sidePanelInstruction: `### Timestamp receipt

Observe the secure timestamp, then click **Next** to proceed.`,
            instructionSteps: [
              {
                id: 'tap-receipt-next',
                label: 'Tap "Next" to continue',
                selector: '#incident-receipt-next-btn',
                popover: {
                  title: 'Continue',
                  description: 'Move on to see what options you have next.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#incident-receipt-next-btn' }
              }
            ],
            allowedSelectors: ['#incident-receipt-next-btn'],
            advanceOn: { type: 'tap', selector: '#incident-receipt-next-btn' }
          },
          {
            id: 'scenario-e-offers',
            screenId: ScreenIds.INCIDENT_POST_SAVE_OFFERS,
            title: 'Conclude logging',
            sidePanelInstruction: `### Conclude logging

Click **Do nothing for now** to wrap up the guided scenario.`,
            instructionSteps: [
              {
                id: 'tap-do-nothing',
                label: 'Tap "Do nothing for now"',
                selector: '#do-nothing-btn',
                popover: {
                  title: 'Pause',
                  description: 'Save the record without taking any further action right now.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#do-nothing-btn' }
              }
            ],
            allowedSelectors: ['#do-nothing-btn'],
            advanceOn: { type: 'tap', selector: '#do-nothing-btn' }
          }
        ]
      }
    ],
    postSessionReflection: {
      id: 'reflection-post-session-women',
      title: 'Closing reflection',
      description: 'Three short questions before we finish.',
      microPrompts: [
        {
          id: 'would-write-here',
          type: 'likert-5',
          question: 'I would write what is happening to me in this app.',
          required: true
        },
        {
          id: 'trust-words',
          type: 'likert-5',
          question: 'I trust this app with my words.',
          required: true
        },
        {
          id: 'would-tell-another-woman',
          type: 'likert-5',
          question: 'I would tell another woman about this app.',
          required: true
        }
      ]
    }
  },
  'women-order-b': {
    id: 'women-order-b',
    label: 'Women Guided — Order B',
    scenarios: [
      SCENARIO_0_ORIENTATION,
      // Order B: Scenarios D & E first, then Scenarios A, B & C
      {
        id: 'scenario-d-journaling',
        label: 'Scenario D — Prompted Journaling',
        description: `### Scenario D: Prompted Journaling

Let's try a structured journaling session to process recent stress.`,
        steps: [
          {
            id: 'scenario-d-home',
            screenId: 'guided-home',
            title: 'Structured journaling',
            sidePanelInstruction: `### Reflective Journal card

Tap the **Reflective Journal** card on the screen to begin.`,
            instructionSteps: [
              {
                id: 'tap-journal-card',
                label: 'Tap the Reflective Journal card',
                selector: '#journal-card',
                popover: {
                  title: 'Reflective Journal',
                  description: 'Open your journal to write freely or use a guided prompt.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#journal-card' }
              }
            ],
            allowedSelectors: ['#journal-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#journal-card' }
          },
          {
            id: 'scenario-d-modes',
            screenId: 'journal-modes',
            title: 'Choose journaling mode',
            sidePanelInstruction: `### Journal style

Tap **Guided** to use guided structured prompts.`,
            instructionSteps: [
              {
                id: 'tap-guided-btn',
                label: 'Tap "Guided"',
                selector: '#guided-journal-btn',
                popover: {
                  title: 'Guided mode',
                  description: 'Use guided prompts to structure your reflection.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#guided-journal-btn' }
              }
            ],
            allowedSelectors: ['#guided-journal-btn'],
            advanceOn: { type: 'tap', selector: '#guided-journal-btn' }
          },
          {
            id: 'scenario-d-editor',
            screenId: ScreenIds.JOURNAL_EDITOR,
            title: 'Structured prompts',
            sidePanelInstruction: `### Guided prompt editor

Answer the pre-filled questions or tap **Just save it** to secure the entry.`,
            instructionSteps: [
              {
                id: 'tap-just-save',
                label: 'Tap "Just save it"',
                selector: '#just-save-btn',
                popover: {
                  title: 'Save quietly',
                  description: 'Save your entry without any AI follow-up.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#just-save-btn' }
              }
            ],
            allowedSelectors: ['#just-save-btn'],
            advanceOn: { type: 'tap', selector: '#just-save-btn' }
          }
        ]
      },
      {
        id: 'scenario-e-incidents',
        label: 'Scenario E — Incident Logging',
        description: `### Scenario E: Incident Logging

Document an incident with structured fields for date, place, and people involved.`,
        steps: [
          {
            id: 'scenario-e-home',
            screenId: 'guided-home',
            title: 'Structured logging',
            sidePanelInstruction: `### Incident Log Tab

Tap the **Incident Log** tab in the bottom navigation.`,
            instructionSteps: [
              {
                id: 'tap-incident-tab',
                label: 'Tap "Incident Log" in the bottom nav',
                selector: '#incident-nav-tab',
                popover: {
                  title: 'Incident Log',
                  description: 'Document an incident with structured fields.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#incident-nav-tab' }
              }
            ],
            allowedSelectors: ['#incident-nav-tab', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#incident-nav-tab' }
          },
          {
            id: 'scenario-e-log',
            screenId: 'incident-log',
            title: 'Logging an incident',
            sidePanelInstruction: `### Log details

1. Type a short description of the intrusion in the editor.
2. Tap **Save incident** at the bottom.`,
            instructionSteps: [
              {
                id: 'sel-write',
                label: 'Type details in the incident log',
                selector: 'textarea',
                popover: {
                  title: 'Record incident details',
                  description: 'Document who was involved, when, and where.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'sel-save',
                label: 'Tap "Save incident"',
                selector: '#save-incident-btn',
                popover: {
                  title: 'Save',
                  description: 'Save your incident with a secure timestamp.',
                  side: 'bottom',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-incident-btn' }
              }
            ],
            allowedSelectors: ['#save-incident-btn', 'textarea'],
            advanceOn: { type: 'save', screenId: 'incident-log' }
          },
          {
            id: 'scenario-e-hash',
            screenId: ScreenIds.HASH_RECEIPT,
            title: 'Secure timestamp receipt',
            sidePanelInstruction: `### Timestamp receipt

Observe the secure timestamp, then click **Next** to proceed.`,
            instructionSteps: [
              {
                id: 'tap-receipt-next',
                label: 'Tap "Next" to continue',
                selector: '#incident-receipt-next-btn',
                popover: {
                  title: 'Continue',
                  description: 'Move on to see what options you have next.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#incident-receipt-next-btn' }
              }
            ],
            allowedSelectors: ['#incident-receipt-next-btn'],
            advanceOn: { type: 'tap', selector: '#incident-receipt-next-btn' }
          },
          {
            id: 'scenario-e-offers',
            screenId: ScreenIds.INCIDENT_POST_SAVE_OFFERS,
            title: 'Conclude logging',
            sidePanelInstruction: `### Conclude logging

Click **Do nothing for now** to wrap up the guided scenario.`,
            instructionSteps: [
              {
                id: 'tap-do-nothing',
                label: 'Tap "Do nothing for now"',
                selector: '#do-nothing-btn',
                popover: {
                  title: 'Pause',
                  description: 'Save the record without taking any further action right now.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#do-nothing-btn' }
              }
            ],
            allowedSelectors: ['#do-nothing-btn'],
            advanceOn: { type: 'tap', selector: '#do-nothing-btn' }
          }
        ]
      },
      {
        id: 'scenario-a-green-jokes',
        label: 'Scenario A — Green jokes',
        description: `### Scenario A: Green jokes

Your coworker Marco frequently tells inappropriate sexual jokes. You feel uncomfortable but are not sure if it qualifies as harassment.`,
        steps: [
          {
            id: 'scenario-a-home',
            screenId: 'guided-home',
            title: 'Get started',
            sidePanelInstruction: `### Welcome to Grace

Grace is a private space designed to provide emotional safety and structured recording for survivors.

To begin, tap the **Companion** card on the screen to talk with the Companion.`,
            instructionSteps: [
              {
                id: 'tap-companion-card',
                label: 'Tap the Companion card',
                selector: '#companion-card',
                popover: {
                  title: 'Companion',
                  description: 'Open a chat with Grace\'s Companion.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#companion-card' }
              }
            ],
            allowedSelectors: ['#companion-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#companion-card' }
          },
          {
            id: 'scenario-a-chat',
            screenId: 'companion-chat',
            title: 'Scenario A: Green jokes',
            sidePanelInstruction: `### Companion: Harassment Uncertainty

You are in the **Companion** space. The Companion acts as a sounding board with absolute restraint.

1. Tap the **Suggested prompt** chip to fill in a sample message.
2. Tap the **Send** button.
3. Once the companion replies, tap **Let go for now** to conclude.`,
            instructionSteps: [
              {
                id: 'tap-suggestion-chip',
                label: 'Tap the suggested prompt to fill in the input',
                selector: '#chat-suggestion-chip-0',
                popover: {
                  title: 'Preloaded prompt',
                  description: 'Tap this chip to drop a sample message into the input field.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-chip-0' }
              },
              {
                id: 'tap-send',
                label: 'Send the message',
                selector: '#chat-send-btn',
                popover: {
                  title: 'Send',
                  description: 'Send the message to the Companion.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-send-btn' }
              },
              {
                id: 'select-let-go',
                label: 'Choose "Let go for now"',
                selector: '#let-go-btn',
                popover: {
                  title: 'Ephemeral choice',
                  description: 'Choose to let this one go without logging it.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#let-go-btn' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-chip-0', '#chat-send-btn', '#chat-input', '#let-go-btn'],
            advanceOn: { type: 'tap', selector: '#let-go-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-a',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'chat-restraint',
              type: 'single-choice',
              question: 'Did the Companion\'s restraint feel supportive or frustrating?',
              options: ['Supportive', 'Neutral', 'Frustrating'],
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-b-work-anxiety',
        label: 'Scenario B — Work anxiety',
        description: `### Scenario B: Work Anxiety

You feel anxious about work proximity to Marco and want to explore somatic calming techniques or log your feelings.`,
        steps: [
          {
            id: 'scenario-b-home',
            screenId: 'guided-home',
            title: 'Get started',
            sidePanelInstruction: `### Companion Chat

Tap the **Companion** card on the screen to open the Companion.`,
            instructionSteps: [
              {
                id: 'tap-companion-card-b',
                label: 'Tap the Companion card',
                selector: '#companion-card',
                popover: {
                  title: 'Companion',
                  description: 'Open a chat with Grace\'s Companion.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#companion-card' }
              }
            ],
            allowedSelectors: ['#companion-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#companion-card' }
          },
          {
            id: 'scenario-b-chat',
            screenId: 'companion-chat',
            title: 'Scenario B: Work anxiety',
            sidePanelInstruction: `### Somatic Tension & Reflection

1. Tap the **Suggested prompt** chip to explain your somatic symptoms.
2. Tap the **Send** button.
3. Tap **Continue to journal** to carry this conversation into your personal journal.`,
            instructionSteps: [
              {
                id: 'tap-suggestion-chip-b',
                label: 'Tap the suggested prompt to fill in the input',
                selector: '#chat-suggestion-chip-0',
                popover: {
                  title: 'Preloaded prompt',
                  description: 'Tap this chip to drop a sample message.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-chip-0' }
              },
              {
                id: 'tap-send-b',
                label: 'Send the message',
                selector: '#chat-send-btn',
                popover: {
                  title: 'Send',
                  description: 'Send the message to the Companion.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-send-btn' }
              },
              {
                id: 'select-continue-journal',
                label: 'Choose "Continue to journal"',
                selector: '#continue-journal-btn',
                popover: {
                  title: 'Carry it forward',
                  description: 'Move the conversation into your journal.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#continue-journal-btn' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-chip-0', '#chat-send-btn', '#chat-input', '#continue-journal-btn'],
            advanceOn: { type: 'tap', selector: '#continue-journal-btn' }
          },
          {
            id: 'journal-handoff',
            screenId: ScreenIds.JOURNAL_EDITOR,
            title: 'Reflective Journaling',
            sidePanelInstruction: `### Free Flow Journal

Your conversation summary is pre-filled. 

1. Write a brief sentence about how you are feeling in the editor.
2. Click **Save entry** in the top-right corner to save privately.`,
            instructionSteps: [
              {
                id: 'jh-write',
                label: 'Write a sentence about how you are feeling',
                selector: 'textarea',
                popover: {
                  title: 'Write freely',
                  description: 'Type a short sentence describing your somatic sensations or thoughts.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'jh-save',
                label: 'Save your entry',
                selector: '#save-journal-btn',
                popover: {
                  title: 'Save',
                  description: 'Save what you\'ve written.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#save-journal-btn' }
              }
            ],
            allowedSelectors: ['#save-journal-btn', 'textarea'],
            advanceOn: { type: 'save', screenId: 'journal-editor' }
          },
          {
            id: 'scenario-b-breath',
            screenId: 'breath-reminder',
            title: 'Take a breath',
            sidePanelInstruction: `### Take a breath

Writing about stressful events can be heavy. Grace offers a short breathing exercise to help you ground yourself. Follow the circle on the phone screen for a few seconds.

Tap the button on the phone screen when you are ready to continue.`,
            instructionSteps: [
              {
                id: 'tap-breath-continue',
                label: 'Take a few slow breaths',
                selector: '#breath-continue-btn',
                popover: {
                  title: 'Continue',
                  description: 'Tap when you feel ready to move forward.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#breath-continue-btn' }
              }
            ],
            allowedSelectors: ['#breath-continue-btn'],
            advanceOn: { type: 'tap', selector: '#breath-continue-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-b',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'summary-useful',
              type: 'likert-5',
              question: 'The carry-over summary made it easier to move from chat into the journal.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-c-patterns',
        label: 'Scenario C — Pattern surfacing',
        description: `### Scenario C: Pattern Surfacing

Review recurring themes and patterns across your saved entries.`,
        steps: [
          {
            id: 'scenario-c-offers',
            screenId: ScreenIds.POST_SAVE_OFFERS,
            title: 'Reviewing patterns',
            sidePanelInstruction: `### Looking back

Grace notices patterns over time. 

Tap **Help me notice patterns** to let Grace cross-reference somatic themes.`,
            instructionSteps: [
              {
                id: 'tap-notice-patterns',
                label: 'Tap "Help me notice patterns"',
                selector: '#help-notice-patterns-btn',
                popover: {
                  title: 'Pattern surfacing',
                  description: 'Let Grace highlight repeated themes across your entries.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#help-notice-patterns-btn' }
              }
            ],
            allowedSelectors: ['#help-notice-patterns-btn'],
            advanceOn: { type: 'tap', selector: '#help-notice-patterns-btn' }
          },
          {
            id: 'scenario-c-annotations',
            screenId: ScreenIds.JOURNAL_ANNOTATIONS,
            title: 'Exploring highlighted themes',
            sidePanelInstruction: `### Surfaced themes

1. Tap one of the **highlighted phrases** (colored superscript numbers) on the screen to read what Grace noticed.
2. Tap **Close** to return and complete the scenario.`,
            instructionSteps: [
              {
                id: 'tap-annotation-phrase',
                label: 'Tap a highlighted phrase to see what Grace noticed',
                selector: '[id^=annotation-]',
                popover: {
                  title: 'AI note',
                  description: 'Each highlight is something Grace flagged across your entries. Tap to read.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '[id^=annotation-]' }
              },
              {
                id: 'tap-close-annotation',
                label: 'Tap "Close" when you\'ve reviewed the highlights',
                selector: '#close-annotations-btn',
                popover: {
                  title: 'Close',
                  description: 'Return to your journal.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#close-annotations-btn' }
              }
            ],
            allowedSelectors: ['[id^=annotation-]', '#close-annotations-btn'],
            advanceOn: { type: 'tap', selector: '#close-annotations-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-c',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'annotation-helpful',
              type: 'likert-5',
              question: 'The highlighted annotations helped me better understand what I have been going through.',
              required: true
            }
          ]
        }
      }
    ],
    postSessionReflection: {
      id: 'reflection-post-session-women',
      title: 'Closing reflection',
      description: 'Three short questions before we finish.',
      microPrompts: [
        {
          id: 'would-write-here',
          type: 'likert-5',
          question: 'I would write what is happening to me in this app.',
          required: true
        },
        {
          id: 'trust-words',
          type: 'likert-5',
          question: 'I trust this app with my words.',
          required: true
        },
        {
          id: 'would-tell-another-woman',
          type: 'likert-5',
          question: 'I would tell another woman about this app.',
          required: true
        }
      ]
    }
  },
  'women-combined': {
    id: 'women-combined',
    label: 'Women Guided — Combined',
    scenarios: [
      SCENARIO_0_ORIENTATION,
      {
        id: 'scenario-a-green-jokes',
        label: 'A workplace situation',
        description: `### A workplace situation

A coworker keeps making inappropriate jokes at the office. You are not sure if this counts as harassment and want to talk about it.`,
        steps: [
          {
            id: 'scenario-a-home',
            screenId: 'guided-home',
            title: 'Open the Companion',
            sidePanelInstruction: `### Open the Companion

Grace has a few different features. The **Companion** is a private chat to help you talk through what's on your mind.

Tap the **Companion** card on the phone to start.`,
            instructionSteps: [
              {
                id: 'tap-companion-card',
                label: 'Tap the Companion card',
                selector: '#companion-card',
                popover: {
                  title: 'Companion',
                  description: 'Chat with the Companion.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#companion-card' }
              }
            ],
            allowedSelectors: ['#companion-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#companion-card' }
          },
          {
            id: 'scenario-a-chat',
            screenId: 'companion-chat',
            title: 'Talk it through',
            sidePanelInstruction: `### Talk it through

The Companion is a private chat to help you think out loud. It will listen and reply, but it won't label your experience for you—you are in control.

1. Tap the **suggested prompt** button at the bottom of the phone to enter a sample message.
2. Tap **Send**.
3. Once the Companion replies, tap **Let go for now** to close the chat without saving any of it.`,
            instructionSteps: [
              {
                id: 'tap-suggestion-chip',
                label: 'Tap the suggested prompt',
                selector: '#chat-suggestion-chip-0',
                popover: {
                  title: 'Suggested prompt',
                  description: 'Tap this to fill in a pre-written message so you don\'t have to type.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-chip-0' }
              },
              {
                id: 'tap-send',
                label: 'Send the message',
                selector: '#chat-send-btn',
                popover: {
                  title: 'Send',
                  description: 'Send the message to the Companion.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-send-btn' }
              },
              {
                id: 'select-let-go',
                label: 'Tap "Let go for now"',
                selector: '#let-go-btn',
                popover: {
                  title: 'Let go for now',
                  description: 'Close the chat. No record or copy of this conversation will be saved.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#let-go-btn' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-chip-0', '#chat-send-btn', '#chat-input', '#let-go-btn'],
            advanceOn: { type: 'tap', selector: '#let-go-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-a',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'chat-restraint',
              type: 'likert-5',
              question: 'I liked that the Companion listened without trying to label or define my experience for me.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-b-work-anxiety',
        label: 'Heading to work',
        description: `### Heading to work

It's Monday morning. You feel anxious about going to the office because of the coworker who was making inappropriate jokes.`,
        steps: [
          {
            id: 'scenario-b-home',
            screenId: 'guided-home',
            title: 'Open the Companion',
            sidePanelInstruction: `### Open the Companion

Tap the **Companion** card on the phone screen to start a new chat.`,
            instructionSteps: [
              {
                id: 'tap-companion-card-b',
                label: 'Tap the Companion card',
                selector: '#companion-card',
                popover: {
                  title: 'Companion',
                  description: 'Start a chat with the Companion.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#companion-card' }
              }
            ],
            allowedSelectors: ['#companion-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#companion-card' }
          },
          {
            id: 'scenario-b-chat',
            screenId: 'companion-chat',
            title: 'Move it into the journal',
            sidePanelInstruction: `### Save to your journal

If a chat feels important, you can save it. The Companion can move a summary of your chat directly into a private journal, where you can add your own thoughts.

1. Tap the **suggested prompt** button at the bottom.
2. Tap **Send**.
3. When the Companion replies, tap **Continue to journal** to move the summary into your journal.`,
            instructionSteps: [
              {
                id: 'tap-suggestion-chip-b',
                label: 'Tap the suggested prompt',
                selector: '#chat-suggestion-chip-0',
                popover: {
                  title: 'Suggested prompt',
                  description: 'Tap this to fill in a pre-written message.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-chip-0' }
              },
              {
                id: 'tap-send-b',
                label: 'Send the message',
                selector: '#chat-send-btn',
                popover: {
                  title: 'Send',
                  description: 'Send the message.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-send-btn' }
              },
              {
                id: 'select-continue-journal',
                label: 'Tap "Continue to journal"',
                selector: '#continue-journal-btn',
                popover: {
                  title: 'Continue to journal',
                  description: 'Move this conversation\'s summary into a private journal entry.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#continue-journal-btn' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-chip-0', '#chat-send-btn', '#chat-input', '#continue-journal-btn'],
            advanceOn: { type: 'tap', selector: '#continue-journal-btn' }
          },
          {
            id: 'journal-handoff',
            screenId: ScreenIds.JOURNAL_EDITOR,
            title: "Write what you're feeling",
            sidePanelInstruction: `### Write what you're feeling

A quick summary of your chat is pre-filled at the top of your journal. You can keep, edit, or delete it.

1. Type a short sentence in the text area about how you are feeling.
2. Tap **Save entry** in the top right.`,
            instructionSteps: [
              {
                id: 'jh-write',
                label: "Write a sentence about how you're feeling",
                selector: 'textarea',
                popover: {
                  title: 'Write freely',
                  description: 'Type a quick sentence about how you feel. Write whatever comes to mind.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'jh-save',
                label: 'Save the entry',
                selector: '#save-journal-btn',
                popover: {
                  title: 'Save',
                  description: 'Save your entry. It will be stored privately on your device.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#save-journal-btn' }
              }
            ],
            allowedSelectors: ['#save-journal-btn', 'textarea'],
            advanceOn: { type: 'save', screenId: 'journal-editor' }
          },
          {
            id: 'scenario-b-breath',
            screenId: 'breath-reminder',
            title: 'Take a breath',
            sidePanelInstruction: `### Take a breath

Writing about stressful events can be heavy. Grace offers a short breathing exercise to help you ground yourself. Follow the circle on the phone screen for a few seconds.

Tap the button on the phone screen when you are ready to continue.`,
            instructionSteps: [
              {
                id: 'tap-breath-continue',
                label: 'Take a few slow breaths',
                selector: '#breath-continue-btn',
                popover: {
                  title: 'Continue',
                  description: 'Tap when you feel ready to move forward.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#breath-continue-btn' }
              }
            ],
            allowedSelectors: ['#breath-continue-btn'],
            advanceOn: { type: 'tap', selector: '#breath-continue-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-b',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'summary-useful',
              type: 'likert-5',
              question: 'I liked how easy it was to move my chat summary into a private journal entry.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-c-patterns',
        label: 'Looking back over time',
        description: `### Looking back over time

You have saved several journal entries over the last few weeks. Grace can help you spot details or patterns that keep appearing in what you wrote.`,
        steps: [
          {
            id: 'scenario-c-offers',
            screenId: ScreenIds.POST_SAVE_OFFERS,
            title: 'Ask Grace to look for patterns',
            sidePanelInstruction: `### Look for patterns

Every time you save an entry, Grace suggests a few next steps. One option is to let Grace find common themes in your past entries.

Tap **Help me notice patterns**.`,
            instructionSteps: [
              {
                id: 'tap-notice-patterns',
                label: 'Tap "Help me notice patterns"',
                selector: '#help-notice-patterns-btn',
                popover: {
                  title: 'Help me notice patterns',
                  description: 'Let Grace find and highlight details or habits that repeat in your entries.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#help-notice-patterns-btn' }
              }
            ],
            allowedSelectors: ['#help-notice-patterns-btn'],
            advanceOn: { type: 'tap', selector: '#help-notice-patterns-btn' }
          },
          {
            id: 'scenario-c-annotations',
            screenId: ScreenIds.JOURNAL_ANNOTATIONS,
            title: 'See what came up',
            sidePanelInstruction: `### See what came up

Grace highlights repeating details in your text (like physical feelings or people who saw you).

1. Tap any **colored phrase** on the screen to read what Grace noticed.
2. Tap **Close** to finish.`,
            instructionSteps: [
              {
                id: 'tap-annotation-phrase',
                label: 'Tap a highlighted phrase',
                selector: '[id^=annotation-]',
                popover: {
                  title: 'A note from Grace',
                  description: 'Tap any colored phrase to see the pattern Grace found.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '[id^=annotation-]' }
              },
              {
                id: 'tap-close-annotation',
                label: 'Tap "Close" when you\'ve read it',
                selector: '#close-annotations-btn',
                popover: {
                  title: 'Close',
                  description: 'Go back to your journal list.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#close-annotations-btn' }
              }
            ],
            allowedSelectors: ['[id^=annotation-]', '#close-annotations-btn'],
            advanceOn: { type: 'tap', selector: '#close-annotations-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-c',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'annotation-helpful',
              type: 'likert-5',
              question: 'The highlighted words pointed out details or patterns that felt important to me.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-d-journaling',
        label: 'Writing with a prompt',
        description: `### Writing with a prompt

Writing on a blank page can be hard. Grace provides simple questions to help you start writing.`,
        steps: [
          {
            id: 'scenario-d-home',
            screenId: 'guided-home',
            title: 'Open the journal',
            sidePanelInstruction: `### Open the journal

Tap the **Reflective Journal** card on the phone screen.`,
            instructionSteps: [
              {
                id: 'tap-journal-card',
                label: 'Tap the Reflective Journal card',
                selector: '#journal-card',
                popover: {
                  title: 'Reflective Journal',
                  description: 'Open your private journal.',
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#journal-card' }
              }
            ],
            allowedSelectors: ['#journal-card', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#journal-card' }
          },
          {
            id: 'scenario-d-modes',
            screenId: 'journal-modes',
            title: 'Pick a guided session',
            sidePanelInstruction: `### Choose how to write

You can write in two ways. **Free flow** is a blank page, while **Guided** gives you a few helpful questions to answer.

Tap **Guided**.`,
            instructionSteps: [
              {
                id: 'tap-guided-btn',
                label: 'Tap "Guided"',
                selector: '#guided-journal-btn',
                popover: {
                  title: 'Guided',
                  description: 'Choose this mode to use simple questions to guide your writing.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#guided-journal-btn' }
              }
            ],
            allowedSelectors: ['#guided-journal-btn'],
            advanceOn: { type: 'tap', selector: '#guided-journal-btn' }
          },
          {
            id: 'scenario-d-editor',
            screenId: ScreenIds.JOURNAL_GUIDED_EDITOR,
            title: 'Save the entry',
            sidePanelInstruction: `### Save the entry

You can answer the questions now, or just save the blank entry and fill it out later.

Tap **Save entry** at the top right.`,
            instructionSteps: [
              {
                id: 'tap-just-save',
                label: 'Tap "save entry"',
                selector: '#save-guided-btn',
                popover: {
                  title: 'save entry',
                  description: 'Save this entry as it is.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#save-guided-btn' }
              }
            ],
            allowedSelectors: ['#save-guided-btn'],
            advanceOn: { type: 'tap', selector: '#save-guided-btn' }
          }
        ],
        reflection: {
          id: 'reflection-no-ai-comfort',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'combined-no-ai-comfort',
              type: 'likert-5',
              question: 'The guided questions made it easier to start writing.',
              required: true
            }
          ]
        }
      },
      {
        id: 'scenario-e-incidents',
        label: 'Writing it down as a record',
        description: `### Writing it down as a record

If you want to keep an official record of what happened in case you need it later, the Incident Log helps you save specific details—like the date, location, and people involved—with a secure timestamp.`,
        steps: [
          {
            id: 'scenario-e-home',
            screenId: 'guided-home',
            title: 'Open the incident log',
            sidePanelInstruction: `### Open the incident log

Tap **Incident Log** in the navigation bar at the bottom of the phone screen.`,
            instructionSteps: [
              {
                id: 'tap-incident-tab',
                label: 'Tap "Incident Log"',
                selector: '#incident-nav-tab',
                popover: {
                  title: 'Incident Log',
                  description: 'Go to the Incident Log.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#incident-nav-tab' }
              }
            ],
            allowedSelectors: ['#incident-nav-tab', 'a[href="/guided"]'],
            advanceOn: { type: 'tap', selector: '#incident-nav-tab' }
          },
          {
            id: 'scenario-e-log',
            screenId: 'incident-log',
            title: 'Review incident log',
            sidePanelInstruction: `### Review incident details

Your incident details have been filled in for you to review.

1. Read through the details on the screen.
2. Add any extra notes under **Anything else** at the bottom if you want.
3. Tap **Save incident securely** at the bottom.`,
            instructionSteps: [
              {
                id: 'sel-write',
                label: 'Review prefilled description',
                selector: 'textarea',
                popover: {
                  title: 'Review prefilled log',
                  description: 'Review the details. Add any extra thoughts at the bottom if you\'d like.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'sel-save',
                label: 'Tap "Save incident"',
                selector: '#save-incident-btn',
                popover: {
                  title: 'Save',
                  description: 'Save the incident record. Grace will lock it and add a secure timestamp.',
                  side: 'bottom',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-incident-btn' }
              }
            ],
            allowedSelectors: ['#save-incident-btn', 'textarea'],
            advanceOn: { type: 'save', screenId: 'incident-log' }
          },
          {
            id: 'scenario-e-hash',
            screenId: ScreenIds.HASH_RECEIPT,
            title: 'Your timestamp receipt',
            sidePanelInstruction: `### Your secure receipt

Once saved, Grace creates a secure receipt for your entry. This proves exactly when you wrote it and that it has not been changed since, which is useful if you ever need to share it.

Tap **Next** to continue.`,
            instructionSteps: [
              {
                id: 'tap-receipt-next',
                label: 'Tap "Next"',
                selector: '#incident-receipt-next-btn',
                popover: {
                  title: 'Next',
                  description: 'Go to the next step.',
                  side: 'bottom',
                  align: 'end'
                },
                completedWhen: { type: 'tap', selector: '#incident-receipt-next-btn' }
              }
            ],
            allowedSelectors: ['#incident-receipt-next-btn'],
            advanceOn: { type: 'tap', selector: '#incident-receipt-next-btn' }
          },
          {
            id: 'scenario-e-offers',
            screenId: ScreenIds.INCIDENT_POST_SAVE_OFFERS,
            title: 'Decide what to do next',
            sidePanelInstruction: `### Decide what to do next

Grace suggests a few steps you can take next, such as sharing with a professional or finding support. You can also choose to leave it for now.

Tap **Do nothing for now**.`,
            instructionSteps: [
              {
                id: 'tap-do-nothing',
                label: 'Tap "Do nothing for now"',
                selector: '#do-nothing-btn',
                popover: {
                  title: 'Do nothing for now',
                  description: 'Choose this to finish saving without taking any other action today.',
                  side: 'right',
                  align: 'start'
                },
                completedWhen: { type: 'tap', selector: '#do-nothing-btn' }
              }
            ],
            allowedSelectors: ['#do-nothing-btn'],
            advanceOn: { type: 'tap', selector: '#do-nothing-btn' }
          }
        ],
        reflection: {
          id: 'reflection-scenario-e',
          title: 'A quick reflection',
          microPrompts: [
            {
              id: 'incident-record-confidence',
              type: 'likert-5',
              question: 'The Incident Log felt like a secure place to keep records that I might need in the future.',
              required: true
            }
          ]
        }
      }
    ],
    postSessionReflection: {
      id: 'reflection-post-session-women',
      title: 'Closing reflection',
      description: 'A few short questions before we finish.',
      microPrompts: [
        {
          id: 'would-write-here',
          type: 'likert-5',
          question: 'I would feel comfortable writing down what happens to me using this app.',
          required: true
        },
        {
          id: 'trust-words',
          type: 'likert-5',
          question: 'I trust this app to keep my writing private and safe.',
          required: true
        },
        {
          id: 'would-tell-another-woman',
          type: 'likert-5',
          question: 'I would recommend this app to another woman going through a similar situation.',
          required: true
        },
        {
          id: 'nothing-felt-unsafe',
          type: 'likert-5',
          question: 'Everything in this app felt safe and secure to me.',
          required: true
        }
      ]
    }
  },
  'lawyer-standard': {
    id: 'lawyer-standard',
    label: 'Lawyer Guided — Standard',
    scenarios: [
      SCENARIO_0_ORIENTATION_PROVIDER,
      {
        id: 'lawyer-intake',
        label: 'Intake walkthrough',
        steps: [
          {
            id: 'la-home',
            screenId: ScreenIds.LAWYER_DASHBOARD,
            title: 'New consultation request',
            sidePanelInstruction: `### New consultation request

This is the receiving provider's dashboard. A prospective client has submitted a consultation request through Grace.

Tap the **Consultation request — Jane** notification to open it.`,
            instructionSteps: [
              {
                id: 'la-open-intake',
                label: 'Open the consultation request',
                selector: '#booking-notification',
                popover: {
                  title: 'New consultation request',
                  description: `Open the request submitted by Jane.`,
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#booking-notification' }
              }
            ],
            allowedSelectors: ['#booking-notification'],
            advanceOn: { type: 'tap', selector: '#booking-notification' }
          },
          {
            id: 'la-view-intake',
            screenId: 'lawyer-booking-detail',
            title: 'Review the request and accept',
            sidePanelInstruction: `### Review the request and accept

The request shows a redacted client profile. The client's full identifying information is held back until you formally accept.

Review what's shown, then tap **Accept Request** to proceed and unlock evidence access controls.`,
            instructionSteps: [
              {
                id: 'la-review-profile',
                label: 'Review the client profile',
                selector: '.redacted-profile-info',
                popover: {
                  title: 'Client profile',
                  description: `Identifying details remain redacted until you accept.`,
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'la-accept-booking',
                label: 'Tap "Accept Request"',
                selector: '#accept-booking-btn',
                popover: {
                  title: 'Accept',
                  description: `Formally accept the consultation. This unlocks evidence access.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#accept-booking-btn' }
              }
            ],
            allowedSelectors: ['#accept-booking-btn'],
            advanceOn: { type: 'tap', selector: '#accept-booking-btn' }
          },
          {
            id: 'la-view-records',
            screenId: 'lawyer-artifacts',
            title: 'Request access to client records',
            sidePanelInstruction: `### Request access to client records

The client has elected to share two artifact types: encrypted incident logs and journal entries. Access is gated — you request, the client grants, and access is logged on both sides.

Request access to both. Then tap **Next**.`,
            instructionSteps: [
              {
                id: 'la-request-incident',
                label: 'Request access to incident logs',
                selector: '#request-incident-btn',
                popover: {
                  title: 'Request incident logs',
                  description: `Request decryption access to the client's incident logs.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#request-incident-btn' }
              },
              {
                id: 'la-request-journal',
                label: 'Request access to journal entries',
                selector: '#request-journal-btn',
                popover: {
                  title: 'Request journal entries',
                  description: `Request decryption access to the client's journal entries.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#request-journal-btn' }
              }
            ],
            allowedSelectors: ['#request-incident-btn', '#request-journal-btn', '#artifacts-next-btn'],
            advanceOn: { type: 'tap', selector: '#artifacts-next-btn' }
          },
          {
            id: 'la-chat-corpus',
            screenId: 'lawyer-chat',
            title: "Query the client's corpus",
            sidePanelInstruction: `### Query the client's corpus

The corpus chat lets you ask questions about the shared entries. Every answer cites the specific entry and paragraph it draws from. The client sees every question you ask and every answer returned.

Tap each of the three suggested questions to see how the corpus responds. Then tap **Next**.`,
            instructionSteps: [
              {
                id: 'la-chat-timeline',
                label: 'Ask "Show me the timeline"',
                selector: '#chat-suggestion-timeline',
                popover: {
                  title: 'Query the corpus',
                  description: `Ask the corpus to surface a chronological account.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-timeline' }
              },
              {
                id: 'la-chat-evidence',
                label: 'Ask "What evidence is attached?"',
                selector: '#chat-suggestion-evidence',
                popover: {
                  title: 'Query the corpus',
                  description: `Ask what attached evidence the client has shared.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-evidence' }
              },
              {
                id: 'la-chat-named',
                label: 'Ask "Has she named what happened?"',
                selector: '#chat-suggestion-named',
                popover: {
                  title: 'Query the corpus',
                  description: `Ask whether the client has named the conduct in her own words.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-named' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-timeline', '#chat-suggestion-evidence', '#chat-suggestion-named', '#chat-next-btn'],
            advanceOn: { type: 'tap', selector: '#chat-next-btn' }
          },
          {
            id: 'la-intake-notes',
            screenId: 'lawyer-notes',
            title: 'Add intake notes',
            sidePanelInstruction: `### Add intake notes

Review the AI synthesis and add your own intake notes. Your notes are kept separately from the synthesis and the client's entries.

Save a note, then tap **Next** to continue to the certified export.`,
            instructionSteps: [
              {
                id: 'la-save-notes',
                label: 'Add and save intake note',
                selector: '#save-note-btn',
                popover: {
                  title: 'Save note',
                  description: `Type a brief intake note and save.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-note-btn' }
              },
              {
                id: 'la-continue-export',
                label: 'Continue to the certified export',
                selector: '#notes-next-btn',
                popover: {
                  title: 'Continue',
                  description: `Move on to the export preview.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#notes-next-btn' }
              }
            ],
            allowedSelectors: ['#provider-note', '#save-note-btn', '#notes-next-btn'],
            advanceOn: { type: 'tap', selector: '#notes-next-btn' }
          },
          {
            id: 'la-export',
            screenId: 'lawyer-export',
            title: 'Review the certified export',
            sidePanelInstruction: `### Review the certified export

The certified export is the PDF you'd attach to a pleading or share with co-counsel. It includes the synthesis, the cited excerpts, the hash receipts, and the timestamp chain for each incident log.

Review the export, then tap **End Review** to finish.`,
            instructionSteps: [
              {
                id: 'la-end-review',
                label: 'Tap "End Review" when done',
                selector: '#export-end-btn',
                popover: {
                  title: 'End Review',
                  description: `Finish the walkthrough.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#export-end-btn' }
              }
            ],
            allowedSelectors: ['#export-end-btn'],
            advanceOn: { type: 'manual_next' }
          }
        ]
      }
    ],
    postSessionReflection: {
      id: 'reflection-post-session-lawyer',
      title: 'Closing reflection',
      microPrompts: [
        {
          id: 'legal-synthesis-useful',
          type: 'likert-5',
          question: 'The legal-lens synthesis would be useful for case preparation.',
          required: true
        },
        {
          id: 'hash-defensible',
          type: 'likert-5',
          question: 'The hash-receipt and timestamp model, as a concept, could be defensible under cross-examination if implemented as described.',
          required: true
        },
        {
          id: 'accept-shared-links-lawyer',
          type: 'likert-5',
          question: 'I would accept shared Grace links from clients as a receiving provider on this platform.',
          required: true
        }
      ]
    }
  },
  'clinician-standard': {
    id: 'clinician-standard',
    label: 'Clinician Guided — Standard',
    scenarios: [
      SCENARIO_0_ORIENTATION_PROVIDER,
      {
        id: 'clinician-intake',
        label: 'Patient intake walkthrough',
        steps: [
          {
            id: 'ca-home',
            screenId: ScreenIds.CLINICIAN_DASHBOARD,
            title: 'New referral',
            sidePanelInstruction: `### New referral

This is the receiving provider's dashboard. A prospective patient has shared her Grace artifacts and requested an initial consultation.

Tap the **Referral — Jane** notification to open it.`,
            instructionSteps: [
              {
                id: 'ca-open-intake',
                label: 'Open the referral',
                selector: '#booking-notification',
                popover: {
                  title: 'New referral',
                  description: `Open the referral from Jane.`,
                  side: 'right',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#booking-notification' }
              }
            ],
            allowedSelectors: ['#booking-notification'],
            advanceOn: { type: 'tap', selector: '#booking-notification' }
          },
          {
            id: 'ca-view-intake',
            screenId: 'clinician-booking-detail',
            title: 'Review the referral and accept',
            sidePanelInstruction: `### Review the referral and accept

The referral shows a redacted patient profile. Full identifying details are held back until you accept.

Review what's shown, then tap **Accept Request** to proceed.`,
            instructionSteps: [
              {
                id: 'ca-review-profile',
                label: 'Review the patient profile',
                selector: '.redacted-profile-info',
                popover: {
                  title: 'Patient profile',
                  description: `Identifying details remain redacted until you accept.`,
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'ca-accept-booking',
                label: 'Tap "Accept Request"',
                selector: '#accept-booking-btn',
                popover: {
                  title: 'Accept',
                  description: `Accept the referral to unlock access to her shared artifacts.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#accept-booking-btn' }
              }
            ],
            allowedSelectors: ['#accept-booking-btn'],
            advanceOn: { type: 'tap', selector: '#accept-booking-btn' }
          },
          {
            id: 'ca-view-records',
            screenId: 'clinician-artifacts',
            title: 'Request access to shared artifacts',
            sidePanelInstruction: `### Request access to shared artifacts

The patient has shared two artifact types: encrypted incident logs and journal entries. Access is gated — you request, the patient grants, and the access is logged on both sides.

Request access to both. Then tap **Next**.`,
            instructionSteps: [
              {
                id: 'ca-request-incident',
                label: 'Request access to incident logs',
                selector: '#request-incident-btn',
                popover: {
                  title: 'Request incident logs',
                  description: `Request access to the patient's incident logs.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#request-incident-btn' }
              },
              {
                id: 'ca-request-journal',
                label: 'Request access to journal entries',
                selector: '#request-journal-btn',
                popover: {
                  title: 'Request journal entries',
                  description: `Request access to the patient's journal entries.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#request-journal-btn' }
              }
            ],
            allowedSelectors: ['#request-incident-btn', '#request-journal-btn', '#artifacts-next-btn'],
            advanceOn: { type: 'tap', selector: '#artifacts-next-btn' }
          },
          {
            id: 'ca-chat-corpus',
            screenId: 'clinician-chat',
            title: "Query the patient's somatic logs",
            sidePanelInstruction: `### Query the patient's somatic logs

The somatic chat lets you ask questions about what the patient has shared. Every answer cites the entry and paragraph it draws from. The client sees every question and answer.

Tap each of the three suggested questions to see how the somatic assistant responds. Then tap **Next**.`,
            instructionSteps: [
              {
                id: 'ca-chat-timeline',
                label: 'Ask "Show somatic patterns"',
                selector: '#chat-suggestion-timeline',
                popover: {
                  title: 'Query somatic patterns',
                  description: `Ask for self-reported somatic stress patterns.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-timeline' }
              },
              {
                id: 'ca-chat-evidence',
                label: 'Ask "What are the panic reactions?"',
                selector: '#chat-suggestion-evidence',
                popover: {
                  title: 'Query panic reactions',
                  description: `Ask what physical panic reactions are logged.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-evidence' }
              },
              {
                id: 'ca-chat-named',
                label: 'Ask "What attachment style is noted?"',
                selector: '#chat-suggestion-named',
                popover: {
                  title: 'Query attachment indicators',
                  description: `Ask about attachment style indicators in self-reflection.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-named' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-timeline', '#chat-suggestion-evidence', '#chat-suggestion-named', '#chat-next-btn'],
            advanceOn: { type: 'tap', selector: '#chat-next-btn' }
          },
          {
            id: 'ca-intake-notes',
            screenId: 'clinician-notes',
            title: 'Add session-prep notes',
            sidePanelInstruction: `### Add session-prep notes

Review the AI synthesis and add notes for your first session with this patient. Your notes are kept separately from the synthesis and the patient's entries.

Save a note, then tap **Next** to continue to the export.`,
            instructionSteps: [
              {
                id: 'ca-save-notes',
                label: 'Add and save a session-prep note',
                selector: '#save-note-btn',
                popover: {
                  title: 'Save note',
                  description: `Type a brief note for session prep and save.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-note-btn' }
              },
              {
                id: 'ca-continue-export',
                label: 'Continue to the export',
                selector: '#notes-next-btn',
                popover: {
                  title: 'Continue',
                  description: `Move on to the export preview.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#notes-next-btn' }
              }
            ],
            allowedSelectors: ['#provider-note', '#save-note-btn', '#notes-next-btn'],
            advanceOn: { type: 'tap', selector: '#notes-next-btn' }
          },
          {
            id: 'ca-export',
            screenId: 'clinician-export',
            title: 'Review the export',
            sidePanelInstruction: `### Review the export

The export is what you'd file in the patient's record. It includes the synthesis, the cited excerpts, and the patient's somatic and pattern flags.

Review the export, then tap **End Review** to finish.`,
            instructionSteps: [
              {
                id: 'ca-end-review',
                label: 'Tap "End Review" when done',
                selector: '#export-end-btn',
                popover: {
                  title: 'End Review',
                  description: `Finish the walkthrough.`,
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#export-end-btn' }
              }
            ],
            allowedSelectors: ['#export-end-btn'],
            advanceOn: { type: 'manual_next' }
          }
        ]
      }
    ],
    postSessionReflection: {
      id: 'reflection-post-session-clinician',
      title: 'Closing reflection',
      microPrompts: [
        {
          id: 'clinical-synthesis-useful',
          type: 'likert-5',
          question: 'The clinical-lens synthesis would be useful for session preparation.',
          required: true
        },
        {
          id: 'recommend-to-patient',
          type: 'likert-5',
          question: 'I would recommend a patient use this between sessions.',
          required: true
        },
        {
          id: 'accept-shared-links-clinician',
          type: 'likert-5',
          question: 'I would accept shared links from patients as a receiving provider on this platform.',
          required: true
        }
      ]
    }
  },
  'admin-freeroam': {
    id: 'admin-freeroam',
    label: 'Admin Free Roam',
    scenarios: []
  },
  'free-01': {
    id: 'free-01',
    label: 'FREE-01 Free Roam Admin',
    scenarios: []
  }
}

export function getSessionConfig(sessionId: string): SessionConfig | null {
  return SESSIONS[sessionId] || null
}

export function getScenarioSteps(sessionId: string): GuidedStepConfig[] {
  const session = getSessionConfig(sessionId)
  if (!session) return []
  return session.scenarios.flatMap(s => s.steps)
}

export function getStepConfig(sessionId: string, stepIndex: number): GuidedStepConfig | null {
  const steps = getScenarioSteps(sessionId)
  if (stepIndex >= 0 && stepIndex < steps.length) {
    return steps[stepIndex]
  }
  return null
}
