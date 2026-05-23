// Consent content from BUILD.md lines 238-279

export interface ConsentContent {
  triggerWarning: string
  consentText: string
  distressDisclosure?: string
}

// Trigger warning (shown to ALL cohorts)
export const TRIGGER_WARNING = `**A note before you begin**

This prototype is for an app that supports women navigating gender-based harm — harassment, abuse, and related experiences. You'll see chat messages, journal prompts, and incident-logging flows that touch on these topics.

If at any point you'd rather stop, you can — there's a pause button on every screen, and stopping doesn't affect your participation in any way.`

// Women cohort consent text
export const WOMEN_CONSENT = `**What this is**

You're helping us test an early prototype of Grace, an app being designed for women in the Philippines. We want to understand how the app feels to use — not whether you do things "correctly."

**What we'll capture**

What you tap, how long you spend on each screen, and anything you type into the prototype. Your inputs help us understand whether the app feels usable and safe. We don't share your data outside the research team, and we don't link it to your real identity — only the nickname you chose.

**You can stop at any time**

If anything feels uncomfortable, you can pause or end the session. Stopping doesn't affect your compensation or your standing in any way.

**You're testing the app, not yourself**

Please don't share anything from your own life that you wouldn't want recorded. The scenarios are designed so you can role-play without putting your own experience on the page.`

// Provider (lawyer/clinician) cohort consent text
export const PROVIDER_CONSENT = `**What this is**

You're helping us evaluate an early prototype of Grace, an app being designed to support women navigating gender-based harm and to provide synthesized journal and incident artifacts to receiving providers like yourself.

**What we'll capture**

What you tap, how long you spend on each screen, anything you type into the prototype, and your responses to a brief end-of-session survey. We don't share your individual responses outside the research team.

**What we're asking from you**

We want your professional judgment on whether the synthesis artifacts would be useful in your practice, whether the app's behavior is clinically/legally appropriate, and whether you'd consider onboarding to a platform like this. Please be candid — negative findings are as valuable as positive ones.`

export function getConsentForCohort(cohort: 'women' | 'lawyer' | 'clinician'): ConsentContent {
  const isWomen = cohort === 'women'

  return {
    triggerWarning: TRIGGER_WARNING,
    consentText: isWomen ? WOMEN_CONSENT : PROVIDER_CONSENT,
  }
}
