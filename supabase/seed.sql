-- ═══════════════════════════════════════════════════════════════
-- NestFund — seed data (mirrors lib/data/* mock records)
-- Run AFTER schema.sql
-- ═══════════════════════════════════════════════════════════════

-- ── Properties ────────────────────────────────────────────────
insert into properties (id, name, location, type, status, image, current_price, price_per_share, total_shares, available_shares, price_change, price_change_percent, rental_yield, area_score, future_growth, occupancy, investors, last_activity, beds, baths, sqm, parking, floors, year_built, featured_on_landing, featured_on_home) values
('sunrise-apartments', 'Sunrise Apartments', 'Kiira, Wakiso', 'Residential', 'Live', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', 245000000, 1250, 5000, 3452, 52, 4.34, 11.2, 87, 'High', 100, 312, 'Rent paid — Jan 2026', 2, 2, 85, 1, 6, 2021, true, true),
('green-heights', 'Green Heights', 'Bunga, Kampala', 'Residential', 'Live', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', 184000000, 840, 5000, 2800, -11, -1.29, 9.6, 81, 'Medium', 96, 201, '96% Occupied — Jan 2026', 3, 2, 110, 1, 8, 2019, false, false),
('acacia-office-park', 'Acacia Office Park', 'Nakasero, Kampala', 'Commercial', 'Live', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', 420000000, 2100, 5000, 1400, 89, 4.43, 10.8, 92, 'High', 98, 489, 'Rent paid — Jan 2026', 0, 4, 3200, 80, 12, 2020, true, false),
('lake-view-residences', 'Lake View Residences', 'Entebbe Road, Wakiso', 'Hotels', 'Live', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', 312000000, 1680, 5000, 2100, 43, 2.63, 8.9, 79, 'High', 94, 156, 'Revenue distributed — Jan 2026', 2, 2, 95, 1, 5, 2022, false, false),
('kololo-heights', 'Kololo Heights', 'Kololo, Kampala', 'Residential', 'Live', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80', 148000000, 740, 5000, 4100, 4, 0.54, 8.9, 84, 'Medium', 100, 98, '100% Occupied', 3, 2, 130, 2, 4, 2018, false, false),
('naalya-business-park', 'Naalya Business Park', 'Naalya, Wakiso', 'Commercial', 'Live', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&q=80', 480000000, 2400, 5000, 680, 117, 5.12, 11.8, 88, 'High', 91, 421, 'Rent paid — Jan 2026', 0, 6, 4200, 120, 9, 2021, false, false);

-- Gallery images (sort_order 0 = main)
insert into property_images (property_id, url, sort_order) values
('sunrise-apartments', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80', 0),
('sunrise-apartments', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70', 1),
('sunrise-apartments', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70', 2),
('sunrise-apartments', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70', 3),
('sunrise-apartments', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70', 4),
('green-heights', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80', 0),
('green-heights', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70', 1),
('green-heights', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70', 2),
('acacia-office-park', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80', 0),
('acacia-office-park', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70', 1),
('acacia-office-park', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&q=70', 2),
('lake-view-residences', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', 0),
('lake-view-residences', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70', 1),
('kololo-heights', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80', 0),
('kololo-heights', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70', 1),
('naalya-business-park', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=900&q=80', 0),
('naalya-business-park', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70', 1);

-- Documents
insert into property_documents (property_id, name, doc_type, source, category) values
('sunrise-apartments', 'Title Deed — Sunrise Apartments.pdf', 'pdf', 'Uganda Land Registry', 'ownership'),
('sunrise-apartments', 'Independent Valuation Report.pdf', 'pdf', 'Knight Frank Uganda', 'property'),
('sunrise-apartments', 'Smart Contract — Share Registry', 'link', 'verified.nestfund.io', 'ownership'),
('sunrise-apartments', 'Investment Prospectus.pdf', 'pdf', 'NestFund Legal', 'property');

-- Activities
insert into property_activities (property_id, icon, title, description, happened_at) values
('sunrise-apartments', 'payment', 'Rental Income Distributed — Jan 2026', 'Monthly rental income distributed to all shareholders proportionally. Yield maintained at 11.2%.', '2026-01-30'),
('sunrise-apartments', 'update', '100% Occupancy Maintained', 'All 24 units remain occupied. Tenant renewal rate 94%.', '2026-01-15'),
('green-heights', 'payment', 'Rental Income Distributed — Jan 2026', 'Monthly income distributed. Yield at 9.6% p.a.', '2026-01-31'),
('acacia-office-park', 'update', 'New Anchor Tenant Signed', 'MTN Uganda signed a 5-year lease for floors 9–11.', '2025-12-15'),
('kololo-heights', 'update', 'Full Occupancy Renewed', 'All units renewed their annual leases. Zero vacancy going into 2026.', '2026-01-08'),
('naalya-business-park', 'update', 'Two New Retail Tenants', 'Ground-floor retail units leased to a pharmacy and a bank branch.', '2026-01-12');

-- ── Construction projects ─────────────────────────────────────
insert into construction_projects (id, name, location, developer, type, status, image, project_cost, developer_investment, capital_needed, capital_raised, funding_progress, construction_progress, expected_completion, projected_yield, projected_roi, share_price, share_price_start, share_price_at_completion, estimated_property_value, total_shares, available_shares, investors, stage, stage_color, beds, baths, sqm) values
('ibis-residences-ii', 'Ibis Residences Phase II', 'Kiira, Wakiso', 'Ibis Properties Ltd', 'Residential', 'Under Construction', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', 10000000000, 3000000000, 7000000000, 2940000000, 42, 0, 'June 2028', 13.2, 38.5, 4200, 3500, 4800, 12500000000, 5000, 2900, 131, 'Construction funding', '#f59e0b', 3, 2, 120),
('kololo-towers-ii', 'Kololo Towers Phase II', 'Kololo, Kampala', 'Skyline Developers', 'Commercial', 'Foundation Stage', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', 25000000000, 8000000000, 17000000000, 9520000000, 56, 15, 'March 2027', 11.8, 26.3, 5450, 5200, 6800, 32000000000, 5000, 2200, 289, 'Construction funding', '#f59e0b', 0, 0, 2800),
('naalya-eco-park', 'Naalya Eco Business Park', 'Naalya, Wakiso', 'GreenBuild Africa', 'Commercial', '32% Built', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80', 8500000000, 2500000000, 6000000000, 4794000000, 79.9, 32, 'December 2026', 12.5, 43.5, 3200, 2800, 4020, 11000000000, 5000, 1005, 275, 'Construction funding', '#f59e0b', 0, 0, 4500),
('muyenga-hillside', 'Muyenga Hillside Villas', 'Muyenga, Kampala', 'Hill Estates Ltd', 'Residential', 'Initial Stage', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', 6000000000, 2000000000, 4000000000, 2080000000, 52, 5, 'September 2027', 10.9, 31.7, 2350, 2200, 3100, 7800000000, 5000, 2400, 164, 'Initial funding', '#2563eb', 4, 3, 280);

-- ── Exchange listings ─────────────────────────────────────────
insert into exchange_listings (property_id, project_id, market_type, current_share_price, available_buy_shares, available_sell_shares, last_trade_price) values
('sunrise-apartments', null, 'income', 1290, 1427, 342, 1285),
(null, 'kololo-towers-ii', 'construction', 5450, 890, 156, 5440),
('acacia-office-park', null, 'income', 2140, 1369, 201, 2135),
('naalya-business-park', null, 'income', 2455, 620, 450, 2450);

-- ── Intelligence ──────────────────────────────────────────────
insert into intelligence_items (type, category, title, location, affected_properties, description, change_percent, image, source_label, source_url) values
('approval', 'GOVT. APPROVAL', 'Gov''t Approves New Expressway', 'Entebbe – Kampala', 312, 'Properties along the 51km corridor expected to see significant value appreciation. New access roads open 3 untapped residential zones.', 11, 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=70', 'Uganda National Roads Authority', 'https://www.unra.go.ug'),
('development', 'DEVELOPMENT', 'New Shopping Mall Approved', 'Kira Town, Wakiso', 89, 'Commercial activity boost expected within 6 months. Nearby residential properties historically increase 7–12% after mall construction.', 7, 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600&q=70', 'Wakiso District Council', null),
('decline', 'RISK ALERT', 'Flooding Reported in Bwaise', 'Bwaise, Kampala', 47, 'High-risk flood zone alert. Properties in low-lying areas facing devaluation risk. Insurance premiums expected to rise.', -8, 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=70', 'KCCA Flood Risk Report', null),
('development', 'DEVELOPMENT', 'New University Campus Planned', 'Nansana, Wakiso', 134, 'Student housing demand expected to surge. Purpose-built student accommodation currently under-supplied in this corridor.', 15, 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=70', 'Ministry of Education Uganda', null),
('decline', 'RISK ALERT', 'Property Tax Increase in Kololo', 'Kololo, Kampala', 28, 'Local council approved 12% property tax increase. Net rental yields in the area may decrease by 0.5–1.2% for investors.', -4, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70', 'Kampala Capital City Authority', null),
('approval', 'GOVT. APPROVAL', 'New Industrial Park Approved', 'Namanve, Mukono', 201, '20,000+ workers expected to relocate to the area. Worker housing demand rising. Strong buy signal for budget residential.', 9, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70', 'Uganda Investment Authority', null);

-- ── Site settings ─────────────────────────────────────────────
insert into site_settings (key, value) values
('platform_stats', '{"marketVolume": "UGX 24.6B", "marketVolumeChange": 4.49, "totalInvestors": 14250, "investorsChange": 8.32, "activeListings": 47, "listingsChange": 5, "avgAnnualReturn": 8.64, "returnChange": -1.2}'),
('landing_hero', '{"featuredPropertyIds": ["sunrise-apartments", "acacia-office-park", "ibis-residences-ii"]}'),
('home_hero', '{"featuredPropertyId": "sunrise-apartments"}'),
('exchange_stats', '{"monthlyVolume": "UGX 18.5B", "avgSellTime": "38 min", "participants": 892, "totalListings": 47}');
