# Web Music Player – Layout Specification

## 1. Overview
This document describes the visual layout and component structure for the web music player application. The design prioritizes simplicity, accessibility, and responsive behavior across devices.

## 2. Overall Page Structure

```
┌─────────────────────────────────────────┐
│           HEADER / BRANDING             │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│          TRACK LIST AREA                │
│         (Scrollable)                    │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│        PLAYER CONTROLS (Fixed)          │
└─────────────────────────────────────────┘
```

## 3. Component Breakdown

### 3.1 Header Section
**Purpose:** Application branding and title
**Position:** Top of page, fixed or static
**Height:** ~60-80px

**Elements:**
- App logo/icon (left-aligned)
- App name: "Web Music Player" or custom branding
- Optional: minimal navigation or settings icon

**Styling:**
- Clean, minimal design
- Contrasting background color
- Centered or left-aligned text

---

### 3.2 Track List Area
**Purpose:** Display available music tracks
**Position:** Main content area, between header and player
**Behavior:** Scrollable vertically

**Track Item Structure:**
Each track should display:
```
┌───────────────────────────────────────┐
│ [▶] Track Title - Artist Name    3:45 │
├───────────────────────────────────────┤
│ [▶] Track Title - Artist Name    4:12 │
├───────────────────────────────────────┤
│ [▶] Track Title - Artist Name    3:28 │
└───────────────────────────────────────┘
```

**Elements per track:**
- Play button icon (▶)
- Track number or thumbnail (optional)
- Track title
- Artist name
- Duration
- Visual indicator for currently playing track (highlighted row, animation)

**Interaction:**
- Click on track to play
- Currently playing track is visually highlighted
- Hover effects for better UX

**Responsive behavior:**
- Desktop: List view with all details visible
- Mobile: Compact view, possible truncation of long titles

---

### 3.3 Player Control Section
**Purpose:** Primary music playback controls
**Position:** Fixed at bottom of viewport
**Height:** ~80-120px

**Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│  Now Playing: Track Name - Artist               │
├─────────────────────────────────────────────────┤
│     ◄◄    ▶/❚❚    ■    ►►                      │
│                                                 │
│  [────────●────────────────────] 1:23 / 3:45   │
│                                                 │
│  🔀  🔁  🔊 [──●──]                             │
└─────────────────────────────────────────────────┘
```

**Primary Controls (Row 1):**
- Previous track button (◄◄)
- Play/Pause toggle button (▶/❚❚) - larger, prominent
- Stop button (■)
- Next track button (►►)

**Progress Bar (Row 2):**
- Seek bar (draggable slider)
- Current time display
- Total duration display

**Secondary Controls (Row 3):**
- Shuffle button (🔀) - toggleable, shows active state
- Repeat button (🔁) - toggleable, shows active state
- Volume icon (🔊)
- Volume slider (horizontal)

**Responsive behavior:**
- Desktop: All controls visible in single row
- Tablet: Controls may stack into 2 rows
- Mobile: Compact layout, possibly collapsible volume control

---

## 4. Responsive Design Strategy

### 4.1 Desktop (≥1024px)
- Full layout with all controls visible
- Track list: 600-800px width, centered
- Player controls: Full-width bottom bar
- Spacious padding and margins

### 4.2 Tablet (768px - 1023px)
- Slightly condensed layout
- Track list: Full width with padding
- Player controls: May stack into 2 rows
- Touch-friendly button sizes (min 44x44px)

### 4.3 Mobile (≤767px)
- Compact, single-column layout
- Track list: Full width, minimal padding
- Player controls: Stacked layout
- Essential controls prioritized
- Volume slider may collapse into popup/modal
- Larger touch targets (min 48x48px)

---

## 5. UI/UX Principles

### 5.1 Visual Hierarchy
- Player controls most prominent (fixed, always visible)
- Currently playing track clearly highlighted
- Play/Pause button is the largest interactive element

### 5.2 Color Scheme
- Clean, modern palette
- High contrast for accessibility
- Active states clearly differentiated
- Dark mode consideration for future enhancement

### 5.3 Typography
- Clear, readable fonts (system fonts or web-safe fonts)
- Track titles: 16-18px
- Control labels: 14px
- Time display: 12-14px monospace

### 5.4 Accessibility
- Semantic HTML structure
- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators visible
- Sufficient color contrast (WCAG AA minimum)

### 5.5 Loading & States
- Loading indicator for track list
- Buffering indicator during playback
- Empty state message when no tracks available
- Error state handling (network issues, playback failures)

---

## 6. Component Interactions

### 6.1 Track Selection
1. User clicks on track in list
2. Track list highlights selected track
3. Player controls update with track info
4. Playback begins automatically

### 6.2 Continuous Playback
- When track ends, automatically advance to next
- Update player UI and highlighted track
- If last track and repeat is off, stop playback

### 6.3 Shuffle Mode
- Button toggles active state (visual indicator)
- Randomizes playback order
- Does not affect current track list display

### 6.4 Repeat Mode
- Button toggles active state
- Replays current track when it ends
- Overrides continuous playback

---

## 7. Technical Considerations

### 7.1 Performance
- Virtual scrolling for large track lists (100+ tracks)
- Lazy loading of album artwork (if implemented)
- Optimized re-renders (only update playing state)

### 7.2 Browser Compatibility
- Use standard HTML5 audio APIs
- CSS Grid/Flexbox for layout
- Polyfills for older browsers if needed
- Test on Chrome, Safari, Edge, Firefox

### 7.3 Mobile Optimizations
- Touch-friendly controls
- Prevent zoom on double-tap
- Handle screen orientation changes
- Optimize for touch gestures

---

## 8. Future Enhancements (Out of Current Scope)
- Playlist management
- Album artwork display
- Lyrics display
- Equalizer visualization
- Dark/Light theme toggle
- Keyboard shortcuts overlay
