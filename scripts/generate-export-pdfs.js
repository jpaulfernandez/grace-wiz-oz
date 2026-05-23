import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

// Ensure target directories exist
const publicDir = path.resolve('public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const scriptsDir = path.resolve('scripts')
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true })
}

function drawBorder(doc) {
  doc.rect(20, 20, 572, 752).strokeColor('#E0E0E0').lineWidth(1).stroke()
}

function drawHeader(doc, titleText) {
  doc.font('Courier').fontSize(9).fillColor('#9E9E9E')
  doc.text('Grace Verification Platform', 40, 40)
  doc.text(new Date().toLocaleDateString(), 500, 40, { align: 'right' })
  doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(40, 55).lineTo(572, 55).stroke()
}

function drawFooter(doc, pageNum, totalPages) {
  doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(40, 745).lineTo(572, 745).stroke()
  doc.font('Courier').fontSize(8).fillColor('#9E9E9E')
  doc.text(`Page ${pageNum} of ${totalPages}`, 40, 755)
  doc.text('Confidential - Research Use Only', 572, 755, { align: 'right' })
}

function generateLegalPDF() {
  const filePath = path.join(publicDir, 'legal-export-sample.pdf')
  const doc = new PDFDocument({ size: 'LETTER', margin: 40, autoFirstPage: false })
  const stream = fs.createWriteStream(filePath)
  doc.pipe(stream)

  const totalPages = 15

  // PAGE 1: COVER PAGE
  doc.addPage()
  drawBorder(doc)
  
  // Tag
  doc.font('Courier').fontSize(10).fillColor('#9E9E9E')
  doc.text('ANCHORED TO GRACE TIMESTAMP AUTHORITY', 40, 60)
  
  // Title
  doc.font('Times-Roman').fontSize(28).fillColor('#212121')
  doc.text('Evidence & Pattern Synthesis', 40, 100)
  doc.fontSize(14).fillColor('#616161')
  doc.text('Prepared for Legal Intake and Counsel Advisory', 40, 140)

  // Divider
  doc.strokeColor('#5E35B1').lineWidth(2).moveTo(40, 165).lineTo(200, 165).stroke()

  // Metadata
  doc.font('Helvetica').fontSize(10).fillColor('#212121')
  doc.text('Client Nickname:', 40, 190)
  doc.font('Helvetica-Bold').text('Tester Jane (GRACE-L-01)', 160, 190)

  doc.font('Helvetica').text('Intake Period:', 40, 210)
  doc.font('Helvetica-Bold').text('May 1, 2026 - May 23, 2026', 160, 210)

  doc.font('Helvetica').text('Verification Authority:', 40, 230)
  doc.font('Helvetica-Bold').text('Grace decentralized ledger system (simulated)', 160, 230)

  // Executive Summary
  doc.font('Times-Bold').fontSize(14).fillColor('#212121')
  doc.text('Executive Legal Synthesis', 40, 270)
  doc.font('Times-Roman').fontSize(11).fillColor('#424242')
  const summaryText = `This document represents a certified export of structured incident logging and somatic journal tracking recorded by the user. The underlying entries have been cryptographically timestamped and anchored to verify integrity of recording timing.

The records indicate an escalating pattern of gender-based workplace hostility, avoidant behavior modifications (avoiding elevator and stairs), and verbal remarks matching indicators of Republic Act No. 11313 (Safe Spaces Act) and Republic Act No. 9262.`
  doc.text(summaryText, 40, 290, { width: 500, lineGap: 4 })

  // Hash Receipt Monospace Box
  doc.font('Courier').fontSize(9).fillColor('#212121')
  doc.rect(40, 420, 500, 120).strokeColor('#BDBDBD').lineWidth(1).stroke()
  
  doc.text('┌──────────────────────────────────────────────────────────┐', 45, 435)
  doc.text('│  Anchored to Grace Timestamp Authority                   │', 45, 450)
  doc.text('│                                                          │', 45, 465)
  doc.text('│  Hash:  a3f8e2b1d9c8b7a6f5e4d3c2b1a0f9e830e2f1  (SHA256) │', 45, 480)
  doc.text('│  Time:  2026-05-12T14:32:08+08:00                        │', 45, 495)
  doc.text('│  Verify at: grace.app/verify/Tester-Jane                 │', 45, 510)
  doc.text('└──────────────────────────────────────────────────────────┘', 45, 525)

  // Instructions
  doc.font('Helvetica-Oblique').fontSize(9).fillColor('#9E9E9E')
  doc.text('To verify this package, upload the hash block to your secure dashboard.', 40, 560)

  drawFooter(doc, 1, totalPages)

  // INCIDENTS AND JOURNAL PAGES (Pages 2-15)
  const incidents = [
    {
      date: 'May 23, 2026',
      title: 'Incident 1: Pantry boundary intrusion and verbal comments',
      location: 'Office pantry, 14th floor',
      who: 'Marco (Coworker)',
      what: "Marco came up behind me while I was preparing coffee at the pantry counter. He stood so close that I could feel his breath and remarked in a low voice that my skirt was 'a good choice today'. He lingered there for a few moments, blocking my path, before J. walked in, which caused Marco to step back.",
      felt: 'Frozen, extremely tense, stomach dropped'
    },
    {
      date: 'May 19, 2026',
      title: 'Incident 2: Elevator hallway intercept',
      location: 'Elevator lobby',
      who: 'Marco (Coworker)',
      what: 'Stood in front of the elevator door blocking my entry. Made comments about my outfit and laughed when I asked him to move. Avoided elevator since then.',
      felt: 'Anxious, avoidant, heart racing'
    },
    {
      date: 'May 14, 2026',
      title: 'Incident 3: Desk side comments during lunch break',
      location: 'My working desk',
      who: 'Marco (Coworker)',
      what: 'Leaned over my shoulder while everyone was out. Made suggestive jokes and said I was being uptight.',
      felt: 'Trapped, shallow breathing, physically froze'
    }
  ]

  const journals = [
    "Avoiding the lobby completely now. Walked up 14 flights of stairs. Chest felt so tight. J. saw me tired but I couldn't say why.",
    "Decided to avoid lunch in the pantry. Sitting at my desk. Heard his voice and instantly my stomach knotted.",
    "Tried to speak to HR contact but backed out. Worried about retaliatory ratings. Appreciate having this space to write it down.",
    "Feeling overwhelmed today. The comments are disguised as jokes, but everyone laughs. Am I the problem here?",
    "Felt the anxiety in my chest again. Walking up the stairs today because he was by the lobby.",
    "He made another joke today. Sexual stuff disguised as humor. Had to sit through a whole meeting after.",
    "Writing this down so I don't forget the details. Shallow breathing, frozen reaction.",
    "Met J. in the stairs. He asked if I was okay. I just smiled. Wish I had the courage to say something.",
    "Stomach is in knots today. Just walking into the building makes me tense.",
    "Decided to write more details about the coffee pantry incident. It was extremely uncomfortable.",
    "The chest tightness hasn't gone away since yesterday. The physical reactions are so real.",
    "Planning my exit route when leaving. Waiting until 6:30 PM so the lobby is clear of coworkers."
  ]

  for (let p = 2; p <= totalPages; p++) {
    doc.addPage()
    drawBorder(doc)
    drawHeader(doc)

    if (p <= 5) {
      // INCIDENT LOG SECTION
      const inc = incidents[(p - 2) % incidents.length]
      doc.font('Courier').fontSize(9).fillColor('#5E35B1')
      doc.text(`INCIDENT LOG RECORD - CHRONOLOGICAL FILE ${p - 1}`, 40, 70)

      doc.font('Times-Bold').fontSize(16).fillColor('#212121')
      doc.text(inc.title, 40, 95)

      doc.font('Helvetica-Bold').fontSize(10).text('Date/Time:', 40, 130)
      doc.font('Helvetica').text(inc.date, 150, 130)

      doc.font('Helvetica-Bold').text('Location:', 40, 150)
      doc.font('Helvetica').text(inc.location, 150, 150)

      doc.font('Helvetica-Bold').text('Asserted Actor:', 40, 170)
      doc.font('Helvetica').text(inc.who, 150, 170)

      doc.font('Helvetica-Bold').text('Detailed Narrative:', 40, 200)
      doc.font('Times-Roman').fontSize(11).fillColor('#424242')
      doc.text(inc.what, 40, 220, { width: 500, lineGap: 4 })

      doc.font('Helvetica-Bold').fontSize(10).fillColor('#212121').text('Felt During Interaction:', 40, 360)
      doc.font('Times-Roman').fontSize(11).fillColor('#424242').text(inc.felt, 40, 380)

      doc.font('Courier').fontSize(8).fillColor('#9E9E9E')
      doc.text('Cryptographic Anchor Hash: 0f9e830e2f1a3f8e2b1d9c8b7a6f5e4d3c2b1a', 40, 430)

      // Dummy signature space
      doc.strokeColor('#BDBDBD').lineWidth(0.5).moveTo(40, 680).lineTo(200, 680).stroke()
      doc.font('Helvetica').fontSize(8).fillColor('#9E9E9E').text('Intake Examiner Initials', 40, 690)
    } else {
      // JOURNAL TRANSCRIPT SECTION
      const jIdx = (p - 6) % journals.length
      const journalText = journals[jIdx]
      
      doc.font('Courier').fontSize(9).fillColor('#5E35B1')
      doc.text(`VERBATIM SOMATIC JOURNAL TRANSCRIPT - ENTRY ${p - 5}`, 40, 70)

      doc.font('Times-Bold').fontSize(16).fillColor('#212121')
      doc.text(`Journal entry: May ${23 - (p - 6)}, 2026`, 40, 95)

      doc.font('Times-Roman').fontSize(12).fillColor('#424242')
      doc.text(`"${journalText}"`, 40, 140, { width: 500, lineGap: 5 })

      doc.font('Helvetica-Bold').fontSize(10).fillColor('#212121').text('Clinical / Pattern Annotations:', 40, 260)
      
      doc.rect(40, 280, 500, 80).fillColor('#F5F5F5').fill()
      doc.fillColor('#212121')
      doc.font('Helvetica-Oblique').fontSize(9)
      doc.text('Self-reported somatic tension marker: "Chest felt tight/anxious knots". Reflects somatic nervous response matching chronic situational stress.', 50, 295, { width: 480, lineGap: 3 })
      
      doc.font('Helvetica-Bold').fontSize(9).text('Analysis category: Somatic Tension Tracking', 50, 340)

      doc.font('Courier').fontSize(8).fillColor('#9E9E9E')
      doc.text('Cryptographic Anchor Hash: a3f8e2b1d9c8b7a6f5e4d3c2b1a0f9e830e2f1', 40, 430)
    }

    drawFooter(doc, p, totalPages)
  }

  doc.end()
}

