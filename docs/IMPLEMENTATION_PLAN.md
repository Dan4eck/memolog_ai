# Auth & Payment Implementation Plan

## Overall Progress
- **Phase 1: Supabase Setup** - ✅ COMPLETED
- **Phase 2: Auth Integration** - ✅ COMPLETED
- **Phase 3: User Dashboard** - ⚠️ PARTIALLY COMPLETED (no generation history UI)
- **Phase 4: Stripe Integration** - ❌ NOT STARTED
- **Phase 5: Rate Limiting & Usage Tracking** - ✅ COMPLETED (token-based system, not Upstash)
- **Phase 6: UI/UX Enhancements** - ⚠️ PARTIALLY COMPLETED (no navbar, pricing page, etc.)
- **Phase 7: Testing & Deployment** - ✅ PARTIALLY COMPLETED (Stripe testing not done)
- **Phase 8: Documentation & Monitoring** - ⚠️ PARTIALLY COMPLETED (monitoring not done)

## Current Status
The MemeLog AI application is LIVE at https://memolog-ai.vercel.app/ with the following features:

**Implemented:**
- ✅ Supabase authentication with Google OAuth
- ✅ Token-based generation system (10 free tokens on signup, 1 token per generation)
- ✅ Protected routes (/generate, /dashboard) with smart redirects
- ✅ User dashboard with token balance display
- ✅ AI-powered meme generation (4 variations per request)
- ✅ Token deduction system with PostgreSQL function
- ✅ Generation tracking in database
- ✅ Color-coded token balance warnings

**Not Yet Implemented:**
- ❌ Stripe payment integration for token purchases
- ❌ Pricing/purchase page
- ❌ Generation history UI in dashboard
- ❌ Navbar with auth status
- ❌ Error boundaries
- ❌ Monitoring/alerting system

## Tech Stack
- **Auth & Database:** Supabase (Postgres + Auth) ✅
- **Payments:** Stripe ❌ (not yet implemented)
- **Rate Limiting:** Token-based system ✅ (not Upstash Redis)

---

## Phase 1: Supabase Setup ✅ COMPLETED

### Account & Project Setup
- [x] Create Supabase account
- [x] Create new Supabase project
- [x] Save project URL and anon key to .env
- [x] Enable Google OAuth provider in Auth settings

### Database Schema ✅ COMPLETED
- [x] Create `profiles` table (extends auth.users, token_balance field)
- [x] Create `token_purchases` table (user_id, stripe data, tokens purchased)
- [x] Create `generations` table (user_id, template_id, topic, tokens_spent)
- [x] Set up Row Level Security (RLS) policies for all tables
- [x] Create `deduct_tokens()` helper function
- [x] Create auto-profile trigger on signup (grants 10 free tokens)

---

## Phase 2: Auth Integration ✅ COMPLETED

### Dependencies
- [x] Install `@supabase/ssr`
- [x] Install `@supabase/supabase-js`

### Supabase Client Setup ✅ COMPLETED
- [x] Create `lib/supabase/client.ts` (browser client)
- [x] Create `lib/supabase/server.ts` (server client with cookies)
- [x] Create `middleware.ts` with Supabase client integration (no separate middleware.ts in lib)

### Auth Pages ✅ COMPLETED
- [x] Create `app/login/page.tsx` (Google OAuth only)
- [ ] Create `app/signup/page.tsx` (not needed - OAuth only flow)
- [x] Create `app/auth/callback/route.ts` (OAuth callback handler with smart redirect)
- [ ] Create `app/api/auth/signout/route.ts` (not needed - using server action in dashboard)

### Auth Context ❌ NOT NEEDED
- [ ] Create `contexts/AuthContext.tsx` (using server components instead)
- [ ] Wrap `app/layout.tsx` with AuthProvider (not needed)
- [x] Add user profile types to `types/meme.ts` (not types/database.ts)

### Route Protection ✅ COMPLETED
- [x] Create `middleware.ts` (protect /generate, /dashboard with smart redirect)
- [x] Update `app/generate/page.tsx` to require auth
- [x] Add login redirect for unauthenticated users with `next` parameter

---

