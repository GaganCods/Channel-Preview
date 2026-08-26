# Product Requirements Document
## ChannelKit Preview — Editor Page (Core Tool)

**Version:** 1.0  
**Author:** Gagan Pratap  
**Date:** May 2026  
**Status:** Draft  
**Page:** `/editor` (or `/app`)

---

## 1. Purpose & Scope

This PRD covers **only the Editor page** — the actual working tool where a creator uploads assets and previews their channel. This is the product. The landing page sells it; this page IS it.

Single job of this page: **let a creator go from "blank canvas" to "confident, exported preview" in under 3 minutes, without ever feeling lost.**

---

## 2. Layout Architecture

The editor uses a **3-panel workspace layout** — a pattern borrowed from design tools (Figma, Canva) because creators already have muscle memory for it.

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR — Logo · Device Tabs (center) · Export · Settings       │
├──────────────┬──────────────────────────────────┬────────────────┤
│              │                                    │                │
│  LEFT PANEL  │         CENTER CANVAS             │  RIGHT PANEL   │
│  (Assets &   │      (Live YouTube Mockup)        │  (Edit Controls│
│   Channel    │                                    │   — contextual)│
│   Info)      │                                    │                │
│              │                                    │                │
│  280px       │           flex-grow                │   320px        │
│              │                                    │                │
└──────────────┴──────────────────────────────────┴────────────────┘
```

**Why this structure:**
- Left = Input (what you give the tool)
- Center = Output (what YouTube will actually show)
- Right = Control (appears only when something is selected — keeps the UI calm by default)

This avoids the #1 failure mode of editor tools: control overload. Right panel is **empty/hidden until the user clicks an asset in the canvas.**

---

## 3. Top Bar

**Height:** 64px. Fixed. `background: #111114`, `border-bottom: 1px solid #232328`.

| Zone | Contents |
|---|---|
| Left | Logo mark + "ChannelKit Preview" wordmark (clickable → home) |
| Center | Device Tab Switcher: **Desktop · Tablet · Mobile** (pill-style segmented control) |
| Right | "Safe Zone" toggle (icon button) · "Compare" toggle (icon button) · **Export** button (primary, amber fill) |

**Device Tab Switcher detail:**
- Segmented control, `background: #1A1A1F`, active segment `background: #EEA727`, active text `#0C0C0E`
- Icons: 🖥️ Desktop / 📟 Tablet / 📱 Mobile, each with label
- Switching is instant (no loading state) — canvas re-renders the crop frame only, assets stay loaded in memory

**Export button:**
- Pill shape, amber fill `#EEA727`, dark text `#0C0C0E`
- On click → opens a small dropdown (not a modal): "Export Desktop PNG" / "Export Mobile PNG" / "Export All (ZIP)"

---

## 4. Left Panel — Assets & Channel Info

**Width:** 280px fixed. `background: #131316`. Scrollable if content exceeds viewport height.

Organized into **collapsible sections** (accordion-style, one open at a time by default to reduce scroll fatigue):

### 4.1 Section: "Channel Assets" (open by default)

Each asset is an **upload slot card**:

```
┌─────────────────────────────────┐
│  BANNER                          │
│  ┌─────────────────────────┐    │
│  │                          │    │
│  │   [drag & drop or click]│    │
│  │      🖼️ Add banner       │    │
│  │                          │    │
│  └─────────────────────────┘    │
│  Recommended: 2560×1440px        │
└─────────────────────────────────┘
```

**States of an upload slot:**

| State | Visual |
|---|---|
| Empty | Dashed border `#33333A`, centered icon + "Add [asset]" label, muted text |
| Drag-hover | Border becomes solid `#EEA727`, background tints amber at 8% opacity |
| Filled | Shows actual thumbnail of uploaded image, filename + dimensions below in JetBrains Mono 11px, small "✕" remove icon top-right, small "✎" edit icon bottom-right (opens Right Panel) |
| Invalid file | Border flashes red `#E25555`, inline error text: "Use PNG, JPG, or WebP under 6MB" |

