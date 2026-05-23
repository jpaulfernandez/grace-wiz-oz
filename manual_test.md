# Manual Verification & Test Script (Grace Capstone Prototype)

This document provides a highly structured, end-to-end verification checklist to validate the core user pathways, privacy structures, and clinician/advocate dashboards of the Grace web prototype.

---

## 1. Onboarding & Participant Cohorts (Mobile Emulation)

### Goal
Verify that patients/participants are correctly onboarded with appropriate safety guidelines, mobile mockups, and strict session/consent enforcement.

### Test Instructions
1. Open the browser and navigate to `/`.
2. Ensure the screen displays the warm neutral design system (Outfit & Newsreader fonts, harmonized cream background, dark borders).
3. **Scenario A: Standard Woman Cohort**
   - Enter Invite Code: `GRACE-W-SCENARIO-A` and click **Enter Portal**.
   - Verify that the layout transitions to a centered mobile web container frame matching mobile viewports.
   - Read the welcome safety context. Click **Continue to Consent**.
   - Review the strict sovereign data privacy disclosures.
   - Click **Give Sovereign Consent** (Verify that telemetry logs this event).
4. **Scenario B: Crisis/Standard Woman Cohort**
   - Reload and enter Invite Code: `GRACE-W-SCENARIO-B`.
   - Verify the same flow; complete the onboarding sequence to reach the core dashboard.

---

## 2. Advocate (Lawyer-Guided) Portal Flow (`L1–L6`)

### Goal
Verify the end-to-end legal intake, client consent loops, sovereign search query logic, and certified PDF downloads.

### Test Instructions
1. Navigate to `/` and enter Invite Code: `GRACE-L-ADV-INTAKE`.
2. Verify that the screen is rendering in wide **Desktop Browser Frame** (if screen size $\ge 1024$px).
3. **Step L1: Orientation**
   - Read the professional instruction guidelines. Click **Start Guided Review &rarr;**.
4. **Step L2: Redacted Intake & Synthesis**
   - Inspect the beautiful intake details, booking calendar slot, and the **AI Somatic timeline & Somatic indices** (redacted view).
   - Click **Request Somatic Records Access &rarr;**.
5. **Step L3: Simulated Decryption Delay**
   - Observe the security screen. Click **Initiate Secure Access Handoff**.
   - Verify that a 2-second simulated loading spinner says `"Awaiting client authorization approval..."` and `"Sovereign authorization key received!"`.
   - Ensure the somatic entries decrypt and render securely on completion.
   - Click **Open Secure Corpus Chat &rarr;**.
6. **Step L4: Sovereign Corpus Chat**
   - Notice the prominent security warning banner.
   - Click the chip: **"Search 'evidence'"** or type `"evidence"` in the input and click Send.
     - Verify that the AI returns the specific chronological events details of Marco's workplace actions.
   - Click the chip: **"Search 'timeline'"** or type `"timeline"`.
     - Verify the chronological timeline analysis.
   - Click the chip: **"Search 'attachment'"** or type `"attachment"`.
     - Verify somatic attachment reflections.
   - Click **Proceed to Intake Notes &rarr;**.
7. **Step L5: Intake Casework Manager**
   - Type a custom legal review note in the input box, e.g., `"Workplace incident exhibits high employer liability under RA 11313."`.
   - Click **Save casework note**. Verify that the note is added to the active case log feed and the `"Continue to certified export"` button appears.
   - Click **Continue to certified export &rarr;**.
8. **Step L6: Certified Ledger Export**
   - Inspect the SHA-256 Ledger signature fingerprint blocks.
   - Click **Download Certified PDF Packet**.
   - Verify that the browser downloads `legal-export-sample.pdf` and check that it is a professional, high-fidelity 15-page legal docket.
   - Click **Continue to Survey &rarr;**.

---

## 3. Clinician-Guided Portal Flow (`CL1–CL6`)

### Goal
Verify somatic intake workflows, simulated clinical decryptions, AI somatic chat logs, and certified clinical PDF downloads.

### Test Instructions
1. Navigate to `/` and enter Invite Code: `GRACE-C-CLN-INTAKE`.
2. **Step CL1: Orientation**
   - Click **Start Guided Review &rarr;**.
3. **Step CL2: Somatic Synthesis**
   - Review somatic flight/fight indices and calendar slot. Click **Request Somatic Records Access &rarr;**.
4. **Step CL3: Decryption Loop**
   - Click **Initiate Secure Access Handoff**.
   - Observe the 2-second approval animation. Verify decryption.
   - Click **Open Somatic Incident Chat &rarr;**.