## Phase 3: User Dashboard ✅ PARTIALLY COMPLETED

### Dashboard Page
- [x] Create `app/dashboard/page.tsx`
- [x] Display user info (email, join date)
- [ ] Display user avatar
- [ ] Show current subscription tier (not applicable - token-based system)
- [ ] Display generation usage (this month) (not implemented)
- [x] Display current token balance
- [ ] List recent generation history (table exists in DB but no UI)
- [x] Add logout button (server action)
- [ ] Add "Manage Subscription" link (not applicable - token-based system)

---

## Phase 4: Stripe Integration ❌ NOT STARTED

### Stripe Setup
- [ ] Create Stripe account
- [ ] Get API keys (publishable + secret)
- [ ] Add keys to .env (dev + production)
- [ ] Create products in Stripe Dashboard:
  - [ ] Token packs (e.g., 10 tokens, 50 tokens, 100 tokens)
- [ ] Set up webhook endpoint in Stripe Dashboard

### Dependencies
- [ ] Install `stripe` package
- [ ] Install `@stripe/stripe-js` (frontend)

### Stripe Client
- [ ] Create `lib/stripe.ts` (server-side Stripe client)
- [ ] Create helper functions (createCheckoutSession, addTokensToProfile)

### Pricing Page
- [ ] Create `app/pricing/page.tsx`
- [ ] Display token pack options
- [ ] Add "Buy Tokens" buttons with pack selection
- [ ] Show current token balance for logged-in users

### Checkout Flow
- [ ] Create `app/api/checkout/route.ts` (create Stripe Checkout Session)
- [ ] Handle successful redirect (dashboard with updated balance)
- [ ] Handle canceled checkout redirect

### Webhook Handler
- [ ] Create `app/api/webhooks/stripe/route.ts`
- [ ] Verify webhook signatures
- [ ] Handle `checkout.session.completed` event
- [ ] Handle `payment_intent.succeeded` event
- [ ] Add purchased tokens to user profile via `token_purchases` table

### Customer Portal
- [ ] Add "Purchase History" button to dashboard
- [ ] Create `app/api/portal/route.ts` (redirect to Stripe portal for payment history)

---

## Phase 5: Rate Limiting & Usage Tracking ✅ PARTIALLY COMPLETED

### Upstash Setup
- [ ] Create Upstash account (not implementing - using token-based system)
- [ ] Create Redis database (not implementing - using token-based system)
- [ ] Save UPSTASH_REDIS_REST_URL and TOKEN to .env (not implementing)

### Dependencies
- [ ] Install `@upstash/redis` (not implementing)
- [ ] Install `@upstash/ratelimit` (not implementing)

### Token-Based System ✅ COMPLETED
- [x] Token balance system implemented in database (profiles.token_balance)
- [x] Update `app/api/generate/route.ts`:
  - [x] Get user from session
  - [x] Check token balance
  - [x] Apply token deduction before generation
  - [x] Return 402 error if insufficient tokens
  - [x] Track generation in database
- [x] Helper function: `deduct_tokens()` in PostgreSQL
- [x] Auto-grant 10 free tokens on signup via database trigger

### Usage Tracking ✅ PARTIALLY COMPLETED
- [x] Create `generations` table to track all generations
- [x] Log each generation to database
- [x] Add tokens_spent field (1 token per generation)
- [ ] Display usage in dashboard with progress bar (not implemented)
- [ ] Show generation history list (not implemented)

---

## Phase 6: UI/UX Enhancements ❌ NOT STARTED

### Navigation
- [ ] Add auth status to navbar
- [ ] Show "Login" button when logged out
- [ ] Show avatar + dropdown menu when logged in
- [ ] Add "Dashboard" link to navigation
- [ ] Add "Pricing" link to navigation (when Stripe implemented)

### Landing Page Updates
- [ ] Update `app/page.tsx` with pricing/purchase CTA
- [ ] Add "Start Free" button for logged-out users
- [ ] Show "Go to Dashboard" for logged-in users

### Generation Page Updates ✅ PARTIALLY COMPLETED
- [x] Show remaining tokens
- [x] Display color-coded warnings based on token balance
- [x] Display "Get More Tokens" CTA when balance is 0
- [ ] Show generation history (not implemented)
- [ ] Add upgrade prompt when token balance is low (not yet implemented)

