# Gamified Cloud Web Terminal - Design Guidelines

## Overview
This is a high-fidelity web application for a **Gamified Cloud Web Terminal**. The design follows a minimalist, modern, dark-themed cyberpunk/developer aesthetic.

## Color Palette

### Primary Colors
- **Deep Black/Carbon**: `#121212` (Main background)
- **Carbon Dark**: `#0A0A0A` (Darker backgrounds)
- **Terminal Green**: `#39FF14` (Primary accent)
- **Terminal Green Alt**: `#00FF66` (Secondary accent)

### Gray Scale
- **Dark Gray**: `#1E1E1E` (Panels, cards)
- **Medium Gray**: `#2A2A2A` (Borders, dividers)
- **Light Gray**: `#B0B0B0` (Secondary text)
- **Pure White**: `#FFFFFF` (Primary text)

### Accent Colors
- **Success Streak**: `#FF8C00` (Orange flame icon)
- **Failed**: `#FF4444` (Red for errors)
- **Completed**: `#39FF14` (Green checkmark)
- **Warning**: `#FFD700` (Gold/yellow)

## Typography

### Font Families
- **UI Elements**: Inter, Roboto, Helvetica, Arial (Sans-serif)
- **Terminal/Code**: JetBrains Mono, Fira Code (Monospace)

### Font Weights
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

## Layout Architecture

### View 1: Authentication Screen

**Structure**:
- Centered authentication card
- Dark background with subtle gradient
- Two tabs: "Login" and "Register"

**Components**:
- **Header**:
  - Terminal icon (16x16 or larger)
  - "Cloud Terminal" title
  - Subtitle: "Gamified Linux Learning Platform"
  - Pulsing border animation around icon

- **Tabs**:
  - Full-width tabs
  - Terminal green indicator
  - Glow effect on active tab

- **Input Fields**:
  - Username (with User icon)
  - Email (Register only, with Mail icon)
  - Password (with Lock icon)
  - Gray border: `#2A2A2A`
  - Focus: Terminal green glow (`0 0 8px rgba(57, 255, 20, 0.3)`)
  - Monospace font for username

- **Button**:
  - Login: "Let's Hack"
  - Register: "Enter Terminal"
  - Background: `#39FF14`
  - Text: `#121212`
  - Glow: `0 0 20px rgba(57, 255, 20, 0.3)`

- **Registration Notice** (Register tab only):
  - Info alert
  - Background: `rgba(57, 255, 20, 0.05)`
  - Border: `1px solid rgba(57, 255, 20, 0.2)`
  - Text: "Upon registration, a secure personal root sandbox directory will be automatically provisioned for your account."

### View 2: Single-Page Dashboard

**Grid Layout**:
```
┌─────────────────────────────────────────┐
│     Top Navbar (Full Width)            │
├──────────────────┬──────────────────────┤
│  Task Creation   │  Profile Stats       │
│  Panel (25%)     │  & Streaks (25%)     │
├──────────────────┴──────────────────────┤
│                                         │
│  Web Terminal Window (50% height)      │
│                                         │
└─────────────────────────────────────────┘
```

#### Top Navbar Components

**Left Section**:
- **Avatar**:
  - Size: 48x48px
  - Background: `#39FF14`
  - Text color: `#121212`
  - Border: `2px solid #39FF14`
  - Glow: `0 0 20px rgba(57, 255, 20, 0.3)`
  - Click to open dropdown menu

- **User Info**:
  - Username (bold, 1.1rem)
  - Level chip: "Level X"
    - Background: `rgba(57, 255, 20, 0.15)`
    - Border: `1px solid #39FF14`

- **XP Progress Bar**:
  - Width: 200px
  - Height: 6px
  - Background: `#2A2A2A`
  - Fill: `#39FF14` with glow
  - Label: "XP: X/Y" (caption size, gray)

**Right Section**:
- Chevron down icon (Terminal green)

**Dropdown Menu**:
- Dark background: `#1E1E1E`
- Border: `1px solid rgba(57, 255, 20, 0.2)`
- Items:
  - "Edit Profile" (with User icon)
  - Divider
  - "Logout" (with LogOut icon, red text: `#FF4444`)

#### Task Creation Panel (Top-Left, 25%)

**Card Style**:
- Background: `#1E1E1E`
- Border: `1px solid rgba(57, 255, 20, 0.2)`
- Glow: `0 0 30px rgba(57, 255, 20, 0.1)`

**Components**:
- Title: "Create Task" (Terminal green, bold)
- Input: "Task Name" (monospace)
- Textarea: "Description" (monospace, 4 rows)
- Button: "Run" (bottom-right)
  - Background: `#39FF14`
  - Text: `#121212`
  - Play icon

#### Profile Stats Panel (Top-Right, 25%)

**Card Style**:
- Same as Task Creation Panel

**Components**:
- Title: "Statistics" (Terminal green, bold)
- 3 Stat Cards in grid (3 columns):

**Success Streak Card**:
- Background: `#121212`
- Border: `1px solid rgba(255, 140, 0, 0.3)`
- Flame icon: `#FF8C00`
- Number: Large, orange
- Label: "Success Streak"

