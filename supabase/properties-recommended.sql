-- ═══════════════════════════════════════════════════════════════
-- Recommended properties: link listings together so each property
-- page can show "You may also like" picks chosen by the admin.
-- Run in the Supabase SQL editor.
-- ═══════════════════════════════════════════════════════════════

alter table properties
  add column if not exists recommended_ids text[] default '{}';

-- Sensible starting links for the seeded portfolio
update properties set recommended_ids = '{green-heights,kololo-heights,lake-view-residences}' where id = 'sunrise-apartments';
update properties set recommended_ids = '{sunrise-apartments,kololo-heights,lake-view-residences}' where id = 'green-heights';
update properties set recommended_ids = '{naalya-business-park,green-heights,sunrise-apartments}' where id = 'acacia-office-park';
update properties set recommended_ids = '{sunrise-apartments,green-heights,kololo-heights}' where id = 'lake-view-residences';
update properties set recommended_ids = '{green-heights,sunrise-apartments,acacia-office-park}' where id = 'kololo-heights';
update properties set recommended_ids = '{acacia-office-park,sunrise-apartments,lake-view-residences}' where id = 'naalya-business-park';
