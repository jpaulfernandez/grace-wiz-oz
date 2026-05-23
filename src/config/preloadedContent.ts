export interface Annotation {
  id: string
  phrase: string
  note: string
  category: 'somatic' | 'witness' | 'pattern'
}

export interface TextSegment {
  text: string
  annotationId?: string
}

export interface GuidedPrompt {
  id: string
  question: string
  preloadedAnswer: string
}

export interface IncidentFields {
  dateTime: string
  location: string
  who: string
  whatHappened: string
  quotes: string
  evidence: string
  witnesses: string
  feltDuring: string
  feltNow: string
}

// Scenario C Journal Text Segments
export const SCENARIO_C_JOURNAL_SEGMENTS: TextSegment[] = [
  { text: "I decided to walk up the stairs again today because he was standing near the lobby. My " },
  { text: "chest felt so tight", annotationId: "somatic-tightness" },
  { text: ". It's the third time this week I " },
  { text: "avoided the elevator", annotationId: "elevator-avoidance" },
  { text: " because of him. " },
  { text: "J. saw me", annotationId: "witness-j" },
  { text: " walking up and asked why I looked so tired. I didn't know what to say so I just said I needed the exercise. I hate that he makes me feel like I have to change my whole routine just to feel safe at work." }
]

export const SCENARIO_C_ANNOTATIONS: Annotation[] = [
  {
    id: "somatic-tightness",
    phrase: "chest felt so tight",
    note: "This chest tightening is a somatic stress trigger you previously identified. Noticing where your body holds tension is a valuable step in recognizing trauma signals.",
    category: "somatic"
  },
  {
    id: "elevator-avoidance",
    phrase: "avoided the elevator",
    note: "This is the third recorded instance of avoiding the elevator/lobby when Marco is present. A consistent pattern of behavioral adjustment indicates an escalating environment of discomfort.",
    category: "pattern"
  },
  {
    id: "witness-j",
    phrase: "J. saw me",
    note: "You have identified J. as a potential third-party witness to your physical avoidance behaviors, which could serve as corroborative context if you ever decide to file a report.",
    category: "witness"
  }
]

// Scenario D: Prompted Journal Prompts
export const SCENARIO_D_PROMPTS: GuidedPrompt[] = [
  {
    id: "guided-q1",
    question: "Describe what happened as clearly as you can.",
    preloadedAnswer: "Marco came up to my desk again while everyone else was at lunch. He made comments about my outfit and leaned over my shoulder. I felt extremely uncomfortable and asked him to step back, but he laughed it off and said he was just being friendly."
  },
  {
    id: "guided-q2",
    question: "Where did you feel this in your body, and how did you react?",
    preloadedAnswer: "I felt my breathing get very shallow and my stomach knot up. I froze for a few seconds and pretended to be busy on my phone until he walked away."
  },
  {
    id: "guided-q3",
    question: "What do you need right now to feel supported?",
    preloadedAnswer: "I need to feel like I am not crazy for feeling unsafe. I want to keep this recorded so I don't forget the details, and I hope to find options for getting support without causing a scene at work."
  }
]

// Scenario E: Preloaded Incident Log Form Fields
export const SCENARIO_E_INCIDENT_DATA: IncidentFields = {
  dateTime: "2026-05-23T14:30:00", // Matches the mock timeline
  location: "Office pantry, 14th floor",
  who: "Marco (Coworker)",
  whatHappened: "Marco came up behind me while I was preparing coffee at the pantry counter. He stood so close that I could feel his breath and remarked in a low voice that my skirt was 'a good choice today'. He lingered there for a few moments, blocking my path, before J. walked in, which caused Marco to step back.",
  quotes: "'a good choice today'",
  evidence: "None (screenshot/photo not attached)",
  witnesses: "J. (coworker, who entered the pantry at the end of the interaction)",
  feltDuring: "Frozen, extremely tense, stomach dropped",
  feltNow: "Angry that I had to abandon my coffee and leave, anxious about returning to the pantry"
}
