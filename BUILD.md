# Grace Prototype — Build Specification (v3)

This is the engineering source-of-truth for the Grace prototype testing app. It works alongside three other documents — keep all four open during development:

| File                                                                       | What it owns                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `BUILD.md` (this file)                                                     | Architecture, behavior, scenarios, telemetry, build phasing         |
| `DESIGN.md`                                                                | Visual tokens, component styling, sample HTML                       |
| `research/screen-flows.md` (= `grace-screen-flows-v3.md`)                  | Screen-by-screen specs (A1-A2, B1-B7, C2-C4, D1-D2, F1-F10, G1)     |
| `research/testing-plan.md` (= _Grace Concept Testing and Validation Plan_) | Research methodology, ethics protocol, test cards, success criteria |

**Ownership boundary:** if any two conflict, surface it — don't silently resolve. The screen-flows doc is a guide, not a final spec — some screens are sketches and need to be fleshed out per the scenario descriptions in this file.

---

## Purpose

A guided + free-roam testing harness for the Grace mobile app. Not the product itself — a wizard-of-Oz environment where three cohorts (women users, lawyers, clinicians) run through scripted scenarios while we capture behavior, in-the-moment reactions, and post-session ratings.

The harness is the research instrument for the four-week validation phase. Its job is to produce enough evidence to support a disciplined GO / HOLD / REDESIGN call on each of three hypotheses:

1. **Writing willingness.** Will women — including survivors — write into the Companion and Journal?
2. **Provider utility.** Do lawyers and clinicians find the synthesis artifacts useful in their actual practice?
3. **Provider onboarding.** Will lawyers and clinicians onboard as receiving providers, or should Grace be export-only?

Everything in this spec serves those three questions. Features that don't directly support them (marketplace, community, pathway discovery) exist as **free-roam-only** stubs — testers can explore them, we don't measure them in this phase.

---

## Two modes

Every cohort can experience the app in two modes after consent:

- **Guided.** A predetermined sequence of screens with a moderator (or async script) walking the tester through specific scenarios. Side panel shows step-by-step instructions, inline micro-prompts, and (when moderated) moderator notes. Used for hypothesis-aligned measurement.
- **Free roam.** Unlocked after the tester completes their guided scenarios. All features accessible, no instructions, no inline prompts. We still log behavior. Used to surface unexpected exploration patterns.

Providers (lawyers, clinicians) can also toggle a **"view as user"** mode in free roam — they see the user-side app from the inside. This is essential context for evaluating the synthesis artifacts. They do not get user-side micro-prompts during this toggle.

---

## Three cohorts, three invite-code families

Invite codes are case-insensitive on input, stored uppercase, and map to a cohort + scenario set. Unknown codes show a polite "code not recognized — check with your moderator" message.

```
GRACE-W-{XX}     →  Women user cohort
GRACE-L-{XX}     →  Lawyer cohort
GRACE-C-{XX}     →  Clinician cohort
```

The trailing two-character suffix identifies the specific scenario set assigned to that tester. Different testers get different suffixes so we can balance which scenarios get the most observation. The mapping lives in `src/config/scenarios.ts`.

For v1, ship these:

| Code         | Cohort    | Guided scenarios                                     |
| ------------ | --------- | ---------------------------------------------------- |
| `GRACE-W-01` | Women     | Companion + Journal (both scripts) + Incident Log    |
| `GRACE-W-02` | Women     | Same flow, alternate scenario order (counterbalance) |
| `GRACE-L-01` | Lawyer    | Booking review → corpus chat → export → notes        |
| `GRACE-C-01` | Clinician | Booking review → corpus chat → export → notes        |

All testers in all cohorts unlock free roam after completing guided.

---

## Non-goals (do not build)

- Real AI/LLM. All chat is fully scripted with preloaded turns.
- Real crisis dialing. Crisis buttons show a mock overlay with the real number as plain text.
- Real authentication. The invite code is the only gate. Nickname is for tester convenience, not security.
- Real cryptographic hashing or PDF generation. The PDF export is a pre-generated static file with one piece of dynamic content (tester nickname).
- Persistence of user-typed content across sessions. We log it to Supabase for research; the app behaves as if it's ephemeral.
- Real provider booking. The booking flow ends at "request submitted" with a notice that the actual booking happens outside the platform.
- Production polish. This is a research instrument with a four-week deadline.

---

## Technology stack

| Layer        | Choice                         | Why                                                          |
| ------------ | ------------------------------ | ------------------------------------------------------------ |
| Build tool   | Vite                           | Fast dev loop, no SSR needed                                 |
| Framework    | React 18 + TypeScript          | Standard                                                     |
| Styling      | Tailwind CSS                   | Pairs with DESIGN.md tokens                                  |
| Routing      | React Router v6                | Multiple top-level routes                                    |
| State        | Zustand                        | Single store, no boilerplate                                 |
| Backend      | Supabase (Postgres + anon key) | Telemetry sink                                               |
| Animation    | Framer Motion                  | Chat typing, screen transitions                              |
| Icons        | Lucide React                   | Per DESIGN.md                                                |
| Forms        | react-hook-form                | Survey + consent only                                        |
| Product tour | Driver.js                      | Guided scenario step-by-step overlays + lost-tester recovery |

