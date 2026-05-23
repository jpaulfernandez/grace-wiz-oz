# Guided Scenarios Refactor — Implementation Plan

> **Audience:** Coding agent working on the Grace Wizard-of-Oz prototype.
> **Source files:** `src/config/sidePanel.ts` (scenario step definitions), `src/lib/useGuidedTour.ts` (driver.js hook), `src/routes/Guided.tsx`, side-panel component that renders `sidePanelInstruction`, and the toast/redirect logic in the guided session view.
> **Goal:** Refactor the guided walkthrough so scenarios are first-class groups, microprompts gate progression at scenario boundaries, instruction steps drive a precise and self-correcting driver.js tour, the side panel renders proper markdown, and the participant is properly oriented to the Wizard-of-Oz study setup before scenarios begin.

---

## 1. Background & Problems Observed

### Problem 1 — No scenario grouping
The current `SCENARIO_STEPS` flattens **everything into one array per "order"** (`women-order-a` has 16 steps covering five distinct test scenarios). The side panel reads "Step 2 of 16" with no narrative anchor (Scenario A vs B vs E), and there's no clean unit to attach end-of-scenario reflection prompts to.

### Problem 2 — Microprompts get skipped
A microprompt is attached to a step, but `advanceOn: { type: 'tap', selector: '#companion-card' }` fires as soon as the user taps the prototype. The step advances **before the user answers**. The microprompt renders but never gates anything.

### Problem 3 — Stray / wrongly-placed microprompts
The Likert `"I feel comfortable using a digital tool to discuss sensitive concerns"` is on `welcome-tour` — a step the user blows past in two seconds. It's a **baseline / pre-test** question. Other mid-scenario microprompts (`chat-restraint`, `summary-useful`) fire while the participant is still actively interacting — they belong at the reflective pause **after** the scenario completes.

### Problem 4 — Instruction steps don't drive an accurate tour
`instructionSteps` is an array of strings but each step config only has **one** `tourTarget`. driver.js can only point at the first thing. When a participant taps an instruction row, there's no per-instruction selector to highlight.

### Problem 5 — Side panel markdown rendering
Newlines inside the `sidePanelInstruction` template literal (`\n\n`) don't produce visual breaks. Lists ("1. Tap… 2. Tap… 3. Follow…") collapse into one paragraph. Either the renderer isn't real markdown or it's being squashed by Tailwind `whitespace-normal`.

### Problem 6 — "Please complete the highlighted task" toast fires on already-completed steps
Two root causes:
1. **Wrong UX primitive.** Toast scolds the participant for tapping off-path. For a WoZ study this contaminates the think-aloud — they become self-conscious. The right response to an off-path tap is **redirect**, not error.
2. **Completion state mismatch.** The checklist UI strikes through rows (UI state) but the gate checking "are instructions complete" reads from a different source than the auto-complete logic writes to. So even when a row visually shows done, the gate still thinks it's incomplete and re-fires.

### Problem 7 — driver.js popover appears in stale position pointing at gone-element
When the DOM changes inside the phone frame (chat message sent → suggestion chip removed → new AI suggestion paths render), driver.js's cached bounding rect for the highlighted element goes stale. The popover keeps showing at the old coordinates, or worse, points at an element that no longer exists. In one observed case, all three instructions were already complete but the popover still showed "Preloaded Prompt" floating in the middle of the frame.

### Problem 8 — Popover overlaps the prototype
Popovers should sit **outside** the phone frame with a clear pointer arrow back at the highlighted element, not inside the frame obscuring what the participant is supposed to look at.

### Problem 9 — No orientation to the WoZ study setup
`welcome-tour` jumps straight to "tap the Companion card" without explaining: what the phone frame is, what the side panel is, where to get help, that reflection moments will happen. For a Wizard-of-Oz session this orientation is non-optional — the participant needs to know the rules of the room before scenarios begin.

---

## 2. Target Architecture

Move from flat `GuidedStepConfig[]` to a **nested structure**: a session is a sequence of **Scenarios**, each Scenario is a sequence of **Steps**, and each Scenario has its own end-of-scenario **reflection block**.

```
Session (e.g., "women-order-a")
├── Scenario 0 — Orientation (5 steps, last one is the baseline reflection)
├── Scenario A — Green Jokes
│   ├── Steps...
│   └── End-of-scenario reflection
├── Scenario B — Work Anxiety
│   ├── Steps...
│   └── End-of-scenario reflection
├── ...
└── Post-session reflection (cohort-level closing Likerts)
```

The pre-session baseline Likert lives inside **Scenario 0's last step** rather than as a separate floating block — that way the participant learns the reflection UI by using it, and there's no naked "answer this before we start" moment with no context.

### 2.1 New TypeScript shape

