-- ============================================================================
-- FáGlè — demo seed data (Benin pilot story)
-- ============================================================================
-- Fictional demo data for the hackathon story: farmer Koffi, Bohicon,
-- "Ferme Démo FáGlè", "Parcelle Maïs A". Run after schema.sql. Safe to re-run.
-- Mirrors data/seedData.js — the single source of truth for Demo Mode.

insert into crops (id, name, stages) values
  ('crop-maize', 'Maïs', array['Préparation du sol','Germination','Croissance végétative','Floraison','Remplissage du grain','Maturité']),
  ('crop-tomato', 'Tomate', array['Pépinière','Repiquage','Croissance végétative','Floraison','Fructification','Récolte']),
  ('crop-rice', 'Riz', array['Préparation du sol','Pépinière','Repiquage','Tallage','Floraison','Maturité'])
on conflict (id) do nothing;

insert into profiles (id, role, full_name, country, region, commune, phone, preferred_language, allow_anonymized_research_use) values
  ('11111111-1111-1111-1111-111111111111', 'farmer', 'Koffi Adjovi', 'Bénin', 'Zou', 'Bohicon', '+229 97 00 11 22', 'fr', false),
  ('22222222-2222-2222-2222-222222222222', 'farmer', 'Akpé Houngbo', 'Bénin', 'Atlantique', 'Abomey-Calavi', '+229 96 22 33 44', 'fr', true),
  ('33333333-3333-3333-3333-333333333333', 'scientist', 'Dr Nadia Fassassi', 'Bénin', 'Littoral', 'Cotonou', '+229 95 55 66 77', 'fr', false),
  ('44444444-4444-4444-4444-444444444444', 'admin', 'Équipe FáGlè', 'Bénin', 'Littoral', 'Cotonou', null, 'fr', false)
on conflict (id) do nothing;

insert into farms (id, owner_id, name, country, region, commune, size_ha, irrigation_available, main_crops) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Ferme Démo FáGlè', 'Bénin', 'Zou', 'Bohicon', 3.5, false, array['Maïs','Tomate']),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Ferme familiale Houngbo', 'Bénin', 'Atlantique', 'Abomey-Calavi', 1.8, true, array['Riz'])
on conflict (id) do nothing;

insert into plots (id, farm_id, name, lat, lng, crop_id, variety, planting_date, growth_stage, soil_state, irrigation) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Parcelle Maïs A', 7.1781, 2.0667, 'crop-maize', 'Composite local (DMR-ESR-Y)', now() - interval '6 days', 'Germination', 'humid', 'none'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Parcelle Tomate B', 7.1795, 2.0691, 'crop-tomato', 'Tropimech', now() - interval '35 days', 'Floraison', 'normal', 'limited'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Parcelle Riz 1', 6.4489, 2.3556, 'crop-rice', 'IR841', now() - interval '50 days', 'Tallage', 'very_humid', 'available')
on conflict (id) do nothing;

insert into sensor_devices (device_id, plot_id, status, last_seen_at) values
  ('SENSOR-BJ-001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'unregistered', null),
  ('SENSOR-BJ-002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'active', now())
on conflict (device_id) do nothing;

insert into sensor_readings (device_id, plot_id, timestamp, soil_moisture, temperature, humidity, rainfall) values
  ('SENSOR-BJ-002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', now() - interval '1 day', 62.4, 29.1, 78, 4.2),
  ('SENSOR-BJ-002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', now() - interval '12 hours', 65.1, 28.4, 81, 1.1);

insert into weather_snapshots (plot_id, date, temperature, humidity, rainfall_24h, rainfall_48h, rainfall_7d, source) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', now(), 27.5, 84, 12, 38, 61, 'générateur de démo'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', now(), 30.2, 58, 0, 2, 9, 'générateur de démo'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', now(), 28.8, 76, 6, 14, 44, 'générateur de démo');

insert into farmer_observations (plot_id, farmer_id, date, crop_stage, soil_condition, plant_condition, pest_observed, standing_water, dryness, leaf_discoloration, notes) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', now() - interval '4 days', 'Germination', 'humid', 'normal', false, false, false, false, 'Les jeunes plants lèvent de façon homogène sur toute la parcelle après la pluie de la semaine dernière.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', now() - interval '1 day', 'Germination', 'very_humid', 'stressed', false, true, false, false, 'De l''eau stagne dans le coin bas de la parcelle après l''orage d''hier.');

insert into crop_photos (plot_id, farmer_id, url, date, crop, growth_stage, note) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '/demo/photos/maize-week1.svg', now() - interval '6 days', 'Maïs', 'Préparation du sol', 'Champ préparé et billonné, prêt pour le semis.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '/demo/photos/maize-week2.svg', now() - interval '2 days', 'Maïs', 'Germination', 'Premières pousses visibles, levée régulière et homogène.');

insert into monthly_reports (id, farm_id, month, status, sections) values
  ('report-2026-08-farm-demo', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-08', 'validated',
   '{"farm_summary":{"name":"Ferme Démo FáGlè","commune":"Bohicon","plots":2},"crops_monitored":["Maïs","Tomate"],"main_risks":["Risque d’excès d’eau pendant la germination"],"limitations":["Échantillon réduit (une seule exploitation)."]}'::jsonb),
  ('report-2026-09-farm-demo', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-09', 'pending_review',
   '{"farm_summary":{"name":"Ferme Démo FáGlè","commune":"Bohicon","plots":2},"crops_monitored":["Maïs","Tomate"],"main_risks":["Fortes précipitations prévues au stade de germination"],"limitations":["La période du rapport est encore en cours."]}'::jsonb)
on conflict (id) do nothing;

insert into report_reviews (report_id, reviewer_id, reviewer_name, status, comments) values
  ('report-2026-08-farm-demo', '33333333-3333-3333-3333-333333333333', 'Dr Nadia Fassassi', 'validated', 'Cohérent avec les régimes de précipitations régionaux du mois d''août. Il est recommandé de collecter des données d''humidité du sol la saison prochaine pour confirmer l''hypothèse d''excès d''eau.');
