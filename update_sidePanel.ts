import fs from 'fs';
import path from 'path';

const p = path.resolve('src/config/sidePanel.ts');
let content = fs.readFileSync(p, 'utf8');

const lawyerTasksRegex = /id: 'la-view-intake',[\s\S]*?(?=\s*\{[\s\S]*?id: 'la-view-records')/m;
const lawyerRecordsRegex = /id: 'la-view-records',[\s\S]*?(?=\s*\{[\s\S]*?id: 'la-chat-corpus')/m;
const lawyerChatRegex = /id: 'la-chat-corpus',[\s\S]*?(?=\s*\{[\s\S]*?id: 'la-intake-notes')/m;
const lawyerNotesRegex = /id: 'la-intake-notes',[\s\S]*?(?=\s*\][\s\S]*?postSessionReflection)/m;

// Define replacements for lawyer

// 1. la-view-intake
content = content.replace(lawyerTasksRegex, `id: 'la-view-intake',
            screenId: 'lawyer-booking-detail',
            title: 'Review Client Profile',
            sidePanelInstruction: \`### Review and Accept

Review the client profile. Tap **Accept Request** to formally accept the consultation and view evidence request options.\`,
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
                completedWhen: { type: 'input' } // Auto-completed or skipped by tap
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
`);

// 2. la-view-records
content = content.replace(lawyerRecordsRegex, `id: 'la-view-records',
            screenId: 'lawyer-artifacts',
            title: 'Secure Client Data',
            sidePanelInstruction: \`### Request Data Access

Jane has shared encrypted Incident Logs and Somatic Journals. Request access to both logs to decrypt and review them.\`,
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
`);

// 3. la-chat-corpus
content = content.replace(lawyerChatRegex, `id: 'la-chat-corpus',
            screenId: 'lawyer-chat',
            title: 'Chat with Corpus',
            sidePanelInstruction: \`### Ask the AI

Ask questions directly to the client's evidence corpus by tapping the suggestions.\`,
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
`);

// 4. la-intake-notes
content = content.replace(lawyerNotesRegex, `id: 'la-intake-notes',
            screenId: 'lawyer-notes',
            title: 'Intake Notes',
            sidePanelInstruction: \`### Finalize Notes

Review the AI Synthesis, add your notes, and proceed to the certified export.\`,
            instructionSteps: [
              {
                id: 'la-save-notes',
                label: 'Add and save note',
                selector: '#provider-note-save-btn',
                popover: {
                  title: 'Save Notes',
                  description: 'Type observations and save.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#provider-note-save-btn' }
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
            allowedSelectors: ['#provider-note-input', '#provider-note-save-btn', '#notes-next-btn'],
            advanceOn: { type: 'tap', selector: '#notes-next-btn' }
          },
          {
            id: 'la-export',
            screenId: 'lawyer-export',
            title: 'Certified Export',
            sidePanelInstruction: \`### This is the last stage, review.

Review the certified PDF export and tap End Review.\`,
            instructionSteps: [
              {
                id: 'la-end-review',
                label: 'Press end when you\\'re done reviewing',
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
`);


const caTasksRegex = /id: 'ca-view-intake',[\s\S]*?(?=\s*\{[\s\S]*?id: 'ca-view-records')/m;
const caRecordsRegex = /id: 'ca-view-records',[\s\S]*?(?=\s*\{[\s\S]*?id: 'ca-chat-corpus')/m;
const caChatRegex = /id: 'ca-chat-corpus',[\s\S]*?(?=\s*\{[\s\S]*?id: 'ca-intake-notes')/m;
const caNotesRegex = /id: 'ca-intake-notes',[\s\S]*?(?=\s*\][\s\S]*?postSessionReflection)/m;

// 1. ca-view-intake
content = content.replace(caTasksRegex, `id: 'ca-view-intake',
            screenId: 'lawyer-booking-detail',
            title: 'Review Client Profile',
            sidePanelInstruction: \`### Review and Accept

Review the client profile. Tap **Accept Request** to formally accept the consultation and view evidence request options.\`,
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
`);

// 2. ca-view-records
content = content.replace(caRecordsRegex, `id: 'ca-view-records',
            screenId: 'lawyer-artifacts',
            title: 'Secure Client Data',
            sidePanelInstruction: \`### Request Data Access

Jane has shared encrypted Incident Logs and Somatic Journals. Request access to both logs to decrypt and review them.\`,
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
`);

// 3. ca-chat-corpus
content = content.replace(caChatRegex, `id: 'ca-chat-corpus',
            screenId: 'lawyer-chat',
            title: 'Chat with Corpus',
            sidePanelInstruction: \`### Ask the AI

Ask questions directly to the client's evidence corpus by tapping the suggestions.\`,
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
`);

// 4. ca-intake-notes
content = content.replace(caNotesRegex, `id: 'ca-intake-notes',
            screenId: 'lawyer-notes',
            title: 'Intake Notes',
            sidePanelInstruction: \`### Finalize Notes

Review the AI Synthesis, add your notes, and proceed to the certified export.\`,
            instructionSteps: [
              {
                id: 'ca-save-notes',
                label: 'Add and save note',
                selector: '#provider-note-save-btn',
                popover: {
                  title: 'Save Notes',
                  description: 'Type observations and save.',
                  side: 'top',
                  align: 'center'
                },
                completedWhen: { type: 'tap', selector: '#provider-note-save-btn' }
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
            allowedSelectors: ['#provider-note-input', '#provider-note-save-btn', '#notes-next-btn'],
            advanceOn: { type: 'tap', selector: '#notes-next-btn' }
          },
          {
            id: 'ca-export',
            screenId: 'lawyer-export',
            title: 'Certified Export',
            sidePanelInstruction: \`### This is the last stage, review.

Review the certified PDF export and tap End Review.\`,
            instructionSteps: [
              {
                id: 'ca-end-review',
                label: 'Press end when you\\'re done reviewing',
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
`);

fs.writeFileSync(p, content);