function generateClinicalPDF() {
  const filePath = path.join(publicDir, 'clinical-export-sample.pdf')
  const doc = new PDFDocument({ size: 'LETTER', margin: 40, autoFirstPage: false })
  const stream = fs.createWriteStream(filePath)
  doc.pipe(stream)

  const totalPages = 15

  // PAGE 1: COVER PAGE
  doc.addPage()
  drawBorder(doc)
  
  // Tag
  doc.font('Courier').fontSize(10).fillColor('#9E9E9E')
  doc.text('CLINICAL COMPANION PORTAL - SECURE SYNTHESIS', 40, 60)
  
  // Title
  doc.font('Times-Roman').fontSize(28).fillColor('#212121')
  doc.text('Somatic & Behavioral Prep Packet', 40, 100)
  doc.fontSize(14).fillColor('#616161')
  doc.text('Prepared for Secure Somatic Therapy Session Intake', 40, 140)

  // Divider
  doc.strokeColor('#00897B').lineWidth(2).moveTo(40, 165).lineTo(200, 165).stroke()

  // Metadata
  doc.font('Helvetica').fontSize(10).fillColor('#212121')
  doc.text('Patient Nickname:', 40, 190)
  doc.font('Helvetica-Bold').text('Tester Grace (GRACE-C-01)', 160, 190)

  doc.font('Helvetica').text('Assessment Period:', 40, 210)
  doc.font('Helvetica-Bold').text('May 1, 2026 - May 23, 2026', 160, 210)

  doc.font('Helvetica').text('Somatic Anxiety Tags:', 40, 230)
  doc.font('Helvetica-Bold').text('Chest tightness, Stomach knots, Hyperventilation', 160, 230)

  // Executive Summary
  doc.font('Times-Bold').fontSize(14).fillColor('#212121')
  doc.text('Clinical Summary & Session Preparation', 40, 270)
  doc.font('Times-Roman').fontSize(11).fillColor('#424242')
  const summaryText = `This prep packet synthesizes self-reported journal and narrative logs written by the client. It highlights recurring somatic stress flags and avoidance patterns to support clinician intake and somatic grounding exercises.

Somatic Stress Flags: 3 entries mention tight chest / restricted breathing, 4 entries mention 'stomach knot' reactions, and 3 entries detail workplace elevator avoidance.
Attachment Patterns: Anxious-avoidant behaviors are noted during interactions with coworker Marco.`
  doc.text(summaryText, 40, 290, { width: 500, lineGap: 4 })

  // Summary box
  doc.rect(40, 420, 500, 120).strokeColor('#E0E0E0').lineWidth(1).stroke()
  doc.fillColor('#00897B')
  doc.font('Helvetica-Bold').fontSize(11).text('Key Somatic Anchors', 60, 435)
  doc.fillColor('#212121')
  doc.font('Helvetica').fontSize(9)
  doc.text('• Somatic response: Physical freezing reaction when coworker approaches.', 60, 460)
  doc.text('• Behavior modification: Avoiding the lobby elevator, walking 14 flights of stairs.', 60, 485)
  doc.text('• Triggers: Sound of voice or proximity in pantry workspace.', 60, 510)

  // Instructions
  doc.font('Helvetica-Oblique').fontSize(9).fillColor('#9E9E9E')
  doc.text('This intake prep packet is to be used solely to guide the somatic therapeutic alliance.', 40, 560)

  drawFooter(doc, 1, totalPages)

  // PAGES 2-15 CLINICAL LOGS (Same bodies but clinically annotated)
  const clinicalEntries = [
    {
      date: 'May 23, 2026',
      trigger: 'Coworker proximity in pantry counter space',
      somatic: 'Frozen reaction, chest tightening, stomach dropped',
      description: "Client reports coworker came behind her while preparing coffee. Stood close, blocked path. Client experienced immediate physical freezing, rapid heart rate, and an abandoned task."
    },
    {
      date: 'May 19, 2026',
      trigger: 'Elevator lobby encounter',
      somatic: 'Avoidant flight behavior, rapid pulse',
      description: "Client avoided the elevator lobby entirely after coworker blocked door and made remarks. Walked 14 flights of stairs instead. Restricting her access to common areas."
    },
    {
      date: 'May 14, 2026',
      trigger: 'Desk side intrusion',
      somatic: 'Shallow breathing, freezing',
      description: "Coworker leaned over her desk shoulder while lunch hour was empty. Experienced shallow breathing and did not speak."
    }
  ]

  const somaticJournals = [
    "Avoiding the lobby completely now. Walked up 14 flights of stairs. Chest felt so tight. Physical avoidance.",
    "Decided to avoid lunch in the pantry. Knotted stomach is persistent.",
    "Felt the anxiety in my chest again. Walking up the stairs today because he was by the lobby.",
    "He made another joke today. Sexual stuff disguised as humor. Frozen nervous response.",
    "Writing this down so I don't forget the details. Shallow breathing, frozen reaction.",
    "Stomach is in knots today. Just walking into the building makes me tense.",
    "The chest tightness hasn't gone away since yesterday. Grounding thoughts needed.",
    "Planning my exit route when leaving. Waiting until 6:30 PM so the lobby is clear of coworkers."
  ]

  for (let p = 2; p <= totalPages; p++) {
    doc.addPage()
    drawBorder(doc)
    drawHeader(doc)

    if (p <= 5) {
      const entry = clinicalEntries[(p - 2) % clinicalEntries.length]
      
      doc.font('Courier').fontSize(9).fillColor('#00897B')
      doc.text(`SOMATIC COMPANION INTAKE RECORD - ENTRY ${p - 1}`, 40, 70)

      doc.font('Times-Bold').fontSize(16).fillColor('#212121')
      doc.text(`Focus: ${entry.trigger}`, 40, 95)

      doc.font('Helvetica-Bold').fontSize(10).text('Assessment Date:', 40, 130)
      doc.font('Helvetica').text(entry.date, 160, 130)

      doc.font('Helvetica-Bold').text('Somatic Reaction:', 40, 150)
      doc.font('Helvetica').text(entry.somatic, 160, 150)

      doc.font('Helvetica-Bold').text('Narrative Detail:', 40, 180)
      doc.font('Times-Roman').fontSize(11).fillColor('#424242')
      doc.text(entry.description, 40, 200, { width: 500, lineGap: 4 })

      // Clinical Note Card
      doc.rect(40, 320, 500, 90).fillColor('#F5F5F5').fill()
      doc.fillColor('#212121')
      doc.font('Helvetica-Bold').fontSize(10).text('Clinical Interpretation:', 50, 335)
      doc.font('Helvetica').fontSize(9).text('The physical freezing and avoidance (stairs) are classic protective nervous response adaptations. Grounding exercises should target deep chest breathing, vagal toning, and restoring personal boundary safety.', 50, 355, { width: 480, lineGap: 3 })
    } else {
      const jIdx = (p - 6) % somaticJournals.length
      const journalText = somaticJournals[jIdx]
      
      doc.font('Courier').fontSize(9).fillColor('#00897B')
      doc.text(`VERBATIM SOMATIC JOURNAL TRANSCRIPT - ENTRY ${p - 5}`, 40, 70)

      doc.font('Times-Bold').fontSize(16).fillColor('#212121')
      doc.text(`Journal entry: May ${23 - (p - 6)}, 2026`, 40, 95)

      doc.font('Times-Roman').fontSize(12).fillColor('#424242')
      doc.text(`"${journalText}"`, 40, 140, { width: 500, lineGap: 5 })

      // Clinical Cue Box
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#212121').text('Clinical Cue:', 40, 260)
      doc.rect(40, 280, 500, 80).fillColor('#F5F5F5').fill()
      doc.fillColor('#212121')
      doc.font('Helvetica-Oblique').fontSize(9)
      doc.text('Note somatic focus: tight chest and restricted diaphragmatic breathing. The client details walking the stairs as active avoidant coping. This reveals high hyperarousal when entering physical locations.', 50, 295, { width: 480, lineGap: 3 })
    }

    drawFooter(doc, p, totalPages)
  }

  doc.end()
}

// Generate the packets
console.log('Generating Legal PDF...')
generateLegalPDF()
console.log('Generating Clinical PDF...')
generateClinicalPDF()
console.log('PDF Generation Completed successfully.')
