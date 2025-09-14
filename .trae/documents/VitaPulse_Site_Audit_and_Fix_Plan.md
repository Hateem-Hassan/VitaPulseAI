# VitaPulse Site-Wide Audit & Fix Plan

## 1. Project Overview

VitaPulse aims to be the definitive, open-source-powered health platform surpassing MyFitnessPal, Noom, and UpToDate. The current implementation has critical functionality gaps that prevent it from achieving its mission as a comprehensive health platform.

## 2. Core Issues Identified

### 2.1 Critical Priority Issues (Fix Immediately)

#### Missing Calculator Implementations
- **Status**: Only BMI calculator is implemented (1/20 calculators)
- **Impact**: 95% of calculator functionality is broken
- **Missing Routes**:
  - `/calculators/calorie-needs` - Daily calorie requirements
  - `/calculators/hydration` - Water intake calculator
  - `/calculators/sleep-needs` - Optimal sleep duration
  - `/calculators/macro-splitter` - Macronutrient ratios
  - `/calculators/heart-rate-zone` - Target heart rate zones
  - `/calculators/body-fat` - Body fat percentage
  - `/calculators/step-goal` - Daily step targets
  - `/calculators/stress-estimator` - Stress level assessment
  - `/calculators/fitness-progress` - Fitness tracking
  - **10 Professional Calculators**: CVD Risk, GFR, Dose calculations, etc.

#### Broken Navigation Links
- **Dashboard Route**: `/dashboard` - Partially functional but missing key components
- **Meal Planner**: `/meal-planner` - Route exists but incomplete implementation
- **Food Logger**: `/food-logger` - Missing implementation
- **Analytics**: `/analytics` - Missing implementation
- **Achievements**: `/achievements` - Missing implementation
- **Community**: `/community` - Missing implementation
- **Workouts**: `/workouts` - Missing implementation

#### Authentication System Issues
- **Missing Auth Pages**: `/auth/signin` and `/auth/signup` routes not implemented
- **Auth Hook**: `useAuth` hook exists but may have integration issues
- **User Management**: Incomplete user session handling

### 2.2 High Priority Issues

#### Mixed Architecture Conflicts
- **PHP Files**: Legacy PHP files in root directory conflicting with Next.js routing
  - `calculators/bmi.html` - Conflicts with `/calculators/bmi` React route
  - `pro-calculators/index.php` - Separate authentication system
  - `medical-content-generator/index.php` - Isolated functionality
- **CSS Conflicts**: Clinical CSS removed from layout but files still exist
- **Routing Confusion**: Multiple implementations for same functionality

#### Incomplete Dashboard Components
- **Missing Components**: Several dashboard components referenced but not fully implemented
- **Data Integration**: Mock data used instead of real backend integration
- **Gamification**: Points system partially implemented

### 2.3 Medium Priority Issues

#### AI Integration Missing
- **LLM Services**: No integration with planned AI models (Llama 3, BioMistral, Meditron)
- **AI Meal Planner**: Interface exists but no backend AI integration
- **Medical Content**: No AI-powered content generation

#### Database Integration
- **Supabase**: Configured but not fully integrated
- **User Data**: No persistent storage for user calculations and progress
- **Halal Food Database**: Missing implementation

## 3. Detailed Fix Plan

### 3.1 Phase 1: Critical Fixes (Week 1)

#### Priority 1A: Implement Missing Calculators

**Public Calculators (10 total)**:
1. **TDEE Calculator** - Total Daily Energy Expenditure
2. **Calorie Needs Calculator** - Daily calorie requirements
3. **Hydration Calculator** - Daily water intake
4. **Sleep Needs Calculator** - Optimal sleep duration
5. **Macro Splitter** - Macronutrient distribution
6. **Heart Rate Zone Calculator** - Target heart rate zones
7. **Body Fat Calculator** - Body fat percentage estimation
8. **Step Goal Calculator** - Daily step targets
9. **Stress Level Estimator** - Stress assessment
10. **Fitness Progress Tracker** - Progress monitoring

**Implementation Steps**:
- Create individual calculator pages following BMI calculator pattern
- Implement calculation logic for each calculator
- Add proper form validation and error handling
- Integrate points system for gamification
- Add SEO optimization for each calculator page

#### Priority 1B: Fix Navigation System

**Authentication Pages**:
- Create `/auth/signin` page with Supabase integration
- Create `/auth/signup` page with user registration
- Implement password reset functionality
- Add social login options (Google, Apple)

**Core Pages**:
- Complete `/dashboard` implementation with all components
- Implement `/meal-planner` with basic functionality
- Create `/food-logger` with food search and logging
- Build `/analytics` with user progress visualization
- Develop `/achievements` with badge system
- Create `/community` with basic social features
- Implement `/workouts` with exercise tracking

### 3.2 Phase 2: Professional Features (Week 2)

#### Priority 2A: Professional Calculators

**Medical Calculators (10 total)**:
1. **GFR Calculator** - Glomerular Filtration Rate
2. **CVD Risk Calculator** - Cardiovascular disease risk
3. **Drug Dosage Calculator** - Medication dosing
4. **BMR Calculator** - Basal Metabolic Rate
5. **Blood Pressure Risk** - Hypertension assessment
6. **Cholesterol Risk** - Lipid profile analysis
7. **Diabetes Risk** - Type 2 diabetes screening
8. **Pregnancy Calculator** - Gestational calculations
9. **Pediatric Growth** - Child development metrics
10. **Nutrition Assessment** - Professional dietary analysis

