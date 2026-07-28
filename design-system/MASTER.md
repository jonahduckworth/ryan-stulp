# Ryan Stulp Real Estate — Design System

This file is the source of truth for the public website and admin dashboard.

## Product intent

The experience should make Ryan easy to trust, easy to contact, and easy to remember. It serves two modes:

- Public: editorial, confident, warm, conversion-focused real estate experience.
- Admin: restrained, dense enough to be useful, fast to scan, and built around listings and leads.

## Visual direction

- Style: premium editorial minimalism with subtle architectural geometry.
- Brand anchors: the supplied RS mark, signal red, ink black, warm white, and neutral stone.
- Avoid: generic luxury clichés, excessive gradients, glassmorphism, stock-template card grids, animated counters, fake statistics, and real-estate gold.
- Photography: use Ryan's portraits and approved listing imagery with intentional crops, preserved aspect ratios, and no decorative distortion.
- Motion: restrained opacity/translate transitions, 150–300 ms, disabled under `prefers-reduced-motion`.

## Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#111111` | Primary text, dark surfaces |
| `paper` | `#F8F6F2` | Main warm background |
| `white` | `#FFFFFF` | Cards and high-contrast surfaces |
| `signal` | `#D51F3C` | Primary actions and brand emphasis |
| `signal-dark` | `#A9152D` | Hover/pressed states |
| `charcoal` | `#272727` | Secondary dark surface |
| `slate` | `#5A5A57` | Muted body text |
| `line` | `#D8D3CB` | Borders and dividers |
| `success` | `#217A52` | Success states |
| `warning` | `#9A5B12` | Pending/warning states |
| `danger` | `#B42318` | Errors/destructive actions |

All normal body copy must meet WCAG AA contrast. Signal red is used with white only at sufficiently large or bold sizes; otherwise use ink text on a pale signal tint.

## Typography

- Display/headings: `Manrope`, 600–800, tight tracking.
- Body/UI: `Inter`, 400–700.
- Numeric/listing emphasis: tabular numbers.
- Body size: 16 px minimum on mobile; 18 px for editorial sections.
- Body line height: 1.6–1.75.
- Long-form line length: 65–72 characters.
- Headings use sentence case, not all caps, except short eyebrow labels.

## Layout

- Public max width: 1240 px.
- Admin max width: fluid with a 280 px sidebar at desktop.
- Public section rhythm: 72–120 px desktop, 56–80 px mobile.
- Grid: 12 columns desktop, 6 tablet, 4 mobile.
- Breakpoints: verify 375, 768, 1024, and 1440 px.
- Fixed/sticky elements must reserve their space and never obscure focused content.
- No horizontal scrolling at any supported width.

## Components

### Navigation

- Public navigation is calm, lightweight, and never more visually dominant than the hero.
- Persistent brokerage identification appears in the global shell.
- Mobile menu uses a full-width panel with 48 px targets and visible focus.

### Buttons and links

- Minimum touch target: 44 × 44 px.
- Primary: signal red background, white text, dark-red hover.
- Secondary: transparent, ink border, ink text.
- Tertiary: text link with directional icon and underline offset.
- Hover must not move layout.
- All keyboard focus states use a high-contrast two-pixel outline with offset.

### Cards

- Use borders and whitespace before shadows.
- Listing cards reserve image aspect ratio and expose status in text, not colour alone.
- Admin summary cards are compact and use real counts only.

### Forms

- Persistent visible labels; placeholders are examples, not labels.
- Explain why sensitive fields are requested.
- Inline errors sit beside the field and a form-level summary receives focus.
- Submit buttons expose loading state and prevent duplicate submission.
- Consent language is readable and marketing consent is separate and unchecked.

### Tables

- Keep a semantic table on desktop.
- At narrow widths, transform rows into labelled cards without losing field meaning.
- Status is text plus a subtle badge.
- Provide an explicit empty state and a next action.

### Dialogs

- Use only for short, interruptive tasks or confirmations.
- Destructive actions require target-specific confirmation.
- Focus is trapped and returned to the trigger.

## Public page pattern

1. Brokerage/identity strip.
2. Navigation.
3. Outcome-led hero with one primary and one secondary action.
4. Trust proof using approved facts only.
5. Buyer/seller decision path.
6. Listings or honest empty state.
7. Process/benefits.
8. Approved testimonial or credibility section.
9. Strong contact section.
10. Compliance-first footer with brokerage name and address.

## Admin page pattern

1. Persistent sidebar on desktop; drawer on mobile.
2. Page title, concise context, primary action.
3. Filters/search only when they have real utility.
4. Content surface with loading, empty, error, and success states.
5. Destructive actions separated from primary workflow.

## Accessibility and performance gates

- Semantic landmarks and heading hierarchy.
- Skip link.
- Full keyboard navigation and visible focus.
- Labels for every input and accessible names for icon buttons.
- Descriptive alt text for meaningful images; empty alt for decoration.
- Form errors announced through live regions.
- Reduced-motion support.
- Responsive optimized images with reserved dimensions.
- Lazy-load offscreen media; prioritize the hero image.
- Avoid unnecessary client JavaScript and third-party scripts.
- Public pages must remain useful without animation.

## Content voice

- Direct, grounded, knowledgeable, and human.
- Prefer concrete Calgary-area guidance over generic superlatives.
- Never imply guarantees, fabricate urgency, or publish unverified performance claims.
- Use "Ryan" when conversational and the approved licensed/brokerage name in compliance contexts.