```ts
// src/config/scenarioTypes.ts (new file, or top of sidePanel.ts)

export type MicroPromptType = 'likert-5' | 'text-short' | 'single-choice'

export interface MicroPromptConfig {
  id: string
  type: MicroPromptType
  question: string
  options?: string[]              // for single-choice
  required?: boolean              // default true; gates progression
}

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface InstructionStep {
  id: string                      // stable id for analytics + click handling
  label: string                   // human-readable, e.g. "Tap the 'Suggested prompt' chip"
  selector?: string               // CSS selector to highlight via driver.js
  popover?: {
    title: string
    description: string
    side?: PopoverSide            // default 'right'
    align?: PopoverAlign          // default 'start'
  }
  waitForElement?: boolean        // default true if selector present
  completedWhen?: {               // auto-complete rule when participant interacts
    type: 'tap' | 'input' | 'route'
    selector?: string
    screenId?: string
  }
}

export interface AdvanceRule {
  type: 'tap' | 'chat_send' | 'save' | 'manual_next' | 'all_instructions_done'
  selector?: string
  screenId?: string
}

export interface GuidedStepConfig {
  id: string
  screenId: string
  title: string
  sidePanelInstruction: string    // markdown
  instructionSteps?: InstructionStep[]
  allowedSelectors?: string[]     // taps outside this list trigger redirect (see §4)
  advanceOn: AdvanceRule
  idleTimeoutMs?: number
  prototypeInteractive?: boolean  // default true; false for orientation/reflection steps
}

export interface ScenarioReflection {
  id: string                      // e.g. "reflection-scenario-a"
  title: string                   // e.g. "Quick reflection — Scenario A"
  description?: string            // optional preamble markdown
  microPrompts: MicroPromptConfig[]
}

export interface ScenarioConfig {
  id: string                      // e.g. "scenario-a-green-jokes"
  label: string                   // e.g. "Scenario A — Green jokes"
  description?: string            // optional intro markdown
  steps: GuidedStepConfig[]
  reflection?: ScenarioReflection // shown after final step, gates next scenario
}

export interface SessionConfig {
  id: string                      // e.g. "women-order-a"
  label: string                   // e.g. "Women Guided — Order A"
  scenarios: ScenarioConfig[]     // includes Scenario 0 (Orientation) as first entry
  postSessionReflection?: ScenarioReflection
}

export const SESSIONS: Record<string, SessionConfig> = { /* ... */ }
```

### 2.2 Why this shape

- **Scenarios are addressable.** Side-panel header now reads `Scenario A — Green Jokes · Step 1 of 3` instead of `Step 2 of 16`.
- **Reflections are explicit blocks**, not bolted onto a random step.
- **Per-instruction tour targets** unblock the driver.js issue.
- **`prototypeInteractive: false`** on orientation/reflection steps gives us a single flag for the dim-and-lock behavior instead of branching on `mode`.

---

## 3. UX Behavior Spec

### 3.1 Side panel modes

| Mode | When | Prototype state | Primary CTA |
|---|---|---|---|
| `step` | Inside a scenario step | Interactive (or locked if `prototypeInteractive: false`) | Auto-advances on `advanceOn` rule |
| `reflection` | Between scenarios / pre-session / post-session | **Dimmed + pointer-events: none** | "Continue" — disabled until all required microprompts answered |
| `scenario-intro` | First mount of a new scenario (optional) | Dimmed | "Start Scenario X" |

> Locking the phone frame during reflections is the single most important UX fix. Use `opacity-50 pointer-events-none` plus a centered overlay caption: "Take a moment — answer the questions in the side panel."

### 3.2 Markdown rendering

Use a real markdown renderer in the side panel. Required:

- `react-markdown` + `remark-gfm` (run `npm i react-markdown remark-gfm`).
- Wrap in a `<Markdown source={...} />` component at `src/components/ui/Markdown.tsx`.
- Apply Tailwind `prose prose-sm` (or design-system equivalent) so paragraphs, lists, bold, and headings render correctly.
- Sanitize. No raw HTML from config.

```tsx
// src/components/ui/Markdown.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-serif">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  )
}
```

Replace every `<div>{sidePanelInstruction}</div>` with `<Markdown source={sidePanelInstruction} />`.

### 3.3 Instruction checklist behavior

For each step with `instructionSteps`:

1. Render each instruction as a row with checkbox + `label`.
2. **Tapping a row** (anywhere except the checkbox) → call `highlightInstruction(instructionStep)` (see §5 for the hook).
3. **Auto-check** a row when its `completedWhen` rule fires.
4. Completion state lives in the Zustand store keyed by `${stepId}:${instructionId}` (see §4.2 for source-of-truth fix).
5. The step's "Next step" button:
   - Hidden during `advanceOn.type === 'tap' | 'save' | 'chat_send'` (auto-advances).
   - Visible and enabled for `manual_next`.
   - Visible but disabled for `all_instructions_done` until every required instruction is complete.

### 3.4 Reflection block behavior

1. Side panel switches to `reflection` mode.
2. Phone-frame area gets dimmed + lock overlay.
3. Microprompts render in order with a required indicator on required ones.
4. "Continue" disabled until every required microprompt has a value.
5. On continue, telemetry fires `reflection_completed { sessionId, scenarioId | 'pre-session' | 'post-session', answers }`, and the session advances.

---

## 4. Bug Fixes — Tap Redirect, Source of Truth, Stale Popovers

### 4.1 Replace toast with two-stage attention → redirect

