-- MemeLog AI Database Schema
-- Run this in Supabase SQL Editor
-- Payment Model: Token-based (pay per generation)

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  token_balance int default 10, -- Free tokens on signup
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: Users can only read/update their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- 2. TOKEN PURCHASES TABLE
-- ============================================

create table public.token_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_payment_intent_id text unique,
  tokens_purchased int not null,
  amount_paid decimal(10,2) not null, -- USD
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.token_purchases enable row level security;

-- Policies: Users can only view their own purchases
create policy "Users can view their own purchases"
  on public.token_purchases for select
  using (auth.uid() = user_id);

-- ============================================
-- 3. GENERATIONS TABLE (history)
-- ============================================

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  template_id text not null,
  template_name text,
  topic text,
  tokens_spent int default 1, -- Cost per generation
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.generations enable row level security;

-- Policies: Users can view and insert their own generations
create policy "Users can view their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

-- ============================================
-- 4. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

-- Trigger function to create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, token_balance)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    10 -- Give 10 free tokens on signup
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Run handle_new_user() after user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

create index idx_token_purchases_user_id on public.token_purchases(user_id);
create index idx_generations_user_id on public.generations(user_id);
create index idx_generations_created_at on public.generations(created_at desc);

-- ============================================
-- 6. HELPER FUNCTION: DEDUCT TOKENS
-- ============================================

create or replace function public.deduct_tokens(user_uuid uuid, tokens int)
returns boolean as $$
declare
  current_balance int;
begin
  -- Get current balance
  select token_balance into current_balance
  from public.profiles
  where id = user_uuid;

  -- Check if enough tokens
  if current_balance >= tokens then
    -- Deduct tokens
    update public.profiles
    set token_balance = token_balance - tokens
    where id = user_uuid;
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer;

-- ============================================
-- DONE! Schema created successfully.
-- ============================================
