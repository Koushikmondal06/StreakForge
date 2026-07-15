# StreakForge

A developer habit tracker that connects to your GitHub account, fetches commit data, and presents analytics including coding streaks, with AI-powered insights via Google Gemini.

## Features

- **Coding Streaks**: Track consecutive days of commits
- **Activity Analytics**: Visualize your coding patterns with charts
- **AI Insights**: Get personalized suggestions using Google Gemini
- **Repository Analytics**: Breakdown stats by individual repositories
- **Caching**: Supabase-based caching for improved performance

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Recharts
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: Supabase (PostgreSQL)
- **APIs**: GitHub REST API, Google Gemini AI

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub OAuth App credentials
- Supabase account
- Google Gemini API key

### Environment Variables

1. Copy the example environment files:

```bash
cp .env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

2. Fill in the required variables:

**Backend (.env)**:
- `CLIENT_ID` - GitHub OAuth App Client ID
- `CLIENT_SECRET` - GitHub OAuth App Client Secret
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)

**Frontend (.env)**:
- `VITE_API_BASE` - Backend API URL (default: http://localhost:5000)

### Database Setup

Run the SQL migration in your Supabase dashboard:

```sql
-- See Backend/migrations/001_create_github_cache.sql
```

### Installation

```bash
# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

### Development

```bash
# Start Backend (port 5000)
cd Backend
npm run dev

# Start Frontend (port 5173)
cd Frontend
npm run dev
```

### Production Build

```bash
# Build Backend
cd Backend
npm run build
npm start

# Build Frontend
cd Frontend
npm run build
npm run preview
```

## Architecture

```
StreakForge/
├── Backend/
│   ├── middleware/      # Auth middleware
│   ├── routes/         # API routes (auth, github, gemini)
│   ├── services/       # Business logic (github, supabase)
│   ├── types/          # TypeScript interfaces
│   └── migrations/     # SQL migrations
└── Frontend/
    └── src/
        ├── components/ # Reusable UI components
        ├── hooks/      # Custom React hooks
        ├── pages/      # Route pages
        └── services/   # API client functions
```

## API Endpoints

- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - OAuth callback
- `GET /github/repos` - Get user repositories
- `GET /github/commits` - Get commits for a repo
- `GET /github/analytics` - Get aggregate analytics
- `POST /ai` - Free-form AI chat
- `POST /ai/dashboard-analysis` - Structured AI analysis

## License

ISC