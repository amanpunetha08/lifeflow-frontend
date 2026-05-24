# LifeFlow Frontend

Gamified productivity scheduler UI built with React + Vite + TailwindCSS.

## Tech Stack

- React 18 + Vite
- TailwindCSS (dark mode, glassmorphism)
- React Router v6
- Zustand (state management)
- React Query (server state)
- Framer Motion (animations)
- Recharts (analytics charts)
- Axios (API client with JWT interceptor)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
lifeflow-frontend/
├── src/
│   ├── api/              # Axios client with JWT refresh
│   ├── components/
│   │   ├── tasks/        # TaskCard, TaskList
│   │   ├── dashboard/    # Stats, charts
│   │   ├── landing/      # Landing page sections
│   │   └── common/       # Shared components
│   ├── pages/
│   │   ├── Landing/      # Premium landing page
│   │   ├── Auth/         # Login, Register
│   │   ├── Dashboard/    # Main dashboard
│   │   └── Analytics/    # (Phase 4)
│   ├── store/            # Zustand stores
│   ├── routes/           # Protected routes
│   ├── hooks/            # Custom hooks
│   ├── styles/           # Global CSS
│   └── utils/            # Helpers
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features

### Landing Page
- Animated hero with gradient effects
- Feature grid with icons
- How it works section
- Dashboard preview with mock stats
- Testimonials
- CTA sections

### Authentication
- JWT-based login/register
- Auto token refresh
- Persistent sessions (localStorage)
- Protected routes

### Dashboard
- Today's task overview with stats
- XP progress bar with level display
- Discipline score & chaos meter
- Card view and list view toggle
- Task completion with XP rewards

## Design System

- **Dark mode** with glassmorphism cards
- **Color palette**: Indigo primary, Fuchsia accent
- **Typography**: Inter font family
- **Animations**: Framer Motion fade-up, scale transitions
- **Components**: `.glass`, `.btn-primary`, `.btn-secondary`

## Development Phases

- [x] Phase 1: Landing, Auth, Dashboard shell, Task views
- [ ] Phase 2: Task creation form, Kanban board, Calendar
- [ ] Phase 3: Gamification UI, achievements, streaks display
- [ ] Phase 4: Analytics charts, notifications
- [ ] Phase 5: AI features, focus mode, mobile optimization
