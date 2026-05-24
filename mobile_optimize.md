# Mobile Optimization Audit

> **Last updated:** 2026-05-24
> **Scope:** Full codebase scan — layout, routes, chat, chrome, freeroam, survey, and UI components.

---

## Executive Summary

The project has a **well-designed dual-frame architecture** (`DesktopFrame` ↔ `MobileFrame` via `FrameWrapper.tsx`) that switches at the `lg` breakpoint (1024px). On desktop, content renders inside a fixed-size `PhoneChrome` (390×844px) with a docked `SidePanel`; on mobile, content renders directly into the viewport with a `SideDrawer` bottom sheet.

However, because the app was primarily designed and tested in the **desktop phone-simulator context**, several mobile-native concerns were never addressed. The audit found **3 critical bugs, 8 significant UX issues, and 6 polish items** across touch targets, typography, viewport handling, and interaction patterns.

---

## Architecture Overview

```
Desktop (≥1024px)                    Mobile (<1024px)
┌──────────────────────────────┐     ┌──────────────────┐
│ Top Bar (h-12)               │     │ Top Bar (h-11)   │
├──────────────┬───────────────┤     ├──────────────────┤
│              │               │     │                  │
│  PhoneChrome │  SidePanel    │     │  Direct Content  │
│  (390×844)   │  (w-400px)    │     │  (overflow-y)    │
│              │               │     │                  │
│  children    │  Instructions │     ├──────────────────┤
│  rendered    │  Checklist    │     │ Step Controls    │
│  inside      │  Reflections  │     │ (h-12) or FAB   │
│              │               │     └──────────────────┘
└──────────────┴───────────────┘       ↓ SideDrawer (85vh)
```

**Key files:**
- [FrameWrapper.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/FrameWrapper.tsx) — orchestrator, `useIsDesktop()` hook
- [DesktopFrame.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/DesktopFrame.tsx) — desktop shell with PhoneChrome + SidePanel
- [MobileFrame.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/MobileFrame.tsx) — mobile shell with SideDrawer
- [SideDrawer.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/SideDrawer.tsx) — bottom sheet (Framer Motion)
- [PhoneChrome.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/PhoneChrome.tsx) — desktop-only phone simulator

---

## 🔴 Critical Issues (Must Fix)

### C1 — Guided click interception breaks on mobile