No Next.js. No Redux. No auth library. Keep dependencies minimal.

---

## Viewing modes

- **Desktop** (≥1024px): centered phone-shaped frame (390×844) containing the prototype, side panel docked right with scenario instructions, inline micro-prompts, and moderator notes (when `?mod=1`). For provider scenarios, the desktop frame swaps to a browser-frame chrome for screens that conceptually live on desktop (lawyer/clinician dashboards, PDF preview, corpus chat).
- **Mobile** (<1024px): full-bleed. Side panel becomes a slide-up drawer triggered by an info icon. For provider scenarios on mobile, show a non-blocking notice: _"This view is best on desktop — some elements may be cramped."_ Don't block them; let them continue.

Screens inside the phone frame always render at 390px-wide regardless of host. They don't know whether they're framed.

---

## Repository structure

```
grace-prototype/
├── BUILD.md
├── DESIGN.md
├── design-samples/
├── research/
│   ├── testing-plan.md          # the validation plan doc, for reference
│   ├── screen-flows.md          # the screen-by-screen doc
│   └── wizard-protocol.md       # Companion restraint protocol
├── .env.example
├── package.json
├── tailwind.config.ts
├── vite.config.ts
├── scripts/
│   └── generate-export-pdfs.ts  # run once, commits PDFs to public/
├── public/
│   ├── legal-export-sample.pdf  # generated, committed
│   └── clinical-export-sample.pdf
├── supabase/
│   └── schema.sql
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── config/
    │   ├── scenarios.ts          # invite-code → cohort + scenario set
    │   ├── sidePanel.ts          # per-screen instructions + micro-prompts
    │   ├── chatScripts.ts        # all scripted exchanges, indexed
    │   ├── surveys.ts            # SUS + cohort-specific Likerts
    │   ├── consent.ts            # consent text per cohort
    │   └── preloadedContent.ts   # journal entries, community posts, etc.
    ├── lib/
    │   ├── supabase.ts
    │   ├── telemetry.ts
    │   ├── session.ts            # session lifecycle, resume, pause
    │   ├── scriptedChat.ts       # WoZ engine
    │   ├── store.ts              # Zustand
    │   ├── sus.ts                # SUS scoring helpers
    │   └── useGuidedTour.ts      # Driver.js wrapper, idle/off-path telemetry
    ├── components/
    │   ├── layout/
    │   │   ├── DesktopFrame.tsx        # phone-chrome variant
    │   │   ├── DesktopBrowserFrame.tsx # browser-chrome variant
    │   │   ├── MobileFrame.tsx
    │   │   ├── PhoneChrome.tsx
    │   │   ├── SidePanel.tsx
    │   │   ├── SideDrawer.tsx
    │   │   └── PauseAffordance.tsx     # always-visible pause control
    │   ├── chrome/
    │   │   ├── BottomNav.tsx
    │   │   ├── CrisisButton.tsx
    │   │   └── ScreenHeader.tsx
    │   ├── chat/
    │   │   ├── ChatMessage.tsx
    │   │   ├── ChatInput.tsx
    │   │   ├── TypingIndicator.tsx
    │   │   └── HandoffChips.tsx
    │   ├── consent/
    │   │   ├── ConsentScreen.tsx
    │   │   ├── TriggerWarning.tsx
    │   │   └── DistressDisclosure.tsx  # survivor cohorts only
    │   ├── survey/
    │   │   ├── LikertItem.tsx
    │   │   ├── SUSForm.tsx
    │   │   └── MicroPrompt.tsx
    │   └── ui/
    ├── screens/
    │   ├── user/                  # A1–G1 (women's app surface)
    │   ├── lawyer/                # L1–L7 (lawyer dashboard)
    │   ├── clinician/             # CL1–CL7 (clinician dashboard)
    │   └── shared/                # marketplace, community, pathway
    └── routes/
        ├── Welcome.tsx            # / — nickname + invite code
        ├── Consent.tsx            # /consent
        ├── Guided.tsx             # /guided — runs the assigned scenarios
        ├── EndSurvey.tsx          # /survey — required after guided
        ├── PostSurvey.tsx         # /post-survey — invites optional free roam
        ├── FreeRoam.tsx           # /free — only after survey submitted
        ├── Done.tsx               # /done — thank-you
        └── Admin.tsx              # /admin?key=...
```

---

## Onboarding flow (every cohort)

```
/  Welcome
   ├── Nickname input (free text, 2-30 chars, no validation beyond length)
   ├── Invite code input (case-insensitive)
   └── Continue → looks up scenario, routes to /consent

/consent  Consent
   ├── Trigger warning block (all cohorts)
   ├── Consent text (cohort-specific, see below)
   ├── Distress disclosure (women cohort only — references warm referral)
   ├── Checkbox: "I understand and want to continue"
   ├── Checkbox: "I understand I can pause or stop at any time"
   └── Continue → creates session in Supabase, routes to /guided

/guided  Runs the assigned scenarios in sequence

After guided completes, survey is REQUIRED before free roam unlocks:

/survey  End-of-session questionnaire (required after guided)
   ├── Cohort-specific custom Likerts (3 items)
   ├── SUS (10 items, standard — see SUS Inventory below)
   ├── 2-3 open-text questions
   ├── Provider-only: pricing throwaway question (open text)
   └── Submit → routes to /post-survey

/post-survey  Optional free-roam invitation
   ├── "Thank you. Would you like to explore the app on your own?"
   ├── "Explore freely" → /free
   └── "I'm done" → /done

/free  Free roam (only accessible AFTER survey submitted)
   ├── Persistent banner: "Wrap up your session" → /done
   └── All features unlocked

/done  Thank-you, completion logged
```

