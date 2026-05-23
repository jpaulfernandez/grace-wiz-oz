---
name: Grace
colors:
  surface: "#FFFFFF"
  surface-dim: "#E0E0E0"
  surface-bright: "#F5F5F5"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#F5F5F5"
  surface-container: "#EEEEEE"
  surface-container-high: "#E0E0E0"
  surface-container-highest: "#BDBDBD"
  on-surface: "#212121"
  on-surface-variant: "#424242"
  inverse-surface: "#303030"
  inverse-on-surface: "#F5F5F5"
  outline: "#757575"
  outline-variant: "#E0E0E0"
  surface-tint: "#5E35B1"
  primary: "#5E35B1"
  on-primary: "#FFFFFF"
  primary-container: "#EDE7F6"
  on-primary-container: "#311B92"
  inverse-primary: "#B39DDB"
  secondary: "#00897B"
  on-secondary: "#FFFFFF"
  secondary-container: "#E0F2F1"
  on-secondary-container: "#004D40"
  tertiary: "#616161"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#EEEEEE"
  on-tertiary-container: "#212121"
  error: "#D32F2F"
  on-error: "#FFFFFF"
  error-container: "#FFEBEE"
  on-error-container: "#B71C1C"
  primary-fixed: "#EDE7F6"
  primary-fixed-dim: "#D1C4E9"
  on-primary-fixed: "#311B92"
  on-primary-fixed-variant: "#4527A0"
  secondary-fixed: "#E0F2F1"
  secondary-fixed-dim: "#B2DFDB"
  on-secondary-fixed: "#004D40"
  on-secondary-fixed-variant: "#00695C"
  tertiary-fixed: "#EEEEEE"
  tertiary-fixed-dim: "#E0E0E0"
  on-tertiary-fixed: "#212121"
  on-tertiary-fixed-variant: "#424242"
  background: "#FAFAFA"
  on-background: "#212121"
  surface-variant: "#EEEEEE"
  border-divider: "#E0E0E0"
  text-secondary: "#616161"
  text-muted: "#9E9E9E"
typography:
  headline-lg:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: "500"
    lineHeight: 34px
  headline-md:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: "500"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
  nav-label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 14px
  header-title:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "500"
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  edge-margin: 24px
  block-gap: 24px
  touch-target: 48px
  nav-height: 72px
  header-height: 56px
---

## Brand & Style

The design system for this safety and support app is defined by an **austere, editorial minimalism**. It is a sanctuary of restraint, prioritizing clarity and emotional safety over traditional app engagement tactics. The visual language is inspired by high-end magazine layouts—specifically the stark, typography-driven aesthetic of Co-Star—but adapted for a crisis-sensitive context.

The personality is meditative, quiet, and reliable. It avoids all "cheerleading" or advocacy-style visuals. There are no photographs of people, no filled icons, and no aggressive colors. The UI "whispers" through generous whitespace and a flat hierarchy, ensuring the user feels in control and unhurried.

**Design Style:** **Editorial Minimalism.** Sharp-edged logic from the reference material is softened only by specific Grace Rule corner radiuses (12px–24px) to ensure the interface feels approachable yet disciplined. The layout is structured on a strict 8px grid with zero shadows (except for a single 4px blur at 8% opacity where absolutely necessary for depth).

## Colors

The color palette is deliberately built on strict, neutral grayscale tones to eliminate visual noise, accented by specific colors dedicated to advocacy and calm.

- **Primary (Purple):** Used for interactive elements like active navigation, primary buttons, and focused states. It is the universally recognized color for domestic violence awareness, conveying solidarity and strength.
- **Secondary (Teal):** Reserved strictly for crisis-related elements. Recognized for sexual assault awareness, teal acts as a grounding, calming presence, signifying immediate support without triggering panic.
- **Neutral (Crisp White/Grey):** The global background color. It provides a stark, clean canvas that avoids the warmth of creams or yellows, ensuring maximum clarity.
- **Text (Charcoal Black):** A dark, neutral grey (`#212121`) that provides high contrast for readability without the jarring harshness of pure black (`#000000`).