### Error Handling ✅ PARTIALLY COMPLETED
- [x] Handle auth errors (invalid session, expired token) via middleware
- [ ] Handle payment errors (card declined, etc.) (not yet implemented)
- [x] Handle insufficient token errors with clear messaging (402 status)
- [ ] Add error boundaries for client components (not implemented)

---

## Phase 7: Testing & Deployment ✅ PARTIALLY COMPLETED

### Local Testing ✅ COMPLETED
- [x] Test signup flow (Google OAuth)
- [x] Test login/logout
- [x] Test protected routes (redirect when logged out)
- [x] Test token-based generation limiting
- [x] Test token deduction and balance tracking
- [ ] Test checkout flow (Stripe not yet implemented)
- [ ] Test webhook events (Stripe not yet implemented)
- [ ] Test token purchase flow (Stripe not yet implemented)
- [ ] Test generation tracking (table exists but no UI to verify)

### Production Setup ✅ PARTIALLY COMPLETED
- [x] Add production env vars to Vercel:
  - [x] NEXT_PUBLIC_SUPABASE_URL
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY (may not be needed)
  - [ ] STRIPE_SECRET_KEY (not yet implemented)
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (not yet implemented)
  - [ ] STRIPE_WEBHOOK_SECRET (not yet implemented)
  - [ ] UPSTASH_REDIS_REST_URL (not implementing)
  - [ ] UPSTASH_REDIS_REST_TOKEN (not implementing)
- [x] Update Supabase redirect URLs (add production domain)
- [ ] Update Stripe webhook URL (add production domain) (not yet implemented)
- [ ] Set Stripe to live mode (not yet implemented)
- [x] Deploy to Vercel (live at https://memolog-ai.vercel.app/)
- [x] Test production auth and generation flows end-to-end
- [ ] Test production payment flows (not yet implemented)

---

## Phase 8: Documentation & Monitoring ✅ PARTIALLY COMPLETED

### Documentation ✅ COMPLETED
- [x] Update README.md with auth setup instructions
- [ ] Document environment variables in .env.example (not yet created)
- [x] Update CLAUDE.MD with auth architecture details
- [x] Create AUTH_IMPLEMENTATION.md documenting auth system
- [ ] Document token purchase flow and pricing (not yet implemented)

### Monitoring ❌ NOT STARTED
- [ ] Set up Stripe webhook monitoring (not yet implemented)
- [ ] Monitor Supabase auth events (can use Supabase dashboard)
- [ ] Track conversion rates (users who purchase tokens) (not yet implemented)
- [ ] Monitor generation usage patterns (can use Supabase dashboard)
- [ ] Set up alerts for failed payments (not yet implemented)

---

## Environment Variables Checklist

### Currently Required
```
IMGFLIP_USERNAME=
IMGFLIP_PASSWORD=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY= (optional)
```

### Not Yet Implemented (Stripe - Phase 4)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Not Implementing (Upstash - using token-based system instead)
```
UPSTASH_REDIS_REST_URL= (not implementing)
UPSTASH_REDIS_REST_TOKEN= (not implementing)
```

---

## Next Steps (Prioritized)

### High Priority (Revenue Generation)
1. **Implement Stripe Integration** (Phase 4)
   - Create token pack products in Stripe
   - Build checkout flow for purchasing tokens
   - Implement webhook handlers to add tokens after payment
   - Create pricing page with token pack options

### Medium Priority (UX Improvements)
2. **Add Navigation Bar** (Phase 6)
   - Show login button when logged out
   - Show avatar + dropdown when logged in
   - Add links to Dashboard and Pricing

3. **Dashboard Enhancements** (Phase 3)
   - Display generation history list
   - Add purchase history (after Stripe)
   - Show total generations count

### Low Priority (Nice to Have)
4. **Error Handling** (Phase 6)
   - Add error boundaries for client components
   - Improve error messages for edge cases

5. **Monitoring** (Phase 8)
   - Set up basic analytics (generation patterns, user engagement)
   - Monitor Stripe webhook failures (after implementation)