---

## Consent and trigger warning copy

This is the starting draft. Edit to taste; have your gatekeeper organization review the women's version before any survivor session.

### Trigger warning (shown to all cohorts)

> **A note before you begin**
>
> This prototype is for an app that supports women navigating gender-based harm — harassment, abuse, and related experiences. You'll see chat messages, journal prompts, and incident-logging flows that touch on these topics.
>
> If at any point you'd rather stop, you can — there's a pause button on every screen, and stopping doesn't affect your participation in any way.

### Consent — women's cohort

> **What this is**
>
> You're helping us test an early prototype of Grace, an app being designed for women in the Philippines. We want to understand how the app feels to use — not whether you do things "correctly."
>
> **What we'll capture**
>
> What you tap, how long you spend on each screen, and anything you type into the prototype. Your inputs help us understand whether the app feels usable and safe. We don't share your data outside the research team, and we don't link it to your real identity — only the nickname you chose.
>
> **You can stop at any time**
>
> If anything feels uncomfortable, you can pause or end the session. Stopping doesn't affect your compensation or your standing in any way. If you'd like to talk to a counselor at any point during or after the session, your moderator can connect you to one we've arranged in advance.
>
> **You're testing the app, not yourself**
>
> Please don't share anything from your own life that you wouldn't want recorded. The scenarios are designed so you can role-play without putting your own experience on the page.

### Consent — provider cohorts (lawyer / clinician)

> **What this is**
>
> You're helping us evaluate an early prototype of Grace, an app being designed to support women navigating gender-based harm and to provide synthesized journal and incident artifacts to receiving providers like yourself.
>
> **What we'll capture**
>
> What you tap, how long you spend on each screen, anything you type into the prototype, and your responses to a brief end-of-session survey. We don't share your individual responses outside the research team.
>
> **What we're asking from you**
>
> We want your professional judgment on whether the synthesis artifacts would be useful in your practice, whether the app's behavior is clinically/legally appropriate, and whether you'd consider onboarding to a platform like this. Please be candid — negative findings are as valuable as positive ones.

### Distress disclosure (women's cohort, after consent)

> A counselor from {gatekeeper org} is available to talk if anything that comes up here connects to your own experience. You can ask your moderator to connect you at any point, during or after the session — and you don't need to explain why.

---

## The Wizard-of-Oz protocol (Companion)

**Decision: fully canned scripts for v1.** Both preloaded user prompts (tester just taps send) AND scripted AI responses. There is no live human operating the wizard — the "WoZ" term is retained for the testing plan, but in practice the prototype runs entirely off pre-written exchanges. This ensures consistency across moderated and async sessions and removes operator drift as a confound.

The Companion is a state-machine chat engine driven by scripts in `config/chatScripts.ts`. There is no LLM in the loop. The engine:

1. Renders the opener on screen entry (if defined).
2. On user send: log the user's text verbatim, append to history, show typing indicator with randomized 900-1600ms delay.
3. After delay: render the next scripted AI reply, advance the script pointer.
4. If the script flags `showHandoffChips: true`, render chips after the AI reply.
5. If the user sends past the end of the script: render a graceful fallback ("Let's pause here.") and stop advancing.

The Companion's responses follow the **restraint protocol** documented in `research/wizard-protocol.md` (you'll write this separately, or I can draft it). Three rules baked into every script:

- **Never name the user's experience for her.** "It sounds like harassment" → not allowed. "What's been weighing on you?" → allowed.
- **Acknowledge professional limits explicitly.** "I'm not a lawyer / not a clinician, but here's what I can offer..."
- **Always offer choice, not direction.** End every clarifying turn with "Would it help to {log this} / {keep writing} / {pause for now}?" — three options, not one.

### Guided scenarios — women

**Scenario A: Green jokes (uncertainty about harassment)**

_Context for the wizard / scripter: "green jokes" in Filipino workplace slang means sexual innuendos or sexually-suggestive jokes. The scenario tests how the Companion responds when the user is uncertain whether what she's experiencing counts as harassment._

User enters the Companion with a preloaded prompt: _"My workmate keeps making these green jokes around me. Sexual stuff disguised as jokes. He says I'm being uptight when I don't laugh. I don't know if I'm overreacting or if this is really harassment."_

Script flow (user just presses send for each):

