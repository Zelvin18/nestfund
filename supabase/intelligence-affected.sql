-- ═══════════════════════════════════════════════════════════════
-- Intelligence: link news to the specific listed properties it
-- affects (shown as clickable chips on the Intelligence page).
-- Run in the Supabase SQL editor.
-- ═══════════════════════════════════════════════════════════════

alter table intelligence_items
  add column if not exists affected_property_ids text[] default '{}';

-- Backfill the seeded items with sensible links
update intelligence_items set affected_property_ids = '{lake-view-residences,sunrise-apartments,ibis-residences-ii}' where title = 'Gov''t Approves New Expressway';
update intelligence_items set affected_property_ids = '{sunrise-apartments,ibis-residences-ii}' where title = 'New Shopping Mall Approved';
update intelligence_items set affected_property_ids = '{naalya-business-park,naalya-eco-park}' where title = 'New University Campus Planned';
update intelligence_items set affected_property_ids = '{kololo-heights,kololo-towers-ii}' where title = 'Property Tax Increase in Kololo';
update intelligence_items set affected_property_ids = '{naalya-business-park}' where title = 'New Industrial Park Approved';
