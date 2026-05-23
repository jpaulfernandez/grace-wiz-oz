# Grace — Copy Rewrite & Survey Update Guide

This document is the source of truth for rewriting all participant-facing copy in the Grace Wizard-of-Oz prototype and survey flow. Hand this to the coding agent and have it apply the changes verbatim.

---

## Part 1 — Tone & Voice Guide

Before touching any specific copy, apply this voice across the whole frontend.

### Who is reading this

Two audiences with different registers:

- **Participants (women cohort)** — adults who have not read the validation plan. They opened a link, sat down, and are now trying to figure out what to do. Write to them like a calm friend giving directions, not a product team launching a feature.
- **Providers (lawyers and clinicians)** — professionals reading prototype copy in a 75-minute session. They expect domain-appropriate language. Use the terms they actually use in practice. Don't oversimplify, but don't add marketing varnish either.

### Rules for the participant voice

- Plain English. No "somatic," no "Pennebaker," no "austere editorial-minimal sanctuary," no "cryptographic," no "AI partner."
- Second person. "You'll see," "tap the Companion card."
- Short sentences. One idea per sentence where possible.
- No marketing adjectives. Cut "supportive," "secure," "intuitive," "powerful," "structured" when they're decorative rather than informative.
- No praise or celebration of the participant for tapping a button. No "Great!" or "Well done."
- Skip the framing sentence when the instruction is enough. If the panel says "Tap the Companion card to open the chat," it doesn't also need "Welcome! In this scenario you will be exploring the Companion feature."

### Rules for the provider voice

- **Lawyers:** use the legal terms they'd use. "Intake," "client matter," "evidence," "chain of custody," "consultation request" are fine. Don't say "consultation request notification card."
- **Clinicians:** use clinical-adjacent language without overclaiming. "Session preparation," "patient," "between-session activity," "referral" are fine. Avoid pseudo-clinical jargon the app hasn't earned ("somatic flags" is fine because that's what the synthesis literally produces; "trauma-informed reflective modality" is not).
- Still no marketing varnish. "Encrypted Incident Logs and Somatic Journals" → "encrypted incident logs and journal entries."
- Mention what the artifact is and what they're being asked to do with it. Skip the throat-clearing.

### Words to cut on sight (across the whole app)