1. AI: "Thank you for putting that down. I'm not a lawyer, so I can't tell you whether what you're describing meets a legal definition — but I can sit with you while you think it through. What about it has been sticking with you?"
2. User sends second preloaded prompt: _"It happens almost every day now. Other people laugh too so I feel like I'm the problem for being uncomfortable."_
3. AI: "What you're noticing about your own discomfort matters. I won't tell you what to call it — only you can name your own experience. There are a few things you could do from here, and none of them are required. You could log this as an incident so you have a record, you could write more in your journal, or you could let it go for now."
4. Handoff chips appear: **Log incident** / **Continue to journal** / **Let go for now**
5. Tester taps **Let go for now**.
6. AI: "That's a real choice. Whatever you carry, you don't have to carry alone. I'll be here." (1.5s delay) — chat history fades and clears, returning to the empty Companion state.

**Important design tension:** "Let go for now" clears the chat. The "remember this conversation" toggle (mentioned in earlier screen-flow doc) is **off by default** in all v1 scenarios. Clearing is the design statement — the app forgets when she asks it to. We test this behavior, we don't bypass it.

**Scenario B: Anxiety (continuation to journal)**

User enters with: _"I'm anxious about going to work tomorrow. My workmate is going to be there."_

Script flow:

1. AI: "That makes sense. I'm not a psychologist, so I can't treat what you're feeling — but I can sit with you while you think. Where are you feeling the anxiety most?"
2. User sends: _"In my chest. It's been there since yesterday."_
3. AI: "Your body is paying attention. Has anything happened recently that your body is responding to?"
4. User sends: _"He made another joke today. The kind I told you about — sexual stuff disguised as humor. I had to sit through a whole meeting after."_
5. AI: "Thank you for putting that down. Some people find it helpful to write more about what happened — others find it helpful to log it as an incident. You can also stop here if that's what feels right."
6. Handoff chips: **Log incident** / **Continue to journal** / **Let go for now**
7. Tester taps **Continue to journal**.
8. Transition: journal opens with a 2-second "carrying this over..." screen, then journal screen with preloaded summary card at top showing a 2-3 sentence synthesis of the chat.

**Scenario C: Journal — free flow**

After Scenario B, tester is in the journal with preloaded content. They can add a few sentences (or not — log either way). On Save:

1. 2-second breath reminder screen (animated breathing circle, "Take a breath" text).
2. Completion screen: summary card, soft offers (Make sense of this with AI / Save and close / Log an incident).
3. Tester taps **Make sense of this with AI**.
4. AI annotation overlay appears with **preloaded** highlighted phrases and notes (annotations target the preloaded journal text, not anything the tester typed — see `preloadedContent.ts`). Example: "This is the second time you've mentioned the elevator. You might be noticing a pattern." The point is to evaluate the _concept_ of AI pattern-surfacing, not to live-analyze the tester's input.

**Scenario D: Journal — guided (prompted)**

Three doors → Journal → Guided mode. Preloaded prompts with preloaded answers. Tester adds anything, saves. Same breath reminder + completion, but **does not tap the Make sense button** this time. We want to log that they saw it and chose not to.

**Scenario E: Incident log**

Three doors → Incident Log. Walk through structured form: what happened, when, where, who, evidence. All fields preloaded except a single open "anything else" field. On Save:

1. Hash receipt visual appears (canned — see Non-goals).
2. Post-save offer: "What would help next? — Journal about this / Call someone / Find community / Do nothing for now"
3. Whichever they tap, log it and route to the corresponding screen (or back to home for "do nothing").

### Guided scenarios — lawyer

**L1. Dashboard with booking request.** Single notification: "New booking request from {nickname-W-test-user}."

**L2. Booking request detail.** Shows what the user agreed to share: identity, contact, journal access, incident log access, synthesis. Tester taps Accept. A "propose new time" option is visible but for this scenario, accept the proposed time as-is.

**L3. Post-acceptance: request artifacts.** Two buttons: Request journal access / Request incident logs. Tester taps both. Simulated "client approved" notifications fire after 2 seconds each.

**L4. Corpus chat.** Browser-frame chat interface. Pre-loaded with 3-4 question-and-answer pairs the tester can scroll through. Tester can also type — anything they type triggers one of two canned "stricter, legal-compliant" responses based on keyword presence (one for pattern-of-conduct questions, one for evidence questions, fallback for everything else). The AI persona is explicitly framed: "I retrieve from the client's journal and incident log, and I flag pattern-of-conduct evidence relevant to RA 9262, RA 11313, and RA 8505. I do not provide legal advice."

**L5. Activity log and notes.** Tester can add a note. Three timestamped past notes are preloaded. Save logs the note.

**L6. Export to PDF.** Tester taps "Download as evidence packet." Static PDF downloads (`/public/legal-export-sample.pdf`).

The PDF is **pre-generated once** by a script (`scripts/generate-export-pdfs.ts`) and committed to the repo. The script produces two files — one for legal, one for clinical — using a Node-side PDF library (e.g. `pdfkit` or `puppeteer` rendering an HTML template). It runs as `npm run generate:exports` and is not part of the runtime app.

The script content should be substantial — substantially thicker than the guided scenarios suggest, since the lawyer/clinician needs enough material to actually evaluate. Recommended content:

**Legal PDF (`legal-export-sample.pdf`):**

- Cover page: AI synthesis summary (legal framing), pattern-of-conduct callouts with citation references, hash-receipt visual (see hash receipt note below), validation link placeholder
- 6-8 incident log entries in chronological order, each with structured fields filled
- 12-15 journal entries in chronological order
- Total: 15-20 pages