**Remove the "Please complete the highlighted task" toast entirely.** Replace with a two-stage soft redirect:

**Stage 1 (first off-path tap):** Pulse the currently-highlighted instruction row in the side panel to draw attention. No popover change, no toast, no prototype interruption.

**Stage 2 (second off-path tap within ~3 seconds):** Re-trigger driver.js to point at the next-not-yet-completed instruction's selector. This is the actual redirect.

After Stage 2 fires, reset the counter so the next off-path tap goes back to Stage 1.

```ts
// Pseudo-code for the off-path tap handler
// Lives in the click-capture logic for the phone frame, or in useGuidedTour.

let offPathTapCount = 0
let offPathTapResetTimer: number | null = null

function handlePhoneFrameClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const currentStep = getCurrentStep()
  if (!currentStep) return

  const isAllowed = (currentStep.allowedSelectors ?? [])
    .some(sel => target.closest(sel))
  const isCompleting = (currentStep.instructionSteps ?? [])
    .some(ins => ins.completedWhen?.selector && target.closest(ins.completedWhen.selector))

  if (isAllowed || isCompleting) {
    offPathTapCount = 0
    return // on-path tap, no redirect needed
  }

  offPathTapCount += 1

  if (offPathTapCount === 1) {
    // Stage 1: pulse the side-panel row
    pulseCurrentInstructionRow()
  } else {
    // Stage 2: re-trigger driver.js
    const next = getNextIncompleteInstruction(currentStep)
    if (next?.selector) highlightInstruction(next)
    offPathTapCount = 0
  }

  // Reset stage counter after 3s of no further off-path taps
  if (offPathTapResetTimer) clearTimeout(offPathTapResetTimer)
  offPathTapResetTimer = window.setTimeout(() => { offPathTapCount = 0 }, 3000)
}
```

The `pulseCurrentInstructionRow()` function adds a brief Tailwind animation class (`animate-pulse` for ~600ms, or a custom `ring-2 ring-purple-400` fade) to the row corresponding to the next incomplete instruction.

### 4.2 Single source of truth for instruction completion

The root cause of "the checklist looks done but the gate still says incomplete" is two pieces of state. Fix:

- **One store slice** for `completedInstructions: Record<string, Set<string>>` keyed by `stepId`.
- **All writes** go through `markInstructionComplete(stepId, instructionId)`.
- **All reads** (checklist UI, gate logic, "what should driver.js highlight next") go through `isInstructionComplete(stepId, instructionId)` and `getNextIncompleteInstruction(step)`.
- Auto-complete is triggered by a global click-capture handler. On every click inside the phone frame, iterate the current step's `instructionSteps`. For each one whose `completedWhen.selector` matches the click target (via `target.closest(selector)`), mark it complete in the store.

```ts
// src/lib/store.ts — additions

interface GuidedSessionSlice {
  // ...existing...
  completedInstructions: Record<string, string[]>  // stepId -> instructionIds
  markInstructionComplete: (stepId: string, instructionId: string) => void
  isInstructionComplete: (stepId: string, instructionId: string) => boolean
}

// selector — derives "next incomplete" purely from store state
function getNextIncompleteInstruction(step: GuidedStepConfig) {
  const completed = useStore.getState().completedInstructions[step.id] ?? []
  return step.instructionSteps?.find(ins => !completed.includes(ins.id))
}
```

The checklist row's struck-through state and the gate's `canAdvance` both call `isInstructionComplete`. They cannot disagree.

### 4.3 Stale popover + DOM-change handling

driver.js caches the highlighted element's bounding rect at `highlight()` time. When the prototype DOM changes (chat message sent, suggestion chips re-render, route change), the popover keeps pointing at coordinates that no longer correspond to any element. Fix:

**Watch for DOM changes inside the phone frame and re-evaluate the highlight.**

```ts
// In useGuidedTour or a new useInstructionHighlight hook

useEffect(() => {
  const phoneFrame = document.querySelector('#phone-frame-root')
  if (!phoneFrame) return

  const observer = new MutationObserver(() => {
    const step = getCurrentStep()
    if (!step) return

    const next = getNextIncompleteInstruction(step)

    // If nothing left to highlight, dismiss any active popover
    if (!next || !next.selector) {
      driverInstance?.destroy()
      return
    }

    // If the currently-highlighted element is gone or moved, re-highlight
    const el = document.querySelector(next.selector) as HTMLElement | null
    if (!el || !isElementVisible(el)) {
      driverInstance?.destroy()
      return
    }

    // Only re-trigger if the highlight target changed
    if (currentlyHighlightedSelector !== next.selector) {
      highlightInstruction(next)
    }
  })

  observer.observe(phoneFrame, { childList: true, subtree: true, attributes: true })
  return () => observer.disconnect()
}, [currentStepId])

function isElementVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}
```

**Before every `driver.highlight()` call**, also guard with `isElementVisible()` so we never show a popover anchored to a phantom element.

### 4.4 Popover placement — outside the phone frame, with arrow

driver.js supports `side` and `align` natively. Default convention:

