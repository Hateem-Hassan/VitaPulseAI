# VitaPulse Setup Guide

## Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp env.example .env.local
```

### 3. Edit Environment Variables
Open `.env.local` and fill in your actual values:
- Supabase URL and keys
- AI provider API keys (OpenAI, Anthropic, DeepSeek)
- OAuth provider credentials
- Other service credentials

### 4. Build the Project
```bash
npm run build
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Start Production Server
```bash
npm start
```

## Environment Variables Required

### Essential (Required for basic functionality)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CUSTOM_KEY` (already set in env.example)

### AI Features (Required for AI functionality)
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY` 
- `DEEPSEEK_API_KEY`

### Optional (For enhanced features)
- OAuth provider keys (Google, GitHub, Facebook)
- Email service credentials
- Analytics keys
- File storage credentials

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing modules:
1. Make sure `npm install` completed successfully
2. Check that `next-env.d.ts` exists in the root directory
3. Restart your TypeScript language server in your editor

### Build Errors
If build fails:
1. Check all environment variables are set
2. Ensure all dependencies are installed
3. Check for any missing files

### Runtime Errors
If the app crashes at runtime:
1. Verify environment variables are correct
2. Check Supabase connection
3. Verify AI API keys are valid

## Project Structure
```
VitaPulseAi/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   ├── components/          # React components
│   ├── config/             # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── .env.local             # Environment variables (create from env.example)
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Features Included
- ✅ AI-powered meal planning
- ✅ Food logging with barcode scanning
- ✅ Health calculators (BMI, BMR, etc.)
- ✅ Wearable device integration
- ✅ Gamification and achievements
- ✅ Analytics dashboard
- ✅ Community features
- ✅ Multilingual support (10+ languages)
- ✅ PWA (Progressive Web App)
- ✅ Offline functionality
- ✅ Medical reference library
- ✅ Clinical guidelines updater
- ✅ Adaptive fitness workouts

## Deployment
The app is ready for deployment on:
- Vercel (recommended)
- Netlify
- Any Linux VPS with Node.js support
- Docker containers

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.
