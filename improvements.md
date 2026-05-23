# Grace Prototype — Improvements Plan

## Overview

This document details all planned improvements across 8 feature areas plus quality-of-life fixes. Each section identifies the **exact files** the executor must touch, so no codebase scanning is required.

---

## Feature 1 — Post-Consent Prototype Walkthrough

**Goal:** After the participant accepts consent, show a brief onboarding tour that (1) highlights the phone/app screen, (2) points to the right sidebar as the guide, (3) shows the micro-question area, and (4) explains Prev/Next navigation — before they can proceed.

### What to build
- A new multi-step **onboarding overlay** rendered on first entry to `/guided`, gated until all walkthrough slides are seen.
- 4 slides shown as a modal over the full layout (not Driver.js — a custom simple stepper):
  1. **"This is the app"** — spotlight/dim the phone chrome area. Text outside: "This is the prototype you'll be testing. Interact with it naturally."
  2. **"Your guide is on the right"** — arrow pointing to the `SidePanel`. Text: "The right panel shows step-by-step instructions. Read them before acting."
  3. **"Answer the micro-questions"** — arrow to the micro-prompts section. Text: "Each step has short questions. Answer all of them before moving on."
  4. **"Navigate with Prev / Next"** — point to where Prev/Next buttons will live (outside phone). Text: "Use these buttons to go back and forth between steps." Also: "Lost? Click the **? Help** button to re-run the tour for this step."
- Prev/Next buttons on the overlay for navigation between slides.
- A "Got it, start testing" CTA on the final slide that dismisses the overlay and saves `onboardingComplete: true` to Zustand store.

### Files to modify
| File | Change |
|------|--------|
| `src/lib/store.ts` | Add `onboardingComplete: boolean` field and `setOnboardingComplete()` action |
| `src/routes/Guided.tsx` | Import and conditionally render `<OnboardingWalkthrough />` when `!onboardingComplete` |
| `src/components/layout/DesktopFrame.tsx` | Pass a ref/prop so spotlight can highlight the PhoneChrome area |

### New files to create
| File | Purpose |
|------|---------|
| `src/components/layout/OnboardingWalkthrough.tsx` | 4-slide stepper overlay with spotlight effect, prev/next, and "Got it" CTA |

---

## Feature 2 — Secondary Driver.js Tour (Help Button, Not Primary)

**Goal:** Driver.js walkthrough is demoted to "on-demand help." A persistent **? Help** button is always visible outside the phone container. Clicking it triggers Driver.js for the *current* scenario step only.

### What to build
- Move Driver.js invocation from auto-trigger to manual trigger via a `? Help` button.
- The button lives in the left gutter of `DesktopFrame` (outside phone, below center).
- `useGuidedTour` already has Driver.js logic — expose a `triggerHelp()` function that the button calls.
- On mobile (`MobileFrame`), place the help button in the top-right of the outer frame (not inside the phone).

### Files to modify
| File | Change |
|------|--------|
| `src/lib/useGuidedTour.ts` | Export a `triggerHelp()` function that re-runs Driver.js for `currentStep.tourTarget` only |
| `src/components/layout/DesktopFrame.tsx` | Add `? Help` button in left panel area (outside phone), calling `triggerHelp()` |
| `src/components/layout/MobileFrame.tsx` | Add `? Help` button in outer wrapper (not inside `<main>`), calling `triggerHelp()` |
| `src/routes/Guided.tsx` | Remove any auto-triggering of Driver.js on mount; ensure it is only called manually |

---

## Feature 3 — Guided Mode Button Locking + Wrong-Tap Nudge

**Goal:** During a guided step, only the button the scenario requires is tappable. All other interactive elements are dimmed and non-functional. Tapping a wrong element triggers a Driver.js nudge + message: *"Don't worry — you'll be able to explore everything freely after the guided session."*

### What to build
- Add an `allowedSelectors: string[]` field to `GuidedStepConfig`. List button IDs that are active for that step.
- In `Guided.tsx`, use a global click interceptor (`useEffect` with `document.addEventListener('click', ...)`) that:
  - Checks if clicked element matches `allowedSelectors`.
  - If not: cancels the event, fires `triggerHelp()`, and shows a toast.
