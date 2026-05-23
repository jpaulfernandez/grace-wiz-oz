# Survey Questions and Microprompts

This document compiles all survey questions, microprompts, and expected answers for each user cohort in the Grace app. It includes:
- Pre-session, scenario-specific, and post-session microprompts
- Likert scale questions
- Open-text questions
- SUS (System Usability Scale) questions

---

## 1. Women Cohort

### User Sessions:
- women-order-a
- women-order-b
- women-combined

### Microprompts

#### Scenario 0 - Orientation Reflection
- **Question ID**: welcome-feeling
- **Question**: I feel comfortable using a digital tool to discuss sensitive concerns.
- **Type**: likert-5 (1-5)
- **Required**: Yes

#### Scenario A - Green Jokes Reflection
- **Question ID**: chat-restraint
- **Question**: Did the Companion's restraint feel supportive or frustrating?
- **Type**: single-choice
- **Options**: ['Supportive', 'Neutral', 'Frustrating']
- **Required**: Yes

#### Scenario B - Work Anxiety Reflection
- **Question ID**: summary-useful
- **Question**: The carry-over summary made it easier to move from chat into the journal.
- **Type**: likert-5 (1-5)
- **Required**: Yes

#### Scenario C - Pattern Surfacing Reflection
- **Question ID**: annotation-helpful
- **Question**: The highlighted annotations helped me better understand what I have been going through.
- **Type**: likert-5 (1-5)
- **Required**: Yes

#### Scenario D - Prompted Journaling Reflection
- **Question ID**: combined-no-ai-comfort
- **Question**: The guided journaling prompts helped me process what I was going through, even without an AI companion.
- **Type**: likert-5 (1-5)
- **Required**: Yes

#### Post-Session Reflection
- **Question ID**: would-write-here
  - **Question**: I would write what is happening to me in this app.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes
- **Question ID**: trust-words
  - **Question**: I trust this app with my words.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes
- **Question ID**: would-tell-another-woman
  - **Question**: I would tell another woman about this app.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes

### Survey Questions (Post-Intervention)

#### Likert Scale Questions
1. I would write what is happening to me in this app.
2. I trust this app with my words.
3. I would tell another woman about this app.

#### Open Text Questions
1. What about this app made you feel safe, or unsafe?
2. Was there anything you would not write into this app, even if it were happening to you?
3. What would make this worse for someone you know?

---

## 2. Lawyer Cohort

### User Sessions:
- lawyer-standard

### Microprompts (Post-Session Reflection)

- **Question ID**: legal-synthesis-useful
  - **Question**: The legal lens synthesis would be useful for case preparation.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes
- **Question ID**: hash-defensible
  - **Question**: The hash-receipt and timestamp model, if implemented as described, would be defensible under cross-examination.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes
- **Question ID**: accept-shared-links-lawyer
  - **Question**: I would accept shared Grace links from clients as a receiving provider on this platform.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes

### Survey Questions (Post-Intervention)

#### Likert Scale Questions
1. The legal lens synthesis would be useful for case preparation.
2. The hash-receipt and timestamp model, if implemented as described, would be defensible under cross-examination.
3. I would accept shared Grace links from clients as a receiving provider on this platform.

#### Open Text Questions
1. Which fields in the incident log are essential for admissibility, and what's missing?
2. Where does the citation-chip / corpus-chat model break down?
3. What would have to change before you'd use this with an actual client matter?

#### Pricing Throwaway Question
- If this platform charged providers for receiving client links and using the corpus chat, what would feel reasonable, and what would feel disqualifying?

---

## 3. Clinician Cohort

### User Sessions:
- clinician-standard

### Microprompts (Post-Session Reflection)

- **Question ID**: clinical-synthesis-useful
  - **Question**: The clinical lens synthesis would be useful for session preparation.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes
- **Question ID**: recommend-to-patient
  - **Question**: I would recommend a patient use this between sessions.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes
- **Question ID**: accept-shared-links-clinician
  - **Question**: I would accept shared links from patients as a receiving provider on this platform.
  - **Type**: likert-5 (1-5)
  - **Required**: Yes

### Survey Questions (Post-Intervention)

#### Likert Scale Questions
1. The clinical lens synthesis would be useful for session preparation.
2. I would recommend a patient use this between sessions.
3. I would accept shared links from patients as a receiving provider on this platform.

#### Open Text Questions
1. Was there any Companion exchange that crossed a line into pseudo-therapy?
2. What's missing from the synthesis that you'd need for session prep?
3. What would have to change before you'd refer a patient to this app?

#### Pricing Throwaway Question
- If this platform charged providers for receiving client links and using the corpus chat, what would feel reasonable, and what would feel disqualifying?

---

## 4. System Usability Scale (SUS) Questions

The following 10 statements are used to measure system usability:

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

---

## Key Notes

- **Likert-5 Scale**: Questions marked as "likert-5" use a 5-point scale: 1 (Strongly Disagree) to 5 (Strongly Agree)
- **Single-Choice**: Questions with options require selecting one answer from the provided list
- **Open Text**: Questions with placeholders allow free-form text responses
- **Pricing Throwaway**: Only shown to lawyer and clinician cohorts

This document serves as a reference for auditing test cases to ensure all survey questions and microprompts are covered.