**Clinical PDF (`clinical-export-sample.pdf`):**

- Cover page: somatic flags, pattern flags, session-prep summary
- Same body content but reordered/annotated for clinical session prep
- Total: 15-20 pages

The same PDFs are reused across all sessions — no nickname stamping, no dynamic content. If a tester wants to know "is this my data," the moderator explains it's a representative sample, not their own session.

**L7. Wrap.** Tester is returned to the dashboard with the active client visible.

### Guided scenarios — clinician

Mirrors lawyer flow, but:

- **CL1-CL2:** identical structure, softer copy throughout.
- **CL4 (corpus chat):** AI persona is psych-framed. Canned responses focus on somatic patterns, repetition, attachment language, and process notes. Explicitly disclaims diagnosis: "I surface patterns from the client's writing. I do not diagnose."
- **CL6 (PDF export):** clinical cover page — somatic flags, pattern flags, session-prep summary. Same chronological data underneath.

### Hash receipt visual

The hash receipt appears in two places — on the incident log detail screen (user side) and on the legal PDF cover page. It is **purely visual** for v1 — no real cryptography is performed.

Render as a small credential-style card with monospace text:

```
┌─────────────────────────────────────────────┐
│  Anchored to Grace Timestamp Authority      │
│                                             │
│  Hash:  a3f8e2b1...c4d7e9f2  (SHA-256)      │
│  Time:  2026-05-12T14:32:08+08:00            │
│  Verify at grace.app/verify/{id}             │
└─────────────────────────────────────────────┘
```

The hash string can be any 64-character hex value (generate one random, hard-code it). The timestamp can be static. The verify link goes nowhere — it's a visual indicator only.

The testing plan calls this out explicitly as a concept-validation, not implementation-validation. The lawyer cohort evaluates _the idea_ — would this kind of artifact survive cross-examination if implemented properly — not the current rendering.

---

## Free roam — what exists, what's connected

Once guided is complete, free roam unlocks the full app. Everything is functional or visually mocked. Nothing is gated.
When doing the free roam, show the features that is not covered during the test

For **women testers**, free roam exposes:

- Three doors (Companion, Journal, Incident Log) — works as in guided but with no script restrictions. Companion still uses the WoZ engine but with a more permissive fallback script.
- **Community** — pre-populated feed: positive stories from anonymized users, "this barangay station was helpful" notes, a Q&A section with 3-5 example threads. Tester can scroll, tap into posts. No posting.
- **Pathway discovery** — **list view** (no map for v1). Each list item is a card showing place name, type, distance, and a tappable arrow. Filter chips at top: All / Barangay / Police Station / NGO / VAWC Desk. Tapping a card opens a station profile (FAQs: what to expect, what to bring; user comments; copy-able Google Maps link). Preload 8-12 places with realistic Metro Manila names.
- **Marketplace** — filter by Legal / Psych, filter by Free services. Listings are dummy data (5-6 per category). Tap a listing → profile → "Request consultation" → date/time picker → "Allow {Lawyer/Clinician} to see my profile and synthesized journal" toggle → preview of what they'd see → Complete booking → confirmation that booking happens off-platform.
- **Emergency** — banner notice on marketplace: "Marketplace is not for emergencies. If you're in danger, call 911." Tap routes to Crisis pathway.

For **providers** in free roam:

- Their own dashboard remains available.
- A "View as user" toggle in the header swaps them to the women's user-side app, free-roam style. This is critical for the synthesis evaluation — providers need to see the source material to judge the artifact. No micro-prompts during this toggle. They can toggle back.

---

## Side panel content model

Three sections, top to bottom:

1. **Sticky header.** Scenario name + step indicator (e.g. "Step 3 of 7") + "exit scenario" link → routes to `/survey?partial=1`.
2. **Instruction block.** Markdown-light. Re-mounts with fade on screen change. Per-screen content in `config/sidePanel.ts`.
3. **Micro-prompts (collapsible, default open).** 1-2 prompts per screen max. Optional always. Skippable. Answers log immediately on change — no submit button.
4. **Moderator notes (if `?mod=1`).** Textarea, auto-saves to telemetry every 3 seconds of inactivity. Visually distinct background.

Micro-prompts available types: `likert-5`, `text-short`, `single-choice`. Use sparingly — they're for catching moments before they fade, not for collecting structured data. The end-of-session survey does the heavy quantitative work.

---

## Guided tour and lost-tester recovery

Guided scenarios use **Driver.js** as the tour overlay layer. The side panel tells the tester _what step they're on and what they should accomplish._ Driver.js shows _where on the screen to tap._ The two are complementary, not redundant.

### Tour driver model

Each guided scenario step has:

```ts
type GuidedStep = {
  id: string;
  screenId: ScreenId;
  sidePanelInstruction: string; // shown in side panel always
  tourTarget?: {
    selector: string; // CSS selector of element to highlight
    popover: { title: string; description: string };
    waitForElement?: boolean; // poll until element exists, max 3s
  };
  advanceOn:
    | { type: "tap"; selector: string }
    | { type: "chat_send" }
    | { type: "save"; screenId: ScreenId }
    | { type: "manual_next" }; // explicit "next" button in side panel
  idleTimeoutMs?: number; // default 30000 — see lost-tester below
};
```

