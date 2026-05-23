# Grace — Screen Flow Prototype Script v3

*This is the per-screen prototype guide for Google Stitch. It assumes the Component Rules document is loaded as global instructions.*

**How to use:** For each flow group, generate the screens in the order listed. The "State" lines tell you what data the screen should show (sample copy is real-feeling, not Lorem). The "Transition" lines tell you what triggers the next state. Build all states in a group before moving to the next group — same-group screens share visual context.

---

## Flow Group A — First Contact

*Goal: take her from app open to a chosen space in under 90 seconds, with no signup wall and no funnel.*

### A1 — Cold Open (Screen 1)
**State:** First-ever launch. No data, no account.
**Header:** none (full-screen greeting)
**Body:** centered, single line *"You don't have to explain yet. I'm here when you're ready."* Three vertical buttons below: **Begin**, **Just look around**, **I need help right now**. Tiny language toggle top-right: `EN | FIL`.
**Floating Crisis button:** hidden (the third button replaces it on this screen)
**Bottom nav:** hidden
**Transitions:**
- Begin → A2
- Just look around → A2 with anonymous-mode flag
- I need help right now → G1 (Crisis)
- Language toggle → reloads same screen in chosen language

### A2 — Three Doors (Screen 2)
**State:** Right after Cold Open. No data yet.
**Header:** *"Where would you like to start?"*
**Body:** three equal-weight cards, vertical:
- *Just to think things through* → Companion
- *I want to write what happened* → Journal
- *I'm trying to figure out my options* → Pathways
Below cards, small text: *"You can move between these any time."*
**Floating Crisis button:** present
**Bottom nav:** visible for the first time, all five items shown but none active yet
**Transitions:**
- Tap Companion card → B1
- Tap Journal card → C1
- Tap Pathways card → E1 (out of scope for this doc, see spec)
- Bottom nav tap → corresponding space

---

## Flow Group B — Companion (the AI conversation space)

*Goal: she can think out loud, the AI never names her experience, and she can opt to keep the conversation or carry it into the journal.*

### B1 — Companion Home, fresh session (Screen 3)
**State:** First Companion session ever, or returning with no retained threads. Chat area empty.
**Header:** *"A space to think."* Top-right menu icon (⋯).
**Body:** chat area shows a single AI message: *"Take your time. What's on your mind?"* Input bar at bottom with prompt-template icon (small) on the left and send arrow on the right.
**Floating Crisis button:** present
**Bottom nav:** visible, Companion active
**Transitions:**
- She types → B2
- Tap prompt template icon → B7 (Prompt Library)
- Tap ⋯ menu → shows two items: *Remember this conversation* (toggle, off), *Look at my journal* (action)

### B2 — Companion conversation in progress, example A (clinical-leaning chat)
**State:** She has sent one message. The AI has replied with restraint. Sample content:
- **Her:** *"i feel anxious going to work because i am not comfortable seeing my boss who harassed me"*
- **AI:** *"That's a lot to carry into a workday. Where in your body do you feel the anxiety most?"*
- **Her:** *"my chest tightens when i walk into the building. i avoid the elevator if i think he might be there"*
- **AI:** *"You're tracking what feels unsafe and adjusting. How long has the elevator thing been happening?"*
**Header:** *"A space to think."* with a small dot indicator if "Remember this" is on.
**Floating Crisis button:** present
**Bottom nav:** visible
**No handoff chips yet** — chips appear after 3+ substantive exchanges.

**Transitions:**
- She sends another message → continues conversation
- Tap ⋯ → menu shows *Remember this conversation*, *Look at my journal*

### B3 — Companion conversation with handoff chips visible
**State:** Same chat as B2, now 4 exchanges deep. Below the input bar, a soft chip row has appeared.
**Body additions:** chip row above the input: **Continue this in your journal** · **Log this as incident**
**Visual note for Stitch:** chips are sage-bordered, transparent fill, 32px tall, equal width, with a small subtle separator between them. They sit *above* the input, not blocking it.
**Transitions:**
- Tap *Continue this in your journal* → B5 (Handoff Bridge, free-flow suggestion)
- Tap *Log this as incident* → B5 (Handoff Bridge, incident-log suggestion)
- Keep chatting → chips stay until she dismisses or hands off