- Apply a CSS class `guided-locked` to the phone wrapper during active steps — dims non-target elements.
- Specific case: Scenario A (`companion-chat`) — lock everything except `#let-go-btn`. The `Continue to journal` chip must be non-tappable.

### Files to modify
| File | Change |
|------|--------|
| `src/config/sidePanel.ts` | Add `allowedSelectors?: string[]` to `GuidedStepConfig` interface; populate for each step in `women-order-a` and `women-order-b` |
| `src/routes/Guided.tsx` | Add global click interceptor in `useEffect`; render `<GuidedLockToast />` for wrong-tap feedback |
| `src/lib/useGuidedTour.ts` | Export `triggerHelp()` (shared with Feature 2) |
| `src/components/chat/HandoffChips.tsx` | Accept a `disabledActions?: HandoffAction[]` prop to disable specific chips |

### New files to create
| File | Purpose |
|------|---------|
| `src/components/ui/GuidedLockToast.tsx` | Small bottom toast with "Don't worry…" message and dismiss button |

---

## Feature 4 — "Explain What I'm Seeing" Contextual Button

**Goal:** A button labeled **"Explain what I'm seeing"** appears outside the phone container. Tapping it opens a panel explaining every visible element on the current screen.

### What to build
- Floating button in the left gutter of `DesktopFrame` (below the `? Help` button).
- A `screenExplanations` config object mapping `screenId → { title, elements: [{ label, description }] }`.
- When tapped, opens a `<ExplainerDrawer />` slide-in panel from the left with formatted element explanations.
- Free-roam: maps to `activeTab` value instead of `screenId`.

### Files to modify
| File | Change |
|------|--------|
| `src/components/layout/DesktopFrame.tsx` | Add "Explain what I'm seeing" button in left gutter; pass `currentScreenId` prop |
| `src/routes/Guided.tsx` | Surface `currentStep.screenId` to the frame |
| `src/routes/FreeRoam.tsx` | Pass `activeTab` as the current screen context to the frame |

### New files to create
| File | Purpose |
|------|---------|
| `src/config/screenExplanations.ts` | Config: `screenId → { title, elements[] }` for all screens (guided + free-roam) |
| `src/components/layout/ExplainerDrawer.tsx` | Slide-in left panel showing element explanations with icons |

---

## Feature 5 — Driver.js Annotations Outside Phone Container

**Goal:** Driver.js popover tooltips must render in the outer desktop area (left gutter or above phone), not inside the phone bezel.

### What to build
- Override Driver.js popover position strategy in `useGuidedTour.ts`.
- Use `onPopoverRender` callback to reposition the popover DOM node into `#outer-left-gutter` div.
- Create a named `id="outer-left-gutter"` div in `DesktopFrame` as the annotation target area.
- On mobile: Driver.js popovers appear above the phone content area (outside `<main>`).

### Files to modify
| File | Change |
|------|--------|
| `src/lib/useGuidedTour.ts` | Update Driver.js step config: use `onPopoverRender` to move popover into `#outer-left-gutter`; or anchor to outer element |
| `src/components/layout/DesktopFrame.tsx` | Add `id="outer-left-gutter"` to left panel div with `position: relative` |
| `src/components/layout/MobileFrame.tsx` | Add `id="mobile-tour-anchor"` zone above `<main>` for mobile popover injection |

---

## Feature 6 — Right Sidebar: Formatted Instructions + Checkbox Progress + Progress Bar

**Goal:** `SidePanel` instructions become a scannable checklist. A progress bar shows the participant's overall journey. Micro-questions must be answered before "Next" is enabled.

### 6a — Progress Bar
- Thin primary-colored bar at top of `SidePanel` showing `currentStepIndex / steps.length` as percentage.
- Animated width with CSS transition.

### 6b — Formatted Instruction Checklist
- Replace `FormattedMarkdown` plain text with a new `StepChecklist` component.
- Each numbered instruction becomes a checkbox item (local state, not submitted).
- Add optional `instructionSteps: string[]` array to each step config in `sidePanel.ts`.