The tour overlay highlights the target element with a spotlight, shows a small popover, and waits for `advanceOn` to fire. The side panel's "Next" button is always available as an escape hatch — Driver.js advances are coupled to scenario advance via the Zustand store.

### Lost-tester detection

If a tester is on a step for longer than `idleTimeoutMs` without taking the expected action, the system shows a gentle nudge:

1. After 30s of inactivity (no tap, no scroll, no text input): subtle pulse animation on the tour-highlighted element. Log `tour_idle_30s`.
2. After 60s: side panel shows an additional line below the instruction: _"Looking for something? Try tapping the highlighted area, or use the 'Next' button to skip ahead."_ Log `tour_idle_60s`.
3. After 90s: tour overlay re-shows in case it was dismissed, with the popover pulsing. Log `tour_idle_90s`.

If the tester taps something _other_ than the expected target while a tour step is active, log `tour_off_path` with the actual selector tapped. Don't block them. If their tap takes them to a different screen than the scenario expects, gently route them back with a toast: _"Let's come back to this — we'll explore that next time."_

This is not punitive — the goal is to know which screens cause confusion. Heavy `tour_idle_*` and `tour_off_path` event counts on a specific screen are themselves findings.

### When the tour is on vs off

- **Guided mode:** tour overlays active on every step except chat screens (overlays would interrupt the conversation).
- **Free roam:** tour completely off. No nudges, no overlays.
- **Provider "view as user" toggle:** tour off. They're exploring with full agency.

### Library specifics

Driver.js v1.x. Wrap it in a thin React hook `useGuidedTour(scenarioId, stepId)` that:

- Mounts the driver instance on step change
- Handles the `waitForElement` polling
- Fires telemetry on highlight, advance, idle, off-path
- Cleans up on unmount

---

## End-of-session survey

### Women cohort

**Custom Likerts (5-point, strongly disagree → strongly agree):**

1. "I would write what is happening to me in this app."
2. "I trust this app with my words."
3. "I would tell another woman about this app."

**Open text (2-3 sentences each):**