**Failed Attempts Card**:
- Background: `#121212`
- Border: `1px solid rgba(255, 68, 68, 0.3)`
- X icon: `#FF4444`
- Number: Large, red
- Label: "Failed Attempts"

**Total Completed Card**:
- Background: `#121212`
- Border: `1px solid rgba(57, 255, 20, 0.3)`
- Check icon: `#39FF14`
- Number: Large, green
- Label: "Total Completed"

#### Web Terminal Window (Bottom, 50%)

**Card Style**:
- Background: `#000000` (pure black)
- Border: `1px solid rgba(57, 255, 20, 0.3)`
- Glow: `0 0 40px rgba(57, 255, 20, 0.15)`

**Terminal Header**:
- Background: `#1A1A1A`
- Border bottom: `1px solid rgba(57, 255, 20, 0.2)`
- Left: macOS-style window controls
  - Red dot: `#FF4444`
  - Yellow dot: `#FFD700`
  - Green dot: `#39FF14`
- Middle: "terminal@cloud-sandbox" (monospace, gray)
- Right: Trash icon (clear history)

**Terminal Output Area**:
- Background: `#000000`
- Font: JetBrains Mono / Fira Code
- Font size: 0.9rem
- Text color: `#39FF14`
- Scrollbar:
  - Width: 8px
  - Track: `#0A0A0A`
  - Thumb: `#39FF14`, rounded

**Welcome Message**:
```
Welcome to Cloud Terminal v1.0.0
Type 'help' for available commands
════════════════════════════════════════
```

**Command Format**:
```
user@sandbox:~$ <command>
<output in white>
```

**Terminal Input Area**:
- Background: `#0A0A0A`
- Border top: `1px solid rgba(57, 255, 20, 0.2)`
- Prompt: `user@sandbox:~$` (Terminal green)
- Input: Monospace, Terminal green
- Send button: Terminal green, hover effect

## Interactive Elements

### Input Fields (Global)
- **Default**:
  - Border: `#2A2A2A`
  - Background: Transparent or `#1E1E1E`

- **Hover**:
  - Border: `#39FF14`

- **Focus**:
  - Border: `#39FF14`
  - Glow: `0 0 8px rgba(57, 255, 20, 0.3)`

### Buttons

**Primary Button**:
- Background: `#39FF14`
- Text: `#121212`
- Font weight: 700
- Glow: `0 0 20px rgba(57, 255, 20, 0.3)`
- Hover glow: `0 0 30px rgba(57, 255, 20, 0.5)`

**Disabled State**:
- Background: `#2A2A2A`
- Text: `#666666`

### Cards/Panels

**Standard Card**:
- Background: `#1E1E1E`
- Border: `1px solid rgba(57, 255, 20, 0.2)`
- Glow: `0 0 30px rgba(57, 255, 20, 0.1)`
- Border radius: 8px

**Stat Card** (nested):
- Background: `#121212`
- Border: 1px solid (color varies)
- Border radius: 8px
- Padding: 16px

## Animations

### Pulse Animation (Auth page icon)
```css
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}
```

### Loading State
- Spinner color: `#39FF14`
- Background: `#0A0A0A`
- Text: "Loading..." (monospace, Terminal green)

## Component Specifications

### Profile Edit Dialog

**Structure**:
- Background: `#1E1E1E`
- Border: `1px solid rgba(57, 255, 20, 0.2)`
- Title: "Edit Profile" (Terminal green)

**Fields**:
- First Name
- Last Name
- Email
- Password (optional)

**Actions**:
- Cancel (gray text)
- Save (Primary button style)
- Delete Account (red, bottom section)

### Snackbar/Alert

**Success**:
- Background: `#1E1E1E`
- Text: `#39FF14`
- Icon: Check circle

**Error**:
- Background: `#1E1E1E`
- Text: `#FF4444`
- Icon: X circle

## Accessibility

- Maintain WCAG AA contrast ratios
- Terminal green (`#39FF14`) on black has excellent contrast
- All interactive elements have focus states
- Keyboard navigation supported
- Screen reader friendly labels

## Responsive Behavior

- Desktop (>1024px): Full 3-panel layout
- Tablet (768-1024px): Stack panels vertically
- Mobile (<768px): Single column, collapsible sections

## Implementation Notes

1. Use CSS Grid for main layout
2. Terminal green glows add cyberpunk feel
3. Monospace fonts for inputs that represent terminal data
4. Smooth transitions (200-300ms) for interactive elements
5. Loading states use Terminal green spinner
6. All shadows use Terminal green tint
7. Maintain dark theme throughout
8. No bright whites except for primary text

## Z-Index Hierarchy

- Base content: 1
- Cards/Panels: 2
- Navbar: 10
- Dropdown menus: 100
- Dialogs/Modals: 1000
- Snackbars: 1500

---

**Design Philosophy**: Keep it minimal, keep it dark, make it glow green. Every element should feel like part of a terminal interface while maintaining modern web UX standards.