### 6c — Micro-question Gate on "Next"
- Manual "Next" button is **disabled** until all `microPrompts` for the current step have a recorded answer.
- Show message: *"Answer the questions above to continue."*

### 6d — Prev/Next Buttons Outside Phone
- Move Prev/Next to the **left gutter** of `DesktopFrame` (below the phone, centered).
- On mobile: sticky bottom bar in outer `MobileFrame` wrapper (above the drawer trigger).

### Files to modify
| File | Change |
|------|--------|
| `src/config/sidePanel.ts` | Add optional `instructionSteps?: string[]` to `GuidedStepConfig`; populate for all steps |
| `src/components/layout/SidePanel.tsx` | Add progress bar at top; replace `FormattedMarkdown` with `StepChecklist`; disable Next when micro-prompts unanswered |
| `src/components/layout/DesktopFrame.tsx` | Move Prev/Next buttons to left gutter below phone chrome |
| `src/components/layout/MobileFrame.tsx` | Add sticky Prev/Next bar in outer frame below `<main>` |
| `src/routes/Guided.tsx` | Remove any internal Prev/Next rendering from inside phone screen content |

### New files to create
| File | Purpose |
|------|---------|
| `src/components/layout/StepChecklist.tsx` | Renders `instructionSteps[]` as tappable checkbox items with local tick state |

---

## Feature 7 — Remove Floating Crisis Call Button

**Goal:** Remove the green floating phone button (`CrisisButton`) from all guided and free-roam phone screens.

### Files to modify
| File | Change |
|------|--------|
| `src/routes/Guided.tsx` | Remove all `<CrisisButton />` imports and JSX across every `renderInnerContent()` case |
| `src/routes/FreeRoam.tsx` | Remove `<CrisisButton />` if present |

> The `CrisisButton.tsx` component file itself can be kept for future use — just remove all usages.

---

## Feature 8 — Free Roam Overhaul

### 8.1 — Home: The Three Doors
Replace the two cards on the free-roam home screen with three "door" cards:
1. **Companion** — "Chat with an AI companion about your feelings"
2. **Journal** — "Write privately in your reflective journal"
3. **Incident Log** — "Document an event with a timestamp"

Each door navigates to a sub-screen within free-roam via `activeSubScreen` state.

### 8.2 — Circles: Q&A Community Stories (Reddit-style)

**List view:** Story cards with title, tag (`#NeedHelp`, `#PositiveStory`, `#Article`), short excerpt, author pseudonym, upvote count.
**Filter bar:** `All` | `#NeedHelp` | `#PositiveStory` | `#Article`

**Story detail view** (tapping a card): Full story text (2–4 paragraphs), tag pills, sample comment section.

**Sample stories to hardcode (in `src/config/freeRoamContent.ts`):**
1. *"I finally reported him"* — `#PositiveStory` — about going to barangay successfully
2. *"I'm not sure what I experienced counts"* — `#NeedHelp` — uncertainty about labeling
3. *"My experience at the Pasig City Hall VAW desk"* — `#Article` — community member writeup

### 8.3 — Pathways: Barangay / Police / NGO Directory

**List view:**
- Filter bar: `Near Me` | `Positive Experience` | `NGO` | `Government` | `Legal`
- Cards: Institution name, type badge, location, short description

**Institution detail view:**
- Sections: "What to prepare", "What to expect", "Community notes"
- Community notes: short comment-style entries, positive ones first
- Sample note: *"The police officer at the desk was calm and non-judgmental."*

**Sample institutions (hardcoded in `src/config/freeRoamContent.ts`):**
1. **Barangay Poblacion VAW Desk** — Government — Makati
2. **PNP Women & Children Protection Center** — Government — Camp Crame
3. **Gabriela Women's Party** — NGO — Manila
4. **PAO – Public Attorney's Office** — Government/Legal — Nationwide

### 8.4 — Marketplace: Clinics & Lawyers Directory