| Element location in phone frame | `side` | `align` | Rationale |
|---|---|---|---|
| Inside the body (chat area, journal editor) | `right` | `start` | Sits outside the phone, arrow points left at the element |
| Top app-bar (Save button, page title) | `bottom` | `center` | Pointer arrow points up at the bar |
| Bottom nav (Companion / Journal / Incident Log tabs) | `top` | `center` | Pointer arrow points down at the tab |
| Far-right edge (Send button) | `right` | `center` | Still outside the frame; offset handles overlap |

Make `side` and `align` configurable per `InstructionStep.popover` with `'right' / 'start'` as defaults. driver.js handles the arrow automatically — no extra config needed.

```ts
// Highlight call signature
function highlightInstruction(ins: InstructionStep) {
  if (!ins.selector) return
  const el = document.querySelector(ins.selector) as HTMLElement | null
  if (!el || !isElementVisible(el)) return

  driverInstance.highlight({
    element: ins.selector,
    popover: {
      title: ins.popover?.title ?? '',
      description: ins.popover?.description ?? '',
      side: ins.popover?.side ?? 'right',
      align: ins.popover?.align ?? 'start',
      showButtons: [],   // popover is informational; no Next/Done
    },
  })
  currentlyHighlightedSelector = ins.selector
  trackEvent('instruction_highlighted', { stepId: getCurrentStep().id, instructionId: ins.id })
}
```

Add ~24px margin on the popover so it sits clearly beyond the phone frame's shadow:

```css
/* Override driver.js popover positioning */
.driver-popover { margin: 24px; }
```

### 4.5 Highlight lifecycle summary

1. **On step mount:** if `instructionSteps` exists, find the first incomplete one and highlight it.
2. **On instruction checklist row tap:** highlight that specific instruction.
3. **On auto-complete (matching tap in prototype):** mark complete, find next incomplete, highlight it. If none remain, dismiss.
4. **On DOM mutation inside phone frame:** re-evaluate. If current target is gone or different from "next incomplete", update or dismiss.
5. **On step unmount:** dismiss any active popover.

---

## 5. Content Migration — Where Each Microprompt Goes

| Existing microprompt | Currently attached to | New home | Rationale |
|---|---|---|---|
| `welcome-feeling` — likert-5 — comfort with digital tool | `welcome-tour` | **Scenario 0 (Orientation), final step** | Baseline measurement, learns the reflection UI by using it |
| `chat-restraint` — single-choice — Companion restraint feel | `scenario-a-chat` | **End-of-Scenario-A reflection** | Currently fires mid-chat; belongs in the natural reflective pause |
| `summary-useful` — likert-5 — carry-over summary | `journal-handoff` | **End-of-Scenario-B reflection** | Same — fires during the save action |
| `combined-welcome-feeling`, `combined-chat-restraint`, `combined-summary-useful` | Various combined-* steps | Pre-session / end-of-scenario equivalents in `women-combined` | Same logic |
| `combined-no-ai-comfort` — Journaling without AI guidance | `combined-blank-journal` | **End-of-Part-2 reflection** | Compares the two halves; belongs at end of Part 2 |

**New microprompts to add** (per validation plan, currently missing):

Women's cohort post-session reflection (Test Card 1.1, primary metric):
- `would-write-here` — likert-5 — "I would write what is happening to me in this app." **(required)**
- `trust-words` — likert-5 — "I trust this app with my words."
- `would-tell-another-woman` — likert-5 — "I would tell another woman about this app."

Lawyer post-session (Test Card 3.1):
- `legal-synthesis-useful` — likert-5
- `hash-defensible` — likert-5
- `accept-shared-links-lawyer` — likert-5

Clinician post-session (Test Card 2.1):
- `clinical-synthesis-useful` — likert-5
- `recommend-to-patient` — likert-5
- `accept-shared-links-clinician` — likert-5

> SUS lives outside this config — separate route (`PostSurvey.tsx` / `EndSurvey.tsx`). Don't conflate.

---

## 6. Scenario Grouping — Concrete Plan for `women-order-a`

```
women-order-a
├── Scenario 0 — Orientation (5 steps, last step IS the baseline reflection)
├── Scenario A — Green Jokes
│   ├── scenario-a-home (was welcome-tour, stripped of microprompt)
│   ├── scenario-a-chat
│   └── Reflection: chat-restraint
├── Scenario B — Work Anxiety
│   ├── scenario-b-chat
│   ├── journal-handoff
│   ├── scenario-c-breath (renamed scenario-b-breath)
│   └── Reflection: summary-useful
├── Scenario C — Pattern Surfacing
│   ├── scenario-c-offers
│   └── scenario-c-annotations
│   └── (no reflection — short)
├── Scenario D — Prompted Journaling
│   ├── scenario-d-home → scenario-d-modes → scenario-d-editor → scenario-d-breath → scenario-d-offers
├── Scenario E — Incident Logging
│   ├── scenario-e-home → scenario-e-log → scenario-e-hash → scenario-e-offers
└── Post-session reflection
    └── would-write-here, trust-words, would-tell-another-woman
```

Apply same logic to `women-order-b`, `women-combined`, `lawyer-standard`, `clinician-standard`.

---

## 7. Instruction Steps — Migration Pattern

