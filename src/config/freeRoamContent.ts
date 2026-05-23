export interface CommunityStory {
  id: string
  title: string
  tag: '#NeedHelp' | '#PositiveStory' | '#Article'
  excerpt: string
  content: string
  author: string
  upvotes: number
  replies: Array<{ author: string; text: string; date: string }>
}

export interface Institution {
  id: string
  name: string
  tag: 'Near Me' | 'Positive Experience' | 'NGO' | 'Government' | 'Legal'
  location: string
  description: string
  prepare: string[]
  expect: string[]
  reviews: string[]
}

export interface MarketplaceEntity {
  id: string
  name: string
  tag: 'Clinics' | 'Legal' | 'Free Service' | 'NGO'
  location: string
  specialty: string
  expect: string[]
  reviews: string[]
  contact?: string
  mapsLink?: string
}

export const COMMUNITY_STORIES: CommunityStory[] = [
  {
    id: 'story-1',
    title: 'I finally reported him',
    tag: '#PositiveStory',
    excerpt: 'I spent weeks doubting myself before heading to the Makati Barangay Poblacion VAW Desk...',
    content: 'I spent weeks doubting myself before heading to the Makati Barangay Poblacion VAW Desk. The officer in charge was quiet, did not interrupt me, and walked me through filing a verified complaint under RA 11313. If you are second-guessing your experience, please know that there are desks specifically trained to handle this without blaming you.',
    author: 'SurvivalSovereign',
    upvotes: 42,
    replies: [
      { author: 'HopefulVibe', text: 'This gives me so much courage. Thank you for sharing.', date: '2 hours ago' },
      { author: 'SomaticSeeker', text: 'Did they ask for printed evidence or was the digital receipt okay?', date: '1 hour ago' },
      { author: 'SurvivalSovereign', text: 'The officer accepted my secure hash receipt and logged it in the official blotter!', date: '30 mins ago' }
    ]
  },
  {
    id: 'story-2',
    title: "I'm not sure what I experienced counts",
    tag: '#NeedHelp',
    excerpt: 'My supervisor keeps making remarks that he labels as "green jokes". He laughs them off...',
    content: 'My supervisor keeps making remarks that he labels as "green jokes". He laughs them off, but it makes me freeze in my tracks. My chest gets tight every morning before clocking in. Does verbal commentary actually fall under the Safe Spaces Act, or am I overreacting?',
    author: 'AnonymousSeeker',
    upvotes: 18,
    replies: [
      { author: 'LegalEaglePH', text: 'Yes, it absolutely counts. RA 11313 covers gender-based sexual harassment in the workplace, which explicitly includes verbal remarks, green jokes, and unwanted sexual comments. Document everything.', date: '4 hours ago' },
      { author: 'BreatheQuiet', text: 'Please take care of your somatic stress. The physiological tightening you feel is a real response to a boundary violation.', date: '3 hours ago' }
    ]
  },
  {
    id: 'story-3',
    title: "My experience at the Pasig City Hall VAW desk",
    tag: '#Article',
    excerpt: 'A comprehensive guide on local filing procedures, waiting times, and counselor behaviors...',
    content: 'A comprehensive guide on local filing procedures, waiting times, and counselor behaviors. If you go, expect to fill out a 3-page intake questionnaire. Ask for Officer Cruz—she has been trained in trauma-informed grounding and will never rush your statement.',
    author: 'AdvocateKat',
    upvotes: 29,
    replies: [
      { author: 'MakatiWorker', text: 'Very useful checklist, saved this for my record folder.', date: '1 day ago' }
    ]
  }
]

export const INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'Barangay Poblacion VAW Desk',
    tag: 'Government',
    location: 'Makati City',
    description: 'Local government desk dedicated to assisting residents with gender-based violence and harassment incidents under RA 11313.',
    prepare: [
      'Chronological log of incidents',
      'Names/pseudonyms of witnesses',
      'Valid identification card'
    ],
    expect: [
      'Private intake interview room',
      'Assistance in drafting a barangay protection order (BPO)',
      'Mediation support or immediate referral to PNP protection centers'
    ],
    reviews: [
      'The police desk officer was calm and non-judgmental. She did not force me to recount details that made me uncomfortable.',
      'Excellent response protocol. They accepted my timestamped ledger logs.'
    ]
  },
  {
    id: 'inst-2',
    name: 'PNP Women & Children Protection Center',
    tag: 'Near Me',
    location: 'Camp Crame, Quezon City',
    description: 'National specialized police unit providing secure reporting and criminal investigation support for gender-based violations.',
    prepare: [
      'Verified report digests',
      'Cryptographic ledger receipts (if using digital logs)',
      'Witness contacts'
    ],
    expect: [
      'Professional investigation protocol',
      'Full confidentiality matching national security standards',
      'Legal guidance for filing criminal complaints under RA 11313'
    ],
    reviews: [
      'Very professional officers. They took my statements seriously and followed strict evidentiary guidelines.'
    ]
  },
  {
    id: 'inst-3',
    name: 'Gabriela Women\'s Party',
    tag: 'NGO',
    location: 'Manila',
    description: 'Advocacy group offering pro-bono consultation, legal advice, and clinical referral paths for female workplace survivors.',
    prepare: [
      'Written narrative of your experience',
      'List of questions regarding workplace liability'
    ],
    expect: [
      'Warm peer support circle intake',
      'Consultation with specialized pro-bono labor lawyers',
      'Non-coercive somatic referrals'
    ],
    reviews: [
      'They make you feel protected from the very first minute. A true sanctuary.'
    ]
  },
  {
    id: 'inst-4',
    name: 'PAO – Public Attorney\'s Office',
    tag: 'Legal',
    location: 'Nationwide',
    description: 'Government legal office offering free legal representation and counseling to low-income Filipino citizens facing harassment.',
    prepare: [
      'Certificate of Indigency',
      'Verified affidavits and evidence pack'
    ],
    expect: [
      'Public defender consultation',
      'Assistance in filing complaints in municipal courts',
      'Free litigation representation'
    ],
    reviews: [
      'Very busy desk but the attorneys are dedicated to helping survivors.'
    ]
  }
]

