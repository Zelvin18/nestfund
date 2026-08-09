-- ═══════════════════════════════════════════════════════════════
-- NestFund — initial Postgres schema (Supabase)
--
-- Mirrors lib/data/* TypeScript types. Run in the Supabase SQL
-- editor (or `supabase db push`) to create the database, then run
-- seed.sql to load the current mock data.
-- ═══════════════════════════════════════════════════════════════

-- ── Property managers (linked accounts per property) ──────────
-- Created first so properties/projects can reference it
create table managers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null unique,
  phone       text,
  company     text,
  auth_user_id uuid,                             -- links to auth.users when invited
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Rental properties ─────────────────────────────────────────
create table properties (
  id            text primary key,                -- slug, e.g. 'sunrise-apartments'
  name          text not null,
  location      text not null,
  type          text not null check (type in ('Residential', 'Commercial', 'Hotels')),
  status        text not null default 'Draft' check (status in ('Draft', 'Live', 'Paused', 'Sold')),
  description   text,
  image         text,                            -- card thumbnail URL
  current_price bigint not null,                 -- total valuation, UGX
  price_per_share integer not null,
  total_shares  integer not null default 5000,
  available_shares integer not null,
  price_change  numeric(10,2) not null default 0,
  price_change_percent numeric(6,2) not null default 0,
  rental_yield  numeric(5,2) not null,
  area_score    integer check (area_score between 0 and 100),
  future_growth text not null default 'Medium' check (future_growth in ('High', 'Medium', 'Low')),
  occupancy     integer check (occupancy between 0 and 100),
  investors     integer not null default 0,
  last_activity text,
  beds integer default 0, baths integer default 0, sqm integer default 0,
  parking integer default 0, floors integer default 0, year_built integer,
  featured_on_landing boolean not null default false,  -- shown in landing hero strip
  featured_on_home    boolean not null default false,  -- the home hero card
  manager_id    uuid references managers(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table property_images (
  id          uuid primary key default gen_random_uuid(),
  property_id text not null references properties(id) on delete cascade,
  url         text not null,
  sort_order  integer not null default 0
);

create table property_documents (
  id          uuid primary key default gen_random_uuid(),
  property_id text not null references properties(id) on delete cascade,
  name        text not null,
  doc_type    text not null default 'pdf' check (doc_type in ('pdf', 'link')),
  source      text,                              -- issuing body, e.g. 'Uganda Land Registry'
  url         text,
  category    text not null default 'ownership' check (category in ('ownership', 'property', 'audit')),
  created_at  timestamptz not null default now()
);

create table property_activities (
  id          uuid primary key default gen_random_uuid(),
  property_id text not null references properties(id) on delete cascade,
  icon        text not null default 'update' check (icon in ('payment', 'update', 'report')),
  title       text not null,
  description text,
  photos      text[] default '{}',
  attachment  text,
  happened_at date not null default current_date,
  created_at  timestamptz not null default now()
);

create table property_trades (
  id          uuid primary key default gen_random_uuid(),
  property_id text not null references properties(id) on delete cascade,
  tx_hash     text,
  shares      integer not null,
  price       integer not null,
  volume      bigint not null,
  status      text not null default 'Sold',
  traded_at   timestamptz not null default now()
);

-- ── Construction projects ─────────────────────────────────────
create table construction_projects (
  id            text primary key,
  name          text not null,
  location      text not null,
  developer     text not null,
  type          text not null default 'Residential',
  status        text not null default 'Draft',
  description   text,
  image         text,
  project_cost  bigint not null,
  developer_investment bigint not null default 0,
  capital_needed bigint not null,
  capital_raised bigint not null default 0,
  funding_progress numeric(5,2) not null default 0,
  construction_progress numeric(5,2) not null default 0,
  expected_completion text,
  projected_yield numeric(5,2),
  projected_roi numeric(6,2),
  share_price   integer not null,
  share_price_start integer not null,
  share_price_at_completion integer not null,
  estimated_property_value bigint,
  total_shares  integer not null default 5000,
  available_shares integer not null,
  investors     integer not null default 0,
  stage         text,
  stage_color   text default '#f59e0b',
  beds integer default 0, baths integer default 0, sqm integer default 0,
  manager_id    uuid references managers(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table construction_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  text not null references construction_projects(id) on delete cascade,
  url         text not null,
  sort_order  integer not null default 0
);

create table construction_activities (
  id          uuid primary key default gen_random_uuid(),
  project_id  text not null references construction_projects(id) on delete cascade,
  icon        text not null default 'report',
  title       text not null,
  description text,
  photos      text[] default '{}',
  attachment  text,
  happened_at date not null default current_date
);

-- ── Exchange (secondary market) ───────────────────────────────
create table exchange_listings (
  id            uuid primary key default gen_random_uuid(),
  property_id   text references properties(id) on delete cascade,
  project_id    text references construction_projects(id) on delete cascade,
  market_type   text not null check (market_type in ('income', 'construction')),
  current_share_price integer not null,
  available_buy_shares integer not null default 0,
  available_sell_shares integer not null default 0,
  last_trade_price integer,
  last_trade_at timestamptz,
  is_active     boolean not null default true,
  check (
    (market_type = 'income' and property_id is not null and project_id is null) or
    (market_type = 'construction' and project_id is not null and property_id is null)
  )
);

-- ── Market intelligence ───────────────────────────────────────
create table intelligence_items (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in ('approval', 'development', 'decline')),
  category      text not null,
  title         text not null,
  location      text,
  affected_properties integer default 0,
  description   text,
  change_percent numeric(5,2) not null default 0,
  image         text,
  source_label  text,
  source_url    text,
  published_at  timestamptz not null default now(),
  is_published  boolean not null default true
);

-- ── Site settings (landing/home hero, platform stats) ─────────
-- Single-row key/value table so the admin controls page content
create table site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Keys used by the site:
--   'platform_stats'  -> { marketVolume, totalInvestors, activeListings, avgAnnualReturn, ... }
--   'landing_hero'    -> { featuredPropertyIds: [..], headline?, subheadline? }
--   'home_hero'       -> { featuredPropertyId, portfolioValueDemo, monthlyIncomeDemo }
--   'exchange_stats'  -> { monthlyVolume, avgSellTime, participants, totalListings }

-- ── updated_at triggers ───────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at before update on properties
  for each row execute function set_updated_at();
create trigger construction_updated_at before update on construction_projects
  for each row execute function set_updated_at();
create trigger settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- ── Row-level security ────────────────────────────────────────
-- Public site: read-only on published content. Admin/managers write
-- via authenticated policies (tighten once auth roles exist).
alter table properties enable row level security;
alter table property_images enable row level security;
alter table property_documents enable row level security;
alter table property_activities enable row level security;
alter table property_trades enable row level security;
alter table construction_projects enable row level security;
alter table construction_images enable row level security;
alter table construction_activities enable row level security;
alter table exchange_listings enable row level security;
alter table intelligence_items enable row level security;
alter table site_settings enable row level security;
alter table managers enable row level security;

create policy "public read" on properties for select using (true);
create policy "public read" on property_images for select using (true);
create policy "public read" on property_documents for select using (true);
create policy "public read" on property_activities for select using (true);
create policy "public read" on property_trades for select using (true);
create policy "public read" on construction_projects for select using (true);
create policy "public read" on construction_images for select using (true);
create policy "public read" on construction_activities for select using (true);
create policy "public read" on exchange_listings for select using (true);
create policy "public read" on intelligence_items for select using (is_published);
create policy "public read" on site_settings for select using (true);

create policy "authenticated write" on properties for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on property_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on property_documents for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on property_activities for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on property_trades for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on construction_projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on construction_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on construction_activities for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on exchange_listings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on intelligence_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write" on managers for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
