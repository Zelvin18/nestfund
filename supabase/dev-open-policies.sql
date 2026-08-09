-- ═══════════════════════════════════════════════════════════════
-- TEMPORARY: allow admin writes without login.
--
-- The schema ships with write access restricted to authenticated
-- users, but the admin console has no login yet — so writes are
-- silently blocked. Run this in the Supabase SQL editor to open
-- writes for the anon key while the platform is in development.
--
-- ⚠ SECURITY: with these policies, anyone who discovers the API
-- could modify data. Fine for a demo/dev site; BEFORE real money
-- or real users, add Supabase Auth to /admin and run
-- lockdown-policies.sql (below) to revert.
-- ═══════════════════════════════════════════════════════════════

create policy "dev anon write" on properties for all using (true) with check (true);
create policy "dev anon write" on property_images for all using (true) with check (true);
create policy "dev anon write" on property_documents for all using (true) with check (true);
create policy "dev anon write" on property_activities for all using (true) with check (true);
create policy "dev anon write" on property_trades for all using (true) with check (true);
create policy "dev anon write" on construction_projects for all using (true) with check (true);
create policy "dev anon write" on construction_images for all using (true) with check (true);
create policy "dev anon write" on construction_activities for all using (true) with check (true);
create policy "dev anon write" on exchange_listings for all using (true) with check (true);
create policy "dev anon write" on intelligence_items for all using (true) with check (true);
create policy "dev anon write" on site_settings for all using (true) with check (true);
create policy "dev anon write" on managers for all using (true) with check (true);

-- ═══════════════════════════════════════════════════════════════
-- LOCKDOWN (run later, once admin login exists):
--
-- drop policy "dev anon write" on properties;
-- drop policy "dev anon write" on property_images;
-- drop policy "dev anon write" on property_documents;
-- drop policy "dev anon write" on property_activities;
-- drop policy "dev anon write" on property_trades;
-- drop policy "dev anon write" on construction_projects;
-- drop policy "dev anon write" on construction_images;
-- drop policy "dev anon write" on construction_activities;
-- drop policy "dev anon write" on exchange_listings;
-- drop policy "dev anon write" on intelligence_items;
-- drop policy "dev anon write" on site_settings;
-- drop policy "dev anon write" on managers;
-- ═══════════════════════════════════════════════════════════════