**List view:**
- Filter bar: `Clinics` | `Legal` | `Free Service` | `NGO`
- Cards: Entity name, type, location, specialty tag

**"Free Service" filter** shows PAO, Gabriela Legal, Lihok Pilipina.

**Entity profile view:**
- Profile: name, type badge, address, contact, specialty
- "What to expect" section
- Community ratings/notes (sample positive comments)

**Sample entities (hardcoded in `src/config/freeRoamContent.ts`):**
1. **PAO — Public Attorney's Office** — Free Legal — Nationwide
2. **Gabriela Legal Clinic** — Free Legal / NGO — Manila
3. **Healing Minds PH** — Clinic / Trauma-informed — QC
4. **UP-PGH Psychiatry** — Clinic / Public — Manila

### 8.5 — Bottom Nav Restructure (4 tabs)

Merge Circles, Pathways, and Marketplace under one **"Resources"** tab.

| Tab | Icon | Content |
|-----|------|---------|
| Home | `Home` | Three Doors + Breathing card |
| Companion | `MessageSquare` | Chat interface |
| Journal | `BookOpen` | Free journal + Incident log |
| Resources | `LifeBuoy` | Sub-tabs: Circles · Pathways · Marketplace |

### 8.6 — Free Roam Right Sidebar (Contextual Helper)

Replace the generic state with a helpful context panel:
- Header: *"You are in Free Roam"*
- Description: *"The guided session is complete. Feel free to explore all features at your own pace."*
- Checklist of explorable features (each with a **"Show me"** hyperlink that triggers Driver.js):
  - `[ ]` Try the Companion chat
  - `[ ]` Write a journal entry
  - `[ ]` Log an incident
  - `[ ]` Read a community story
  - `[ ]` Browse support institutions
  - `[ ]` View clinics & legal services
- Bottom: "When ready, click **End Session** to finish."

### Files to modify
| File | Change |
|------|--------|
| `src/routes/FreeRoam.tsx` | Full overhaul: new home doors, 4-tab nav, replace all tab content, add sub-tab routing for Resources, add entity/story detail sub-screens |
| `src/components/layout/SidePanel.tsx` | Detect free-roam context (via route or prop); render `FreeRoamSidebar` content |
| `src/components/layout/DesktopFrame.tsx` | Ensure sidebar renders in free-roam (currently `FreeRoam` uses `FrameWrapper` which routes to `DesktopFrame` for user cohort) |

### New files to create
| File | Purpose |
|------|---------|
| `src/config/freeRoamContent.ts` | All hardcoded data: community stories, institutions, marketplace entities |
| `src/components/freeroam/CommunityStories.tsx` | List + detail view for Q&A community stories |
| `src/components/freeroam/PathwaysDirectory.tsx` | List + detail view for barangay/NGO/police institutions |
| `src/components/freeroam/MarketplaceDirectory.tsx` | List + detail view for clinics & lawyers |
| `src/components/freeroam/FreeRoamSidebar.tsx` | Context panel with checklist + "Show me" Driver.js links |

---

## Quality of Life Improvements

### QoL-1 — Fix Phone Status Bar Time to 01:43
**File:** `src/components/layout/PhoneChrome.tsx`
- Remove the `useEffect` live-clock logic.
- Replace with hardcoded static string `'1:43'`.

### QoL-2 — Study Info Button
A persistent **ⓘ** button visible on all screens opens a modal with study details and contact info.

**Files to modify:**
| File | Change |
|------|--------|
| `src/components/layout/DesktopFrame.tsx` | Add `ⓘ` icon button in top-right of outer frame (outside phone) |
| `src/components/layout/MobileFrame.tsx` | Add `ⓘ` icon in the outer top bar |

**New files to create:**
| File | Purpose |
|------|---------|
| `src/components/layout/StudyInfoModal.tsx` | Modal with researcher name, institution, email, IRB note, and participation acknowledgment copy |

### QoL-3 — Prev/Next Buttons Outside Phone Container
*(Covered under Feature 6d — no separate work needed.)*

