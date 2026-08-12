-- ═══════════════════════════════════════════════════════════════
-- PHASE 1 FOUNDATION — accounts, user states, ledger skeleton.
-- Run in the Supabase SQL editor.
--
-- Blueprint refs: §3 User Engine, §36 Ownership Ledger, §39 Finance
-- Engine, §58-59 Events & Audit. Schema-first: tables now, engines
-- as the platform grows. Golden Rule 3: no ownership change without
-- a recorded transaction.
-- ═══════════════════════════════════════════════════════════════

-- ── Profiles (1:1 with auth.users) ────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'investor'
              check (role in ('investor', 'manager', 'developer', 'admin')),
  status      text not null default 'REGISTERED'
              check (status in ('REGISTERED','KYC_PENDING','KYC_REVIEW','VERIFIED','RESTRICTED','SUSPENDED','CLOSED')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
-- TEMPORARY until role-gated admin (drop with the other dev policies)
create policy "dev anon read" on profiles for select using (true);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Ledger: transactions (append-only, hash-chain ready) ──────
create table if not exists ledger_transactions (
  id              uuid primary key default gen_random_uuid(),
  seq             bigint generated always as identity,        -- strict ordering
  ref             text unique,                                -- e.g. NF-TX-2026-0001842 (assigned by engine)
  user_id         uuid references auth.users(id),
  type            text not null check (type in (
    'DEPOSIT','WITHDRAWAL','INVESTMENT','REFUND','RENTAL_RECEIPT',
    'DISTRIBUTION','FEE','TRADE_SETTLEMENT','CONSTRUCTION_RELEASE','BUYOUT'
  )),
  amount          bigint not null,                            -- UGX, signed from user's perspective
  currency        text not null default 'UGX',
  -- no FK: may point at properties OR construction_projects (asset id namespace)
  property_id     text,
  units           bigint,                                     -- share units moved, when applicable
  status          text not null default 'pending'
                  check (status in ('pending','completed','failed','reversed')),
  memo            text,
  idempotency_key text unique,                                -- Golden Rule 16: retries never double-pay
  prev_hash       text,                                       -- hash chain: tamper-evident history
  hash            text,
  created_at      timestamptz not null default now()
);

create index if not exists ledger_tx_user_idx on ledger_transactions (user_id, created_at desc);
create index if not exists ledger_tx_property_idx on ledger_transactions (property_id, created_at desc);

alter table ledger_transactions enable row level security;
create policy "own transactions" on ledger_transactions for select using (auth.uid() = user_id);
create policy "dev anon read"  on ledger_transactions for select using (true);
create policy "dev anon write" on ledger_transactions for insert with check (true);
-- NOTE: no update/delete policies on purpose — the ledger is append-only.
-- Corrections happen via reversing entries, never edits.

-- ── Holdings (current position; derived from the ledger) ──────
create table if not exists holdings (
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- no FK: may point at properties OR construction_projects (asset id namespace)
  property_id text not null,
  units       bigint not null default 0 check (units >= 0),
  avg_cost    bigint not null default 0,                      -- per unit, UGX
  updated_at  timestamptz not null default now(),
  primary key (user_id, property_id)
);

alter table holdings enable row level security;
create policy "own holdings" on holdings for select using (auth.uid() = user_id);
create policy "dev anon read"  on holdings for select using (true);
create policy "dev anon write" on holdings for all using (true) with check (true);

-- ── Platform events (append-only audit; feeds notifications,
--    charts, and later blockchain anchoring) ──────────────────
create table if not exists platform_events (
  id          uuid primary key default gen_random_uuid(),
  seq         bigint generated always as identity,
  type        text not null,                                  -- e.g. INVESTMENT_PURCHASED, PROPERTY_VERIFIED
  actor       uuid,                                           -- auth.users id or null for system
  entity_type text,
  entity_id   text,
  before      jsonb,
  after       jsonb,
  reason      text,
  created_at  timestamptz not null default now()
);

alter table platform_events enable row level security;
create policy "dev anon read"  on platform_events for select using (true);
create policy "dev anon write" on platform_events for insert with check (true);
-- Append-only: no update/delete policies.
