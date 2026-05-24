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
  mobileSidePanelInstruction?: string // optional mobile-specific markdown
  instructionSteps?: InstructionStep[]
  allowedSelectors?: string[]     // taps outside this list trigger redirect
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
