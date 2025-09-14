# VitaPulse Deployment Guide

## 🚀 Complete Self-Hosting Guide for VitaPulse

This guide will help you deploy VitaPulse as a self-hosted, cost-efficient, and scalable health & wellness platform.

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Git
- A domain name (optional but recommended)
- Basic knowledge of command line and web hosting

## 🏗️ Architecture Overview

```
VitaPulse Stack:
├── Frontend: Next.js 14 (React 18)
├── Backend: Next.js API Routes
├── Database: Supabase (PostgreSQL)
├── Authentication: Supabase Auth
├── AI Services: OpenAI, Anthropic, DeepSeek
├── File Storage: Supabase Storage / Cloudinary
├── Hosting: Vercel / Netlify / Self-hosted
└── CDN: Vercel Edge / Cloudflare
```

## 💰 Cost-Effective AI Models

### Recommended AI Provider Priority (Most Cost-Effective First):

1. **DeepSeek** - $0.14/1M input, $0.28/1M output
2. **OpenAI GPT-4o-mini** - $0.15/1M input, $0.6/1M output
3. **OpenAI GPT-3.5-turbo** - $0.5/1M input, $1.5/1M output
4. **Anthropic Claude Haiku** - $0.25/1M input, $1.25/1M output
5. **OpenAI GPT-4** - $10/1M input, $30/1M output (for complex tasks only)

### Monthly Cost Estimates (1000 users):
- DeepSeek: ~$50-100/month
- OpenAI GPT-4o-mini: ~$75-150/month
- Database (Supabase): ~$25/month
- Hosting (Vercel Pro): ~$20/month
- **Total: ~$95-295/month**

