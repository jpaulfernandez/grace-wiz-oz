# ScreenID Consistency Audit Report

This report presents a comprehensive audit of the consistency of `screenId` values defined in the session configuration (`src/config/sidePanel.ts`) against the rendering logic in the guided route component (`src/routes/Guided.tsx`). 

Our audit uncovered **critical discrepancies** where certain screen IDs are mismatched between the configuration and the React switch-case routing. These mismatches break parts of the walkthrough experience, triggering the fallback "Screen not matched" error screen or locking the user out of proceeding by failing to render the required interactive elements.

---

## 1. Scenario A Audit (Green Jokes Walkthrough)

Scenario A represents the initial encounter with workplace micro-harassment (hearing green jokes in a chat). Below is the audit comparing the configurations in `sidePanel.ts` and the case rendering in `Guided.tsx`.

| Step ID | sidePanel.ts `screenId` | Guided.tsx `case` statement | Match Status | Experience Impact |
| :--- | :--- | :--- | :--- | :--- |
| **scenario-a-home** | `'guided-home'` | `case 'guided-home':` | **✅ Match** | Renders the initial phone mockup dashboard. User can tap the Companion app card. |
| **scenario-a-chat** | `'companion-chat'` | `case 'companion-chat':` | **✅ Match** | Renders the simulated WhatsApp-style chat log. User can read and progress. |

---

## 2. Global Screen ID Consistency & Discrepancies
Below is the verification of all scenarios defined in `src/config/sidePanel.ts` against `src/routes/Guided.tsx` to surface any mismatched or missing screen identifiers.

