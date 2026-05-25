---
name: code-map
description: AI-optimized knowledge graph of the codebase. Scan this FIRST before reading any files.
last_updated: 2026-05-24
---

# Codebase Knowledge Graph
> **AI INSTRUCTION:** Read this file FIRST before scanning any other files. This is your single source of truth for codebase structure. Update this file EVERY time you add, remove, or significantly modify code.

---

## 📁 Project Overview
**Purpose:** Capstone prototype - AI-powered mental health support platform with guided and freeroam modes.
**Stack:** React + TypeScript + Vite + TanStack Router + Supabase + Zustand
**Domain:** Research study platform for conversational AI intervention testing.

---

## 📂 Directory Structure
| Path | Purpose | Scan Priority |
|------|---------|---------------|
| `src/` | All source code | HIGH |
| `src/components/` | React components | HIGH |
| `src/components/chat/` | Chat interface components | HIGH |
| `src/components/chrome/` | App chrome (navigation, headers) | MEDIUM |
| `src/components/freeroam/` | Freeroam mode components | MEDIUM |
| `src/components/layout/` | Layout and frame components | MEDIUM |
| `src/components/survey/` | Survey components | MEDIUM |
| `src/components/ui/` | Reusable base UI components | HIGH |
| `src/config/` | Static configuration and content | HIGH |
| `src/lib/` | Business logic, state, utilities | HIGH |
| `src/routes/` | Top-level route components | HIGH |
| `docs/` | User-facing documentation and guides | LOW |
| `research/` | Research documentation | LOW |
| `scripts/` | Build and utility scripts | LOW |

---

## 🔑 Key Files & Modules