**Slots in order:**
1. **Banner** (1 slot)
2. **Profile Picture** (1 slot, rendered as circle preview even in the slot itself — so user sees the circular crop immediately)
3. **Thumbnails** (up to 6 slots, shown as a 2×3 mini-grid; "+" tile to add more up to limit)
4. **Watermark** (1 slot, optional — labeled "Optional" in muted text)

Clicking any filled slot's thumbnail **selects that asset** → opens Right Panel with its edit controls AND highlights/scrolls the canvas to that asset with a soft amber outline pulse (so the user always knows what they're editing).

---

### 4.2 Section: "Channel Info" (collapsed by default)

Plain text inputs, minimal style — no heavy borders, just bottom-border inputs like a clean form:

| Field | Input Type | Placeholder |
|---|---|---|
| Channel Name | Text, 100 char limit, live counter | "Your Channel Name" |
| Handle | Text, prefixed with "@" | "yourhandle" |
| Subscriber Count | Text | "12.4K subscribers" |
| Video count | Text | "48 videos" |

Each field updates the **canvas in real time** as the user types (debounced 150ms).

---

### 4.3 Section: "Video Details" (collapsed by default)

Appears only once at least one thumbnail is uploaded. One mini-form per thumbnail slot:

| Field | Limit |
|---|---|
| Title | 60 chars, live counter |
| Views | Freeform, e.g. "45K views" |
| Uploaded | Freeform, e.g. "3 days ago" |
| Duration badge | Freeform, e.g. "10:24" |

---

### 4.4 Section: "Style Presets" (collapsed by default)

5 horizontal preset cards (small thumbnails showing a color/style swatch): Gaming Dark · Edu Minimal · Vlog Warm · Tech Neon · Beauty Pastel.

Clicking applies a default gradient banner + accent color **only if no banner is uploaded yet** — never overwrites a user's real upload. If a banner exists, clicking a preset shows a confirm tooltip: "Replace your uploaded banner with this preset?"

---

## 5. Center Canvas — Live Preview

**This is the most important real estate on the page.** It must look like *actual YouTube*, pixel-for-pixel, not a wireframe approximation.

### 5.1 Canvas Container