## 🛠️ Step-by-Step Deployment

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd vitapulse

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local
```

### 2. Database Setup (Supabase)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations:**
   ```sql
   -- Create tables (run in Supabase SQL Editor)
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     date_of_birth DATE,
     gender TEXT CHECK (gender IN ('male', 'female', 'other')),
     height INTEGER, -- in cm
     weight DECIMAL, -- in kg
     activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
     health_goals TEXT[],
     dietary_restrictions TEXT[],
     preferred_cuisines TEXT[],
     language TEXT DEFAULT 'en',
     timezone TEXT DEFAULT 'UTC',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     last_login TIMESTAMP WITH TIME ZONE,
     is_active BOOLEAN DEFAULT true,
     subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
     subscription_expires_at TIMESTAMP WITH TIME ZONE
   );

   -- Meals table
   CREATE TABLE meals (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
     calories INTEGER NOT NULL,
     protein DECIMAL NOT NULL,
     carbs DECIMAL NOT NULL,
     fat DECIMAL NOT NULL,
     fiber DECIMAL,
     sugar DECIMAL,
     sodium DECIMAL,
     ingredients TEXT[] NOT NULL,
     instructions TEXT[],
     prep_time INTEGER, -- in minutes
     cook_time INTEGER, -- in minutes
     servings INTEGER NOT NULL DEFAULT 1,
     cuisine TEXT,
     dietary_tags TEXT[],
     image_url TEXT,
     is_ai_generated BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Food logs table
   CREATE TABLE food_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     meal_id UUID REFERENCES meals(id) ON DELETE SET NULL,
     food_name TEXT NOT NULL,
     brand TEXT,
     quantity DECIMAL NOT NULL,
     unit TEXT NOT NULL,
     calories INTEGER NOT NULL,
     protein DECIMAL NOT NULL,
     carbs DECIMAL NOT NULL,
     fat DECIMAL NOT NULL,
     fiber DECIMAL,
     sugar DECIMAL,
     sodium DECIMAL,
     logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Health data table
   CREATE TABLE health_data (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     data_type TEXT NOT NULL CHECK (data_type IN ('weight', 'height', 'blood_pressure', 'heart_rate', 'steps', 'sleep', 'water', 'mood', 'energy', 'stress')),
     value DECIMAL NOT NULL,
     unit TEXT NOT NULL,
     notes TEXT,
     source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'wearable', 'app')),
     recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- AI conversations table
   CREATE TABLE ai_conversations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'deepseek')),
     model TEXT NOT NULL,
     messages JSONB NOT NULL,
     context JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- User achievements table
   CREATE TABLE user_achievements (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     achievement_type TEXT NOT NULL,
     achievement_name TEXT NOT NULL,
     description TEXT NOT NULL,
     icon TEXT NOT NULL,
     points INTEGER NOT NULL DEFAULT 0,
     unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Food database table
   CREATE TABLE food_database (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     brand TEXT,
     barcode TEXT,
     calories_per_100g DECIMAL NOT NULL,
     protein_per_100g DECIMAL NOT NULL,
     carbs_per_100g DECIMAL NOT NULL,
     fat_per_100g DECIMAL NOT NULL,
     fiber_per_100g DECIMAL,
     sugar_per_100g DECIMAL,
     sodium_per_100g DECIMAL,
     ingredients TEXT[],
     allergens TEXT[],
     dietary_tags TEXT[],
     image_url TEXT,
     verified BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes for better performance
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_meals_user_id ON meals(user_id);
   CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
   CREATE INDEX idx_health_data_user_id ON health_data(user_id);
   CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
   CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
   CREATE INDEX idx_food_database_name ON food_database(name);
   CREATE INDEX idx_food_database_barcode ON food_database(barcode);

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can view own meals" ON meals FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own meals" ON meals FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own meals" ON meals FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own meals" ON meals FOR DELETE USING (auth.uid() = user_id);
   -- Add similar policies for other tables...
   ```

3. **Configure Environment Variables:**
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

### 3. AI Services Setup

1. **Get API Keys:**
   - [OpenAI API Key](https://platform.openai.com/api-keys)
   - [Anthropic API Key](https://console.anthropic.com/)
   - [DeepSeek API Key](https://platform.deepseek.com/)

2. **Add to Environment Variables:**
   ```bash
   # AI Provider API Keys
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

### 4. External APIs Setup

1. **Nutrition APIs (Optional but Recommended):**
   - [Nutritionix API](https://www.nutritionix.com/business/api)
   - [Edamam API](https://developer.edamam.com/)

2. **Add to Environment Variables:**
   ```bash
   # External APIs
   NUTRITIONIX_APP_ID=your_nutritionix_app_id
   NUTRITIONIX_API_KEY=your_nutritionix_api_key
   EDAMAM_APP_ID=your_edamam_app_id
   EDAMAM_API_KEY=your_edamam_api_key
   ```

### 5. OAuth Setup (Optional)

1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **GitHub OAuth:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Add callback URL

3. **Add to Environment Variables:**
   ```bash
   # OAuth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### 6. File Storage Setup (Optional)

1. **Cloudinary (Recommended):**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your cloud name, API key, and secret

2. **Add to Environment Variables:**
   ```bash
   # File Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### 7. Build and Deploy

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   # Build the project
   npm run build

   # Deploy to Vercel
   vercel

   # Set environment variables in Vercel dashboard
   ```

#### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   # Build the project
   npm run build

   # Deploy to Netlify
   netlify deploy --prod --dir=out
   ```

#### Option C: Self-Hosting (VPS/Dedicated Server)

1. **Setup Server:**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   npm install -g pm2

   # Install Nginx for reverse proxy
   sudo apt install nginx
   ```

2. **Deploy Application:**
   ```bash
   # Clone and setup
   git clone <your-repo-url>
   cd vitapulse
   npm install
   npm run build

   # Start with PM2
   pm2 start npm --name "vitapulse" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/vitapulse
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 🔧 Configuration

### 1. AI Provider Configuration

Edit `src/utils/ai-cost-optimized.ts` to set your preferred AI provider:

```typescript
// Set primary provider (most cost-effective)
this.currentProvider = 'deepseek'; // or 'openai', 'anthropic'

// Set fallback provider
this.fallbackProvider = 'openai';
```

### 2. Feature Flags

Edit `src/config/app.ts` to enable/disable features:

```typescript
features: {
  aiMealPlanner: true,
  foodLogger: true,
  healthCalculators: true,
  wearableIntegration: true,
  gamification: true,
  multilingual: true,
  videoStreaming: false, // Disable if not needed
  analytics: true,
  community: true,
  mentalWellness: true,
},
```

### 3. Cost Optimization

1. **Use DeepSeek as Primary AI Provider:**
   - Lowest cost: $0.14/1M input tokens
   - Good quality for most health-related tasks

2. **Implement Caching:**
   ```typescript
   // Cache AI responses for common queries
   const cacheKey = `ai_response_${query}_${userContext}`;
   const cached = await redis.get(cacheKey);
   if (cached) return JSON.parse(cached);
   ```

3. **Rate Limiting:**
   ```typescript
   // Implement rate limiting for AI calls
   const rateLimit = new Map();
   const maxRequests = 100; // per hour
   ```

## 📊 Monitoring and Analytics

### 1. Error Tracking

Add Sentry for error monitoring:

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring

Add Vercel Analytics or Google Analytics:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Database Monitoring

Monitor Supabase usage in the dashboard:
- Database size
- API calls
- Storage usage
- Real-time connections

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit `.env.local` to version control:

```bash
# .gitignore
.env.local
.env.production
.env.development
```

### 2. API Security

```typescript
// Rate limiting middleware
export async function rateLimit(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const limit = 100; // requests per hour
  // Implement rate limiting logic
}
```

### 3. Data Validation

Always validate user input:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(1).max(120),
  // ... other fields
});
```

## 🚀 Scaling Considerations

### 1. Database Scaling

- Use Supabase Pro for better performance
- Implement database connection pooling
- Add read replicas for heavy read operations

### 2. Caching Strategy

```typescript
// Redis caching for frequently accessed data
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache meal plans for 1 hour
await redis.setex(`meal_plan_${userId}`, 3600, JSON.stringify(mealPlan));
```

### 3. CDN Setup

Use Cloudflare or Vercel Edge for global content delivery:

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## 📱 Mobile App (Optional)

To create mobile apps:

1. **React Native:**
   ```bash
   npx react-native init VitaPulseMobile
   ```

2. **Expo (Easier):**
   ```bash
   npx create-expo-app VitaPulseMobile
   ```

3. **PWA (Progressive Web App):**
   - Already configured in the Next.js app
   - Add to home screen on mobile devices

## 🔄 Maintenance and Updates

### 1. Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 2. Database Backups

Supabase automatically handles backups, but you can also:

```bash
# Manual backup
pg_dump your_database > backup.sql

# Restore backup
psql your_database < backup.sql
```

### 3. Monitoring

Set up alerts for:
- High error rates
- Slow response times
- High AI API costs
- Database connection issues

## 💡 Tips for Success

1. **Start Small:** Deploy with basic features first
2. **Monitor Costs:** Track AI API usage daily
3. **User Feedback:** Implement feedback collection
4. **Iterate:** Regular updates based on user needs
5. **Backup:** Always have database backups
6. **Security:** Regular security audits
7. **Performance:** Monitor and optimize regularly

## 🆘 Troubleshooting

### Common Issues:

1. **Build Errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Database Connection Issues:**
   - Check Supabase credentials
   - Verify network connectivity
   - Check RLS policies

3. **AI API Errors:**
   - Verify API keys
   - Check rate limits
   - Monitor API costs

4. **Deployment Issues:**
   - Check environment variables
   - Verify build logs
   - Check server resources

## 📞 Support

For additional support:
- Check the GitHub issues
- Join the community Discord
- Contact the development team

---

**Congratulations!** You now have a fully self-hosted, cost-efficient VitaPulse platform that can compete with MyFitnessPal and Noom. The platform is designed to be maintainable, scalable, and cost-effective while providing advanced AI-powered health and wellness features.
