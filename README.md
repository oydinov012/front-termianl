# Gamified Cloud Web Terminal

A modern, dark-themed Linux learning platform with gamification features. Learn Linux commands through an interactive web terminal with XP, levels, and achievement tracking.

## Design Philosophy

**Style**: Minimalist, Modern, Dark-themed Cyberpunk/Developer Aesthetic

**Color Palette**:
- Deep Black/Carbon: `#121212`
- Terminal Green: `#39FF14` / `#00FF66`
- Dark Gray Panels: `#1E1E1E`
- Accent: `#2A2A2A`

**Typography**:
- UI Elements: Inter, Roboto (Sans-serif)
- Terminal/Code: JetBrains Mono, Fira Code (Monospace)

## Features

### 🎮 Gamification System
- **Level & XP System**: Track your progress with experience points
- **Success Streaks**: Build and maintain learning streaks 🔥
- **Failed Attempts Tracking**: Learn from mistakes ❌
- **Total Completed Tasks**: Track overall achievements ✅

### 🖥️ Single-Page Dashboard

**Top Navbar**:
- User avatar with profile dropdown
- Real-time XP progress bar
- Current level display
- Edit profile and logout options

**Three-Panel Layout**:

1. **Task Creation Panel** (Top-Left, 25%)
   - Create new learning tasks
   - Add task descriptions
   - Run tasks with one click

2. **Statistics Panel** (Top-Right, 25%)
   - Success Streak counter with flame icon
   - Failed Attempts tracking
   - Total Completed Tasks display
   - Visual stat cards

3. **Web Terminal** (Bottom, 50%)
   - Full Linux terminal simulation
   - macOS-style window controls (red, yellow, green dots)
   - Command history
   - Real-time output
   - Sleek scrollbar design

### 🔐 Authentication

**Dual-Tab Auth Card**:
- Clean Login/Register tabs
- Terminal green glow effects on focus
- Prominent "Let's Hack" / "Enter Terminal" button
- Auto-provisioned sandbox directory notification

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI v7 (Dark Mode)
- **Styling**: Tailwind CSS v4 + Custom Cyberpunk Theme
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Build Tool**: Vite

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd gamified-terminal

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env

# Update .env with your backend API URL
VITE_API_URL=http://localhost:8000
```

## Usage

### Authentication
1. Navigate to `/auth`
2. Choose **Login** or **Register** tab
3. Enter credentials
4. Click "Let's Hack" to enter terminal

### Dashboard
Once logged in, you'll see:

**Profile Menu** (Top-left avatar):
- Edit profile (first name, last name, email, password)
- Delete account option
- Logout

**Task Creation** (Top-left panel):
1. Enter task name
2. Add description
3. Click **Run** button

**Statistics** (Top-right panel):
- Monitor your success streak
- Track failed attempts
- View total completed tasks

**Terminal** (Bottom panel):
1. Type Linux commands
2. Press Enter or click Send
3. View real-time output
4. Clear history with trash icon

## API Integration

### Endpoints Used

**Authentication**:
- `POST /api/auth/login/` - JWT authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/token/refresh/` - Token refresh

**Profile**:
- `GET /api/profile/` - Get user profile
- `PUT /api/profile1/{id}/` - Update profile
- `PATCH /api/profile1/{id}/` - Partial update
- `DELETE /api/profile1/{id}/` - Delete account

**Tasks**:
- `GET /task/` - List tasks
- `POST /task/` - Create task

**Terminal**:
- `POST /terminal/` - Execute command

## Project Structure

```
src/
├── app/
│   ├── config/
│   │   └── api.ts              # Axios configuration with JWT
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── AuthPage.tsx        # Login/Register page
│   │   └── Dashboard.tsx       # Main single-page dashboard
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   └── App.tsx                 # App with dark theme config
└── styles/                     # Tailwind CSS

```

## Design Components Checklist

✅ **Auth Card**:
- Centered card with tabs
- Terminal green glow effects
- Monospace username input
- Sandbox provision notice

✅ **Top Navbar**:
- Avatar with dropdown
- Username display
- Level chip
- XP progress bar

✅ **Profile Dropdown**:
- Edit profile option
- Delete account (red button)
- Logout option

✅ **Terminal Window**:
- macOS-style window controls
- Minimal modern scrollbar
- Command history
- Real-time output
- Monospace font

✅ **Task Panel**:
- Input fields
- Green "Run" button
- Clean layout

✅ **Stats Panel**:
- 3 visual cards
- Flame icon (streak)
- X icon (failures)
- Check icon (completed)

## Color Reference

```css
/* Primary Colors */
--deep-black: #121212;
--carbon-bg: #0A0A0A;
--terminal-green: #39FF14;
--terminal-green-alt: #00FF66;

/* Gray Scale */
--dark-gray: #1E1E1E;
--medium-gray: #2A2A2A;
--light-gray: #B0B0B0;

/* Accent Colors */
--success-streak: #FF8C00; /* Orange flame */
--failed: #FF4444;         /* Red */
--completed: #39FF14;      /* Green */
```

## Development

```bash
# Start development server (Figma Make environment)
# The dev server is already running

# For local development:
pnpm run dev
```

## Features Highlight

🎯 **Single-Page Application**: No page refreshes, smooth experience  
🌑 **Dark Theme**: Easy on the eyes, cyberpunk aesthetic  
⚡ **Real-time Updates**: Instant feedback on commands  
📊 **Gamification**: XP, levels, streaks keep you motivated  
🔒 **Secure**: JWT-based authentication  
📱 **Responsive**: Works on all screen sizes  

## License

MIT

---

> **Note**: This platform automatically creates a sandboxed directory (`/user_sandbox/`) for each user upon registration, providing a safe environment for Linux practice.
# front-termianl