### B4 — Companion conversation, example B (legal-leaning chat)
**State:** Alternate sample showing a different lens scenario.
- **Her:** *"my workmate keeps throwing green jokes at me. is this harassment?"*
- **AI:** *"You're asking a real question — and I'm not the one to define it for you. Can you tell me what's been happening lately?"*
- **Her:** *"like every day he makes comments about my body when i pass by his desk. yesterday he said something about my underwear showing"*
- **AI:** *"That sounds like it's been ongoing. Has anyone else been around when this happens?"*
- **Her:** *"yes, two other officemates usually hear it. they don't say anything"*
- **AI:** *"You're noticing what's happening and who else is in the room. Would it help to put this down somewhere?"*

**Handoff chips appear after the AI's last message.** Same chip pair as B3.

**Visual note:** the AI's restraint is the test here — it does NOT say "yes that's harassment under RA 11313." It mirrors and asks.

### B5 — Companion-to-Journal Handoff Bridge (Screen 3a)
**State:** She tapped *Continue this in your journal* from B3 (anxiety/boss chat).
**Header:** *"Carry this into your journal."* Back arrow on the left.
**Body:**
- Card 1 (carry-over summary, with a distinct soft-amber tinted background so it's visually marked as "not part of your journal"):
  - Small label: *"From your chat — a quick reminder, not saved with your entry."*
  - Summary text (AI-generated, brief, in second person): *"You've been feeling anxious going into work. Your chest tightens when you walk in. You're avoiding the elevator. You mentioned a boss who harassed you."*
  - Two small text buttons below: **Edit** / **Clear this**
- Below the card, a divider, then:
- AI suggestion line (12px, muted): *"This might fit best as Free flow."*
- Three mode cards, equal width, vertical stack:
  - **Free flow** (highlighted with soft sage border, the AI suggestion) — *"Just write. No structure."*
  - **Incident log** — *"Structured. Timestamped. Useful as a record."*
  - **Guided** — *"With a prompt to help you start."*
- Footer microcopy: *"Your chat won't be saved unless you tap Remember. The entry you write next is yours, alone, and stays clean."*

**Transitions:**
- Tap Free flow → C2 with the summary card visible at top
- Tap Incident log → D1 with the summary card visible at top
- Tap Guided → C3 (Pennebaker entry)
- Edit summary → inline text editor on the card
- Clear → summary card collapses to nothing
- Back arrow → returns to B3 (chat preserved within session, lost on app close unless Remember was tapped)

### B6 — Same handoff bridge, but for the green-jokes scenario (different AI suggestion)
**State:** She tapped *Log this as incident* from B4.
**Same screen structure as B5**, but:
- Carry-over summary text: *"A coworker has been making sexual comments about your body, including yesterday about your underwear. Two officemates have heard it. It's been happening daily."*
- AI suggestion line: *"This might fit best as Incident log."*
- Incident log card has the soft sage border instead of Free flow.

**Visual note for Stitch:** this is the *same component* as B5, just different data. Build B5 first, then re-render with B6 data — don't redesign the screen.

### B7 — Prompt Template Library (Screen 4)
**State:** She tapped the prompt-template icon in B1.
**Header:** *"If you're not sure where to start."* Back arrow.
**Body:** vertical list of categories, each tappable to expand:
- I'm not sure what happened
- Something happened at work
- It happened a long time ago
- I'm thinking about reporting
- I already reported and it didn't go well
- Someone close to me hurt me
**Expanded state for one category** (e.g. "Something happened at work" tapped): 4–6 prompts appear below it as small cards:
- *"Help me describe what I'm feeling without naming it yet."*
- *"Walk me through what happened, in any order."*
- *"I'm not sure if this counts as harassment. Can we explore that?"*
- *"My coworker has been saying things and I don't know if I'm overreacting."*
**Transitions:**
- Tap prompt → returns to B1 with the prompt pre-filled in the input bar (she can edit before sending)

### B8 — Returning session with a retained thread available
**State:** Second session, she previously tapped "Remember this conversation."
**Header:** *"A space to think."* with a small dot indicator next to the header.
**Body:** chat area shows a single AI message: *"Welcome back. We have a kept thread from [date] if you want to pick it up, or start fresh."* Two small buttons below the message: **Pick it up** / **Start fresh**.
**Transitions:**
- Pick it up → loads the retained conversation, AI continues from where they left off
- Start fresh → new conversation, retained thread still saved (accessible from ⋯ menu later)

### B9 — Crisis detection banner mid-conversation
**State:** The AI has detected crisis-adjacent language in her last message.
**Body:** chat continues normally, but at the top of the chat area a soft terracotta banner has slid down: *"I want to make sure you're safe. Tap here when ready."* with a small × to dismiss.
**Visual note:** banner is non-blocking. Conversation continues underneath. She can ignore.
**Transitions:**
- Tap banner → G1 (Crisis Pathway)
- Dismiss → banner slides up, conversation resumes
- Keep chatting → AI's next response is gentler, not pushier

---

## Flow Group C — Journal: Free Flow

*Goal: she can write without any AI watching, then on save get soft offers that never pressure her.*

### C1 — Journal Mode Selector (Screen 5)
**State:** She entered Journal from bottom nav or from Three Doors. No handoff context.
**Header:** *"How do you want to write today?"*
**Body:** four mode cards, vertical:
- **Free flow** — *"Just write. No structure."*
- **Guided** — *"Prompts to help you process. Four short sessions over four days, or a daily check-in."*
- **Incident log** — *"Structured fields. Timestamped. Useful if you may want this as a record."*
- **Import** — *"Bring in writing you already have."*
Below cards: *"You can switch modes any time. Nothing is locked."*
**Transitions:**
- Tap card → C2 / C3 / D1 / (Import out of scope)

### C2 — Free Flow Editor, fresh entry (Screen 6)
**State:** Empty editor. No handoff.
**Header:** none (full-screen editor). Tiny ← back arrow top-left, tiny ⋯ menu top-right.
**Body:** full-screen text area. Small grey dismissable prompt at top: *"What do you want to put down?"* Dimmed Companion icon bottom-right with no badge.
**Floating Crisis button:** present
**Bottom nav:** hidden when keyboard is open
**Visual note:** the cursor blinks; the prompt is the only other text. No word count, no formatting toolbar, no AI sparkle icon.
**Transitions:**
- She types → autosave indicator pulses every 5s (a tiny dot near top-right, no text)
- Tap dimmed Companion icon → small tooltip appears: *"The Companion is paused while you write. You can talk after you save."* — the tooltip auto-dismisses after 3s
- Tap back arrow → C4 (Post-Save Soft Offers)

### C3 — Free Flow Editor, post-handoff
**State:** She arrived from B5 (Companion handoff).
**Body:** identical to C2 except a card sits at the very top, above the prompt:
- Tinted soft-amber background (visually marked as "not part of the entry")
- Small label: *"From your chat (not saved with this entry)"*
- The summary text from B5
- A small × in the corner to collapse it
**Visual note:** when she scrolls down to write, the card sticks to top with a slight shrink, so she can always see her chat context but it never gets confused with her actual writing.

### C4 — Post-Save Soft Offers (Screen 6a)
**State:** She just saved a Free Flow entry. The entry is 240 words about a difficult conversation with her sister.
**Header:** *"Saved."* (single word, no praise, no celebration)
**Body:**
- Small subhead: *"What now?"*
- Three reflection options (small cards, equal weight):
  - *Just save it.* (this one is pre-highlighted; auto-selected after 4s of no action)
  - *Read it back to me.*
  - *Help me notice anything I'm not seeing.*
- Divider
- Subhead: *"Or if you want, here are some things that might help."*
- Soft-offer row (horizontal scroll, four cards equal weight):
  - **A 2-minute pause** — small icon of a wave/breath
  - **See what's out there** — small icon of branching lines
  - **People you could talk to** — small icon of two figures
  - **Other women who wrote about something like this** — small icon of overlapping circles
- Footer microcopy: *"None of this is required. You can just close the app."* Small × top-right.

**Visual note:** the soft offers are visually quieter than the reflection options. Think 70% opacity, no border emphasis. The hierarchy is: she finished writing → she can reflect → she can also do something else, but doesn't have to.

**Transitions:**
- Tap *Just save it* → returns to C5 (Entry List) with the new entry at the top
- Tap *Read it back to me* → opens her entry in read-only view with the Companion ready to read sections back (out of scope for v1 visual)
- Tap *Help me notice anything I'm not seeing* → opens Companion in a fresh session, with her entry referenced (this is one of the explicit RAG-recall paths)
- Tap a soft offer → opens the corresponding space (Pathways / Network / etc.)
- × → returns to Entry List

### C5 — Entry List with new entry at top (Screen 10)
**State:** Free Flow entry from C4 just appeared at the top.
**Header:** *"Your journal."*
**Body:** filter chips row at top: `All | Free | Guided | Incident | Imported`. Search icon top-right.
List of entries, newest first. The newly saved entry shows:
- Date (e.g. *Today, 3:42 PM*)
- Mode tag: small *Free* chip
- First line preview (truncated to ~60 chars)
- No lock icon (Free flow isn't encrypted-timestamped like Incident)

Below it, older entries — at least 4 sample entries with varying modes so Stitch can render the variety:
- Yesterday · Incident · *"On Tuesday at the office around 2pm..."* · 🔒 lock icon
- Last Friday · Guided · *"Session 2 — picking up where I left off..."* 
- Nov 12 · Free · *"i don't know why i can't sleep lately"*
- Nov 10 · Incident · *"Around 8pm at home..."* · 🔒
**Transitions:**
- Tap entry → entry detail view (out of scope visual)
- Long-press → delete/export menu
- Search icon → search overlay (local only)

---

## Flow Group D — Journal: Incident Log

*Goal: legal-grade structured documentation, timestamped, with optional AI structure-assist after save.*

### D1 — Incident Log entry, blank (Screen 9)
**State:** She tapped Incident log from C1, no handoff.
**Header:** *"Incident log."* Back arrow. Small lock icon top-right with tiny text *"Timestamped. Encrypted."*
**Body:** vertical stack of fields, each is a card-like input:
- **Date and time** — pre-filled with now, editable
- **Location** — text input with a small toggle below it labeled *"Mark as redacted"*
- **Who was present** — text input
- **What happened** — multi-line text area (largest field)
- **Direct quotes** — text area, with helper text *"Verbatim wording you remember"*
- **Evidence** — attach photo/screenshot/audio button
- **Witnesses** — text input with small lock icon (separately encrypted)
- **How I felt during** — short text area
- **How I feel now** — short text area
At the bottom: large **Save entry** button (sage primary).
**Visual note:** field labels are above the inputs, sentence case, 14px medium. Optional fields have no asterisk; only Date is required.

### D2 — Incident Log entry, partially filled (sample state)
**State:** She has filled some fields with realistic content. Use this for the "in-progress" Stitch state.
- Date and time: *Nov 18, 2025 — 2:30 PM*
- Location: *Office pantry, 14th floor* (redacted toggle: off)
- Who was present: *Me, Marco (the coworker), J. (saw it)*
- What happened: *"Marco came up behind me at the coffee machine and made a comment about how my skirt was 'a good choice today.' He's said similar things before but this was the first time he stood close enough that I could feel his breath. J. was at the table and looked up but didn't say anything. I left the pantry without my coffee."*
- Direct quotes: *"'a good choice today'"*
- Evidence: (empty — but show the attach button)
- Witnesses: *J. — coworker, sits at the desk near the pantry*
- How I felt during: *frozen, then ashamed*
- How I feel now: *angry that i left without coffee. angry that j. didn't say anything. unsure if this is 'enough' to do something about*

**Save entry** button is now enabled (was disabled until Date had a value).

### D3 — Incident Log entry, just saved (transition state)
**State:** She tapped Save. Brief loading state (~600ms) shows a small inline spinner near the save button with text *"Timestamping..."* — then transitions to D4.
**Visual note for Stitch:** this is a brief in-between state, render it as the previous screen with the spinner overlay.

### D4 — Post-Save Soft Offers, incident variant (Screen 6a + extra offer)
**State:** Same as C4 but for an Incident Log entry. Adds one offer at the top because the entry contains crisis-adjacent language (frozen, shamed) and references workplace harm.
**Header:** *"Saved."*
**Body:**
- Three reflection options (same as C4)
- Divider
- Subhead: *"Or if you want, here are some things that might help."*
- **One extra offer card at the top of the soft-offers row, marked with a small terracotta dot indicator:**
  - **See Crisis options** — small subdued icon
- Then the standard soft offers
- **Plus a new offer specific to Incident Log entries:**
  - **Help me structure this** — small icon of three small bars (suggests "extract fields")

**Visual note:** the Crisis offer is the only conditional one. The Structure offer only appears for Incident Log entries.

**Transitions:**
- Tap *Help me structure this* → D5 (Structure Assist)
- Other transitions same as C4

### D5 — Structure Assist, opt-in (Screen 9a)
**State:** She tapped *Help me structure this* from D4.
**Header:** *"Here's what I noticed in what you wrote. You decide what to keep."* Back arrow.
**Body:** a list of proposed field extractions, each as a small card:
- Card 1:
  - Field name: **Date mentioned in text**
  - Triggering phrase: *"Tuesday at the office around 2pm"* — quoted, italicized
  - Two small buttons: **Add to entry** · **Ignore**
- Card 2:
  - Field name: **Person named**
  - Triggering phrase: *"Marco came up behind me..."*
  - **Add to entry** · **Ignore**
- Card 3:
  - Field name: **Possible witness**
  - Triggering phrase: *"J. was at the table and looked up but didn't say anything"*
  - **Add to entry** · **Ignore**
- Card 4:
  - Field name: **Direct quote**
  - Triggering phrase: *"a good choice today"*
  - **Add to entry** · **Ignore**

Footer: *"Your original text isn't changed. You're only adding to the structured fields."*

**Visual note:** each card shows the AI's reasoning by quoting her exact phrase. No paraphrasing.
**Transitions:**
- Tap Add → field is committed (small confirmation animation), card collapses
- Tap Ignore → card collapses with a softer animation
- Once all cards are addressed → return to entry view with structured fields populated

### D6 — Incident Log entry, viewed after save (detail view)
**State:** She tapped the saved entry from C5.
**Header:** *"Nov 18 incident."* with small lock icon. Back arrow. Top-right ⋯ menu with *Edit*, *Export as affidavit*, *Delete*.
**Body:** entry rendered in read mode — all fields populated, with a small **Hash receipt** section at the bottom:
- Hash: `0x4f3a...` (truncated)
- Timestamp authority: *Anchored Nov 18, 2025 — 2:31 PM UTC*
- Small text: *"This entry cannot be backdated. The proof can be verified independently."*
**Transitions:**
- Tap Export → Flow Group F (Export)
- Tap Edit → returns to editor with fields populated

---

## Flow Group E — Pathways (brief — for context, not full build)

*Just the entry points used in flows above. Full Pathways spec in product doc §7 Screens 12–14.*

### E1 — Pathways Network (Screen 12)
**State:** She arrived from Three Doors or from a soft offer.
**Header:** *"What's out there."*
**Body:** zoomable network diagram with nodes for each institution. *"I'm not ready to choose yet"* node always present, equal weight. Small intro text at top: *"These are options, not steps. You can explore any of them."*

### E2 — Pathway Detail (Screen 13)
**State:** She tapped a node (e.g. *Barangay VAW Desk*).
**Body:** collapsible sections — What this is / What to expect / What to bring / What they might ask / Your rights here / Travel and access / If this goes badly.

---

## Flow Group F — Export

*Goal: she controls share tier, lens, and scope; provider gets a synthesis with citations and optional corpus chat; she sees what they ask.*

### F1 — Export entry point (from D6 or C5)
**State:** She tapped Export from an entry or from a multi-select on the entry list.
**Header:** *"Share with someone."* Back arrow.
**Subhead:** *"You choose what they see and how long. You can cancel the link anytime."*
**Body:** Step 1 visible — *"Who is this for?"* with 4 cards:
- **Just me** (download or save off-device)
- **My psychologist** — small label *"Clinical lens"*
- **My lawyer** — small label *"Legal lens"*
- **A trusted person** — no lens label

A small horizontal step indicator at top: `● ○ ○ ○ ○ ○` (six steps total — Who, How much, Which, Lens, Preview, Link)

**Transitions:**
- Tap card → F2 with selection persisted

### F2 — Step 2: How much to share
**State:** She picked "My lawyer" — Atty. M. Reyes (Saligan).
**Header:** *"Share with Atty. M. Reyes."*
**Subhead:** *"How much do you want to share?"*
**Body:** three tier cards, vertical, equal weight (no recommended one):
- **Don't share anything yet** — *"Send a message asking for a first conversation. They see nothing about you."*
- **Just the synthesis** — *"A short reading aid we generate for them, plus flagged excerpts. They cannot see full entries or ask questions."*
- **Share everything I select** — *"Full entries plus synthesis. They can ask the Companion questions about your entries — you'll see every question and answer."*

Step indicator: `● ● ○ ○ ○ ○`

**Transitions:**
- Tap tier → F3 (if Tier 1, skips ahead to F6 since no scope needed; if Tier 2/3, continues)

### F3 — Step 3: Which entries
**State:** She picked Tier 3.
**Header:** *"Which entries to share?"*
**Body:** small filter row at top: `All time | Last 30 days | Last 90 days | Date range...`. Below it, a multi-select list of entries with checkboxes. Default: last 30 days pre-selected (12 entries).
Each row:
- Checkbox
- Date · Mode tag · First line preview · lock icon if Incident
- Long-press → preview the entry inline

Summary at bottom (sticky): *"12 entries selected · spans Sept 12 – Nov 19"*. **Next** button.

Step indicator: `● ● ● ○ ○ ○`

### F4 — Step 4: Reading lens
**State:** She has 12 entries selected, sharing with lawyer.
**Header:** *"Which lens should we use?"*
**Body:** since she picked "My lawyer", Legal is pre-suggested with sage border. Two cards plus a third option:
- **Legal** (highlighted) — *"Flags timeline, named parties, witnesses, evidence, and Philippine law-relevant facts (RA 9262 IPV, RA 11313 Safe Spaces, RA 8505 rape victim assistance)."*
- **Clinical** — *"Flags affect over time, somatic descriptions, repetition patterns, what you have and haven't named."*
- **Both** — *"Generate both syntheses. You can preview each separately."*

Step indicator: `● ● ● ● ○ ○`

### F5 — Step 5: Synthesis Preview (Screen 11b) — legal lens
**State:** She picked Legal. Synthesis has been generated.
**Header:** *"This is what your lawyer will see."* Sub-line: *"You can edit or remove anything."*
**Body:** the synthesis page renders as the provider would see it (use the visual I built earlier as reference, scaled for mobile):
- Top: "Prepared for legal review · Atty. M. Reyes · 12 entries · Sept 12 – Nov 19"
- "What this file contains" grid: entries, span, evidence, language
- Synthesis sections, each with colored left-border:
  - **FLAGGED · POSSIBLY RELEVANT TO RA 9262 §5(i)** (terracotta border) — narrative + citations: `Entry 03 ¶2` `Entry 07 ¶1` `Entry 11 ¶3–4`. Below it: **Edit** · **Remove**
  - **FLAGGED · WITNESS NAMED** (terracotta) — narrative + citation. **Edit** · **Remove**
  - **FLAGGED · DIGITAL EVIDENCE PRESERVED** (terracotta) — narrative + citation. **Edit** · **Remove**
  - **NOTED · GAP IN TIMELINE** (neutral grey border) — narrative. **Edit** · **Remove**
- Above the synthesis sections, an *"Add a note from me"* button (becomes a personal note section above the AI synthesis when she taps it).

Bottom: **Looks good — continue** button.

Step indicator: `● ● ● ● ● ○`

### F6 — Step 6: Link options
**State:** Synthesis approved.
**Header:** *"How long should this link work?"*
**Body:**
- Expiry: three pills, **24 hours** · **7 days** · **30 days** (7 days pre-selected)
- Optional passphrase toggle: *"Require a passphrase to open"* — if on, shows a generated 4-word passphrase she can share separately
- Tier 3 only: **Allow them to ask questions about your entries** toggle — explanatory text below: *"They can chat with the Companion about your shared entries. Every question and answer is visible to you. They cannot message you from here."*

Bottom: **Generate link** button (sage primary).

Step indicator: `● ● ● ● ● ●`

### F7 — Link generated (success state)
**State:** Link successfully created.
**Header:** *"Done."*
**Body:**
- A card showing the link (truncated, with copy button)
- If passphrase enabled: the passphrase displayed separately, *"Share this through a different channel"*
- A line: *"Expires Nov 27, 7:00 PM. You can revoke it anytime."*
- Two buttons: **Copy link** · **See share dashboard**
- Small footer text: *"We don't send the link for you. You decide where it goes."*

### F8 — Share Dashboard (Screen 11a)
**State:** Active shares view.
**Header:** *"Who has access."* Top-right: filter `Active | Expired`.
**Body:** active shares list:
- Card 1: **Atty. M. Reyes** · Tier 3 · Legal lens · Expires in 6 days · 3 questions asked · **Revoke** button (terracotta text)
- Card 2: **Dr. P. Cruz** (psychologist) · Tier 2 · Clinical lens · Expires in 12 days · No questions (Tier 2 has no chat) · **Revoke**

At the bottom, a *Show revoked & expired* collapsed section.

**Transitions:**
- Tap a Tier 3 card → F9 (provider Q&A log)
- Tap Revoke → instant revoke (no confirmation modal), card moves to revoked section

### F9 — Provider Q&A log (her mirror view)
**State:** She tapped the Atty. M. Reyes card.
**Header:** *"What your lawyer is asking."* Sub-line: *"You see every question and answer."*
**Body:** chronological list of Q&A pairs, each showing:
- **The lawyer asked:** *"Did she mention any prior reports to barangay or police?"*
- **Companion answered:** *"She mentions one prior contact with the barangay in Entry 04. She wrote that she went to the barangay tanod after the September 23 incident but did not formally file. She does not mention any contact with police in the shared entries."*
- Citation chips: `Entry 04 ¶2` `Entry 04 ¶5`
- Small timestamp below.

Bottom: **Revoke access** (same terracotta button).

### F10 — Provider-side corpus chat (Screen 11c, for reference)
**State:** What the lawyer sees when they open the share link in a browser.
**Visual note for Stitch:** mock this as a browser-style frame (different from the mobile chrome) so it's clear this is the provider side.
**Header:** *"Companion · shared with Atty. M. Reyes"* with subheader *"Scoped to 12 incident entries · Legal lens · Link expires May 27"*. Two browser-style buttons top-right: **Download PDF** · **Reply to her**.
**Body:**
- Read-only banner: *"You are reading and asking questions about entries she wrote. The Companion will answer only from what she shared. Every answer cites the specific entries it draws from. You cannot message her from here."*
- Chat history with two sample Q&A pairs (use the same content as F9).
- Input bar with placeholder *"Ask about the entries..."* and **Ask** button.
- Suggested-question chips below: *"Show me the timeline" · "What evidence is attached?" · "Has she named what happened?"*

---

## Flow Group G — Crisis & Safety

### G1 — Crisis Pathway (Screen 23)
**State:** She tapped Crisis from any screen.
**Header:** none (the greeting replaces it).
**Body:**
- Greeting at top: *"I'm here. Let me make sure you're safe first."*
- Three large buttons, vertical, equal width, terracotta:
  - **I am in immediate physical danger** → triggers PNP 911 dialer on tap
  - **I need to talk to a person right now** → DSWD 1343 / WCC dialer
  - **I'm having thoughts of harming myself** → NCMH 1553 dialer
- Below buttons: *"Stay here with me while you decide. There's no rush."*
- Small footer text: *"Crisis is private. Nothing here is shared."*

**Bottom nav:** hidden
**Floating Crisis button:** hidden (we're already here)

**Visual note for Stitch:** no confirmation modal on tap. One tap = dial. The spec is explicit that friction kills crisis pathways.

### G2 — Safety Settings (Screen 24, summary for prototype)
**State:** She entered from settings.
**Header:** *"Safety."*
**Body:** sectioned list:
- **App appearance** — Disguised icon (Default / Calculator / Notes / Recipe), App name in launcher
- **Panic gesture** — Type (Shake / Triple-tap / Volume), Action (Open decoy / Close app / Both)
- **Decoy screen** — Style picker, Edit decoy content
- **Lock** — Auto-lock timeout, Biometric, 2FA
- **Backup** — Off-device encrypted backup toggle, Recovery method
- **Data** — Selective deletion, Full wipe

Each section is a card with the controls inline. Each control changes immediately, no save button.

---

## Quick render order for Stitch (Tier 1 priority)

If you only have time to render 12 screens for a working prototype demo, do these in this order:

1. **A1** Cold Open
2. **A2** Three Doors
3. **B1** Companion fresh
4. **B2** Companion mid-conversation (example A — anxiety)
5. **B3** Companion with handoff chips
6. **B5** Handoff Bridge
7. **C2** Free Flow Editor blank
8. **C3** Free Flow Editor with handoff card
9. **C4** Post-Save Soft Offers
10. **D1** Incident Log blank
11. **D2** Incident Log filled (sample state)
12. **G1** Crisis Pathway

This gives you the full first-contact-to-saved-entry-to-soft-offers loop, both Companion-to-Journal handoff paths, and the crisis escape — enough to validate the core experience with your lawyer and psychologist.

For the **export validation** with lawyer/psych specifically, add: F2, F4, F5 (synthesis preview), F8, F9 (her mirror view), and F10 (provider side browser mock).

---

*End of screen flow script. Pair with the Component Rules document for visual consistency across all screens.*
