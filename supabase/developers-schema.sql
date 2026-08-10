-- ═══════════════════════════════════════════════════════════════
-- FOR DEVELOPERS — project submissions
-- Run in the Supabase SQL editor (after schema.sql).
-- Captures applications from developers, landowners, and property
-- owners who want their project listed on NestFund.
-- ═══════════════════════════════════════════════════════════════

create table project_submissions (
  id              uuid primary key default gen_random_uuid(),

  -- Step 1: what they're submitting
  submission_type text not null check (submission_type in (
    'land', 'apartment-development', 'commercial-property',
    'residential-property', 'hotel', 'construction-project', 'other'
  )),

  -- Step 2: property information
  project_name    text not null,
  location        text not null,
  size_details    text,                          -- e.g. '3 acres', '120 apartments, 8,500 sqm'
  estimated_value bigint,                        -- UGX
  development_stage text,                        -- e.g. 'Planning', 'Foundation', 'Operational'
  expected_completion text,
  ownership       text,                          -- e.g. 'Sole owner with freehold title'
  description     text,

  -- Step 3: investment information
  capital_sought  bigint not null,               -- UGX
  capital_uses    text[] default '{}',           -- construction, land-acquisition, renovation, infrastructure, expansion

  -- Step 4: documents they confirmed having (uploads come with storage)
  documents_available text[] default '{}',

  -- Contact
  contact_name    text not null,
  contact_email   text not null,
  contact_phone   text,
  company         text,

  -- Review workflow (admin)
  status          text not null default 'submitted' check (status in (
    'submitted', 'under-review', 'needs-info', 'approved', 'rejected', 'listed'
  )),
  admin_notes     text,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table project_submissions enable row level security;

-- Anyone can APPLY (public form); only authenticated (admin) can read/update.
create policy "public insert" on project_submissions
  for insert with check (true);
create policy "authenticated read" on project_submissions
  for select using (auth.role() = 'authenticated');
create policy "authenticated update" on project_submissions
  for update using (auth.role() = 'authenticated');

-- TEMPORARY (matches dev-open-policies.sql): until admin login exists,
-- allow anon read/update so the admin console can review submissions.
-- Drop these together with the other "dev anon" policies at lockdown.
create policy "dev anon read" on project_submissions
  for select using (true);
create policy "dev anon update" on project_submissions
  for update using (true);