- "Austere," "editorial-minimal," "sanctuary"
- "Somatic AI chat partner," "AI partner"
- "Cryptographic," "blockchain authority"
- "Pennebaker-style"
- "Sounding board" (decorative)
- "Absolute restraint" (overclaims)
- "Process," "secure," "structured" when used as decoration
- "Welcome to Grace" as a section header inside scenarios (it's redundant; the participant already arrived)

### Em dashes and formatting

- Em dashes (`—`) are fine in moderation. Don't string two into one sentence.
- Bold the action ("Tap **Companion**"), not the noun for emphasis ("the **Companion** card is **important**"). One bolded thing per sentence.
- Numbered steps in side panels are good when there's a sequence. Don't number a single instruction.

---

## Part 2 — Global Frontend Sweep Instructions (for the coding agent)

Before applying the per-scenario rewrites in Part 3, do a sweep across the entire frontend to align voice and language.

### Scope

Scan and update copy in:

1. **Prototype phone screens** — all screen titles, body text, button labels, microcopy, placeholder text inside the simulated app (e.g., "Welcome back, Paul.", "A space to breathe.", card descriptions like "Chat safely with a virtual companion to process somatic stress.")
2. **Side panel** — scenario labels, side panel instructions, instruction step labels, popover titles and descriptions, step counter language
3. **Top chrome** — `Study Info`, `I need help`, `Pause / End`, `Exit scenario` buttons and any modals they open
4. **Microprompt forms** — Likert question wording, single-choice options, button labels (`Submit`, `Next`, `Skip`)
5. **Transition screens** — the "scenario complete" screens, the post-guided message about free roam or ending the session
6. **Survey page (`/survey`)** — SUS items, post-session Likerts, open-text questions, intro and closing copy

### Replacements to apply globally

Run these as find-and-replace candidates, then review each hit in context:

| Find (case-insensitive)                                       | Replace with                                                                                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "somatic AI chat partner"                                     | "the Companion"                                                                                                                                           |
| "supportive AI partner"                                       | "the Companion"                                                                                                                                           |
| "austere, editorial-minimal sanctuary"                        | "a private space"                                                                                                                                         |
| "cryptographic receipt"                                       | "timestamp receipt"                                                                                                                                       |
| "blockchain authority hash"                                   | "timestamp"                                                                                                                                               |
| "secure blockchain authority"                                 | "timestamp"                                                                                                                                               |
| "Pennebaker-style structured prompts"                         | "guided prompts"                                                                                                                                          |
| "to process somatic stress"                                   | "to think things through"                                                                                                                                 |
| "sounding board with absolute restraint"                      | "a sounding board"                                                                                                                                        |
| "Chat safely with a virtual companion"                        | "Talk through what's on your mind"                                                                                                                        |
| "Secure, unguided free writing space to write your own story" | "Write freely. No prompts, no structure."                                                                                                                 |
| "encrypted Incident Logs and Somatic Journals"                | "encrypted incident logs and journal entries"                                                                                                             |
| "Welcome back, Paul."                                         | "Welcome back, Jane." (use Jane consistently — Paul appears to be a leftover from earlier dev; Jane is the consistent persona name in the provider flows) |

### Things to leave alone

- The phone status bar and time display (`1:43`, signal icons)
- Bottom nav labels (`Companion`, `Journal`, `Incident Log`, `More`) — these are correct as-is
- Crisis pathway button labels — these are out of scope for this rewrite and need separate review
- Anything inside placeholder data shown in the synthesis preview, hash receipt block, or sample entries — those are intentionally textured

---

## Part 3 — Per-Scenario Rewrites

The structure below mirrors the TS config. For each scenario, replace:

- `label`
- Each step's `title`
- Each step's `sidePanelInstruction` (markdown)
- Each `instructionStep.label`
- Each `popover.title` and `popover.description`

The `id`, `screenId`, `selector`, `completedWhen`, `advanceOn`, and `allowedSelectors` fields are unchanged.

---

### Scenario 0 — Orientation

**Note:** since you're shipping only `women-combined` for participants, the orientation only needs to be updated in that session config and in `SCENARIO_0_ORIENTATION_PROVIDER` for providers.

#### `label`

```
Getting started
```

#### Step `orientation-prototype`

**`title`**

```
Welcome
```

**`sidePanelInstruction`**

```markdown
### Welcome

Thanks for being part of this session. You'll spend about 60 minutes walking through **Grace**, a prototype space for women navigating gender-based harm.

The phone on your left is the prototype. You'll tap and interact with it the way you would a real app. A researcher is playing the part of the Companion live, so the chat replies are real even when other parts of the screen are simulated.

Tap **Next step** when you're ready.
```

**Instruction step `see-prototype`**

- `label`: `The prototype is on the left`
- `popover.title`: `The prototype`
- `popover.description`: `This is what you'll interact with. We'll point to what to tap as we go.`

---

#### Step `orientation-side-panel`

**`title`**

```
This panel guides you
```

**`sidePanelInstruction`**

```markdown
### This panel guides you

Each scenario shows up here with:

- A short explanation of what you're about to do
- A checklist of small steps to follow
- A pointer on the prototype showing where to tap

If you lose your place, tap any row in the checklist and we'll point you back to the right spot.

Tap **Next step** to continue.
```

---

#### Step `orientation-help`

**`title`**

```
If you need help
```

**`sidePanelInstruction`**

```markdown
### If you need help

At the top of the screen, **I need help** reaches the researcher running this session. **Study info** explains what we're testing and how your data is handled.

You can pause, skip, or stop at any time without affecting your compensation. There are no wrong answers, and "I don't know" is always a valid response.

Tap **Next step** to continue.
```

**Instruction step `see-help`**

- `label`: `I need help is at the top-left`
- `popover.title`: `Need help?`
- `popover.description`: `Tap here any time to reach the researcher.`

**Instruction step `see-study-info`**

- `label`: `Study info is next to it`
- `popover.title`: `About this study`
- `popover.description`: `Tap to see what we're testing and how your data is handled.`

---

#### Step `orientation-reflections`

**`title`**

```
Quick reflections along the way
```

**`sidePanelInstruction`**

```markdown
### Quick reflections along the way

Between scenarios, the prototype will pause and a short question or two will appear here in the panel. They look something like this:

> **Example only — not recorded**
> _I feel comfortable using a digital tool to discuss sensitive concerns._
>
> 1 (Strongly disagree) to 5 (Strongly agree)

Please answer honestly. These short reflections are how we tell whether Grace is working the way it should.

Tap **Next step** when you're ready for your first reflection.
```

---

### Scenario A — Green jokes (women-combined)

#### `label`

```
A workplace situation
```

#### `description`

```markdown
### A workplace situation

A coworker keeps making sexual jokes at the office. You're not sure if it counts as harassment.
```

#### Step `scenario-a-home`

**`title`**

```
Open the Companion
```

**`sidePanelInstruction`**

```markdown
### Open the Companion

Grace has a few different spaces. The **Companion** is for talking through what's on your mind.

Tap the **Companion** card on the phone to open it.
```

**Instruction step `tap-companion-card`**

- `label`: `Tap the Companion card`
- `popover.title`: `Companion`
- `popover.description`: `Open a chat with the Companion.`

---

#### Step `scenario-a-chat`

**`title`**

```
Talk it through
```

**`sidePanelInstruction`**

```markdown
### Talk it through

You're now in the Companion. It's a space to think out loud. The Companion replies, but it won't tell you what your experience is — that's up to you.

1. Tap the **suggested prompt** chip to drop a sample message into the input.
2. Tap **Send**.
3. After the Companion replies, tap **Let go for now** to close the conversation without saving it.
```

**Instruction step `tap-suggestion-chip`**

- `label`: `Tap the suggested prompt`
- `popover.title`: `Suggested prompt`
- `popover.description`: `Tap to drop a sample message into the input. You don't need to type anything yourself.`

**Instruction step `tap-send`**

- `label`: `Send the message`
- `popover.title`: `Send`
- `popover.description`: `Send the message. The researcher will reply as the Companion would.`

**Instruction step `select-let-go`**

- `label`: `Tap "Let go for now"`
- `popover.title`: `Let go for now`
- `popover.description`: `Close the conversation without keeping a record of it.`

---

### Scenario B — Work anxiety (women-combined)

#### `label`

```
Heading to work
```

#### `description`

```markdown
### Heading to work

It's Monday morning. You feel anxious about going to the office because of the coworker from the last scenario.
```

#### Step `scenario-b-home`

**`title`**

```
Open the Companion
```

**`sidePanelInstruction`**

```markdown
### Open the Companion

Tap the **Companion** card on the phone.
```

**Instruction step `tap-companion-card-b`**

- `label`: `Tap the Companion card`
- `popover.title`: `Companion`
- `popover.description`: `Open a chat with the Companion.`

---

#### Step `scenario-b-chat`

**`title`**

```
Move it into the journal
```

**`sidePanelInstruction`**

```markdown
### Move it into the journal

Sometimes a conversation is worth keeping. The Companion can hand off what you've talked about into the journal, where you can write more about it on your own.

1. Tap the **suggested prompt** to fill in the input.
2. Tap **Send**.
3. When the Companion replies, tap **Continue to journal** to move the conversation into your journal.
```

**Instruction step `tap-suggestion-chip-b`**

- `label`: `Tap the suggested prompt`
- `popover.title`: `Suggested prompt`
- `popover.description`: `Tap to drop a sample message into the input.`

**Instruction step `tap-send-b`**

- `label`: `Send the message`
- `popover.title`: `Send`
- `popover.description`: `Send the message to the Companion.`

**Instruction step `select-continue-journal`**

- `label`: `Tap "Continue to journal"`
- `popover.title`: `Continue to journal`
- `popover.description`: `Carry this conversation into your journal so you can write more about it.`

---

#### Step `journal-handoff`

**`title`**

```
Write what you're feeling
```

**`sidePanelInstruction`**

```markdown
### Write what you're feeling

A short summary of your chat is already at the top of the journal entry. You can keep it, edit it, or ignore it.

1. Write a sentence or two about how you're feeling.
2. Tap **Save entry** at the top right.
```

**Instruction step `jh-write`**

- `label`: `Write a sentence about how you're feeling`
- `popover.title`: `Write freely`
- `popover.description`: `Type a short sentence. There's no right way to do this.`

**Instruction step `jh-save`**

- `label`: `Save the entry`
- `popover.title`: `Save`
- `popover.description`: `Save what you've written. Grace doesn't comment on it — it just saves.`

---

#### Step `scenario-b-breath`

**`title`**

```
Take a breath
```

**`sidePanelInstruction`**

```markdown
### Take a breath

After a heavier entry, Grace offers a short breathing pause. Follow the circle on the phone for a few seconds.

Tap **Next step** when you're ready.
```

---

### Scenario C — Pattern surfacing (women-combined)

#### `label`

```
Looking back over time
```

#### `description`

```markdown
### Looking back over time

You've written a few entries over the past few weeks. Grace can look across them and point out things you've mentioned more than once.
```

#### Step `scenario-c-offers`

**`title`**

```
Ask Grace to look for patterns
```

**`sidePanelInstruction`**

```markdown
### Ask Grace to look for patterns

After you save an entry, Grace offers a few things you can do next. One of them is to look across your past entries for things that keep coming up.

Tap **Help me notice patterns**.
```

**Instruction step `tap-notice-patterns`**

- `label`: `Tap "Help me notice patterns"`
- `popover.title`: `Help me notice patterns`
- `popover.description`: `Let Grace look across your entries and flag what comes up more than once.`

---

#### Step `scenario-c-annotations`

**`title`**

```
See what came up
```

**`sidePanelInstruction`**

```markdown
### See what came up

Grace marks phrases in your entries it noticed. Each one is something that appeared more than once or seemed worth pointing out.

1. Tap one of the highlighted phrases (the colored numbers in your text) to see what Grace flagged.
2. Tap **Close** to return.
```

**Instruction step `tap-annotation-phrase`**

- `label`: `Tap a highlighted phrase`
- `popover.title`: `A note from Grace`
- `popover.description`: `Each highlight is something Grace flagged. Tap to read what it noticed.`

**Instruction step `tap-close-annotation`**

- `label`: `Tap "Close" when you've read it`
- `popover.title`: `Close`
- `popover.description`: `Return to your journal.`

---

### Scenario D — Prompted journaling (women-combined)

#### `label`

```
Writing with a prompt
```

#### `description`

```markdown
### Writing with a prompt

Sometimes a blank page is too much. Grace has guided prompts that give you somewhere to start.
```

#### Step `scenario-d-home`

**`title`**

```
Open the journal
```

**`sidePanelInstruction`**

```markdown
### Open the journal

Tap the **Reflective Journal** card on the phone.
```

**Instruction step `tap-journal-card`**

- `label`: `Tap the Reflective Journal card`
- `popover.title`: `Reflective Journal`
- `popover.description`: `Open the journal.`

---

#### Step `scenario-d-modes`

**`title`**

```
Pick a guided session
```

**`sidePanelInstruction`**

```markdown
### Pick a guided session

The journal has two modes. **Free flow** is a blank page. **Guided** gives you a few short prompts to write into.

Tap **Guided**.
```

**Instruction step `tap-guided-btn`**

- `label`: `Tap "Guided"`
- `popover.title`: `Guided`
- `popover.description`: `Use short prompts to help you start.`

---

#### Step `scenario-d-editor`

**`title`**

```
Save the entry
```

**`sidePanelInstruction`**

```markdown
### Save the entry

You can answer the prompts now, or just save the entry as-is and come back to it later.

Tap **Just save it**.
```

**Instruction step `tap-just-save`**

- `label`: `Tap "Just save it"`
- `popover.title`: `Just save it`
- `popover.description`: `Save the entry without writing anything more.`

---

### Scenario E — Incident logging (women-combined)

#### `label`

```
Writing it down as a record
```

#### `description`

```markdown
### Writing it down as a record

Sometimes you want to write something down in case you need it later — for yourself, or to share with someone. The incident log has fields for the date, place, and people involved, and saves the entry with a timestamp.
```

#### Step `scenario-e-home`

**`title`**

```
Open the incident log
```

**`sidePanelInstruction`**

```markdown
### Open the incident log

Tap **Incident Log** in the bottom nav.
```

**Instruction step `tap-incident-tab`**

- `label`: `Tap "Incident Log"`
- `popover.title`: `Incident Log`
- `popover.description`: `Open the incident log.`

---

#### Step `scenario-e-log`

**`title`**

```
Write what happened
```

**`sidePanelInstruction`**

```markdown
### Write what happened

The incident log has structured fields, but for this scenario a short description is enough.

1. Type a few sentences about what happened.
2. Tap **Save incident** at the bottom.
```

**Instruction step `sel-write`**

- `label`: `Type a short description`
- `popover.title`: `Describe the incident`
- `popover.description`: `Write a few sentences. The full version would have more fields, but this is enough for now.`

**Instruction step `sel-save`**

- `label`: `Tap "Save incident"`
- `popover.title`: `Save`
- `popover.description`: `Save the entry. Grace will add a timestamp.`

---

#### Step `scenario-e-hash`

**`title`**

```
Your timestamp receipt
```

**`sidePanelInstruction`**

```markdown
### Your timestamp receipt

After you save, Grace shows a timestamp receipt for the entry. This is what proves the entry hasn't been changed since you wrote it, in case you ever need that.

Tap **Next** to continue.
```

**Instruction step `tap-receipt-next`**

- `label`: `Tap "Next"`
- `popover.title`: `Next`
- `popover.description`: `Move on to your options.`

---

#### Step `scenario-e-offers`

**`title`**

```
Decide what to do next
```

**`sidePanelInstruction`**

```markdown
### Decide what to do next

After saving, Grace offers a few things you could do — share with a lawyer or clinician, look at your past entries, or just leave it for now.

Tap **Do nothing for now**.
```

**Instruction step `tap-do-nothing`**

- `label`: `Tap "Do nothing for now"`
- `popover.title`: `Do nothing for now`
- `popover.description`: `Save the record without taking any further action.`

---

### Lawyer scenarios — Standard

The lawyer voice is formal and uses the terminology a Philippine litigator handling RA 9262 or RA 11313 cases would actually use. The goal is for the lawyer to evaluate the artifact, not to learn how to operate the prototype.

#### Scenario label

```
Intake walkthrough
```

#### Step `la-home`

**`title`**

```
New consultation request
```

**`sidePanelInstruction`**

```markdown
### New consultation request

This is the receiving provider's dashboard. A prospective client has submitted a consultation request through Grace.

Tap the **Consultation request — Jane** notification to open it.
```

**Instruction step `la-open-intake`**

- `label`: `Open the consultation request`
- `popover.title`: `New consultation request`
- `popover.description`: `Open the request submitted by Jane.`

---

#### Step `la-view-intake`

**`title`**

```
Review the request and accept
```

**`sidePanelInstruction`**

```markdown
### Review the request and accept

The request shows a redacted client profile. The client's full identifying information is held back until you formally accept.

Review what's shown, then tap **Accept Request** to proceed and unlock evidence access controls.
```

**Instruction step `la-review-profile`**

- `label`: `Review the client profile`
- `popover.title`: `Client profile`
- `popover.description`: `Identifying details remain redacted until you accept.`

**Instruction step `la-accept-booking`**

- `label`: `Tap "Accept Request"`
- `popover.title`: `Accept`
- `popover.description`: `Formally accept the consultation. This unlocks evidence access.`

---

#### Step `la-view-records`

**`title`**

```
Request access to client records
```

**`sidePanelInstruction`**

```markdown
### Request access to client records

The client has elected to share two artifact types: encrypted incident logs and journal entries. Access is gated — you request, the client grants, and access is logged on both sides.

Request access to both. Then tap **Next**.
```

**Instruction step `la-request-incident`**

- `label`: `Request access to incident logs`
- `popover.title`: `Request incident logs`
- `popover.description`: `Request decryption access to the client's incident logs.`

**Instruction step `la-request-journal`**

- `label`: `Request access to journal entries`
- `popover.title`: `Request journal entries`
- `popover.description`: `Request decryption access to the client's journal entries.`

---

#### Step `la-chat-corpus`

**`title`**

```
Query the client's corpus
```

**`sidePanelInstruction`**

```markdown
### Query the client's corpus

The corpus chat lets you ask questions about the shared entries. Every answer cites the specific entry and paragraph it draws from. The client sees every question you ask and every answer returned.

Tap each of the three suggested questions to see how the corpus responds. Then tap **Next**.
```

**Instruction step `la-chat-timeline`**

- `label`: `Ask "Show me the timeline"`
- `popover.title`: `Query the corpus`
- `popover.description`: `Ask the corpus to surface a chronological account.`

**Instruction step `la-chat-evidence`**

- `label`: `Ask "What evidence is attached?"`
- `popover.title`: `Query the corpus`
- `popover.description`: `Ask what attached evidence the client has shared.`

**Instruction step `la-chat-named`**

- `label`: `Ask "Has she named what happened?"`
- `popover.title`: `Query the corpus`
- `popover.description`: `Ask whether the client has named the conduct in her own words.`

---

#### Step `la-intake-notes`

**`title`**

```
Add intake notes
```

**`sidePanelInstruction`**

```markdown
### Add intake notes

Review the AI synthesis and add your own intake notes. Your notes are kept separately from the synthesis and the client's entries.

Save a note, then tap **Next** to continue to the certified export.
```

**Instruction step `la-save-notes`**

- `label`: `Add and save an intake note`
- `popover.title`: `Save note`
- `popover.description`: `Type a brief intake note and save.`

**Instruction step `la-continue-export`**

- `label`: `Continue to the certified export`
- `popover.title`: `Continue`
- `popover.description`: `Move on to the export preview.`

---

#### Step `la-export`

**`title`**

```
Review the certified export
```

**`sidePanelInstruction`**

```markdown
### Review the certified export

The certified export is the PDF you'd attach to a pleading or share with co-counsel. It includes the synthesis, the cited excerpts, the hash receipts, and the timestamp chain for each incident log.

Review the export, then tap **End Review** to finish.
```

**Instruction step `la-end-review`**

- `label`: `Tap "End Review" when done`
- `popover.title`: `End Review`
- `popover.description`: `Finish the walkthrough.`

---

### Clinician scenarios — Standard

The clinician voice uses clinical-adjacent language without overclaiming what Grace does. The goal is for the clinician to evaluate the artifact for between-session use and session preparation.

#### Scenario label

```
Patient intake walkthrough
```

#### Step `ca-home`

**`title`**

```
New referral
```

**`sidePanelInstruction`**

```markdown
### New referral

This is the receiving provider's dashboard. A prospective patient has shared her Grace artifacts and requested an initial consultation.

Tap the **Referral — Jane** notification to open it.
```

**Instruction step `ca-open-intake`**

- `label`: `Open the referral`
- `popover.title`: `New referral`
- `popover.description`: `Open the referral from Jane.`

---

#### Step `ca-view-intake`

**`title`**

```
Review the referral and accept
```

**`sidePanelInstruction`**

```markdown
### Review the referral and accept

The referral shows a redacted patient profile. Full identifying details are held back until you accept.

Review what's shown, then tap **Accept Request** to proceed.
```

**Instruction step `ca-review-profile`**

- `label`: `Review the patient profile`
- `popover.title`: `Patient profile`
- `popover.description`: `Identifying details remain redacted until you accept.`

**Instruction step `ca-accept-booking`**

- `label`: `Tap "Accept Request"`
- `popover.title`: `Accept`
- `popover.description`: `Accept the referral to unlock access to her shared artifacts.`

---

#### Step `ca-view-records`

**`title`**

```
Request access to shared artifacts
```

**`sidePanelInstruction`**

```markdown
### Request access to shared artifacts

The patient has shared two artifact types: encrypted incident logs and journal entries. Access is gated — you request, the patient grants, and the access is logged on both sides.

Request access to both. Then tap **Next**.
```

**Instruction step `ca-request-incident`**

- `label`: `Request access to incident logs`
- `popover.title`: `Request incident logs`
- `popover.description`: `Request access to the patient's incident logs.`

**Instruction step `ca-request-journal`**

- `label`: `Request access to journal entries`
- `popover.title`: `Request journal entries`
- `popover.description`: `Request access to the patient's journal entries.`

---

#### Step `ca-chat-corpus`

**`title`**

```
Query the patient's corpus
```

**`sidePanelInstruction`**

```markdown
### Query the patient's corpus

The corpus chat lets you ask questions about what the patient has shared. Every answer cites the entry and paragraph it draws from. The patient sees every question and answer.

Tap each of the three suggested questions to see how the corpus responds. Then tap **Next**.
```

**Instruction step `ca-chat-timeline`**

- `label`: `Ask "Show me the timeline"`
- `popover.title`: `Query the corpus`
- `popover.description`: `Ask for a chronological account.`

**Instruction step `ca-chat-evidence`**

- `label`: `Ask "What evidence is attached?"`
- `popover.title`: `Query the corpus`
- `popover.description`: `Ask what supporting material the patient has attached.`

**Instruction step `ca-chat-named`**

- `label`: `Ask "Has she named what happened?"`
- `popover.title`: `Query the corpus`
- `popover.description`: `Ask whether the patient has named her experience in her own words.`

---

#### Step `ca-intake-notes`

**`title`**

```
Add session-prep notes
```

**`sidePanelInstruction`**

```markdown
### Add session-prep notes

Review the AI synthesis and add notes for your first session with this patient. Your notes are kept separately from the synthesis and the patient's entries.

Save a note, then tap **Next** to continue to the export.
```

**Instruction step `ca-save-notes`**

- `label`: `Add and save a session-prep note`
- `popover.title`: `Save note`
- `popover.description`: `Type a brief note for session prep and save.`

**Instruction step `ca-continue-export`**

- `label`: `Continue to the export`
- `popover.title`: `Continue`
- `popover.description`: `Move on to the export preview.`

---

#### Step `ca-export`

**`title`**

```
Review the export
```

**`sidePanelInstruction`**

```markdown
### Review the export

The export is what you'd file in the patient's record. It includes the synthesis, the cited excerpts, and the patient's somatic and pattern flags.

Review the export, then tap **End Review** to finish.
```

**Instruction step `ca-end-review`**

- `label`: `Tap "End Review" when done`
- `popover.title`: `End Review`
- `popover.description`: `Finish the walkthrough.`

---

## Part 4 — New Microprompt: Scenario E Reflection

Add a `reflection` block to Scenario E in `women-combined`. The current scenario has no reflection — this fills the gap.

### Place

In `women-combined`, inside the `scenario-e-incidents` scenario object, after the `steps` array, add:

```typescript
reflection: {
  id: 'reflection-scenario-e',
  title: 'A quick reflection',
  microPrompts: [
    {
      id: 'incident-record-confidence',
      type: 'likert-5',
      question: 'The incident log felt like a place I could record something I might need later.',
      required: true
    }
  ]
}
```

### Why this wording

It tests the actual job-to-be-done (recording something for potential future use) without leading the participant toward a positive answer the way "made it easier" does. A participant who didn't trust the log can rate this low, and you can tell why.

---

## Part 5 — Rewording the Existing Microprompts

These are the prompt-by-prompt rewrites for items flagged as leading, inconsistent, or under-calibrated.

### `chat-restraint` (Scenario A)

**Current:** single-choice, options `['Supportive', 'Neutral', 'Frustrating']`
**Change to:** likert-5

```typescript
{
  id: 'chat-restraint',
  type: 'likert-5',
  question: 'The way the Companion held back from defining my experience felt supportive.',
  required: true
}
```

Brings it in line with the rest of the Likert set and lets you compute medians across all per-scenario items.

### `summary-useful` (Scenario B)

**Current:** "The carry-over summary made it easier to move from chat into the journal."

**Change to:**

```
Moving from the chat into the journal felt natural to me.
```

Removes the presupposition that the summary made things easier.

### `annotation-helpful` (Scenario C)

**Current:** "The highlighted annotations helped me better understand what I have been going through."

**Change to:**

```
The highlighted phrases reflected things I felt were worth pointing out.
```

Tests whether Grace's flagging matches the participant's own sense of what's significant, instead of asking the participant to agree that she understands herself better.

### `combined-no-ai-comfort` (Scenario D)

**Current:** "The guided journaling prompts helped me process what I was going through, even without an AI companion."

**Change to:**

```
The guided prompts gave me somewhere to start.
```

Drops the loaded "process," doesn't presuppose the prompts helped, and lets the participant rate it on what it actually does.

---

## Part 6 — Post-Session Survey Rewrites (`/survey`)

These are the items shown on the standalone survey page after the guided portion ends.

### Women cohort — post-session Likerts

| Question ID                   | Final wording                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| `would-write-here`            | I would write what is happening to me in this app.                                      |
| `trust-words`                 | I trust this app with what I write in it.                                               |
| `would-tell-another-woman`    | If a woman I knew was going through something similar, I would mention this app to her. |
| `nothing-felt-unsafe` _(new)_ | Nothing in this app felt unsafe to me.                                                  |

The new `nothing-felt-unsafe` item is required to measure the Test Card 1.1 safety criterion directly. Add it to the women post-session reflection block in `women-combined`:

```typescript
{
  id: 'nothing-felt-unsafe',
  type: 'likert-5',
  question: 'Nothing in this app felt unsafe to me.',
  required: true
}
```

The reworded `would-tell-another-woman` softens the bar from "actively recommend" to "mention if relevant" — a more accurate read for the survivor cohort.

The reworded `trust-words` replaces "with my words" (which reads as poetic-app-marketing) with the plainer phrasing.

### Women cohort — open-text questions

| Question ID              | Final wording                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `safe-or-unsafe-open`    | What about this app made you feel safe, or unsafe?                                      |
| `would-not-write-open`   | Was there anything you would not write into this app, even if it were happening to you? |
| `worse-for-someone-open` | What would make this app worse for someone you know?                                    |

These are unchanged from the existing survey doc — they were already well-phrased.

### Lawyer cohort — post-session Likerts

| Question ID                  | Final wording                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `legal-synthesis-useful`     | The legal-lens synthesis would be useful for case preparation.                                                               |
| `hash-defensible`            | The hash-receipt and timestamp model, as a concept, could be defensible under cross-examination if implemented as described. |
| `accept-shared-links-lawyer` | I would accept shared Grace links from clients as a receiving provider on this platform.                                     |

The `hash-defensible` rewrite makes the concept-vs-implementation distinction explicit, which your validation plan already promises participants verbally — pull that into the item itself.

### Lawyer cohort — open-text questions

| Question ID                 | Final wording                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `incident-fields-open`      | Which fields in the incident log are essential for admissibility, and what's missing?                                                                   |
| `citation-breakdown-open`   | Where does the citation-chip or corpus-chat model break down?                                                                                           |
| `client-matter-change-open` | What would have to change before you'd use this with an actual client matter?                                                                           |
| `pricing-throwaway-open`    | If this platform charged providers for receiving client links and using the corpus chat, what would feel reasonable, and what would feel disqualifying? |

### Clinician cohort — post-session Likerts

| Question ID                     | Final wording                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `clinical-synthesis-useful`     | The clinical-lens synthesis would be useful for session preparation.                |
| `recommend-to-patient`          | I would recommend a patient use this between sessions.                              |
| `accept-shared-links-clinician` | I would accept shared links from patients as a receiving provider on this platform. |

### Clinician cohort — open-text questions

| Question ID                    | Final wording                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `companion-line-open`          | Was there any Companion exchange that crossed a line into pseudo-therapy?                                                                               |
| `missing-from-synthesis-open`  | What's missing from the synthesis that you'd need for session prep?                                                                                     |
| `patient-referral-change-open` | What would have to change before you'd refer a patient to this app?                                                                                     |
| `pricing-throwaway-open`       | If this platform charged providers for receiving client links and using the corpus chat, what would feel reasonable, and what would feel disqualifying? |

---

## Part 7 — SUS Items (no changes recommended)

The 10 SUS items are standardized and should not be reworded — doing so would break comparability with the SUS scoring rubric and with other studies. Keep them as-is.

For reference, the 10 items in standard order:

1. I think that I would like to use this app frequently.
2. I found the app unnecessarily complex.
3. I thought the app was easy to use.
4. I think that I would need the support of a technical person to be able to use this app.
5. I found the various functions in this app were well integrated.
6. I thought there was too much inconsistency in this app.
7. I would imagine that most people would learn to use this app very quickly.
8. I felt very confident using the app.
9. I needed to learn a lot of things before I could get going with this app.
10. I found the app very cumbersome to use.

If you do want to change anything, the only safe change is the wording "this app" — you can replace it with "Grace" globally without breaking the scale. Pick one and apply it consistently.

---

## Part 8 — Post-Guided Transition Screen

After the participant finishes the guided portion, show a short thank-you and a single forward button into the survey. Do not offer an opt-out at this point. The free-roam / end-session screen still exists, but moves to _after_ the survey.

### New copy for the post-guided screen

**Heading**
Thank you for going through that.

**Body**

```markdown
You're almost done. We just have a few closing questions to ask before we wrap up.

I hope you're doing okay. Take a moment if you need one, then tap below when you're ready.
```

**Button (single)**
Continue to closing questions

### Behavior

- **Continue to closing questions** — proceeds to `/survey`.
- No second button, no opt-out copy on this screen. If the participant needs to stop, the standard **Pause / End** control in the top-right of the chrome is still available — but it isn't surfaced as a presented option here.

### Post-survey screen (the existing free-roam / end-session message)

After the participant submits the survey, show the existing message offering free roam or ending the session. That's the right place for it — once the data you need is captured, the choice to keep exploring or wrap up is theirs.

---

## Part 9 — Wizard-of-Oz UI Recommendation

Beyond the copy rewrites, one structural change to the side panel will help with the "not intuitive enough" feedback.

### Auto-expand the current step

Right now the `Steps to follow` accordion appears to be collapsed by default (the `Show >` toggle is visible on the right). Auto-expand the current step so the participant sees the action they need to take without having to expand anything.

Specifically:

- The active step's row should be expanded and visible by default.
- Completed steps collapse with a check mark.
- Upcoming steps stay collapsed under the active one (or are simply hidden until reached, depending on what feels less busy).

This is a small change that significantly reduces the "what am I supposed to do" pause that's currently happening when participants land on a new step.

### What not to do

- Do **not** bake instructions into the prototype phone itself. The phone needs to look like the actual Grace UI, not an onboarding-wrapped version of it. If instructions are baked in, the post-session Likerts about safety, trust, and willingness to write will measure the onboarding wrapper rather than Grace.
- Do **not** add per-scenario "how are you feeling" check-ins. They double the cognitive load of every transition, can prime the next scenario's Likert, and can feel like surveillance for the survivor cohort. The single post-guided check-in in Part 8 is sufficient.

---

## Part 10 — Summary of File Changes

For the coding agent, here's the changeset at a glance:

### Files to modify

1. **`scenarios.ts`** (the config file shown in the second uploaded document)
   - Rewrite `label`, `description`, `sidePanelInstruction`, `title`, `instructionSteps[].label`, `popover.title`, and `popover.description` for every scenario in `women-combined`, `lawyer-standard`, and `clinician-standard`. Use the copy in Part 3.
   - Update `SCENARIO_0_ORIENTATION` and `SCENARIO_0_ORIENTATION_PROVIDER` per Part 3.
   - Add the new `reflection` block to `scenario-e-incidents` in `women-combined` per Part 4.
   - Rewrite the existing microprompt `question` fields per Part 5, and change `chat-restraint` from `single-choice` to `likert-5` (drop the `options` array).
   - Add `nothing-felt-unsafe` to the `women-combined` post-session reflection per Part 6.
   - Optionally remove or deprecate `women-order-a` and `women-order-b` since only `women-combined` is being used.

2. **Survey page (`/survey`)**
   - Apply the wording in Part 6 to all post-session Likert items, open-text items, and the pricing throwaway.
   - Leave SUS items as standard (Part 7), with a single optional global swap of "this app" → "Grace" if desired.

3. **Post-guided transition screen** (currently shows free-roam/end-session)
   - Replace with the check-in screen in Part 8.

4. **Side panel component**
   - Auto-expand the active step in the `Steps to follow` panel per Part 9.

### Files to leave alone (for now)

- Prototype phone screen contents beyond the dictionary in Part 2 (the synthesis preview, the hash receipt block, the sample entries — these have intentionally textured placeholder content that doesn't need re-voicing for this round).
- The crisis pathway buttons — these need separate review with a domain expert.

### Verification checklist for the coding agent

After applying all changes, verify:

- [ ] No occurrence of "somatic AI chat partner" anywhere in the codebase
- [ ] No occurrence of "Pennebaker" anywhere
- [ ] No occurrence of "austere editorial-minimal" anywhere
- [ ] No occurrence of "cryptographic" or "blockchain" in participant-facing copy
- [ ] Welcome name is "Jane" everywhere (not "Paul")
- [ ] `chat-restraint` is type `likert-5`, not `single-choice`
- [ ] Scenario E in `women-combined` has a `reflection` block
- [ ] `nothing-felt-unsafe` exists in the women post-session reflection
- [ ] Post-guided screen offers three options: break / continue / stop
- [ ] Side panel auto-expands the active step