**Implementation Requirements**:
- Implement professional-grade validation
- Add medical disclaimers and warnings
- Include reference ranges and clinical guidelines
- Integrate with medical literature citations
- Add export functionality for clinical use

#### Priority 2B: Architecture Cleanup

**Remove PHP Conflicts**:
- Migrate useful PHP functionality to Next.js API routes
- Remove conflicting HTML/PHP files
- Consolidate authentication systems
- Clean up CSS conflicts

**Database Integration**:
- Complete Supabase schema design
- Implement user data persistence
- Add calculation history storage
- Create user progress tracking

### 3.3 Phase 3: AI Integration (Week 3-4)

#### Priority 3A: AI Meal Planner

**LLM Integration**:
- Set up vLLM inference servers
- Integrate Llama 3 (70B) for meal planning
- Implement Halal food filtering
- Add budget-based meal suggestions
- Create dietary restriction handling

#### Priority 3B: Medical AI Features

**Content Generation**:
- Integrate BioMistral (7B) for public health content
- Set up Meditron (70B) for professional content
- Implement AI-powered health insights
- Add personalized recommendations

#### Priority 3C: MedEd Suite

**Educational Tools**:
- AI QBank Generator with MCQ creation
- Flashcard Creator with spaced repetition
- Clinical Case Simulator
- AI Study Planner with personalized schedules

### 3.4 Phase 4: Advanced Features (Week 5-6)

#### Priority 4A: Halal Food Logger

**Database Development**:
- Create comprehensive Halal restaurant database
- Implement menu item verification system
- Add location-based restaurant search
- Integrate nutrition data for Halal foods

#### Priority 4B: Gamification Enhancement

**Engagement Features**:
- Advanced streak tracking system
- Achievement badge system with 50+ badges
- Leaderboards and social challenges
- Variable reward system with AI-powered surprises

## 4. Technical Implementation Details

### 4.1 Calculator Implementation Pattern

**File Structure**:
```
src/app/calculators/[calculator-name]/
├── page.tsx (Main calculator component)
├── layout.tsx (Calculator-specific layout)
└── components/
    ├── calculator-form.tsx
    ├── results-display.tsx
    └── interpretation.tsx
```

**Required Features for Each Calculator**:
- Input validation with proper error messages
- Real-time calculation updates
- Results interpretation with health insights
- Points system integration (+10-30 points per calculation)
- SEO optimization with structured data
- Mobile-responsive design
- Accessibility compliance (WCAG 2.1)

### 4.2 Database Schema Requirements

**User Tables**:
- `users` - User authentication and profile data
- `user_calculations` - History of all calculator uses
- `user_progress` - Health metrics and goal tracking
- `user_achievements` - Badge and points system

**Content Tables**:
- `calculators` - Calculator metadata and configurations
- `food_items` - Halal food database
- `restaurants` - Halal restaurant directory
- `medical_content` - AI-generated health articles

### 4.3 AI Infrastructure Setup

**vLLM Server Configuration**:
- Llama 3 (70B) - Meal planning and complex reasoning
- BioMistral (7B) - Public health content generation
- Meditron (70B) - Professional medical content
- Custom fine-tuned model - USMLE/MCAT exam prep

**API Integration**:
- FastAPI backend for AI model orchestration
- Rate limiting and usage tracking
- Response caching for common queries
- Fallback mechanisms for model unavailability

## 5. Quality Assurance Checklist

### 5.1 Functionality Testing
- [ ] All 20 calculators functional and accurate
- [ ] Navigation links work correctly
- [ ] Authentication system complete
- [ ] Dashboard displays real user data
- [ ] Mobile responsiveness on all pages
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### 5.2 Performance Optimization
- [ ] Core Web Vitals scores > 90
- [ ] Page load times < 3 seconds
- [ ] Image optimization and lazy loading
- [ ] Code splitting and bundle optimization
- [ ] CDN integration for static assets

### 5.3 SEO Implementation
- [ ] Structured data markup for all calculators
- [ ] Meta tags and Open Graph optimization
- [ ] XML sitemap generation
- [ ] Robot.txt configuration
- [ ] Schema markup for health content

## 6. Success Metrics

### 6.1 Technical Metrics
- **Calculator Completion Rate**: 100% (20/20 calculators functional)
- **Navigation Success Rate**: 100% (all links working)
- **Page Load Speed**: < 3 seconds average
- **Mobile Performance Score**: > 90
- **SEO Score**: > 95

### 6.2 User Experience Metrics
- **Calculator Usage**: Track daily calculator completions
- **User Retention**: 7-day and 30-day retention rates
- **Engagement**: Average session duration and pages per session
- **Conversion**: Free to Pro subscription rate

## 7. Implementation Timeline

**Week 1**: Critical fixes (calculators, navigation, auth)
**Week 2**: Professional features and architecture cleanup
**Week 3-4**: AI integration and meal planner
**Week 5-6**: Advanced features and optimization
**Week 7**: Testing, debugging, and deployment
**Week 8**: Performance optimization and SEO

## 8. Resource Requirements

### 8.1 Development Resources
- **Frontend Developer**: React/Next.js expertise
- **Backend Developer**: Python/FastAPI and AI integration
- **UI/UX Designer**: Health app design experience
- **Medical Consultant**: Calculator validation and content review

### 8.2 Infrastructure Requirements
- **AI Servers**: A100/L40s GPUs for LLM hosting
- **Database**: PostgreSQL with vector extensions
- **CDN**: Global content delivery network
- **Monitoring**: Application performance monitoring tools

This comprehensive audit and fix plan addresses all critical issues preventing VitaPulse from achieving its mission as the definitive health platform. Implementation of this plan will result in a fully functional MVP with all core features operational.