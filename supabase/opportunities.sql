-- ═══════════════════════════════════════════════════════════════
-- OPPORTUNITIES — NestFund 2.0 core table.
-- Run in the Supabase SQL editor.
--
-- An opportunity generalizes "property" to any investable record:
-- contract, invoice, trade, business, asset, property, stable.
-- Property/construction stay in their own tables and are adapted
-- in the app; this table holds the new categories.
-- ═══════════════════════════════════════════════════════════════

create table if not exists opportunities (
  id                 text primary key,
  title              text not null,
  category           text not null check (category in ('cashflow','growth','assets','property','stable')),
  subcategory        text not null default '',
  description        text not null default '',
  location           text not null default '',
  operator           text not null default '',
  image              text not null default '',
  funding_required   bigint not null default 0,
  funding_received   bigint not null default 0,
  min_investment     bigint not null default 0,
  unit_price         bigint not null default 10000,
  duration_label     text not null default '',
  duration_months    int not null default 0,
  target_return_min  numeric not null default 0,
  target_return_max  numeric not null default 0,
  return_period      text not null default 'total' check (return_period in ('total','p.a.')),
  risk_level         text not null default 'Moderate' check (risk_level in ('Lower','Moderate','Higher')),
  status             text not null default 'Draft' check (status in (
    'Draft','Under Review','Verification','Coming Soon','Open',
    'Fully Funded','Active','Repayment','Completed','Cancelled','Defaulted'
  )),
  revenue_model      text not null default '',
  security           jsonb not null default '[]'::jsonb,       -- array of strings; only real protections
  risks              jsonb not null default '[]'::jsonb,       -- plain-language risks, never hidden
  expected_exit      text not null default '',
  verification       jsonb not null default '[]'::jsonb,       -- completed checks only
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists opportunities_category_idx on opportunities (category, status);

alter table opportunities enable row level security;
create policy "public read open opportunities" on opportunities
  for select using (status not in ('Draft','Under Review','Cancelled'));
-- TEMPORARY until role-gated admin (drop with the other dev policies)
create policy "dev anon read"  on opportunities for select using (true);
create policy "dev anon write" on opportunities for all using (true) with check (true);
