# Auth & Payment Implementation Plan

## Tech Stack
- **Auth & Database:** Supabase (Postgres + Auth)
- **Payments:** Stripe
- **Rate Limiting:** Upstash Redis

---

## Phase 1: Supabase Setup

### Account & Project Setup
- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Save project URL and anon key to .env
- [ ] Enable Email + OAuth providers (Google, GitHub) in Auth settings

### Database Schema
- [ ] Create `profiles` table (extends auth.users)
- [ ] Create `subscriptions` table (user_id, stripe data, tier, status)
- [ ] Create `generations` table (user_id, template_id, topic, timestamp)
- [ ] Create `usage` table (user_id, month, generation_count)
- [ ] Set up Row Level Security (RLS) policies for all tables
- [ ] Test RLS policies in Supabase SQL editor

---

## Phase 2: Auth Integration

### Dependencies
- [ ] Install `@supabase/ssr`
- [ ] Install `@supabase/supabase-js`

### Supabase Client Setup
- [ ] Create `lib/supabase/client.ts` (browser client)
- [ ] Create `lib/supabase/server.ts` (server client with cookies)
- [ ] Create `lib/supabase/middleware.ts` (auth helpers)

### Auth Pages
- [ ] Create `app/login/page.tsx` (email + OAuth buttons)
- [ ] Create `app/signup/page.tsx`
- [ ] Create `app/api/auth/callback/route.ts` (OAuth callback handler)
- [ ] Create `app/api/auth/signout/route.ts`

### Auth Context
- [ ] Create `contexts/AuthContext.tsx` (user state management)
- [ ] Wrap `app/layout.tsx` with AuthProvider
- [ ] Add user profile types to `types/database.ts`

### Route Protection
- [ ] Create `middleware.ts` (protect /generate, /dashboard)
- [ ] Update `app/generate/page.tsx` to require auth
- [ ] Add login redirect for unauthenticated users

---

## Phase 3: User Dashboard

### Dashboard Page
- [ ] Create `app/dashboard/page.tsx`
- [ ] Display user info (email, avatar, join date)
- [ ] Show current subscription tier
- [ ] Display generation usage (this month)
- [ ] List recent generation history
- [ ] Add logout button
- [ ] Add "Manage Subscription" link

---

## Phase 4: Stripe Integration

### Stripe Setup
- [ ] Create Stripe account
- [ ] Get API keys (publishable + secret)
- [ ] Add keys to .env (dev + production)
- [ ] Create products in Stripe Dashboard:
  - [ ] Free tier (metadata only)
  - [ ] Pro tier ($9/month)
  - [ ] Unlimited tier ($29/month)
- [ ] Set up webhook endpoint in Stripe Dashboard

### Dependencies
- [ ] Install `stripe` package
- [ ] Install `@stripe/stripe-js` (frontend)

### Stripe Client
- [ ] Create `lib/stripe.ts` (server-side Stripe client)
- [ ] Create helper functions (createCheckoutSession, getSubscription)

### Pricing Page
- [ ] Create `app/pricing/page.tsx`
- [ ] Display tier comparison cards
- [ ] Add "Subscribe" buttons with tier selection
- [ ] Show current tier for logged-in users

### Checkout Flow
- [ ] Create `app/api/checkout/route.ts` (create Stripe Checkout Session)
- [ ] Handle successful redirect (thank you page or dashboard)
- [ ] Handle canceled checkout redirect

### Webhook Handler
- [ ] Create `app/api/webhooks/stripe/route.ts`
- [ ] Verify webhook signatures
- [ ] Handle `checkout.session.completed` event
- [ ] Handle `customer.subscription.updated` event
- [ ] Handle `customer.subscription.deleted` event
- [ ] Sync subscription data to Supabase subscriptions table

### Customer Portal
- [ ] Add "Manage Subscription" button to dashboard
- [ ] Create `app/api/portal/route.ts` (redirect to Stripe portal)

---

## Phase 5: Rate Limiting & Usage Tracking

### Upstash Setup
- [ ] Create Upstash account
- [ ] Create Redis database
- [ ] Save UPSTASH_REDIS_REST_URL and TOKEN to .env

### Dependencies
- [ ] Install `@upstash/redis`
- [ ] Install `@upstash/ratelimit`

### Rate Limit System
- [ ] Create `lib/rate-limit.ts` (tier-based rate limiters)
- [ ] Define limits: Free (10/month), Pro (100/month), Unlimited (no limit)
- [ ] Update `app/api/generate/route.ts`:
  - [ ] Get user from session
  - [ ] Check subscription tier
  - [ ] Apply rate limit check
  - [ ] Return 429 error if limit exceeded
  - [ ] Track generation in database

### Usage Tracking
- [ ] Create function to increment usage count
- [ ] Update `usage` table on each generation
- [ ] Reset monthly counts via cron or on-demand
- [ ] Display usage in dashboard with progress bar

---

## Phase 6: UI/UX Enhancements

### Navigation
- [ ] Add auth status to navbar
- [ ] Show "Login" / "Sign Up" buttons when logged out
- [ ] Show avatar + dropdown menu when logged in
- [ ] Add "Dashboard" and "Pricing" links to navigation

### Landing Page Updates
- [ ] Update `app/page.tsx` with pricing CTA
- [ ] Add "Start Free" button for logged-out users
- [ ] Show "Go to Dashboard" for logged-in users

### Generation Page Updates
- [ ] Show remaining generations for current month
- [ ] Display upgrade prompt when limit reached
- [ ] Add tier badge (Free/Pro/Unlimited)

### Error Handling
- [ ] Handle auth errors (invalid session, expired token)
- [ ] Handle payment errors (card declined, etc.)
- [ ] Handle rate limit errors with clear messaging
- [ ] Add error boundaries for client components

---

## Phase 7: Testing & Deployment

### Local Testing
- [ ] Test signup flow (email + OAuth)
- [ ] Test login/logout
- [ ] Test protected routes (redirect when logged out)
- [ ] Test free tier rate limiting
- [ ] Test checkout flow (use Stripe test mode)
- [ ] Test webhook events (use Stripe CLI)
- [ ] Test subscription upgrade/downgrade
- [ ] Test customer portal
- [ ] Test generation tracking

### Production Setup
- [ ] Add production env vars to Vercel:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] UPSTASH_REDIS_REST_URL
  - [ ] UPSTASH_REDIS_REST_TOKEN
- [ ] Update Supabase redirect URLs (add production domain)
- [ ] Update Stripe webhook URL (add production domain)
- [ ] Set Stripe to live mode
- [ ] Deploy to Vercel
- [ ] Test production flows end-to-end

---

## Phase 8: Documentation & Monitoring

### Documentation
- [ ] Update README.md with auth setup instructions
- [ ] Document environment variables in .env.example
- [ ] Update CLAUDE.md with new architecture details
- [ ] Document subscription tiers and limits

### Monitoring
- [ ] Set up Stripe webhook monitoring
- [ ] Monitor Supabase auth events
- [ ] Track conversion rates (free → paid)
- [ ] Monitor generation usage patterns
- [ ] Set up alerts for failed payments

---

## Environment Variables Checklist

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Upstash
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Existing
```
IMGFLIP_USERNAME=
IMGFLIP_PASSWORD=
OPENAI_API_KEY=
```
