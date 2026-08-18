-- ═══════════════════════════════════════════════════════════════
-- EXCHANGE V2 — user sell-listings (P2P share offers).
-- Run in the Supabase SQL editor.
--
-- A share_listing is one investor's offer to sell part of their
-- position. Buying settles through ledger_transactions
-- (TRADE_SETTLEMENT) and updates both parties' holdings.
-- ═══════════════════════════════════════════════════════════════

create table if not exists share_listings (
  id              uuid primary key default gen_random_uuid(),
  seller_id       uuid references auth.users(id) on delete cascade,
  seller_name     text not null default 'Investor',
  asset_id        text not null,                 -- property / project / opportunity id
  units           bigint not null check (units > 0),
  price_per_share bigint not null check (price_per_share > 0),
  status          text not null default 'Open' check (status in ('Open','Sold','Cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists share_listings_asset_idx on share_listings (asset_id, status);

alter table share_listings enable row level security;
create policy "public read open listings" on share_listings for select using (true);
create policy "own listings write" on share_listings for all
  using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
-- TEMPORARY until role-gated admin (drop with the other dev policies)
create policy "dev anon write" on share_listings for all using (true) with check (true);