### QoL-4 — End Session Button — Make it Prominent
Currently: small `⏸` pause icon (`PauseAffordance.tsx`), easy to miss.

**Change:** Replace with a clearly labeled **"⏸ Pause / End Session"** pill button in the outer frame header.

**Files to modify:**
| File | Change |
|------|--------|
| `src/components/layout/PauseAffordance.tsx` | Change trigger button from icon-only to labeled pill; expose as a `<PauseAffordance />` that can be placed in outer header |
| `src/components/layout/DesktopFrame.tsx` | Reserve a slot in the outer top bar for `<PauseAffordance />` |
| `src/components/layout/MobileFrame.tsx` | Place `<PauseAffordance />` in the outer top bar, not floating |

### QoL-5 — Breathing Animation: Gradient Purple
Currently: green circles with simple scale animation.

**Change:** Transition from white (bottom) to purple (top), pulsing with inhale/exhale cycle.

**Files to modify:**
| File | Change |
|------|--------|
| `src/routes/FreeRoam.tsx` | Replace `bg-green-*` classes on breathing circles with `bg-gradient-to-t from-white to-purple-500`; add `animate-breath-gradient` keyframe class |
| `src/routes/Guided.tsx` | Same update on the `breath-reminder` case: replace ping/pulse circles with gradient purple |
| `src/index.css` | Add `@keyframes breathGradient` for the white→purple pulse |

---

## Implementation Order (Recommended)

```
1. QoL-1 → QoL-4 → Feature 7       (quick wins, ~30 min)
2. Feature 6  (sidebar progress, checklist, gating, Prev/Next outside phone)
3. Feature 1  (onboarding walkthrough overlay)
4. Feature 2  (? Help button + Driver.js demotion)
5. Feature 3  (button locking + wrong-tap nudge)
6. Feature 5  (Driver.js annotations outside phone)
7. Feature 4  (Explain what I'm seeing)
8. Feature 8  (free roam full overhaul — largest chunk)
9. QoL-2 → QoL-3 → QoL-5           (remaining QoL)
```

---

## File Reference Summary

| File | Features Affected |
|------|-------------------|
| `src/lib/store.ts` | F1 |
| `src/lib/useGuidedTour.ts` | F2, F3, F5 |
| `src/config/sidePanel.ts` | F3, F6 |
| `src/config/freeRoamContent.ts` *(new)* | F8 |
| `src/config/screenExplanations.ts` *(new)* | F4 |
| `src/routes/Guided.tsx` | F1, F2, F3, F6, F7, QoL-5 |
| `src/routes/FreeRoam.tsx` | F8, QoL-5 |
| `src/components/layout/DesktopFrame.tsx` | F1, F2, F4, F5, F6, QoL-2, QoL-3, QoL-4 |
| `src/components/layout/MobileFrame.tsx` | F2, F5, F6, QoL-2, QoL-3, QoL-4 |
| `src/components/layout/SidePanel.tsx` | F6, F8 |
| `src/components/layout/PhoneChrome.tsx` | QoL-1 |
| `src/components/layout/PauseAffordance.tsx` | QoL-4 |
| `src/components/layout/OnboardingWalkthrough.tsx` *(new)* | F1 |
| `src/components/layout/ExplainerDrawer.tsx` *(new)* | F4 |
| `src/components/layout/StepChecklist.tsx` *(new)* | F6 |
| `src/components/layout/StudyInfoModal.tsx` *(new)* | QoL-2 |
| `src/components/ui/GuidedLockToast.tsx` *(new)* | F3 |
| `src/components/chat/HandoffChips.tsx` | F3 |
| `src/components/chrome/CrisisButton.tsx` | F7 (remove usages, keep file) |
| `src/components/freeroam/CommunityStories.tsx` *(new)* | F8 |
| `src/components/freeroam/PathwaysDirectory.tsx` *(new)* | F8 |
| `src/components/freeroam/MarketplaceDirectory.tsx` *(new)* | F8 |
| `src/components/freeroam/FreeRoamSidebar.tsx` *(new)* | F8 |
| `src/index.css` | QoL-5 |