Every existing `instructionSteps: string[]` becomes `InstructionStep[]`. Drop the step's `tourTarget`. Example for `scenario-a-chat`:

**Before:**
```ts
instructionSteps: [
  "Tap the 'Suggested prompt' chip at the bottom",
  "Tap the Send button to send the message",
  "Select the 'Let go for now' option at the end"
],
tourTarget: { selector: '#chat-suggestion-chip', popover: { ... } },
advanceOn: { type: 'tap', selector: '#let-go-btn' }
```

**After:**
```ts
instructionSteps: [
  {
    id: 'tap-suggestion-chip',
    label: "Tap the 'Suggested prompt' chip at the bottom",
    selector: '#chat-suggestion-chip',
    popover: {
      title: 'Preloaded prompt',
      description: 'Tap this chip to fill the input field with a sample message.',
      side: 'top', align: 'center',
    },
    completedWhen: { type: 'tap', selector: '#chat-suggestion-chip' },
  },
  {
    id: 'tap-send',
    label: 'Tap the Send button to send the message',
    selector: '#send-chat-btn',
    popover: {
      title: 'Send',
      description: 'Send the message to the Companion.',
      side: 'left', align: 'center',
    },
    completedWhen: { type: 'tap', selector: '#send-chat-btn' },
  },
  {
    id: 'select-let-go',
    label: "Select the 'Let go for now' option at the end",
    selector: '#let-go-btn',
    popover: {
      title: 'Ephemeral choice',
      description: 'Choose to let this one go — Grace respects that.',
      side: 'top', align: 'center',
    },
    completedWhen: { type: 'tap', selector: '#let-go-btn' },
  },
],
allowedSelectors: ['#chat-suggestion-chip', '#send-chat-btn', '#chat-input', '#let-go-btn'],
advanceOn: { type: 'tap', selector: '#let-go-btn' },
```

---

## 8. Implementation Tasks (Ordered)

### Task 1 — Define new types
**File:** `src/config/scenarioTypes.ts` (new)
- [ ] Add interfaces from §2.1.
- [ ] Re-export from `src/config/sidePanel.ts` for back-compat.
- [ ] Remove `tourTarget` and `microPrompts` from `GuidedStepConfig`.

### Task 2 — Add `Markdown` component
**File:** `src/components/ui/Markdown.tsx`
- [ ] `npm i react-markdown remark-gfm`.
- [ ] Component code from §3.2.
- [ ] Replace every direct `{sidePanelInstruction}` render with `<Markdown source={...} />`.

### Task 3 — Session state machine
**File:** `src/lib/store.ts` (or new `src/lib/guidedSession.ts`)
- [ ] Add cursor state: `{ sessionId, scenarioIndex, stepIndex, mode: 'step' | 'reflection' | 'scenario-intro' }`.
- [ ] Add `reflectionAnswers: Record<string, string | number>`.
- [ ] Add `completedInstructions: Record<string, string[]>` per §4.2.
- [ ] Add actions: `advanceToNextStep`, `enterReflection`, `completeReflection`, `recordMicroPromptAnswer`, `markInstructionComplete`.
- [ ] Add selectors: `getCurrentStep`, `getCurrentReflection`, `canAdvance`, `getNextIncompleteInstruction`, `isInstructionComplete`.
- [ ] All transitions call `trackEvent`.

### Task 4 — Side panel renderer split
**File:** `src/components/layout/SidePanel.tsx`
- [ ] Route by store `mode` to `<StepPanel>`, `<ReflectionPanel>`, `<ScenarioIntroPanel>`.
- [ ] Header shows `Scenario X — Label · Step N of M` when in step mode.
- [ ] `<StepPanel>`: Markdown instruction + task checklist + Prev/Next.
- [ ] `<ReflectionPanel>`: microprompts + disabled-until-valid Continue.
- [ ] `<ScenarioIntroPanel>`: scenario label + description + "Start" CTA.

### Task 5 — driver.js / instruction highlight hook
**File:** `src/lib/useGuidedTour.ts` (or new `src/lib/useInstructionHighlight.ts`)
- [ ] Implement `highlightInstruction(ins: InstructionStep)` per §4.4.
- [ ] On step mount: highlight `getNextIncompleteInstruction(step)`.
- [ ] Add `MutationObserver` per §4.3 watching `#phone-frame-root`.
- [ ] Add `isElementVisible` guard before every highlight.
- [ ] On checklist row tap: call `highlightInstruction(ins)`.
- [ ] `waitForElement: true` — poll up to 2s for selector before giving up.

### Task 6 — Off-path tap handler (replaces toast)
**File:** `src/routes/Guided.tsx` or new `src/lib/usePhoneFrameTapRouter.ts`
- [ ] **Delete the "Please complete the highlighted task" toast.**
- [ ] Implement two-stage redirect per §4.1.
- [ ] Pulse animation: add a `pulse` Tailwind class to the matching checklist row for ~600ms.
- [ ] Stage 2 re-triggers driver.js via `highlightInstruction`.
- [ ] 3-second reset window for the stage counter.

