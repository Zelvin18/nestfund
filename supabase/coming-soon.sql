-- ═══════════════════════════════════════════════════════════════
-- COMING SOON — demand-gated property launches.
-- Run in the Supabase SQL editor.
--
-- Every new property starts as 'Coming Soon'. Investors reserve
-- priority access (no payment); when reservations reach the
-- property's interest threshold, the admin opens it to the market.
-- First to reach the threshold launches first.
-- ═══════════════════════════════════════════════════════════════

-- Allow the new status
alter table properties drop constraint if exists properties_status_check;
alter table properties add constraint properties_status_check
  check (status in ('Draft', 'Coming Soon', 'Live', 'Paused', 'Sold'));

-- How many reserved investors it takes to unlock the launch
alter table properties
  add column if not exists interest_threshold integer not null default 100;

-- ── Priority reservations (non-binding, no payment) ───────────
create table if not exists property_interest (
  id              uuid primary key default gen_random_uuid(),
  property_id     text not null references properties(id) on delete cascade,
  full_name       text not null,
  email           text not null,
  phone           text,
  intended_amount bigint not null default 0,     -- UGX they plan to invest
  created_at      timestamptz not null default now()
);

-- One reservation per person per property
create unique index if not exists property_interest_unique
  on property_interest (property_id, lower(email));

alter table property_interest enable row level security;
create policy "public insert" on property_interest for insert with check (true);
create policy "authenticated read" on property_interest for select using (auth.role() = 'authenticated');
-- TEMPORARY until admin login (drop with the other "dev anon" policies)
create policy "dev anon read" on property_interest for select using (true);

-- ── Seed three upcoming properties ────────────────────────────
insert into properties (id, name, location, type, status, image, current_price, price_per_share, total_shares, available_shares, price_change, price_change_percent, rental_yield, area_score, future_growth, occupancy, investors, last_activity, beds, baths, sqm, parking, floors, year_built, interest_threshold) values
('bugolobi-sky-terraces', 'Bugolobi Sky Terraces', 'Bugolobi, Kampala', 'Residential', 'Coming Soon', 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&q=80', 380000000, 1900, 5000, 5000, 0, 0, 10.6, 89, 'High', 0, 0, 'Opening soon', 3, 2, 140, 2, 9, 2024, 120),
('jinja-waterfront-suites', 'Jinja Waterfront Suites', 'Jinja City', 'Hotels', 'Coming Soon', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', 520000000, 2600, 5000, 5000, 0, 0, 12.1, 85, 'High', 0, 0, 'Opening soon', 2, 2, 88, 1, 6, 2023, 150),
('mbarara-trade-centre', 'Mbarara Trade Centre', 'Mbarara City', 'Commercial', 'Coming Soon', 'https://images.unsplash.com/photo-1554435493-93422e8220c8?w=600&q=80', 290000000, 1450, 5000, 5000, 0, 0, 11.4, 82, 'Medium', 0, 0, 'Opening soon', 0, 4, 2600, 40, 5, 2022, 100)
on conflict (id) do nothing;

-- ── Seed early reservations so the queue tells a story ────────
insert into property_interest (property_id, full_name, email, intended_amount)
select 'bugolobi-sky-terraces', 'Early Investor ' || g, 'early' || g || '.bugolobi@example.com', (floor(random() * 20) + 2) * 100000
from generate_series(1, 96) g
on conflict do nothing;

insert into property_interest (property_id, full_name, email, intended_amount)
select 'jinja-waterfront-suites', 'Early Investor ' || g, 'early' || g || '.jinja@example.com', (floor(random() * 25) + 2) * 100000
from generate_series(1, 47) g
on conflict do nothing;

insert into property_interest (property_id, full_name, email, intended_amount)
select 'mbarara-trade-centre', 'Early Investor ' || g, 'early' || g || '.mbarara@example.com', (floor(random() * 15) + 1) * 100000
from generate_series(1, 22) g
on conflict do nothing;