**Forbidden:** Warm off-whites, hospital blues, alert reds, gradients, and saturated brand colors outside of the designated accent palette.

## Typography

This system uses a sophisticated three-font pairing to establish an editorial hierarchy.

1.  **Display (Serif):** Newsreader is used for headings and pull quotes, providing a literary, intellectual, and timeless quality.
2.  **Body (Sans-Serif):** Inter (a humanist sans-serif) is used for all functional UI elements, body copy, and header titles to ensure maximum clarity and accessibility.
3.  **Accent (Mono):** JetBrains Mono is used sparingly for labels and metadata to provide a subtle technical undercurrent, suggesting data-driven reliability.

**Rules:**

- Use **Sentence case** for everything, including buttons and headers.
- **No ALL CAPS.**
- **No bold weights**; use Medium (500) for emphasis and Regular (400) for everything else.

## Layout & Spacing

The layout philosophy follows a **fixed grid model** for mobile, with a strong emphasis on vertical rhythm.

- **Grid:** Use a base unit of 8px. All margins and padding must be multiples of 8.
- **Margins:** A strict 24px margin is applied to the left and right screen edges.
- **Sections:** Content blocks are separated by a minimum of 24px to maintain an "airy," editorial feel.
- **Navigation:** The bottom navigation is persistent at 72px height, while the header remains at 56px.
- **Centering:** For hero-style sections or cold opens, text should be center-aligned to evoke a meditative state, while functional lists and journal entries remain left-aligned for readability.

## Elevation & Depth

This system rejects heavy shadows and neomorphism. Hierarchy is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

- **Surface Strategy:** The background is the neutral light grey/white. Cards and sheets use a pure white surface to "lift" slightly from the background.
- **Outlines:** Separation is created via 1px solid borders (`#E0E0E0`) rather than shadows.
- **Shadows:** Only used on floating elements (like the Crisis button). The shadow must be extremely subtle: 4px blur, 0px offset, and 8% opacity.
- **Interaction:** When a card is tapped, the border color shifts from neutral to the Purple accent color. No scaling or lifting effects are permitted.

## Shapes

The shape language follows specific functional radiuses to balance the "austere" editorial look with "soft" supportive touchpoints. While the inspiration is 0px (sharp), this system uses the following specific rules:

- **Cards:** 16px radius for a contained, gentle feel.
- **Buttons & Inputs:** 12px radius for optimal tap-area definition.
- **Bottom Sheets:** 24px radius on top corners only.
- **Crisis Button:** Always a perfect circle (50% radius) to distinguish it from all other UI elements.

## Components

### Header

- **Standard:** 56px height. No logo. No "Grace" branding. Plain sentence case title (e.g., "A space to think.") in 16px Medium Inter.
- **Slots:** Left slot for back arrow (sub-screens only). Right slot for a single icon (Settings).

### Bottom Navigation

- **Structure:** 5 slots, 72px height. White background with 1px top border.
- **Items:** Companion, Journal, Pathways, Network, Community.
- **Style:** 24px outlined icons (1.5px stroke). 12px Regular labels. Active state uses Purple accent; inactive uses Muted Gray.

### Floating Crisis Button

- **Placement:** Bottom-right, 16px from edge, 88px from bottom.
- **Style:** 56px Teal circle with a white "+" or support symbol. No text label.

### Buttons

- **Primary:** 48px tall, Purple background, white 16px Medium text, 12px radius.
- **Secondary:** 1px Purple border, transparent background, Purple text.
- **Crisis (Inline):** Only for use inside the Crisis Pathway. Teal background, white text.

### Cards

- White background, 1px border (`#E0E0E0`), 16px radius. 20px internal padding.
- Avoid "featured" states; all cards must have equal visual weight.

### Input Fields

- White background, 1px border, 12px radius. 48px minimum height.
- Multi-line journal inputs should have no border when in full-screen focus to mimic a sheet of paper.