### Entry Points
| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/main.tsx` | App entry point | Renders root provider |
| `src/App.tsx` | Root component | Router setup, global providers |

---

### State Management
| File | Purpose | Key Exports | Relationships |
|------|---------|-------------|---------------|
| `src/lib/store.ts` | Global Zustand store | `useStore` | **CENTRAL STATE:** All components read/write here. Contains session state, chat history, current mode, study progress. |

---

### Core Libraries
| File | Purpose | Key Exports | Relationships |
|------|---------|-------------|---------------|
| `src/lib/scriptedChat.ts` | Scripted chat engine | `processUserMessage`, `getNextBotMessage` | Powers guided mode chat. Reads from `config/chatScripts.ts` |
| `src/lib/session.ts` | Session management | `createSession`, `saveSession` | Handles study session lifecycle. Integrates with Supabase. |
| `src/lib/supabase.ts` | Supabase client | `supabase` | Database client wrapper. |
| `src/lib/telemetry.ts` | Event logging | `trackEvent` | All user interactions go through this. |
| `src/lib/sus.ts` | SUS survey logic | `calculateSUSScore` | Survey scoring utilities. |
| `src/lib/useGuidedTour.ts` | Onboarding tour hook | `useGuidedTour` | Drives onboarding walkthrough. |

---

### Configuration
| File | Purpose | Notes |
|------|---------|-------|
| `src/config/chatScripts.ts` | Guided mode chat flows | **HUGE FILE:** Contains all scripted dialogue trees. |
| `src/config/consent.ts` | Consent form content | Static content only. |
| `src/config/freeRoamContent.ts` | Freeroam mode resources | Marketplace, pathways, stories content. |
| `src/config/preloadedContent.ts` | Initial app content | What users see on first load. |
| `src/config/scenarios.ts` | Study scenario definitions | Different experimental conditions. |
| `src/config/scenarioTypes.ts` | Guided walkthrough interfaces | Scenario, session, step, and reflection configuration types. |
| `src/config/sidePanel.ts` | Side panel session configs | **CENTRAL STUDY FLOW:** Defines SESSIONS steps, intros, and reflections for all cohorts verbatim. |
| `src/config/surveys.ts` | Survey question definitions | SUS, cohort safety check, post-study, and pricing survey items. |

---

### Routes
| File | Purpose | Flow Position |
|------|---------|---------------|
| `src/routes/Welcome.tsx` | Welcome screen | 1 |
| `src/routes/Consent.tsx` | Consent form | 2 |
| `src/routes/Guided.tsx` | Guided intervention mode | 3 (primary) |
| `src/routes/FreeRoam.tsx` | Freeroam exploration mode | 3 (alternative) |
| `src/routes/PostSurvey.tsx` | Post-intervention survey | 4 |
| `src/routes/EndSurvey.tsx` | Final end-of-study survey | 5 |
| `src/routes/Done.tsx` | Completion screen | 6 |
| `src/routes/Admin.tsx` | Admin dashboard | Internal only |

---

### Components

#### Chat Components (`src/components/chat/`)
| File | Purpose |
|------|---------|
| `ChatInput.tsx` | Text input for chat |
| `ChatMessage.tsx` | Individual message bubble |
| `HandoffChips.tsx` | Quick reply options |
| `TypingIndicator.tsx` | Bot is typing indicator |

#### Freeroam Components (`src/components/freeroam/`)
| File | Purpose |
|------|---------|
| `CommunityStories.tsx` | Community resources directory |
| `PathwaysDirectory.tsx` | Pathways/clinics directory |
| `MarketplaceDirectory.tsx` | NGOs and external help directory |
| `FreeRoamSidebar.tsx` | Sidebar specific to freeroam mode |
| `ProviderHubFreeRoam.tsx` | Provider intake dashboard simulator for free roam |

#### UI Components (`src/components/ui/`)
> **PATTERN:** All base UI components live here. Import from `src/components/ui/index.ts`
| File | Purpose |
|------|---------|
| `Button.tsx` | Primary button component |
| `Input.tsx` | Text input component |
| `Checkbox.tsx` | Checkbox component |
| `Markdown.tsx` | Sandboxed GFM markdown rendering parser |

#### Layout Components (`src/components/layout/`)
| File | Purpose |
|------|---------|
| `DesktopFrame.tsx` / `MobileFrame.tsx` | Responsive frame wrappers |
| `PhoneChrome.tsx` | Mobile browser chrome simulation |
| `SidePanel.tsx` / `SideDrawer.tsx` | Side navigation |
| `StepChecklist.tsx` | Suggested task checklist with auto-expanding active steps and inline popover descriptions |
| `OnboardingWalkthrough.tsx` | Legacy first-run tour (retired in favor of Scenario 0 SidePanel orientation) |

---

## 🧩 Core Patterns

### 1. State Flow
```
User Action → trackEvent() → store.update() → Component rerender
```
- All state changes go through Zustand store
- All user interactions are telemetered
- No local state for cross-component data

### 2. Chat Flow
**Guided Mode:**
```
User message → processUserMessage() → lookup script → bot response → append to store
```
Scripted, deterministic flow based on chat script tree.

**Freeroam Mode:**
Open chat with no script, uses real AI integration (if enabled).

### 3. Study Flow
```
Welcome → Consent → Randomize → [Guided / FreeRoam] → Post Survey → End Survey → Done
```
Randomization happens at Consent completion.

---

## 📦 Key Dependencies
| Package | Purpose |
|---------|---------|
| `zustand` | State management |
| `@tanstack/react-router` | Routing |
| `@supabase/supabase-js` | Database / Auth |
| `react` / `react-dom` | UI framework |
| `tailwindcss` | Styling |
| `vite` | Build tool |

---

## ⚠️ Critical Notes for AI
1. **NEVER modify `src/config/chatScripts.ts` unless explicitly asked.** This is research content.
2. **All user interactions must call `trackEvent()`** - no exceptions.
3. **State is single source of truth** - don't add new state providers.
4. **UI components are composable** - reuse from `src/components/ui/` before building new ones.
5. **This file is authoritative** - if something here contradicts code, update THIS FILE first.

---

## 📝 Maintenance Rules
> Update this file:
> - ✅ When adding a new file
> - ✅ When changing a file's purpose
> - ✅ When adding a new dependency
> - ✅ When changing core patterns
> - ❌ Don't update for minor code changes
> - ❌ Don't update for bug fixes that don't change architecture