### Task 7 — Auto-complete instruction rows
**File:** wherever the global click-capture for phone frame lives
- [ ] On every click inside `#phone-frame-root`, iterate current step's `instructionSteps`.
- [ ] If any `completedWhen.selector` matches `target.closest(...)`, call `markInstructionComplete`.
- [ ] Fire `trackEvent('instruction_auto_completed', { stepId, instructionId })`.

### Task 8 — Prototype lock during reflection / non-interactive steps
**File:** `src/routes/Guided.tsx` (phone frame container)
- [ ] If `mode === 'reflection'` OR `currentStep.prototypeInteractive === false`: apply `opacity-50 pointer-events-none` to phone frame.
- [ ] Overlay centered caption: `"Take a moment — answer the questions in the side panel."` (reflection) or `"Following along? Read the side panel."` (orientation).
- [ ] When entering reflection mode: scroll side panel to top, focus first microprompt for a11y.

### Task 9 — Content migration
**File:** `src/config/sidePanel.ts`
- [ ] Convert `women-order-a` to new `SessionConfig` shape per §6.
- [ ] Add Scenario 0 (Orientation) using copy from §10.
- [ ] Move microprompts per §5.
- [ ] Convert every `instructionSteps: string[]` to `InstructionStep[]` with selector + popover (`side`/`align` per §4.4 convention).
- [ ] Repeat for `women-order-b`, `women-combined`, `lawyer-standard`, `clinician-standard`.

### Task 10 — Popover styling
**File:** `src/styles/driver.css` (or wherever driver.js styles live)
- [ ] Add `.driver-popover { margin: 24px; }` for clearance from phone frame.
- [ ] Verify arrow styling matches the design system (purple accent).
- [ ] Add `pulse` keyframes if not already present.

### Task 11 — Telemetry events
**File:** `src/lib/telemetry.ts`
- [ ] `scenario_started { sessionId, scenarioId }`
- [ ] `scenario_completed { sessionId, scenarioId, durationMs }`
- [ ] `reflection_completed { sessionId, scenarioId | 'post-session', answers }`
- [ ] `instruction_highlighted { stepId, instructionId, trigger: 'mount' | 'checklist_tap' | 'redirect' }`
- [ ] `instruction_auto_completed { stepId, instructionId }`
- [ ] `microprompt_answered { microPromptId, value }`
- [ ] `off_path_tap { stepId, stage: 1 | 2 }`

### Task 12 — Delete dead code
- [ ] Remove `tourTarget` field references.
- [ ] Remove old toast logic and its strings.
- [ ] Remove old `microPrompts` field from step rendering.
- [ ] Delete `@deprecated SCENARIO_STEPS` once consumers are migrated.

### Task 13 — QA checklist
- [ ] Scenario 0 plays as 5 steps, last step is the baseline reflection. Prototype is non-interactive (visible, dimmed) for all 5.
- [ ] After "Let go for now" tap in Scenario A, side panel switches to reflection. Phone dims. Continue is disabled until `chat-restraint` answered.
- [ ] Tapping any checklist row highlights the matching element with the popover **outside** the phone frame.
- [ ] Markdown renders paragraphs, ordered lists, bold.
- [ ] Side-panel header reads `Scenario A — Green jokes · Step 1 of 2`.
- [ ] No toast fires on off-path tap. First off-path tap pulses the row. Second off-path tap within 3s re-triggers driver.js.
- [ ] Send a message in chat → DOM changes → popover moves or dismisses appropriately. No stale popovers.
- [ ] Prev/Next preserves `completedInstructions`.
- [ ] Telemetry events fire as specified.

---

## 9. Out of Scope

- SUS questionnaire (lives in `PostSurvey.tsx` / `EndSurvey.tsx`).
- Cohort-specific session-id routing (parent route handles).
- Live AI Companion (researcher continues to play Wizard).
- Real cryptographic hash anchoring (visual stays canned).
- Admin tools for editing scenarios in-browser.

---

## 10. Content Reference — Copy, Labels, Microprompt Text

This section is the **canonical text** the coding agent should paste into the config. All copy here has been written deliberately for the WoZ study and the validation plan. Do not paraphrase.

### 10.1 Scenario 0 — Orientation

Scenario-level metadata:
```ts
{
  id: 'scenario-0-orientation',
  label: 'Getting oriented',
  description: undefined,   // no intro screen; first step IS the welcome
}
```

#### Step 0.1 — The prototype

```ts
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
      // no completedWhen — informational
    },
  ],
  allowedSelectors: [],   // nothing tappable yet
  advanceOn: { type: 'manual_next' },
}
```

#### Step 0.2 — The side panel

```ts
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
  advanceOn: { type: 'manual_next' },
}
```

#### Step 0.3 — Help and study info

```ts
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
      selector: '#help-button',     // confirm the actual id in your chrome component
      popover: {
        title: 'Need help?',
        description: 'Tap here any time during the session if you get lost or have a question.',
        side: 'bottom',
        align: 'start',
      },
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
      },
    },
  ],
  allowedSelectors: ['#help-button', '#study-info-button'],
  advanceOn: { type: 'manual_next' },
}
```

#### Step 0.4 — How reflection moments work