- `background: #000000` (matches YouTube's actual page background in dark mode)
- Centered, max-width constrained to current device frame, with generous breathing room (min 64px padding on all sides) so it reads as a "preview stage," not a cramped fit
- Subtle drop shadow under the device frame: `0 24px 64px rgba(0,0,0,0.5)` to lift it off the canvas background

### 5.2 Desktop Mockup (default view)

Rendered at scale (fit to available width, capped at 1100px display width, internally tracking true 2560px coordinate space for export accuracy):

```
┌──────────────────────────────────────────────────┐
│ [ BANNER IMAGE — cropped to 1546×423 safe zone ]  │
│                                                     │
│  ⬤  Channel Name                                   │
│     @handle · 12.4K subscribers · 48 videos        │
│                                                     │
│  Home  Videos  Shorts  Playlists  About             │
│  ──────                                             │
│                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐                │
│  │ Thumb 1│  │ Thumb 2│  │ Thumb 3│                │
│  │  10:24 │  │  10:00 │  │   8:45 │                │
│  └────────┘  └────────┘  └────────┘                │
│  Title text   Title text   Title text               │
│  45K · 3d     850K · 1wk   525K · 1mo                │
└──────────────────────────────────────────────────┘
```

**Fidelity details that matter:**
- Profile picture overlaps the banner bottom edge by exactly the same proportion YouTube uses (circle sits ~50% on banner, 50% below it)
- Nav tab underline uses the same red-to-amber active indicator treatment as YouTube (we use amber `#EEA727` instead of YouTube red, since this is a branded tool, not a YouTube clone — subtle but intentional differentiation)
- Font: Roboto, matching YouTube's actual UI typeface — this is the one place we deliberately do NOT use Syne, because realism matters more than brand consistency *inside the mockup itself*
- Thumbnail grid uses real aspect ratio (16:9), real corner radius (8px, matching current YouTube style), real duration badge styling (bottom-right, black pill, white text)

### 5.3 Mobile Mockup

Rendered inside a **phone frame** (subtle, not a heavy 3D mockup — a clean minimal outline, similar to a modern Figma device frame) so it's unmistakably "this is mobile" without looking like clip art.

```
┌───────────────────┐
│ ╭─────────────────╮│
│ │ [BANNER cropped  ││
│ │  to mobile zone] ││
│ ╰─────────────────╯│
│   ⬤ Channel Name    │
│   @handle           │
│   12.4K subs        │
│                     │
│ ┌─────────────────┐│
│ │   Thumbnail 1   ││
│ │      10:24      ││
│ └─────────────────┘│
│ Title text          │
│ 45K views · 3d ago  │
│                     │
│ ┌─────────────────┐│
│ │   Thumbnail 2   ││
│ └─────────────────┘│
└───────────────────┘
```

Single-column vertical scroll list (matches real YouTube mobile app behavior). If content exceeds frame height, canvas scrolls internally within the device frame, not the whole page.

### 5.4 Tablet Mockup

Same structural pattern as Desktop, but 2-column thumbnail grid, narrower banner safe zone — shown in a wider, shorter frame than mobile, no device chrome (tablets vary too much to fake convincingly; we use a simple labeled border instead).

### 5.5 Safe Zone Overlay (toggle from Top Bar)

When active, overlays the banner with three translucent color bands:

| Zone | Color | Meaning |
|---|---|---|
| Green | `rgba(80, 200, 120, 0.25)` fill, solid border | Visible on all devices |
| Yellow | `rgba(238, 167, 39, 0.25)` fill | Visible on Desktop/TV only |
| Red | `rgba(226, 85, 85, 0.25)` fill | Always cropped, never seen |

A small floating legend chip appears bottom-left of the canvas when overlay is active, explaining the colors — dismissible, reappears on toggle.

### 5.6 Selection State

When an asset is selected (clicked from Left Panel or directly clicked on the canvas):
- A 2px amber outline `#EEA727` appears around that asset on the canvas, with a soft glow (`box-shadow: 0 0 0 4px rgba(238,167,39,0.15)`)
- A small floating label appears above it: "Banner" / "Profile Picture" / "Thumbnail 2" etc.
- Right Panel slides in from the right (240ms ease-out) with that asset's controls

Clicking empty canvas space deselects → Right Panel slides back out.

### 5.7 Empty State (before any upload)

Before any asset is uploaded, the canvas shows a **fully populated placeholder mockup** using a neutral gradient banner, a generic gray circle for profile pic, and gray rectangle thumbnails — so the user immediately understands the layout they're about to fill in, rather than facing a blank void. There is no overlay blocking hint on the canvas. Instead, the right side property panel displays a modern SVG illustration prompting the user to "Select & Edit".

---

## 6. Right Panel — Contextual Edit Controls

**Width:** 320px. Slides in/out. `background: #131316`, `border-left: 1px solid #232328`.

**Critical UX rule: this panel is empty/hidden by default.** It only appears when an asset is selected. This is what keeps the tool feeling clean instead of like a control-overloaded dashboard.

### 6.1 Panel Header (consistent across all asset types)

```
┌─────────────────────────────┐
│  Editing: Banner          ✕  │
├─────────────────────────────┤
```

"✕" deselects and closes the panel.

### 6.2 Banner Controls

| Control | UI Element | Range |
|---|---|---|
| Reposition | Direct drag on canvas (cursor becomes ✥ move icon when hovering banner) | — |
| Zoom | Horizontal slider with live % label | 50%–150% |
| Brightness | Slider | -100 to +100 |
| Contrast | Slider | -100 to +100 |
| Saturation | Slider | -100 to +100 |
| Color Overlay | Color swatch picker + opacity slider | 0–100% opacity |
| Blur | Slider | 0–20px |
| Reset button | Text button, bottom of panel, muted style | Resets all to default |

**Slider component spec:** Track `background: #232328`, filled portion `background: #EEA727`, thumb is a 16px circle, white, with subtle shadow. Live numeric value shown in JetBrains Mono to the right of each slider label.

### 6.3 Profile Picture Controls

| Control | UI Element |
|---|---|
| Reposition within circle | Direct drag on the circular preview |
| Scale | Slider, 80%–200% |
| Border | Toggle switch → reveals color picker + thickness slider when on |
| Background fill (shown behind transparent PNGs) | Color swatch picker |

### 6.4 Thumbnail Controls (per slot)

| Control | UI Element |
|---|---|
| Brightness / Contrast | Two sliders |
| Text Overlay | Toggle → reveals: text input, font dropdown (3 curated options), size slider, color picker, position grid (3×3 click-to-place grid icon) |
| Reorder | Not in Right Panel — handled via drag handles directly in Left Panel thumbnail grid |

### 6.5 Channel Info Live Edit (alternate panel state)

If the user clicks directly on the Channel Name or Handle text *in the canvas* (not just in Left Panel), the Right Panel shows simplified text-only controls: font weight toggle (Regular/Bold), and a direct link "Edit in sidebar →" that scrolls/expands the Left Panel's Channel Info section.

---

## 7. Compare Mode (Top Bar toggle)

When activated:
- Canvas splits into two side-by-side mini-canvases: "Version A" (current state, frozen as a snapshot) and "Version B" (continues live editing)
- A vertical drag-divider lets the user wipe between the two on a single overlaid canvas (Figma-style before/after slider) — OR side-by-side, controlled by a small sub-toggle: **Slider / Side-by-Side**
- Left Panel gains a small "Snapshot A" / "Snapshot B" label row at top so the user knows which state they're currently editing
- Right Panel and asset editing continue to work normally on whichever version is "live"

---

## 8. Export Flow

Triggered from Top Bar "Export" button → dropdown (not full modal, keeps user in flow):

```
┌───────────────────────────┐
│  Export Desktop PNG        │
│  Export Mobile PNG         │
│  Export Tablet PNG         │
│  ────────────────────      │
│  Export All (ZIP)          │
└───────────────────────────┘
```

On click:
- Button shows inline loading spinner (replaces label text temporarily: "Exporting...")
- Browser triggers native download — no intermediate "your file is ready" screen, no modal interruption
- Small toast notification slides in bottom-right: "✓ Desktop preview exported" (auto-dismiss after 3s)

**Technical note:** Export captures the *true resolution* canvas (e.g., actual 2560×423 banner crop), not the scaled-down on-screen render, using off-screen canvas compositing before triggering `html2canvas`/native Canvas `toBlob()`.

---

## 9. Responsive Behavior (Editor Page Specifically)

The editor is **desktop-first by necessity** (it's a design tool), but must degrade gracefully:

| Breakpoint | Behavior |
|---|---|
| ≥1280px | Full 3-panel layout as specified |
| 1024–1279px | Right Panel becomes an overlay (slides over canvas instead of pushing it) rather than a fixed 3rd column |
| 768–1023px | Left Panel becomes a collapsible drawer (hamburger-triggered), canvas takes full width, Right Panel remains overlay |
| <768px | Show a polite blocking message: "ChannelKit Preview works best on a larger screen. For the full editing experience, please switch to a desktop or tablet device." with a simplified read-only preview still viewable below if feasible |

---

## 10. Interaction & Motion Spec

| Interaction | Motion |
|---|---|
| Device tab switch | Canvas crop-frame animates width/height change, 200ms ease-in-out — no fade, just a smooth resize so user *feels* the device difference |
| Asset selected | Right panel slide-in, 240ms ease-out; canvas outline fade-in, 150ms |
| Slider drag | Real-time, no debounce on visual update (debounce only on expensive recompute if needed) |
| Upload success | Slot thumbnail crossfades from empty state to filled, 200ms |
| Safe zone toggle | Overlay fades in/out, 180ms, no slide |
| Export | Button label crossfade to spinner, toast slides up from bottom, 220ms ease-out |
| Drag-to-reposition (banner/profile pic) | Direct 1:1 cursor tracking, no easing (must feel physically attached to cursor) |

**Reduced motion:** All slide/fade animations respect `prefers-reduced-motion` — fall back to instant state changes.

---

## 11. Empty / Error / Edge States

| Scenario | UI Response |
|---|---|
| User uploads oversized file (>6MB) | Inline error in slot: "File too large. Max 6MB." Red border flash, no toast (keep it contained to the slot) |
| User uploads wrong format | Inline error: "Use PNG, JPG, or WebP." |
| User tries to export with zero assets uploaded | Export button disabled state (`opacity: 0.4`, cursor not-allowed) with tooltip on hover: "Upload at least one asset to export" |
| Browser doesn't support Canvas export (very old browser) | Fallback message in Export dropdown: "Export isn't supported in this browser. Try Chrome or Firefox." |
| User uploads a non-16:9 thumbnail | Auto-center-crop to 16:9 with a subtle one-time tooltip: "Cropped to 16:9 — drag to reposition" |

---

## 12. Component Inventory (for Development Handoff)

```
/components/editor
  EditorLayout.tsx          ← 3-panel shell, manages panel widths/breakpoints
  TopBar.tsx
    DeviceTabSwitcher.tsx
    SafeZoneToggle.tsx
    CompareToggle.tsx
    ExportMenu.tsx
  LeftPanel.tsx
    AssetUploadSlot.tsx      ← reusable for banner/pfp/thumbnail/watermark
    ChannelInfoForm.tsx
    VideoDetailsForm.tsx
    PresetCardRow.tsx
  CenterCanvas.tsx
    DesktopMockup.tsx
    TabletMockup.tsx
    MobileMockup.tsx
    SafeZoneOverlay.tsx
    SelectionOutline.tsx
    EmptyStateHint.tsx
  RightPanel.tsx
    BannerControls.tsx
    ProfilePicControls.tsx
    ThumbnailControls.tsx
    SliderControl.tsx        ← reusable slider w/ label + live value
    ColorSwatchPicker.tsx
  CompareView.tsx
    CompareSlider.tsx
    CompareSideBySide.tsx
  ExportToast.tsx
```

---

## 13. Design Tokens (Editor-Specific)

| Token | Value |
|---|---|
| `--editor-bg` | `#0C0C0E` |
| `--panel-bg` | `#131316` |
| `--canvas-bg` | `#000000` |
| `--border-default` | `#232328` |
| `--border-dashed-upload` | `#33333A` |
| `--accent-primary` | `#EEA727` |
| `--accent-glow` | `rgba(238,167,39,0.15)` |
| `--zone-green` | `rgba(80,200,120,0.25)` |
| `--zone-yellow` | `rgba(238,167,39,0.25)` |
| `--zone-red` | `rgba(226,85,85,0.25)` |
| `--text-primary` | `#F2F2F2` |
| `--text-secondary` | `#888893` |
| `--font-ui` | Syne (panel labels, buttons) |
| `--font-data` | JetBrains Mono (dimensions, percentages, filenames) |
| `--font-mockup` | Roboto (text rendered INSIDE the YouTube mockup only) |
| `--radius-card` | 12px |
| `--radius-slot` | 8px |
| `--radius-pill` | 9999px |

---

## 14. Success Criteria for This Page

| Metric | Target |
|---|---|
| Time to first upload | < 15 seconds from page load |
| Time to first export | < 3 minutes median session |
| Device tab usage rate | > 60% of sessions check at least 2 device views |
| Safe Zone toggle usage | > 40% of sessions |
| Drop-off rate (left without uploading anything) | < 25% |
| Right Panel engagement (at least one slider touched) | > 50% of sessions with an upload |

---

*Document prepared for Gagan Pratap — ChannelKit Preview / Editor Page*  