5. **Step CL4: Somatic Chat Analysis**
   - Click suggested chips **"Search 'panic'"** or **"Search 'somatic'"**.
   - Verify that the system dynamically reveals the physiological responses, somatic attachment cues, and diaphragmatic constriction details.
   - Click **Proceed to Intake Notes &rarr;**.
6. **Step CL5: Intake Notes**
   - Enter a clinical preparation note, e.g., `"Patient exhibits strong physiological signs of work-induced hyperarousal."`.
   - Click **Save prep note**. Confirm it appears in the log.
   - Click **Continue to certified export &rarr;**.
7. **Step CL6: Certified Prep Export**
   - Inspect the clinical ledger fingerprint block.
   - Click **Download Intake Prep Packet**. Verify download of `clinical-export-sample.pdf` (15-page stark clinical packet).
   - Click **Continue to Survey &rarr;**.

---

## 4. End Survey & Usability (SUS) Form Verification

### Goal
Validate dynamic Likert cards, the standard 10-statement System Usability Scale, qualitative feedback, and sovereign pricing reflections.

### Test Instructions
1. Navigate to `/survey` (following any completed guided tour).
2. **Cohort-Aware Survey**
   - Verify that the survey matches your cohort (e.g., Clinical, Legal, or Participant).
3. **Likert Questions**
   - Select scores (1 to 5) for intake usefulness, trustworthiness, and comfort. Verify the smooth radio button hover states.
4. **System Usability Scale (SUS) Form**
   - Rate the 10 standard SUS statements (1-5 cards). Ensure all 10 statements are answered.
5. **Reflections & Sovereign Pricing**
   - Type qualitative comments under "Open Reflections".
   - Select/write pricing feedback (e.g., 150-250 PHP threshold).
6. Click **Submit Feedback &rarr;**.
   - Verify the portal navigates successfully to `/post-survey` and saves response columns into Supabase.

---

## 5. Sandboxed Free Roam Console (`/free`)

### Goal
Verify the fully unlocked sandboxed participant modules, vagal breathing micro-animations, and live provider cohort preview togglers.

### Test Instructions
1. Access the free roam by navigating to `/free` or selecting "Explore freely" from the post-survey choice page.
2. **Provider Sandbox Header (If logged in as clinician/lawyer)**
   - Verify that the dark gold header `"VIEWING AS JANE • SECURE PROVIDER SANDBOX"` is displayed.
   - Click **Simulate Grace (Clinical)**: Verify that the view instantly swaps names, mock database logs, and cohort representation styles in real-time.
   - Click **Simulate Jane (Lawyer)**: Verify that the view returns to the legal intake layout.
3. **Home Tab**
   - Click the **Vagal Calming Breath** card.
   - Verify that the breathing modal displays a sage-green HSL circle.
   - Focus on the circle: Verify that it smoothly expands and shrinks every 4 seconds, alternating between `"Inhale..."` and `"Exhale..."`.
   - Click **Close exercise** to dismiss.
4. **Circles Tab (Community)**
   - Click on the **Vagal Grounding Support Circle** card.
   - Inspect the circle description details. Click **Join scheduled circle** and ensure the modal dismisses cleanly.
5. **Pathways Tab**
   - Review knowledge pathways: Safe Spaces Act rights summary and Vagus nerve handbooks.
6. **Referral Tab (Marketplace)**
   - Review verified regional Philippine providers. Click **Request secure handoff consult**.
7. Click **Exit sandbox** in the top header. Verify navigation to the final thank-you page.

---

## 6. Research Analytics Admin Console (`/admin`)

### Goal
Verify active run analytics, aggregate SUS averages, text searches, live mock injectors, and database backups.

### Test Instructions
1. Navigate to `/admin`.
2. Inspect the **Research Analytics Console** dashboard.
3. **Dynamic KPIs**
   - Verify total run count, completion rate, mean SUS score, and Supabase integration status indicator.
4. **Interactive Filters**
   - In the Search input, type `"Marie"` or `"Jane"`. Verify that rows filter instantly.
   - Swap the **Cohort Filter** from "All Cohorts" to "Advocate" or "Clinician". Verify the grid row filtration.
5. **Session Detail Inspector**
   - Click any session row in the grid table.
   - Verify that the **Run Inspector** right panel animates in and displays device metadata, Likert results, open reflections, and pricing feedback.
6. **Simulate Live Run Injection**
   - Click the **Simulate Live Run** button in the header.
   - Verify that a new mock session row is dynamically generated and appended to the table, and that the KPI cards (Total Runs, Completion, mean SUS) instantly recalculate live!
7. **Research Export**
   - Click **Export Research JSON**.
   - Verify that the browser downloads `grace-research-payload.json` containing the entire session corpus.