```ts
{
  id: 'orientation-reflections',
  screenId: 'guided-home',
  title: 'Reflection moments',
  prototypeInteractive: false,
  sidePanelInstruction: `### Between scenarios, we'll pause

Every now and then, the prototype will pause and a few short questions will appear here in the panel. They look something like this:

> **Sample question** *(not recorded)*
> *I feel comfortable using a digital tool to discuss sensitive concerns.*
> ◯ Strongly disagree   ◯ Disagree   ◯ Neutral   ◯ Agree   ◯ Strongly agree

Please answer honestly. There are no wrong answers, and these short reflections are how we understand whether Grace is working the way it should.

Tap **Next step** when you're ready for your first reflection.`,
  instructionSteps: [],
  allowedSelectors: [],
  advanceOn: { type: 'manual_next' },
}
```

> Note to the agent: render the blockquote in the markdown as a real visual preview of the Likert scale UI — wrap it in a `<SampleMicroPrompt />` component if you want it to look exactly like the real thing (disabled inputs, "Example only" caption). Either approach is fine; the markdown above is a working fallback if the styled preview isn't built yet.

#### Step 0.5 — Baseline reflection (this is a reflection block, not a step)

This is the **first reflection block**, not a step. It uses the `ScenarioReflection` shape, attached to Scenario 0:

```ts
reflection: {
  id: 'reflection-orientation',
  title: 'Before we start',
  description: 'One quick question before the first scenario.',
  microPrompts: [
    {
      id: 'welcome-feeling',
      type: 'likert-5',
      question: 'I feel comfortable using a digital tool to discuss sensitive concerns.',
      required: true,
    },
  ],
},
```

After this reflection completes, the session advances to Scenario A.

### 10.2 Refined instructionStep copy for existing scenarios

Improved labels and popover copy for the most common instruction steps. Use these verbatim:

**Suggested prompt chip:**
- label: `Tap the suggested prompt to fill in the input`
- popover title: `Preloaded prompt`
- popover description: `Tap this chip to drop a sample message into the input field. You won't have to type anything.`
- side: `top`, align: `center`

**Send button:**
- label: `Send the message`
- popover title: `Send`
- popover description: `Send the message to the Companion. The researcher will reply as the Companion would.`
- side: `left`, align: `center`

**"Let go for now" chip:**
- label: `Choose "Let go for now"`
- popover title: `Ephemeral choice`
- popover description: `Choose to let this one go without logging it. Grace respects that you may not want a record.`
- side: `top`, align: `center`

**"Continue to journal" chip:**
- label: `Choose "Continue to journal"`
- popover title: `Carry it forward`
- popover description: `Move the conversation into your journal so you can write more about it.`
- side: `top`, align: `center`

**Save entry button (journal):**
- label: `Save your entry`
- popover title: `Save`
- popover description: `Save what you've written. Grace doesn't celebrate or congratulate — it just saves.`
- side: `bottom`, align: `end`

**"Help me notice patterns" button:**
- label: `Tap "Help me notice patterns"`
- popover title: `Pattern surfacing`
- popover description: `Let Grace highlight repeated themes across your entries.`
- side: `right`, align: `start`

**"Just save it" button:**
- label: `Tap "Just save it"`
- popover title: `Save quietly`
- popover description: `Save your entry without any AI follow-up.`
- side: `right`, align: `start`

**Highlighted annotation phrases:**
- label: `Tap a highlighted phrase to see what Grace noticed`
- popover title: `AI note`
- popover description: `Each highlight is something Grace flagged across your entries. Tap to read.`
- side: `right`, align: `start`

**Close annotations:**
- label: `Tap "Close" when you've reviewed the highlights`
- popover title: `Close`
- popover description: `Return to your journal.`
- side: `bottom`, align: `end`

**Reflective Journal card:**
- label: `Tap the Reflective Journal card`
- popover title: `Reflective Journal`
- popover description: `Open your journal to write freely or use a guided prompt.`
- side: `right`, align: `center`

**Guided mode button:**
- label: `Tap "Guided"`
- popover title: `Guided mode`
- popover description: `Use Pennebaker-style prompts to structure your reflection.`
- side: `top`, align: `center`

**Companion card:**
- label: `Tap the Companion card`
- popover title: `Companion`
- popover description: `Open a chat with Grace's Companion — your sounding board.`
- side: `right`, align: `center`

**Incident Log tab:**
- label: `Tap "Incident Log" in the bottom nav`
- popover title: `Incident Log`
- popover description: `Document an incident with structured fields for date, place, and people involved.`
- side: `top`, align: `center`

**Save incident button:**
- label: `Tap "Save incident"`
- popover title: `Save`
- popover description: `Save your incident with a secure timestamp.`
- side: `bottom`, align: `center`

**Hash receipt "Next" button:**
- label: `Tap "Next" to continue`
- popover title: `Continue`
- popover description: `Move on to see what options you have next.`
- side: `bottom`, align: `end`

**"Do nothing for now" button:**
- label: `Tap "Do nothing for now"`
- popover title: `Pause`
- popover description: `Save the record without taking any further action right now.`
- side: `right`, align: `start`

