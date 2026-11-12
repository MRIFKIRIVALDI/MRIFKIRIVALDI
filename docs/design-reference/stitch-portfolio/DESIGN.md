---
name: Aetheria Glass
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#00668a'
  on-secondary: '#ffffff'
  secondary-container: '#40c2fd'
  on-secondary-container: '#004d6a'
  tertiary: '#8127cf'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c48ea'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system defines an ethereal, ultra-luxury digital presence tailored for elite digital product designers, design engineers, and high-caliber creative studios. The visual language merges high-end editorial clarity with cutting-edge neo-glassmorphism. 

The mood communicates precision, deep intentionality, and cosmic elegance. Every surface appears physical yet weightless—like meticulously cut silica floating over soft chromatic light ribbons in Light Mode, or floating in deep atmospheric space with nebula energy cores in Galaxy Dark Mode.

Key visual attributes:
- **Neo-Glassmorphism:** Multi-layered translucent panels featuring heavy backdrop blurs (20px to 40px), razor-sharp inner specular highlights, and ambient glow drop-shadows.
- **Micro-Gradients & Chromatic Highlights:** Restrained pastel iridescence (lavender, icy periwinkle, sky cyan) overlaid on luminous milk-glass planes in light mode, transforming into vibrant interstellar light flares across cosmic obsidian planes in dark mode.
- **Precision Floating Pods:** Isolated metric tags, floating badge counters, and squircle pill buttons providing structured depth and dynamic hierarchy.

## Colors
The palette bridges serene, airy luminescence and deep interstellar cosmic depth.

### Light Mode (Luminous Frost)
- **Canvas Base:** Pristine warm porcelain to soft milk-violet (`#F8FAFC` to `#EEF2FF`).
- **Glass Surface:** `rgba(255, 255, 255, 0.65)` to `rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(24px)`.
- **Primary & Accent:** Electric Iris (`#6366F1`), Glacial Sky (`#38BDF8`), and Soft Orchid (`#A855F7`).
- **Borders & Highlights:** 1px solid `rgba(255, 255, 255, 0.8)` with an inner drop shadow/inset ring representing specular bevels.
- **Typography:** Deep Obsidian Slate (`#0F172A`) for primary headlines, Cool Charcoal (`#475569`) for body text, and Indigo Violet (`#6366F1`) for categorized metadata caps.

### Galaxy Dark Mode (Interstellar Obsidian)
- **Canvas Base:** Abyssal deep navy to starlight obsidian (`#070913` with layered ambient radial gradients of `#1E1035` and `#0B1E36`).
- **Glass Surface:** `rgba(15, 23, 42, 0.55)` to `rgba(30, 41, 59, 0.40)` with `backdrop-filter: blur(32px)`.
- **Primary & Accents:** Bioluminescent Cyan (`#38BDF8`), Stellar Violet (`#A855F7`), and Soft Starlight Lavender (`#C084FC`).
- **Borders & Highlights:** 1px `rgba(255, 255, 255, 0.12)` topped with localized linear gradient borders (`linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.02) 100%)`).
- **Typography:** Pure Starlight White (`#F8FAFC`) for titles, Muted Nebula Silver (`#94A3B8`) for body, and Glowing Electric Cyan/Violet for accent pills and subheadings.

## Typography
Plus Jakarta Sans serves as the singular typographic voice across headlines, body copy, and UI controls. Its contemporary geometric curves, open apertures, and crisp alternate terminals complement rounded glass containers and pill motifs.

Usage guidelines:
- **Section Headers & Overlines:** Always pair `label-caps` in uppercase format with vibrant primary/accent colors (e.g., Violet or Cyan) to clearly anchor section entries before the main headline.
- **Display Weights:** Hero headers use weight `800` paired with negative tracking (`-0.03em`) to yield a compact, high-impact editorial presence.
- **Gradient Text Fills:** The hero second-line subhead ("Digital Product Designer") features a horizontal linear gradient spanning Primary Violet to Glacial Cyan (`linear-gradient(90deg, #6366F1 0%, #38BDF8 100%)`). In Galaxy Dark mode, the endpoint shifts toward Starlight Lavender.

## Layout & Spacing
The layout follows a modular 12-column responsive fluid grid centered within a constrained maximum content width of 1280px.

- **Desktop (>= 1024px):** 12 columns with a 24px (`1.5rem`) gutter and 48px (`3rem`) page boundary margins. Service cards and project highlights span 3 or 4 columns to create rhythmic horizontal pods.
- **Tablet (768px - 1023px):** 8 columns with a 20px gutter and 32px margins. Multi-column tool badges and testimonial cards reflow into 2-column or 3-column rows.
- **Mobile (< 768px):** 4 columns with a 16px (`1rem`) gutter and 20px (`1.25rem`) side margins. Horizontal multi-step processes or metric cards stack vertically or convert into horizontally swipeable glass carousels.

