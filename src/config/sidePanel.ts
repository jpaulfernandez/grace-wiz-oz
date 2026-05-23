import type { SessionConfig, GuidedStepConfig, ScenarioConfig } from './scenarioTypes'
import { ScreenIds } from '../lib/screenIds'

// Scenario 0 - Orientation (Shared by all participant walkthrough flows)
const SCENARIO_0_ORIENTATION: ScenarioConfig = {
  id: 'scenario-0-orientation',
  label: 'Getting oriented',
  steps: [
    {
      id: 'orientation-prototype',
      screenId: 'guided-home',
      title: 'Welcome to Grace',
      prototypeInteractive: false,
      sidePanelInstruction: `### Welcome to Grace

Thank you for taking part in this session. You'll spend about 60 minutes exploring **Grace**, a prototype space for women navigating gender-based harm.

The phone screen on your left is the **prototype** — you'll tap and interact with it the way you would a real app. The researcher running this session will play the part of the AI Companion live, so the conversations are real even if some parts of the prototype are simulated.

Tap **Next step** when you're ready to learn about the rest of the screen.`,
      instructionSteps: [
        {
          id: 'see-prototype',
          label: 'The prototype is on the left',
          selector: '#phone-frame-root',
          popover: {
            title: 'The prototype',
            description: 'This is the interactive Grace prototype. We\'ll show you what to tap as we go.',
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
      title: 'Your instructions live here',
      prototypeInteractive: false,
      sidePanelInstruction: `### This panel guides you


Each scenario will appear here with:

- A short **explanation** of what you're about to do
- A **task checklist** with the small steps to follow
- A **pointer** on the prototype showing exactly where to tap

If you ever feel lost, tap any row in the checklist and we'll point you to the right spot on the prototype.

Tap **Next step** to continue.`,
      instructionSteps: [],
      allowedSelectors: [],
      advanceOn: { type: 'manual_next' }
    } as GuidedStepConfig,
    {
      id: 'orientation-help',
      screenId: 'guided-home',
      title: 'Help is always available',
      prototypeInteractive: false,
      sidePanelInstruction: `### If you get lost

At the top of the screen, **I need help** reaches the researcher running this session. **Study info** explains what we're testing and how your data is handled.

You can stop, pause, or skip any part of this session at any time without affecting your compensation. There are no wrong answers, and "I don't know" is always a valid response.

Tap **Next step** to continue.`,
      instructionSteps: [
        {
          id: 'see-help',
          label: 'Help button is at the top-left',
          selector: '#help-button',
          popover: {
            title: 'Need help?',
            description: 'Tap here any time during the session if you get lost or have a question.',
            side: 'bottom',
            align: 'start',
          }
        },
        {
          id: 'see-study-info',
          label: 'Study info is next to it',
          selector: '#study-info-button',
          popover: {
            title: 'About this study',
            description: 'Tap to see what we\'re testing and how your data is being handled.',
            side: 'bottom',
            align: 'start',
          }
        }
      ],
      allowedSelectors: ['#help-button', '#study-info-button'],
      advanceOn: { type: 'manual_next' }
    } as GuidedStepConfig,
    {
      id: 'orientation-reflections',
      screenId: 'guided-home',
      title: 'Reflection moments',
      prototypeInteractive: false,
      sidePanelInstruction: `### Between scenarios, we'll pause

Every now and then, the prototype will pause and a few short questions will appear here in the panel. They look something like this:

> **Example only — not recorded**
> *I feel comfortable using a digital tool to discuss sensitive concerns.*
> 
> 1 (Strongly disagree) to 5 (Strongly agree)

Please answer honestly. There are no wrong answers, and these short reflections are how we understand whether Grace is working the way it should.

Tap **Next step** when you're ready for your first reflection.`,
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
        question: 'I feel comfortable using a digital tool to discuss sensitive concerns.',
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

Grace is an austere, editorial-minimal sanctuary designed to provide emotional safety and structured recording for survivors.

To begin, tap the **Companion** card on the screen to talk with your supportive AI partner.`,
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

Tap the **Companion** card on the screen to open the somatic AI chat partner.`,
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

Tap **Guided** to use Pennebaker-style structured prompts.`,
            instructionSteps: [
              {
                id: 'tap-guided-btn',
                label: 'Tap "Guided"',
                selector: '#guided-journal-btn',
                popover: {
                  title: 'Guided mode',
                  description: 'Use Pennebaker-style prompts to structure your reflection.',
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
            sidePanelInstruction: `### Cryptographic receipt

Observe the secure blockchain authority hash, then click **Next** to proceed.`,
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

Tap **Guided** to use Pennebaker-style structured prompts.`,
            instructionSteps: [
              {
                id: 'tap-guided-btn',
                label: 'Tap "Guided"',
                selector: '#guided-journal-btn',
                popover: {
                  title: 'Guided mode',
                  description: 'Use Pennebaker-style prompts to structure your reflection.',
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
            sidePanelInstruction: `### Cryptographic receipt

Observe the secure blockchain authority hash, then click **Next** to proceed.`,
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

Grace is an austere, editorial-minimal sanctuary designed to provide emotional safety and structured recording for survivors.

To begin, tap the **Companion** card on the screen to talk with your supportive AI partner.`,
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

Tap the **Companion** card on the screen to open the somatic AI chat partner.`,
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
            title: 'Pause & breathe',
            sidePanelInstruction: `### Somatic breath pause

Breathe slowly. Follow the somatic expansion circle on the screen.

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
        label: 'Scenario A — Green jokes',
        description: `### Scenario A: Green jokes

Your coworker Marco frequently tells inappropriate sexual jokes. You feel uncomfortable but are not sure if it qualifies as harassment.`,
        steps: [
          {
            id: 'scenario-a-home',
            screenId: 'guided-home',
            title: 'Get started',
            sidePanelInstruction: `### Welcome to Grace

To begin, tap the **Companion** card on the screen to talk with your supportive AI partner.`,
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

Tap the **Companion** card on the screen to open the somatic AI chat partner.`,
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
            title: 'Pause & breathe',
            sidePanelInstruction: `### Somatic breath pause

Breathe slowly. Follow the somatic expansion circle on the screen.

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

Tap **Guided** to use Pennebaker-style structured prompts.`,
            instructionSteps: [
              {
                id: 'tap-guided-btn',
                label: 'Tap "Guided"',
                selector: '#guided-journal-btn',
                popover: {
                  title: 'Guided mode',
                  description: 'Use Pennebaker-style prompts to structure your reflection.',
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
            screenId: 'journal-guided-editor',
            title: 'Structured prompts',
            sidePanelInstruction: `### Guided prompt editor

Answer the pre-filled questions or tap **Just save it** to secure the entry.`,
            instructionSteps: [
              {
                id: 'tap-just-save',
                label: 'Tap "Just save it"',
                selector: '#save-guided-btn',
                popover: {
                  title: 'Save quietly',
                  description: 'Save your entry without any AI follow-up.',
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
            sidePanelInstruction: `### Cryptographic receipt

Observe the secure blockchain authority hash, then click **Next** to proceed.`,
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
  'lawyer-standard': {
    id: 'lawyer-standard',
    label: 'Lawyer Guided — Standard',
    scenarios: [
      SCENARIO_0_ORIENTATION_PROVIDER,
      {
        id: 'lawyer-intake',
        label: 'Lawyer Intake Dashboard',
        steps: [
          {
            id: 'la-home',
            screenId: ScreenIds.LAWYER_DASHBOARD,
            title: 'Intake Dashboard',
            sidePanelInstruction: `### Open Intake Request

Welcome to the Lawyer Dashboard. Tap the **Request for Consultation - Jane** notification to open the intake request.`,
            instructionSteps: [
              {
                id: 'la-open-intake',
                label: 'Open the intake request',
                selector: '#booking-notification',
                popover: {
                  title: 'New Intake',
                  description: 'Tap to review the new request from Jane.',
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
            title: 'Review Client Profile',
            sidePanelInstruction: `### Review and Accept

Review the client profile. Tap **Accept Request** to formally accept the consultation and view evidence request options.`,
            instructionSteps: [
              {
                id: 'la-review-profile',
                label: 'Review client profile',
                selector: '.redacted-profile-info',
                popover: {
                  title: 'Information',
                  description: 'Review the initial consultation details.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'la-accept-booking',
                label: 'Accept Request',
                selector: '#accept-booking-btn',
                popover: {
                  title: 'Accept',
                  description: 'Tap to formally accept and reveal data access options.',
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
            title: 'Secure Client Data',
            sidePanelInstruction: `### Request Data Access

Jane has shared encrypted Incident Logs and Somatic Journals. Request access to both logs to decrypt and review them.`,
            instructionSteps: [
              {
                id: 'la-request-incident',
                label: 'Request Incident Logs',
                selector: '#request-incident-btn',
                popover: {
                  title: 'Request Logs',
                  description: 'Tap to request decryption access for incident logs.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#request-incident-btn' }
              },
              {
                id: 'la-request-journal',
                label: 'Request Somatic Journals',
                selector: '#request-journal-btn',
                popover: {
                  title: 'Request Journals',
                  description: 'Tap to request decryption access for somatic journals.',
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
            title: 'Chat with Corpus',
            sidePanelInstruction: `### Ask the AI

Ask questions directly to the client's evidence corpus by tapping the suggestions.`,
            instructionSteps: [
              {
                id: 'la-chat-timeline',
                label: 'Click "Show me the timeline"',
                selector: '#chat-suggestion-timeline',
                popover: { title: 'Query AI', description: 'Tap to ask the AI.', side: 'top', align: 'center' },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-timeline' }
              },
              {
                id: 'la-chat-evidence',
                label: 'Click "What evidence is attached?"',
                selector: '#chat-suggestion-evidence',
                popover: { title: 'Query AI', description: 'Tap to ask the AI.', side: 'top', align: 'center' },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-evidence' }
              },
              {
                id: 'la-chat-named',
                label: 'Click "Has she named what happened?"',
                selector: '#chat-suggestion-named',
                popover: { title: 'Query AI', description: 'Tap to ask the AI.', side: 'top', align: 'center' },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-named' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-timeline', '#chat-suggestion-evidence', '#chat-suggestion-named', '#chat-next-btn'],
            advanceOn: { type: 'tap', selector: '#chat-next-btn' }
          },
          {
            id: 'la-intake-notes',
            screenId: 'lawyer-notes',
            title: 'Intake Notes',
            sidePanelInstruction: `### Finalize Notes

Review the AI Synthesis, add your notes, and proceed to the certified export.`,
            instructionSteps: [
              {
                id: 'la-save-notes',
                label: 'Add and save note',
                selector: '#save-note-btn',
                popover: {
                  title: 'Save Notes',
                  description: 'Type observations and save.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-note-btn' }
              },
              {
                id: 'la-continue-export',
                label: 'Continue to certified export',
                selector: '#notes-next-btn',
                popover: {
                  title: 'Export',
                  description: 'Proceed to export preview.',
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
            title: 'Certified Export',
            sidePanelInstruction: `### This is the last stage, review.

Review the certified PDF export and tap End Review.`,
            instructionSteps: [
              {
                id: 'la-end-review',
                label: 'Press end when you\'re done reviewing',
                selector: '#export-end-btn',
                popover: {
                  title: 'End Review',
                  description: 'Finish the scenario.',
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
          question: 'The legal lens synthesis would be useful for case preparation.',
          required: true
        },
        {
          id: 'hash-defensible',
          type: 'likert-5',
          question: 'The hash-receipt and timestamp model, if implemented as described, would be defensible under cross-examination.',
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
        label: 'Clinician Intake Dashboard',
        steps: [
          {
            id: 'ca-home',
            screenId: ScreenIds.CLINICIAN_DASHBOARD,
            title: 'Intake Dashboard',
            sidePanelInstruction: `### Open Intake Request

Welcome to the Clinician Dashboard. Tap the **Request for Consultation - Jane** notification to open the intake request.`,
            instructionSteps: [
              {
                id: 'ca-open-intake',
                label: 'Open the intake request',
                selector: '#booking-notification',
                popover: {
                  title: 'New Intake',
                  description: 'Tap to review the new request from Jane.',
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
            screenId: 'lawyer-booking-detail',
            title: 'Review Client Profile',
            sidePanelInstruction: `### Review and Accept

Review the client profile. Tap **Accept Request** to formally accept the consultation and view evidence request options.`,
            instructionSteps: [
              {
                id: 'ca-review-profile',
                label: 'Review client profile',
                selector: '.redacted-profile-info',
                popover: {
                  title: 'Information',
                  description: 'Review the initial consultation details.',
                  side: 'left',
                  align: 'center'
                },
                completedWhen: { type: 'input' }
              },
              {
                id: 'ca-accept-booking',
                label: 'Accept Request',
                selector: '#accept-booking-btn',
                popover: {
                  title: 'Accept',
                  description: 'Tap to formally accept and reveal data access options.',
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
            screenId: 'lawyer-artifacts',
            title: 'Secure Client Data',
            sidePanelInstruction: `### Request Data Access

Jane has shared encrypted Incident Logs and Somatic Journals. Request access to both logs to decrypt and review them.`,
            instructionSteps: [
              {
                id: 'ca-request-incident',
                label: 'Request Incident Logs',
                selector: '#request-incident-btn',
                popover: {
                  title: 'Request Logs',
                  description: 'Tap to request decryption access for incident logs.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#request-incident-btn' }
              },
              {
                id: 'ca-request-journal',
                label: 'Request Somatic Journals',
                selector: '#request-journal-btn',
                popover: {
                  title: 'Request Journals',
                  description: 'Tap to request decryption access for somatic journals.',
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
            screenId: 'lawyer-chat',
            title: 'Chat with Corpus',
            sidePanelInstruction: `### Ask the AI

Ask questions directly to the client's evidence corpus by tapping the suggestions.`,
            instructionSteps: [
              {
                id: 'ca-chat-timeline',
                label: 'Click "Show me the timeline"',
                selector: '#chat-suggestion-timeline',
                popover: { title: 'Query AI', description: 'Tap to ask the AI.', side: 'top', align: 'center' },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-timeline' }
              },
              {
                id: 'ca-chat-evidence',
                label: 'Click "What evidence is attached?"',
                selector: '#chat-suggestion-evidence',
                popover: { title: 'Query AI', description: 'Tap to ask the AI.', side: 'top', align: 'center' },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-evidence' }
              },
              {
                id: 'ca-chat-named',
                label: 'Click "Has she named what happened?"',
                selector: '#chat-suggestion-named',
                popover: { title: 'Query AI', description: 'Tap to ask the AI.', side: 'top', align: 'center' },
                completedWhen: { type: 'tap', selector: '#chat-suggestion-named' }
              }
            ],
            allowedSelectors: ['#chat-suggestion-timeline', '#chat-suggestion-evidence', '#chat-suggestion-named', '#chat-next-btn'],
            advanceOn: { type: 'tap', selector: '#chat-next-btn' }
          },
          {
            id: 'ca-intake-notes',
            screenId: 'lawyer-notes',
            title: 'Intake Notes',
            sidePanelInstruction: `### Finalize Notes

Review the AI Synthesis, add your notes, and proceed to the certified export.`,
            instructionSteps: [
              {
                id: 'ca-save-notes',
                label: 'Add and save note',
                selector: '#save-note-btn',
                popover: {
                  title: 'Save Notes',
                  description: 'Type observations and save.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#save-note-btn' }
              },
              {
                id: 'ca-continue-export',
                label: 'Continue to certified export',
                selector: '#notes-next-btn',
                popover: {
                  title: 'Export',
                  description: 'Proceed to export preview.',
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
            screenId: 'lawyer-export',
            title: 'Certified Export',
            sidePanelInstruction: `### This is the last stage, review.

Review the certified PDF export and tap End Review.`,
            instructionSteps: [
              {
                id: 'ca-end-review',
                label: 'Press end when you\'re done reviewing',
                selector: '#export-end-btn',
                popover: {
                  title: 'End Review',
                  description: 'Finish the scenario.',
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
          question: 'The clinical lens synthesis would be useful for session preparation.',
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