**File:** [Guided.tsx:350](file:///Users/polaris/projects/capstone/prototype/src/routes/Guided.tsx#L350)

The guided tour's click-gating system checks `target.closest('#phone-viewport')` to determine if a click is valid. On mobile, `#phone-viewport` does **not exist** (it's inside `PhoneChrome`, which is desktop-only). This means the entire step-interception system silently fails on mobile — users can tap anything without restriction.

**Impact:** Study integrity — guided scenarios lose their controlled flow on mobile devices.

**Fix:**
```diff
- const isInsidePhone = target.closest('#phone-viewport')
+ const isInsidePhone = target.closest('#phone-viewport') || window.innerWidth < 1024
```
Or wrap mobile content in a container with its own interceptable ID.

---

### C2 — FreeRoam companion chat hardcoded height overflows

**File:** [FreeRoam.tsx](file:///Users/polaris/projects/capstone/prototype/src/routes/FreeRoam.tsx)

The companion chat section uses `h-[730px]` — this exceeds the viewport height on most phones (e.g. iPhone 14 has ~660px usable after browser chrome). Content overflows or gets clipped.

**Fix:**
```diff
- className="h-[730px] ..."
+ className="h-[calc(100dvh-72px-44px)] ..."
```
Use dynamic viewport units (`dvh`) minus bottom nav and header.

---

### C3 — Pervasive sub-14px typography across interactive content

Over **50 instances** of text below the 14px mobile readability threshold:

| Size | Tailwind Class | Count | Worst Offenders |
|------|---------------|-------|-----------------|
| 8px | `text-[8px]` | 3+ | Tag badges in stories/directories |
| 9px | `text-[9px]` | 5+ | Metadata, author names |
| 10px | `text-[10px]` | 15+ | Tab labels, timestamps, filter buttons, comment buttons |
| 11px | `text-[11px]` | 8+ | HandoffChips, suggestion prompts, advisory text |
| 12px | `text-xs` | 30+ | Body text, button labels, input text across most components |

**Key files affected:**
- [HandoffChips.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chat/HandoffChips.tsx) — `text-[11px]` on action chips
- [ChatMessage.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chat/ChatMessage.tsx) — `text-[10px]` timestamps
- [BottomNav.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chrome/BottomNav.tsx) — `text-[10px]` tab labels
- [CommunityStories.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/CommunityStories.tsx) — `text-[8px]` tags
- [PathwaysDirectory.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/PathwaysDirectory.tsx) — `text-[8px]` tags
- [MarketplaceDirectory.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/MarketplaceDirectory.tsx) — `text-[8px]` tags
- [FreeRoamSidebar.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/FreeRoamSidebar.tsx) — `text-[10px]` badges

**Fix:** Establish a mobile-minimum of `text-xs` (12px) for metadata/decorative text and `text-sm` (14px) for any readable content. Audit all `text-[Npx]` where N < 12.

---

## 🟡 Significant UX Issues

### S1 — Touch targets below 48px minimum

Multiple interactive elements fall below the [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) 48px minimum target size:

| Component | Element | Current Size | Target |
|-----------|---------|-------------|--------|
| [HandoffChips.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chat/HandoffChips.tsx) | Action buttons | `h-10` (40px) | `h-12` (48px) |
| [CommunityStories.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/CommunityStories.tsx) | Filter tags | `py-1` (~24px) | `py-2` (≥44px) |
| [CommunityStories.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/CommunityStories.tsx) | Upvote/Comment icons | `w-3 h-3` (12px) | Wrap in `p-3` container |
| [PathwaysDirectory.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/PathwaysDirectory.tsx) | Filter tags | `py-1` (~24px) | `py-2` (≥44px) |
| [MarketplaceDirectory.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/MarketplaceDirectory.tsx) | Filter tags | `py-1` (~24px) | `py-2` (≥44px) |
| [ScreenHeader.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chrome/ScreenHeader.tsx) | Back button | `p-1.5` (~28px) | `p-3` (≥44px) |
| [CrisisButton.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chrome/CrisisButton.tsx) | Modal close X | `p-1` (~28px) | `p-3` (≥44px) |
| [FreeRoamSidebar.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/FreeRoamSidebar.tsx) | Stepper badges | `w-5 h-5` (20px) | Row is clickable — OK |
| [ProviderHubFreeRoam.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/ProviderHubFreeRoam.tsx) | Back nav button | `text-xs` no padding (~20px) | Add padding |

**Particularly dangerous:** The **Crisis modal close button** (`p-1`, ~28px) is critically small given the safety-sensitive context. A user in distress should not struggle to dismiss this.

---

### S2 — HandoffChips 3-column grid crushes on narrow screens

**File:** [HandoffChips.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chat/HandoffChips.tsx)

The `grid-cols-3` layout gives each chip ~105px on a 375px screen. Labels like "Continue to journal" will overflow or wrap awkwardly.

**Fix:** Switch to `grid-cols-1 sm:grid-cols-3` or use `flex flex-wrap` with minimum widths.

---

### S3 — SideDrawer lacks swipe-to-dismiss gesture

**File:** [SideDrawer.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/SideDrawer.tsx#L33)

The bottom sheet has a visual drag indicator handle but **no actual drag/swipe gesture handling**. Mobile users universally expect to swipe down to dismiss a bottom sheet. Currently, the only close mechanisms are:
- Tapping the backdrop
- Tapping the X button

**Fix:** Add Framer Motion drag gesture:
```tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0 }}
  dragElastic={0.1}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose()
  }}
  // ... existing props
>
```

---

### S4 — Missing viewport-fit and safe area support

**File:** [index.html](file:///Users/polaris/projects/capstone/prototype/index.html#L6)

Current viewport meta:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Missing for modern iPhones (notch / Dynamic Island):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#FFFFFF" />
```

Without `viewport-fit=cover`, content may not extend into safe areas. Without safe area padding (`env(safe-area-inset-bottom)`), bottom nav and fixed elements could be obscured by the home indicator bar on newer iPhones.

**Files needing `safe-area-inset-bottom`:**
- [MobileFrame.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/MobileFrame.tsx) — step controls bar and floating FAB
- [BottomNav.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chrome/BottomNav.tsx) — bottom navigation
- [CrisisButton.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chrome/CrisisButton.tsx) — floating crisis button

---

### S5 — ReflectionPanel max-height conflicts inside SideDrawer

**File:** [SidePanel.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/SidePanel.tsx)

The reflection area uses `max-h-[calc(100vh-255px)]`. When rendered inside the `SideDrawer` (which caps at `85vh`), this creates conflicting height constraints — the scrollable area height is calculated from the full viewport but constrained by the drawer's smaller container.

**Fix:** Use container-relative units or detect the mobile context:
```diff
- max-h-[calc(100vh-255px)]
+ max-h-[calc(100%-4rem)]  // or use flex-1 with min-h-0
```

---

### S6 — Virtual keyboard pushes content off-screen

**Files:** [ChatInput.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chat/ChatInput.tsx), [MobileFrame.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/MobileFrame.tsx)

The mobile frame uses `h-screen` which doesn't account for the virtual keyboard on iOS/Android. When the keyboard opens:
- On iOS Safari, `100vh` includes the area behind the keyboard
- The chat input can be pushed below the visible area
- No `visualViewport` API usage found anywhere in the codebase

**Fix options:**
1. Use `100dvh` (dynamic viewport height) instead of `h-screen`
2. Add `visualViewport` resize listener to adjust layout
3. For chat specifically, add `scrollIntoView` on input focus

---

### S7 — iOS auto-zoom on text inputs

**File:** [Input.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/ui/Input.tsx)

iOS Safari auto-zooms the page when focusing on `<input>` elements with `font-size` below 16px. The Input component doesn't explicitly set `font-size: 16px`, relying on inheritance.

**Fix:** Add explicit `text-base` (16px) class to all input and textarea elements, or use the global CSS rule:
```css
input, textarea, select {
  font-size: 16px;
}
```

---

### S8 — Nested scrolling in ProviderHub

**File:** [ProviderHubFreeRoam.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/ProviderHubFreeRoam.tsx)

Two nested scrollable regions:
- Notes section: `max-h-[220px] overflow-y-auto`
- PDF preview: `h-64 overflow-y-auto`

Both sit inside an already-scrolling parent. On touch devices, nested scroll containers cause "scroll trapping" — users get stuck scrolling the inner container when they intend to scroll the page.

**Fix:** Consider collapsible sections or full-page modals instead of nested scroll areas on mobile.

---

## 🟢 Polish Items

### P1 — No `-webkit-tap-highlight-color: transparent`

Add to `index.css`:
```css
@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
  }
}
```
This prevents the default blue/grey flash on taps in iOS/Android browsers.

---

### P2 — Hover-only visual feedback without touch equivalents

50+ elements use `hover:` states with no `active:` counterpart. While no functionality is hover-gated (all have `onClick`), touch users get no visual feedback on tap for many elements.

**Key areas needing `active:` states:**
- Directory cards (`hover:border-primary hover:shadow-md`)
- Filter tags (`hover:border-text-muted`)
- Back buttons (`hover:text-primary`)
- Link-style elements (`hover:underline`)

**Fix pattern:**
```diff
- className="hover:border-primary hover:shadow-md"
+ className="hover:border-primary hover:shadow-md active:border-primary active:bg-primary/5"
```

Or use `@media (hover: hover)` to scope hover styles to devices that support it:
```css
@media (hover: hover) {
  .card:hover { border-color: var(--primary); }
}
```

---

### P3 — Missing `role="button"` on clickable divs

Several directory cards use `onClick` on plain `<div>` elements without `role="button"` or `tabIndex`:
- [CommunityStories.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/CommunityStories.tsx) — story cards
- [PathwaysDirectory.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/PathwaysDirectory.tsx) — pathway cards
- [MarketplaceDirectory.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/MarketplaceDirectory.tsx) — marketplace cards

**Fix:** Add `role="button" tabIndex={0} onKeyDown={handleEnter}` or switch to `<button>`.

---

### P4 — Likert scale may be cramped on narrow phones

**File:** [LikertItem.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/survey/LikertItem.tsx)

Five `flex-1` radio options in a row gives each ~60px on a 375px screen (after gaps). While functional, accurate tapping is difficult.

**Consider:** Making the options slightly taller (`py-4`) and ensuring adequate `gap-2` between them, or switching to a stacked vertical layout on phones under 400px.

---

### P5 — No orientation lock or landscape handling

No `orientation` media queries or lock mechanisms. If a user rotates their phone to landscape, the `h-screen` layouts compress vertically to ~375px height, potentially breaking chat and survey views.

**Consider:** Adding `screen.orientation.lock('portrait')` for the study session, or at minimum testing landscape behavior.

---

### P6 — CrisisButton advisory text too small in safety context

**File:** [CrisisButton.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/chrome/CrisisButton.tsx)

Crisis helpline descriptions and advisory text use `text-xs` (12px). Given the crisis-sensitive context of this content, text should be at minimum `text-sm` (14px) with generous line height.

---

## Task Checklist

### 🔴 Critical (Pre-study deployment)
- [ ] **C1** Fix `#phone-viewport` click interception for mobile in [Guided.tsx](file:///Users/polaris/projects/capstone/prototype/src/routes/Guided.tsx)
- [ ] **C2** Replace hardcoded `h-[730px]` in [FreeRoam.tsx](file:///Users/polaris/projects/capstone/prototype/src/routes/FreeRoam.tsx) with dynamic height
- [ ] **C3** Audit and fix all `text-[Npx]` where N < 12 across components

### 🟡 Significant (High-impact UX)
- [ ] **S1** Increase touch targets to ≥48px on HandoffChips, filter tags, upvote/comment icons, header back button, crisis close button
- [ ] **S2** Make HandoffChips responsive — stack on narrow screens
- [ ] **S3** Add swipe-to-dismiss gesture on [SideDrawer.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/SideDrawer.tsx)
- [ ] **S4** Add `viewport-fit=cover`, theme-color meta, and safe area padding in [index.html](file:///Users/polaris/projects/capstone/prototype/index.html) and bottom-positioned elements
- [ ] **S5** Fix ReflectionPanel `max-h` to be container-relative in [SidePanel.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/layout/SidePanel.tsx)
- [ ] **S6** Handle virtual keyboard — use `dvh` units or `visualViewport` API
- [ ] **S7** Set explicit `font-size: 16px` on all inputs to prevent iOS auto-zoom
- [ ] **S8** Address nested scrolling in [ProviderHubFreeRoam.tsx](file:///Users/polaris/projects/capstone/prototype/src/components/freeroam/ProviderHubFreeRoam.tsx)

### 🟢 Polish
- [ ] **P1** Add `-webkit-tap-highlight-color: transparent` globally
- [ ] **P2** Add `active:` states to all hover-only interactive elements
- [ ] **P3** Add `role="button"` and keyboard handlers to clickable divs
- [ ] **P4** Test Likert scale usability on 375px screens; consider vertical layout
- [ ] **P5** Test landscape orientation; consider orientation lock during study
- [ ] **P6** Increase CrisisButton advisory text to `text-sm` minimum

---

## Testing Recommendations

### Devices to Test
| Device | Screen | Why |
|--------|--------|-----|
| iPhone SE (3rd gen) | 375×667 | Smallest common iOS device |
| iPhone 14 | 390×844 | Matches PhoneChrome dimensions |
| iPhone 15 Pro Max | 430×932 | Dynamic Island safe area |
| Samsung Galaxy A14 | 360×800 | Common Android budget phone |
| iPad Mini | 744×1133 | Falls below 1024px — renders MobileFrame |

### Key Test Scenarios
1. **Guided flow end-to-end** on a real phone — verify click interception works
2. **Open keyboard** during chat — verify input stays visible
3. **Tap all interactive elements** — verify 48px targets and visual feedback
4. **Read all text** — verify nothing requires squinting
5. **Swipe down on SideDrawer** — verify it dismisses (after fix)
6. **Rotate to landscape** — verify nothing breaks catastrophically
7. **Fill out EndSurvey** — verify Likert taps are accurate and form scrolls past keyboard
8. **Tap Crisis button** — verify modal is usable, close is reachable, phone links work