### 10.3 Reflection microprompts — final wording

**End of Scenario A** (`reflection-scenario-a`):
- title: `A quick reflection`
- microprompts:
  - id: `chat-restraint`, type: `single-choice`, question: `Did the Companion's restraint feel supportive or frustrating?`, options: `['Supportive', 'Neutral', 'Frustrating']`, required: true

**End of Scenario B** (`reflection-scenario-b`):
- title: `A quick reflection`
- microprompts:
  - id: `summary-useful`, type: `likert-5`, question: `The carry-over summary made it easier to move from chat into the journal.`, required: true

**End of Scenario D** (combined, `reflection-no-ai-comfort`):
- title: `Comparing the two modes`
- microprompts:
  - id: `combined-no-ai-comfort`, type: `likert-5`, question: `Journaling without the AI companion felt just as comfortable.`, required: true

**Post-session — Women's cohort** (`reflection-post-session-women`):
- title: `Closing reflection`
- description: `Three short questions before we finish.`
- microprompts:
  - `would-write-here`, likert-5, `I would write what is happening to me in this app.`, required
  - `trust-words`, likert-5, `I trust this app with my words.`, required
  - `would-tell-another-woman`, likert-5, `I would tell another woman about this app.`, required

**Post-session — Lawyer** (`reflection-post-session-lawyer`):
- title: `Closing reflection`
- microprompts:
  - `legal-synthesis-useful`, likert-5, `The legal lens synthesis would be useful for case preparation.`, required
  - `hash-defensible`, likert-5, `The hash-receipt and timestamp model, if implemented as described, would be defensible under cross-examination.`, required
  - `accept-shared-links-lawyer`, likert-5, `I would accept shared Grace links from clients as a receiving provider on this platform.`, required

**Post-session — Clinician** (`reflection-post-session-clinician`):
- title: `Closing reflection`
- microprompts:
  - `clinical-synthesis-useful`, likert-5, `The clinical lens synthesis would be useful for session preparation.`, required
  - `recommend-to-patient`, likert-5, `I would recommend a patient use this between sessions.`, required
  - `accept-shared-links-clinician`, likert-5, `I would accept shared links from patients as a receiving provider on this platform.`, required

### 10.4 UI strings — side panel chrome

| Use | String |
|---|---|
| Header in step mode | `{Scenario.label} · Step {N} of {M}` |
| Header in reflection mode | `{Reflection.title}` |
| Header in scenario-intro mode | `{Scenario.label}` |
| Prototype overlay caption during reflection | `Take a moment — answer the questions in the side panel.` |
| Prototype overlay caption during non-interactive steps (orientation) | `Read along — we'll tell you when to tap.` |
| Continue button (reflection) | `Continue` (disabled state tooltip: `Answer the required questions to continue`) |
| Next step button (step mode) | `Next step` |
| Prev button | `Prev` |
| Start scenario button (intro mode) | `Start scenario` |
| Required field indicator | `*` (after the question text, with `aria-label="required"`) |
| Sample microprompt label in Step 0.4 | `Example only — not recorded` |

### 10.5 Strings to remove

Search the codebase and delete:

- `"Please complete the highlighted task:"` (toast)
- `"GOT IT"` (toast dismiss button) — if used only by this toast
- Any usage of the old `tourTarget.popover.title` / `description` literals that are duplicated in the new `InstructionStep.popover` (search for `tourTarget:` occurrences and confirm migration before deletion)

---

## 11. Cross-Reference to Validation Plan

This refactor directly serves three success criteria from the four-week validation plan:

- **Track 1 (User Safety)** — post-session reflection captures the three calibrated Likerts driving GO/HOLD/REDESIGN. They must be captured cleanly, after the participant has seen the full flow, not mid-interaction.
- **Track 2 (Clinician)** — post-session reflection holds the utility + onboarding Likerts, scored separately per the validation plan's two-criterion design.
- **Track 3 (Lawyer)** — same pattern. The hash-defensibility Likert in particular needs to come **after** the participant has been shown the hash-receipt screen, which the new scenario grouping enforces structurally.

End-of-scenario microprompts (chat-restraint, summary-useful, no-ai-comfort) feed qualitative themes coding, not primary success criteria, but they need the same dim-and-pause behavior.

---

## 12. Done Definition

1. Every session in `SESSIONS` uses the new nested shape with scenario grouping.
2. No microprompts render mid-step. They only render in dedicated reflection blocks or in Scenario 0's baseline reflection.
3. The prototype is interaction-locked during reflections and non-interactive steps.
4. Each instruction-checklist row, when tapped, calls driver.js with its own selector and popover.
5. Side-panel markdown renders paragraphs, lists, and inline formatting correctly.
6. Side-panel header shows scenario context.
7. The toast is gone. Off-path taps pulse the side panel first, then re-trigger driver.js on the second off-path tap.
8. Popovers sit outside the phone frame with arrows pointing back at the highlighted element.
9. DOM changes inside the phone frame don't leave stale popovers behind.
10. All QA checklist items in Task 13 pass.
11. `@deprecated SCENARIO_STEPS` is removed.