export const MARKETPLACE_ENTITIES: MarketplaceEntity[] = [
  {
    id: 'entity-1',
    name: 'Public Attorney\'s Office (PAO)',
    tag: 'Free Service',
    location: 'Nationwide',
    specialty: 'Free Legal Counseling & Court Representation',
    expect: [
      'No-cost consultation with a public defender',
      'Representation in labor and criminal court proceedings'
    ],
    reviews: [
      'The lawyers are overburdened but highly capable and supportive of Safe Spaces cases.'
    ],
    contact: '+63 (02) 8929-9436',
    mapsLink: 'https://maps.google.com/?q=Public+Attorneys+Office+Quezon+City'
  },
  {
    id: 'entity-2',
    name: 'Gabriela Legal Clinic',
    tag: 'NGO',
    location: 'Manila',
    specialty: 'Safe Work representation & RA 11313 counseling',
    expect: [
      'Confidential consultations focused on workplace harassment',
      'Assistance filing administrative complaints to HR and labor courts'
    ],
    reviews: [
      'Taught me exactly how to document jokes and verbal remarks so they are legally admissible.'
    ],
    contact: '+63 (02) 8371-2302',
    mapsLink: 'https://maps.google.com/?q=Gabriela+Nongovernment+Organization+Manila'
  },
  {
    id: 'entity-3',
    name: 'Healing Minds PH',
    tag: 'Clinics',
    location: 'Quezon City',
    specialty: 'Trauma-informed somatic therapy & vagal calming',
    expect: [
      'One-on-one virtual or in-person therapy sessions',
      'Focus on diaphragmatic calmers and stress down-regulation'
    ],
    reviews: [
      'Saved my mental health after experiencing severe workplace anxiety. Highly recommend their vagal nerve training.'
    ]
  },
  {
    id: 'entity-4',
    name: 'UP-PGH Psychiatry',
    tag: 'Clinics',
    location: 'Manila',
    specialty: 'Public Psychiatric consults & clinical grounding',
    expect: [
      'Clinical intake and formal diagnostic counseling if needed',
      'Prescription management and psychiatric guidance at subsidized costs'
    ],
    reviews: [
      'Excellent staff, though queue times are long. Very detailed and supportive care.'
    ]
  },
  {
    id: 'entity-5',
    name: 'Ateneo Human Rights Center',
    tag: 'Legal',
    location: 'Rockwell, Makati',
    specialty: 'Safe Spaces Act RA 11313 Advocacy & Safe Work representation',
    expect: [
      'Confidential case assessment with human rights attorneys',
      'Assistance in Safe Spaces arbitration and labor counseling'
    ],
    reviews: [
      'Extremely supportive lawyers who know exactly how to represent workplace boundary cases.'
    ]
  },
  {
    id: 'entity-6',
    name: 'SyCip Salazar Law Firm (Pro-Bono Desk)',
    tag: 'Legal',
    location: 'Legaspi Village, Makati',
    specialty: 'Workplace Harassment Advocacy & Advisory Desk',
    expect: [
      'Corporate compliance safety audits',
      'Private employee boundary protection consultation'
    ],
    reviews: [
      'Very detailed pro-bono safe legal advice and supportive coaching.'
    ]
  },
  {
    id: 'entity-7',
    name: 'Libertas PH Safe Space Desk',
    tag: 'Legal',
    location: 'Ortigas, Pasig',
    specialty: 'Human Rights Representation & Labor Safety Coaching',
    expect: [
      'Counseling on gender-based workplace safety and litigation prep',
      'Strategic safety representation and safety filing help'
    ],
    reviews: [
      'Clear, supportive case advice for women facing difficult environments.'
    ]
  }
]