Spacing rhythm relies on an 8px module, with inner component padding prioritizing breathing room (`space-lg` to `space-xl`) inside glass containers to prevent content from touching glowing borders.

## Elevation & Depth
Depth is created through simulated optics—refraction, frosted diffusion, and specular light edge-catching—rather than heavy traditional drop-shadows.

### Layer Stack Architecture
1. **Atmospheric Canvas (Base 0):** Ambient gradient blobs (soft pastel silk ribbons in Light mode; celestial nebula clouds in Dark mode) that drift beneath frosted surfaces.
2. **Backdrop Panels (Elevation 1):** Main content cards and structural sections. Built with `backdrop-filter: blur(28px)`, a translucent fill (`rgba(255, 255, 255, 0.65)` light, `rgba(15, 23, 42, 0.6)` dark), a 1px border (`rgba(255, 255, 255, 0.7)` light, `rgba(255, 255, 255, 0.1)` dark), and a diffused ambient shadow: `0 20px 40px -15px rgba(99, 102, 241, 0.08)`.
3. **Floating Metric Chips & Controls (Elevation 2):** Elevated interactive elements, input textfields, and floating badges. Reinforced with `backdrop-filter: blur(16px)`, soft outer glows (`0 10px 25px -5px rgba(99, 102, 241, 0.12)`), and an inset specular rim light: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)`.
4. **Interactive Hover State:** Elements translate upward by `-3px` to `-4px` while the border lighting intensifies to full opacity and the colored ambient glow expands.

## Shapes
The shape language uses high curvature and pill-shaped aesthetics. Rounded geometric pods feel polished, organic, and touch-friendly.

- **Primary Badges & Micro-Pills:** Complete stadium pills (`border-radius: 9999px`) for navigation menus, floating stats, status pills, and CTA buttons.
- **Content Cards & Sections:** Generous rounded boundaries (`rounded-xl`, `24px` to `32px`) to evoke smooth molded acrylic and glass.
- **Nested Inner Pods:** Nested elements (such as tool icons, input boxes, or mini metric frames) scale down their curvature to `rounded-lg` (`16px` to `20px`) to maintain concentric harmony with parent containers.

## Components

### Buttons
- **Primary Action (High-Contrast Capsule):** Solid deep obsidian (`#0F172A`) in light mode; pure glowing white or electric cyan gradient in galaxy dark mode. Pill geometry (`rounded-full`), padded with `12px 28px`. Includes right-angled arrow icon that animates diagonally on hover.
- **Secondary / Glass CTA:** Frosted glass background (`rgba(255, 255, 255, 0.6)` light / `rgba(255, 255, 255, 0.08)` dark), 1px luminous border, containing dark neutral or white text with an accompanying download or external link icon.

### Navigation Header
- **Floating Island:** A singular floating stadium capsule centered at the top of the viewport. Houses the avatar/brand mark, horizontal link items with soft hover backdrops, and an integrated primary contact button. Anchored with heavy glass blur (`blur(30px)`).

### Service & Skill Cards
- **Frosted Tiles:** Squircle containers featuring a top-left colored glass icon badge (e.g., lavender for UI/UX, sky blue for Research). 
- **Action Cue:** Bottom-right mini indicator displaying an arrow-up-right (`↗`) that shifts color and position upon card hover.

### Floating Stat & Metric Badges
- **Detached Glazing:** Small floating pills and compact cards positioned around hero media. Displaying large bold metrics (`headline-md`) alongside tight secondary descriptions (`body-sm`), accented by mini sparkline SVG charts or starry status dots.

### Input Fields & Contact Module
- **Glass Inset Inputs:** Inputs feature a semi-translucent sunken fill (`rgba(255, 255, 255, 0.45)` in light, `rgba(15, 23, 42, 0.5)` in dark), with crisp inner borders that shift to focused Indigo/Cyan glows with a `2px` focus ring.
- **Pill Form Submit:** Full-width or inline dark capsule submit button with dynamic paper plane / arrow trajectory micro-interactions.

### Process & Testimonial Pods
- **Numbered Sequence Track:** Horizontal linear cards connected by subtle gradient connector pips, numbered with high-contrast accent numerals (`01`, `02`, `03`).
- **Quotes:** Glass testimonial pods with floating frosted quotation marks tinted in brand lavender or electric sky blue.