1. "What about this app made you feel safe, or unsafe?"
2. "Was there anything you would not write into this app, even if it were happening to you?"
3. "What would make this worse for someone you know?" _(this is the negative-findings prompt — keep its exact wording, it's calibrated to surface things participants are otherwise polite about)_

**SUS:** standard 10 items, 5-point. Do not modify wording.

### Lawyer cohort

**Custom Likerts:**

1. "The legal lens synthesis would be useful for case preparation."
2. "The hash-receipt and timestamp model, if implemented as described, would be defensible under cross-examination."
3. "I would accept shared Grace links from clients as a receiving provider on this platform."

**Open text:**

1. "Which fields in the incident log are essential for admissibility, and what's missing?"
2. "Where does the citation-chip / corpus-chat model break down?"
3. "What would have to change before you'd use this with an actual client matter?"

**Pricing throwaway (single open text):**

> "If this platform charged providers for receiving client links and using the corpus chat, what would feel reasonable, and what would feel disqualifying?"

**SUS:** standard.

### Clinician cohort

**Custom Likerts:**

1. "The clinical lens synthesis would be useful for session preparation."
2. "I would recommend a patient use this between sessions."
3. "I would accept shared links from patients as a receiving provider on this platform."

**Open text:**

1. "Was there any Companion exchange that crossed a line into pseudo-therapy?"
2. "What's missing from the synthesis that you'd need for session prep?"
3. "What would have to change before you'd refer a patient to this app?"

**Pricing throwaway:** same as lawyer cohort.

**SUS:** standard.

### SUS Inventory (System Usability Scale)

These 10 items are the standardized SUS (Brooke, 1996), shown to all cohorts at the end of the end-of-session survey. **Do not modify the wording** — the SUS is only validated when used verbatim. The word "system" in the original may be replaced with "app" for clarity.

All items use a 5-point Likert scale: 1 = Strongly disagree, 2 = Disagree, 3 = Neither agree nor disagree, 4 = Agree, 5 = Strongly agree.

Odd-numbered items are positively-keyed; even-numbered items are negatively-keyed. The form should _not_ visually group them by polarity — they alternate in the original instrument to reduce response bias.

1. I think that I would like to use this app frequently.
2. I found the app unnecessarily complex.
3. I thought the app was easy to use.
4. I think that I would need the support of a technical person to be able to use this app.
5. I found the various functions in this app were well integrated.
6. I thought there was too much inconsistency in this app.
7. I would imagine that most people would learn to use this app very quickly.
8. I found the app very cumbersome to use.
9. I felt very confident using the app.
10. I needed to learn a lot of things before I could get going with this app.

**Scoring (handled in `lib/sus.ts`):**

- For odd items (1, 3, 5, 7, 9): score = response - 1
- For even items (2, 4, 6, 8, 10): score = 5 - response
- Sum all 10 scores, multiply by 2.5 → SUS score (0-100 scale)
- Store both raw responses and the calculated score in `sessions.sus_responses` (as `{responses: number[10], score: number}`)

A SUS score of 70+ is the pass threshold per the testing plan.

### Questions Inventory

To make it explicit which question lives where, here's the complete inventory across the prototype:

| Question source                            | Where it appears                 | When                           | Required?            |
| ------------------------------------------ | -------------------------------- | ------------------------------ | -------------------- |
| Inline micro-prompts (per-screen, 1-2 max) | Side panel, collapsible section  | During guided, on screen entry | No, always skippable |
| Custom Likerts (cohort-specific, 3 items)  | `/survey` route                  | After guided complete          | Yes                  |
| Open-text questions (cohort-specific, 2-3) | `/survey` route                  | After guided complete          | No, but encouraged   |
| SUS (10 items)                             | `/survey` route, last section    | After guided complete          | Yes                  |
| Pricing throwaway (providers only)         | `/survey` route, after SUS       | After SUS submission           | No                   |
| Moderator notes                            | Side panel bottom, `?mod=1` only | Throughout session             | N/A — moderator only |

Micro-prompts are for _in-the-moment_ reactions before the tester rationalizes. End-of-session questions are for _considered judgment_ after the full experience. SUS is the _standardized comparative anchor_. They don't overlap — each one captures a different moment in the tester's experience.

---

## Pause / resume / reset

### Pause affordance

Always visible. Top-right of the phone frame on desktop, top-right of the mobile header. Tappable icon (per DESIGN.md) → modal:

> **Pause**
>
> Take a break — your progress is saved. You can resume anytime.
>
> [ Resume now ] [ End session ]

Pausing logs `session_paused`. Resuming logs `session_resumed`. Ending routes to `/survey?ended=1`.

### Resume

If a tester closes the tab mid-scenario and returns to `/`:

1. localStorage has `sessionId`, `scenarioId`, and `lastScreenId`.
2. Check session against Supabase — confirm not `completed_at`.
3. Welcome screen shows: "Welcome back, {nickname}. You were on Step {n}. [Resume] [Start over]"
4. Resume → routes to `/guided` at the recorded screen. Start over → `session_reset` event, clear localStorage, back to `/`.

Resume restores screen position only. Chat history, journal text, micro-prompt answers do **not** restore in the UI. Note this in the moderator brief — for moderated sessions, plan to finish in one sitting.

### Reset

Hidden behind a key combo on `/` (or behind `?reset=1`): clears localStorage, fires `session_reset`. For moderator use between back-to-back testers on the same device.

---

## Telemetry

### Schema (`supabase/schema.sql`)

```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null,
  cohort text not null,           -- 'women' | 'lawyer' | 'clinician'
  scenario_id text not null,
  nickname text,
  started_at timestamptz not null default now(),
  consented_at timestamptz,
  guided_completed_at timestamptz,
  free_roam_started_at timestamptz,
  completed_at timestamptz,
  ended_early boolean default false,
  user_agent text,
  viewport_width int,
  is_moderated boolean default false,
  end_survey jsonb,
  sus_responses jsonb,
  pricing_response text
);

create table events (
  id bigserial primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  ts timestamptz not null default now(),
  screen_id text,
  event_type text not null,
  payload jsonb
);

create index events_session_ts_idx on events(session_id, ts);
create index sessions_invite_code_idx on sessions(invite_code);
create index sessions_cohort_idx on sessions(cohort);

alter table sessions enable row level security;
alter table events enable row level security;

create policy "anon insert sessions" on sessions
  for insert to anon with check (true);
create policy "anon insert events" on events
  for insert to anon with check (true);
create policy "anon update own session" on sessions
  for update to anon using (true) with check (true);
```

### Event types

```
session_start, consent_given, consent_declined,
session_paused, session_resumed, session_reset, session_completed,
screen_enter, screen_exit,
button_tap, text_input, chat_send, chat_ai_reply,
handoff_chip_tap, journal_save, incident_save,
crisis_button_tap, crisis_resolved,
micro_prompt_answer, survey_answer, sus_complete,
moderator_note, free_roam_start, view_as_user_toggle,
pdf_download,
tour_step_shown, tour_step_advanced, tour_idle_30s, tour_idle_60s,
tour_idle_90s, tour_off_path, tour_skipped
```

### Logging rules

- **Text input:** debounced on blur or send (2s for blur). Never keystroke-level. Final string only.
- **Chat:** full user text on send, full AI text on render.
- **Batching:** queue in memory, flush every 5 seconds, immediately on screen_enter / session_completed / page unload (via `navigator.sendBeacon`).
- **Resilience:** failed flushes back up to localStorage under `grace_telemetry_backup`, retry on next app load.
- **Privacy:** no PII fields ever logged. Nickname is the only identifier and is tester-chosen.

---

## Build phases

Each phase has a definition of done. Don't skip ahead — phase 0's telemetry foundation is the single most important thing in this build.

### Phase 0 — Scaffold (1-2 days)

- Vite + React + TS + Tailwind.
- Router with all top-level routes as placeholders.
- Tailwind config imports tokens from DESIGN.md.
- Zustand store skeleton.
- Supabase client, schema deployed, env configured.
- `telemetry.ts` with batched flush — verified by a test button that inserts a dummy event.

**Done when:** a button on a placeholder route inserts a row into Supabase events table.

### Phase 1 — Onboarding (1-2 days)

- Welcome screen: nickname + invite code, validation, scenario lookup.
- Consent screen: trigger warning + cohort-specific copy + distress disclosure for women cohort.
- Session creation in Supabase on consent.
- Resume detection on `/`.
- Pause affordance modal (placeholder action ok at this phase).

**Done when:** entering a valid code creates a session, consent records timestamp, refresh resumes correctly.

### Phase 2 — Layout shells + tour engine (2-3 days)

- `DesktopFrame` with phone chrome + side panel docked right.
- `DesktopBrowserFrame` variant for provider screens.
- `MobileFrame` with slide-up drawer.
- Viewport switch at 1024px.
- `SidePanel` renders from a hard-coded config for one screen.
- **Driver.js integration:** `useGuidedTour` hook, idle detection (30s/60s/90s), off-path detection, telemetry events.
- All styling per DESIGN.md.

**Done when:** resizing browser switches modes cleanly, side panel reads from config, and a sample tour overlay highlights an element with the idle nudge firing on schedule.

### Phase 3 — Women guided: Companion (Scenarios A + B) (3-4 days)

- Screens A1, A2, B1, B2, B3, B4, B5 (companion, both scripts, handoff bridge).
- Bottom nav, screen header, crisis button chrome.
- Scripted chat engine (`scriptedChat.ts`) with typing indicator.
- Handoff chips.
- Side panel + micro-prompts for all screens.
- "Let go for now" → fade-clear-return behavior.

**Done when:** Scenarios A and B both run end-to-end via guided runner, all events logged.

### Phase 4 — Women guided: Journal + Incident (Scenarios C, D, E) (3-4 days)

- Journal screens: free flow editor, guided editor, summary card, breath reminder, completion screen, AI annotation overlay.
- Incident log: form, hash receipt visual, post-save offers.
- Carry-over from Companion (preloaded summary card on journal).
- All side panel content.

**Done when:** Scenarios C, D, E run end-to-end, full women-cohort guided experience flows from start to survey.

### Phase 5 — End survey + SUS (1-2 days)

- `EndSurvey` route with cohort-aware question rendering.
- SUS form (10 items, standard).
- Likert components, open-text components.
- Submit writes to session row.
- `Done` thank-you screen.

**Done when:** a women-cohort tester can complete consent → guided → survey → done with all data captured.

### Phase 6 — Lawyer guided dashboard (3-4 days)

- Browser-frame chrome for lawyer screens.
- L1-L7 screens including corpus chat with canned + keyword-triggered responses.
- `scripts/generate-export-pdfs.ts` — Node script that generates `public/legal-export-sample.pdf` and `public/clinical-export-sample.pdf`. Run once, commit the PDFs, reference statically.
- PDF download button serves the static file.
- Activity log + notes.
- Lawyer-specific survey questions including pricing.

**Done when:** lawyer cohort completes guided end-to-end including PDF download. Both PDFs exist in `public/` and are 15-20 pages each.

### Phase 7 — Clinician guided dashboard (2 days)

- CL1-CL7 — same structure as lawyer with softer copy and psych-framed corpus chat.
- Clinical PDF variant.
- Clinician-specific survey.

**Done when:** clinician cohort completes guided end-to-end.

### Phase 8 — Free roam (3-4 days)

- Mode select screen after guided complete.
- Community feed (preloaded).
- Pathway discovery (map placeholder + station profiles + comments).
- Marketplace (filter, listings, profile, request flow, allow-sharing toggle, preview, confirmation).
- Emergency banner + crisis routing.
- "View as user" toggle for providers.
- Persistent "finish your session" banner during free roam.

**Done when:** all three cohorts have working free roam, telemetry tracks free roam events distinctly from guided.

### Phase 9 — Polish + admin + reliability (2-3 days)

- Animation pass per DESIGN.md.
- Error boundary at route level with recovery.
- Mobile drawer interaction refinement.
- `/admin?key=...` route: list sessions, download JSON dump, basic filters by cohort + completion status.
- Telemetry retry logic verified under network failure.
- Browser back-button doesn't break scenario flow (handle via Zustand, not history).

**Done when:** a non-technical moderator can run a session start-to-finish without help and extract clean data after.

### Phase 10 — Dry runs + protocol calibration (built into validation phase week 1)

- Internal team run-throughs of each cohort's full flow.
- Gatekeeper review of women's consent + scenario copy.
- Wizard protocol calibration if any guided AI responses need adjusting based on dry runs.

**Done when:** at least one full successful end-to-end run per cohort, with the data inspected in Supabase by a moderator other than the builder.

---

## Working with this spec

- Read the relevant screen description in `research/screen-flows.md` before building each screen.
- Read DESIGN.md before any styling.
- Read `research/testing-plan.md` if you're unsure why a feature exists — most design decisions trace back to a specific test card or risk mitigation.
- When behavior isn't specified here, ask — especially for crisis-adjacent or survivor-touching screens.
- Commit at phase boundaries.
- Components stay dumb. Logic in `lib/` and `store.ts`.
- Surface conflicts between this file, DESIGN.md, and the testing plan rather than resolving silently.