### 2.1 Orientation Walkthrough (`scenario-orientation`)
* **Step 1 (`intro-step-1`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.
* **Step 2 (`intro-step-2`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.
* **Step 3 (`intro-step-3`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.
* **Step 4 (`intro-step-4`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.

### 2.2 Scenario B: Work Anxiety (`scenario-b-work-anxiety`)
* **Step 1 (`scenario-b-home`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.
* **Step 2 (`scenario-b-chat`)**: `'companion-chat'` ➡️ `case 'companion-chat'`. **Match**.
* **Step 3 (`journal-handoff`)**: `'journal-editor'` ➡️ `case 'journal-editor'`. **Match**.
* **Step 4 (`scenario-b-breath`)**: `'breath-reminder'` ➡️ `case 'breath-reminder'`. **Match**.

### 2.3 Scenario C: Pattern Surfacing (`scenario-c-patterns`)
* **Step 1 (`scenario-c-offers`)**: `'post-save-offers'` ➡️ `case 'post-save-offers'`. **Match**.
* **Step 2 (`scenario-c-annotations`)**: `'journal-viewer-annotations'` ➡️ **No Matching Case!**
  > [!CRITICAL]
  > **BUG FOUND**: `sidePanel.ts` defines `screenId` as `'journal-viewer-annotations'`, but `Guided.tsx` implements this screen as `case 'journal-annotations':` (line 857).
  > 
  > **Impact**: When the user enters this step, they see the fallback **"Error: Screen not matched"** interface instead of the interactive annotated somatic/reflection journal view.

### 2.4 Scenario D: Prompted Journaling (`scenario-d-journaling`)
* **Step 1 (`scenario-d-home`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.
* **Step 2 (`scenario-d-modes`)**: `'journal-modes'` ➡️ `case 'journal-modes'`. **Match**.
* **Step 3 (`scenario-d-editor`)**: `'journal-editor'` ➡️ `case 'journal-editor'`. **Mismatched Configuration & UI Intent!**
  > [!WARNING]
  > **LOGIC/CONFIG BUG**: In `sidePanel.ts`, step `scenario-d-editor` is set to `screenId: 'journal-editor'`. However, `Guided.tsx` contains `case 'journal-guided-editor':` (line 1029) which implements the actual Pennebaker guided journaling prompts (`SCENARIO_D_PROMPTS`).
  > 
  > Furthermore, the step instructions in `sidePanel.ts` say *"Answer the pre-filled questions or tap **Just save it** to secure the entry"*, and expect the user to tap `#just-save-btn`.
  > 
  > **Impact**: The user is shown the simple fullscreen editor (without prompts) and is asked to tap `#just-save-btn` which *does not exist* in either `journal-editor` or `journal-guided-editor` (it is in `post-save-offers`). To fix the guided prompt layout, the step should be configured with `screenId: 'journal-guided-editor'` (which has the `#save-guided-btn`).

### 2.5 Scenario E: Incident Logging (`scenario-e-incidents`)
* **Step 1 (`scenario-e-home`)**: `'guided-home'` ➡️ `case 'guided-home'`. **Match**.
* **Step 2 (`scenario-e-log`)**: `'incident-log'` ➡️ `case 'incident-log'`. **Match**.
* **Step 3 (`scenario-e-hash`)**: `'incident-receipt'` ➡️ **No Matching Case!**
  > [!CRITICAL]
  > **BUG FOUND**: `sidePanel.ts` defines `screenId` as `'incident-receipt'`, but `Guided.tsx` implements this as `case 'hash-receipt':` (line 1225).
  > 
  > **Impact**: The user is shown the fallback **"Error: Screen not matched"** screen, completely hiding the timestamp anchored QR code receipt.

* **Step 4 (`scenario-e-offers`)**: `'post-save-offers'` ➡️ `case 'post-save-offers'`. **Mismatched UI Flow!**
  > [!CRITICAL]
  > **BUG FOUND**: `sidePanel.ts` sets `screenId` to `'post-save-offers'` (the generic journal offers). However, the step instructions ask the user to tap **"Do nothing for now"** (`#do-nothing-btn`) which ONLY exists on the `'incident-post-save-offers'` screen.
  > 
  > **Impact**: The user is shown the standard journal options (which has no `#do-nothing-btn`). They cannot proceed with the checklist requirements because the button they are instructed to tap is missing. The configuration should be changed to `screenId: 'incident-post-save-offers'`.

---

### 2.6 Professional Cohorts: Lawyer & Clinician Simulation
Both standard cohorts for professional roles (`lawyer-standard` and `clinician-standard`) are **completely broken** due to fundamental mismatches between their generic config IDs and the highly specific screen IDs built in the React component.

* **Intake Dashboard Step (`la-home`, `ca-home`)**:
  - `sidePanel.ts` `screenId`: `'provider-dashboard'`
  - `Guided.tsx` cases: `case 'lawyer-dashboard':` (line 1364) and `case 'clinician-dashboard':` (line 1736).
  - **Mismatch Status**: ❌ No `'provider-dashboard'` case exists in `Guided.tsx`.
  - **Impact**: Both lawyer and clinician starts trigger a **"Screen not matched"** error layout.

* **Reviewing Shared Logs Step (`la-view-records`, `ca-view-records`)**:
  - `sidePanel.ts` `screenId`: `'provider-records'`
  - `Guided.tsx` cases: specific sub-screens like `'lawyer-artifacts'`, `'lawyer-chat'`, `'lawyer-notes'`, `'lawyer-export'`, `'clinician-artifacts'`, `'clinician-chat'`, `'clinician-notes'`, `'clinician-export'`.
  - **Mismatch Status**: ❌ No `'provider-records'` case exists in `Guided.tsx`.
  - **Impact**: Shows a **"Screen not matched"** error layout.

---

## 3. ScreenID Definitions & Description Table

Based on the rendering structures in `src/routes/Guided.tsx`, here is the formal catalog mapping each handled `screenId` to its exact visual interface, user role, and functional description.

| Screen ID | Target Role / Cohort | Description (What can I see here?) | Key Interactive Elements |
| :--- | :--- | :--- | :--- |
| **`guided-home`** | Participant (Jane/Grace) | **Smartphone Dashboard Mockup**: Represents the home screen of the participant's phone, showing time, battery status, and app cards (e.g. Companion, Journal, Incidents, Settings). | - Companion card (`#companion-card`) <br> - Journal card (`#journal-card`) <br> - Incident log card (`#incident-card`) |
| **`companion-chat`** | Participant (Jane/Grace) | **Companion Safe-Space Chat**: Simulated messaging interface displaying conversational therapy sessions with the Companion AI (e.g., analyzing green jokes, micro-harassment, grounding). | - Quick response suggestion chips <br> - Message inputs |
| **`journal-editor`** | Participant (Jane/Grace) | **Free-Flow Somatic Journal**: A fullscreen private writing editor where users can type feelings, attachment reactions, and somatic states (e.g. heart racing). | - Verbatim input textarea <br> - Save journal button (`#save-journal-btn`) |
| **`journal-guided-editor`** | Participant (Jane/Grace) | **Pennebaker-style Guided Reflection**: Multi-field structured journal prompts splitting reflection into narrative, somatic feeling, and behavioral adjustments. | - Question prompts textareas <br> - Save guided button (`#save-guided-btn`) |
| **`journal-annotations`** | Participant (Jane/Grace) | **Highlighted Theme Ledger**: Shows past somatic logs with automated NLP highlights highlighting anxiety indicators, triggers, and somatic signals. | - Highlights hotspots (`#annotation-hotspot-...`) <br> - Decryption ledger toggles |
| **`journal-modes`** | Participant (Jane/Grace) | **Journal Entrance Router**: Screen allowing the user to select between simple "Free Flow" journaling and "Guided Mode" reflection path. | - Free flow button <br> - Guided Mode button (`#guided-journal-btn`) |
| **`breath-reminder`** | Participant (Jane/Grace) | **Breathe / Somatic Pause Nudge**: A micro-intervention screen showing a pulsing graphic to guide the user through a box breathing cycle during a stressful encounter. | - Next navigation (manual/automatic) |
| **`post-save-offers`** | Participant (Jane/Grace) | **Journal Concluding Pathways**: Screen suggesting next actions after securing a journal entry (e.g. somatic breathing, theme highlighting, quick safe close). | - Just save it button (`#just-save-btn`) <br> - Help me notice patterns (`#help-notice-patterns-btn`) |
| **`incident-log`** | Participant (Jane/Grace) | **Secure Incident Fact-Sheet**: Structured form to lock key incident facts (date, who, location, quotes, somatic symptoms) for secure cryptographic anchoring. | - Interactive additional notes textarea <br> - Secure anchoring button (`#save-incident-btn`) |
| **`hash-receipt`** | Participant (Jane/Grace) | **Grace Cryptographic Verification Receipt**: Displays verification QR code and SHA-256 fingerprint proving the incident log was timestamped and frozen in time. | - Next step button (`#incident-receipt-next-btn`) |
| **`incident-post-save-offers`** | Participant (Jane/Grace) | **Incident Concluding Pathways**: Shows action choices after anchoring an incident, such as external therapy referral, legal synthesis, or doing nothing. | - Do nothing button (`#do-nothing-btn`) <br> - Direct reflection pathways |
| **`lawyer-dashboard`** | Advocate (Lawyer) | **Lawyer Portal Inbox**: Simulates an advocate's workspace interface, rendering intake booking notifications and client invitation states. | - Booking notification card (`#booking-notification`) |
| **`lawyer-booking-detail`** | Advocate (Lawyer) | **Redacted Intake Assessment**: Shows intake appointment details, cryptographic anchoring indicators, and the redacted legal synthesis of Jane's reports. | - Accept time & open case button (`#accept-booking-btn`) |
| **`lawyer-artifacts`** | Advocate (Lawyer) | **Secure Client Ledger Decryptor**: Interface allowing the lawyer to request decryption authorization from the client for incident logs and somatic journals. | - Request Incidents button (`#request-incident-btn`) <br> - Request Journals button (`#request-journal-btn`) |
| **`lawyer-chat`** | Advocate (Lawyer) | **Secure client RAG retrieval**: Simulated chat where the lawyer queries the Companion AI to surface relevant incident events and evidence citations. | - Chat suggestion chips <br> - Retrieval text input |
| **`lawyer-notes`** | Advocate (Lawyer) | **Casework Note Logs**: Chronological intake notebook where the lawyer logs legal assessment summaries or defense strategies. | - Note input textarea <br> - Save note button (`#save-note-btn`) |
| **`lawyer-export`** | Advocate (Lawyer) | **Certified PDF Evidence Packager**: Verification mock-up displaying PDF download options for courtroom-ready, timestamped evidence syntheses. | - Download evidence button (`#download-pdf-btn`) |
| **`clinician-dashboard`** | Healthcare (Clinician) | **Clinician Preparatory Portal**: Simulates a counselor's dashboard indicating patient appointments and somatic stress flags. | - Booking notification card (`#booking-notification`) |
| **`clinician-booking-detail`** | Healthcare (Clinician) | **Somatic Intake Synthesizer**: Reviews self-reported patient anxiety flags, attachment narratives, and stomach/nerve freezing markers. | - Accept & prepare session button (`#accept-booking-btn`) |
| **`clinician-artifacts`** | Healthcare (Clinician) | **Client Somatic Log Decryptor**: Request center to securely decrypt clinical narrative logs and verbatim somatic reflections. | - Request Incidents button (`#request-incident-btn`) <br> - Request Journals button (`#request-journal-btn`) |
| **`clinician-chat`** | Healthcare (Clinician) | **Psychological Retrieval engine**: Chat helper querying somatic cues, panic patterns, and patient-reported attachment patterns. | - Chat suggestion chips |
| **`clinician-notes`** | Healthcare (Clinician) | **Counseling Notes Log**: Counselor's diary for somatic breathing plans, panic triggers, and grounding exercises. | - Note input textarea <br> - Save prep note button (`#save-note-btn`) |
| **`clinician-export`** | Healthcare (Clinician) | **Grounding Pack Export**: Download dashboard for clinical intake syntheses including somatic markers and attachment graphs. | - Download clinical packet (`#download-pdf-btn`) |

---

## 4. Summary of Discovered Mismatches & Action Items

To align `src/config/sidePanel.ts` and `src/routes/Guided.tsx` and ensure that all simulation paths run successfully, we recommend implementing the following corrections:

### Fix 1: Resolve Scenario C Annotations Screen
* **Issue**: `sidePanel.ts` points to `'journal-viewer-annotations'`, but `Guided.tsx` expects `'journal-annotations'`.
* **Fix**: In `src/config/sidePanel.ts` (lines 421 and 1656), change:
  ```diff
  - screenId: 'journal-viewer-annotations',
  + screenId: 'journal-annotations',
  ```

### Fix 2: Enable Scenario D Guided Prompts Screen
* **Issue**: `sidePanel.ts` points to `'journal-editor'` (which renders the free-flow screen without prompts), but the text and checklists require the guided prompt editor (which in `Guided.tsx` is named `'journal-guided-editor'`).
* **Fix**: In `src/config/sidePanel.ts` (lines 515 and 1419), change:
  ```diff
  - screenId: 'journal-editor',
  + screenId: 'journal-guided-editor',
  ```

### Fix 3: Resolve Scenario E Hash Receipt Screen
* **Issue**: `sidePanel.ts` points to `'incident-receipt'`, but `Guided.tsx` expects `'hash-receipt'`.
* **Fix**: In `src/config/sidePanel.ts` (lines 609, 841, and 1718), change:
  ```diff
  - screenId: 'incident-receipt',
  + screenId: 'hash-receipt',
  ```

### Fix 4: Enable Scenario E Conclude Logging Button
* **Issue**: `sidePanel.ts` points to `'post-save-offers'` (generic journal offers), which has no `#do-nothing-btn`. The step checklist instructions ask the user to tap "Do nothing for now", which is only found in `'incident-post-save-offers'`.
* **Fix**: In `src/config/sidePanel.ts` (lines 633, 865, and 1742), change:
  ```diff
  - screenId: 'post-save-offers',
  + screenId: 'incident-post-save-offers',
  ```

### Fix 5: Bridge Lawyer & Clinician Standard Cohorts
* **Issue**: The `lawyer-standard` and `clinician-standard` configurations define only two broad screens (`'provider-dashboard'` and `'provider-records'`) which do not exist in the detailed step cases in `Guided.tsx` (`lawyer-dashboard`, `lawyer-booking-detail`, `lawyer-artifacts`, etc.), causing "Screen not matched" errors.
* **Fix**: Expand the `steps` array under `lawyer-standard` and `clinician-standard` in `src/config/sidePanel.ts` to map to the multi-step dashboards built in `Guided.tsx`, or add a routing mapper in `Guided.tsx` to safely bridge `'provider-dashboard'` and `'provider-records'` to the respective advocate or clinician UI sets based on active cohort.
