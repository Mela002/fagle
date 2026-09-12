-- ============================================================================
-- FáGlè — Supabase / PostgreSQL schema
-- ============================================================================
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh
-- project. Safe to re-run: every statement is guarded with IF NOT EXISTS /
-- CREATE OR REPLACE where possible.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  role text not null default 'farmer' check (role in ('farmer', 'scientist', 'admin')),
  full_name text not null,
  country text default 'Benin',
  region text,
  commune text,
  phone text,
  preferred_language text default 'fr',
  allow_anonymized_research_use boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- crops (reference table)
-- ---------------------------------------------------------------------------
create table if not exists crops (
  id text primary key,
  name text not null,
  stages text[] not null default '{}'
);

-- ---------------------------------------------------------------------------
-- farms
-- ---------------------------------------------------------------------------
create table if not exists farms (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,
  country text default 'Benin',
  region text,
  commune text,
  size_ha numeric,
  irrigation_available boolean default false,
  main_crops text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_farms_owner on farms(owner_id);

-- ---------------------------------------------------------------------------
-- plots
-- ---------------------------------------------------------------------------
create table if not exists plots (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references farms(id) on delete cascade,
  name text not null,
  lat numeric,
  lng numeric,
  crop_id text references crops(id),
  variety text,
  planting_date date,
  growth_stage text default 'Land Prep',
  soil_state text default 'normal' check (soil_state in ('dry', 'normal', 'humid', 'very_humid')),
  irrigation text default 'none' check (irrigation in ('none', 'available', 'limited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_plots_farm on plots(farm_id);

-- ---------------------------------------------------------------------------
-- sensor_devices
-- ---------------------------------------------------------------------------
create table if not exists sensor_devices (
  id uuid primary key default uuid_generate_v4(),
  device_id text unique not null,
  plot_id uuid references plots(id) on delete set null,
  status text default 'unregistered' check (status in ('unregistered', 'active', 'offline')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_sensor_devices_plot on sensor_devices(plot_id);

-- ---------------------------------------------------------------------------
-- sensor_readings
-- ---------------------------------------------------------------------------
create table if not exists sensor_readings (
  id uuid primary key default uuid_generate_v4(),
  device_id text not null,
  plot_id uuid references plots(id) on delete cascade,
  timestamp timestamptz not null default now(),
  soil_moisture numeric,
  temperature numeric,
  humidity numeric,
  rainfall numeric,
  created_at timestamptz not null default now()
);
create index if not exists idx_sensor_readings_plot on sensor_readings(plot_id, timestamp desc);

-- ---------------------------------------------------------------------------
-- weather_snapshots
-- ---------------------------------------------------------------------------
create table if not exists weather_snapshots (
  id uuid primary key default uuid_generate_v4(),
  plot_id uuid references plots(id) on delete cascade,
  date timestamptz not null default now(),
  temperature numeric,
  humidity numeric,
  rainfall_24h numeric,
  rainfall_48h numeric,
  rainfall_7d numeric,
  source text default 'demo-generator',
  created_at timestamptz not null default now()
);
create index if not exists idx_weather_plot on weather_snapshots(plot_id, date desc);

-- ---------------------------------------------------------------------------
-- farmer_observations
-- ---------------------------------------------------------------------------
create table if not exists farmer_observations (
  id uuid primary key default uuid_generate_v4(),
  plot_id uuid references plots(id) on delete cascade,
  farmer_id uuid references profiles(id),
  date timestamptz not null default now(),
  crop_stage text,
  soil_condition text,
  plant_condition text,
  pest_observed boolean default false,
  standing_water boolean default false,
  dryness boolean default false,
  leaf_discoloration boolean default false,
  notes text,
  photo_url text,
  created_at timestamptz not null default now()
);
create index if not exists idx_observations_plot on farmer_observations(plot_id, date desc);

-- ---------------------------------------------------------------------------
-- crop_photos
-- ---------------------------------------------------------------------------
create table if not exists crop_photos (
  id uuid primary key default uuid_generate_v4(),
  plot_id uuid references plots(id) on delete cascade,
  farmer_id uuid references profiles(id),
  url text not null,
  date timestamptz not null default now(),
  crop text,
  growth_stage text,
  note text,
  problem text,
  gps jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_photos_plot on crop_photos(plot_id, date);

-- ---------------------------------------------------------------------------
-- recommendations
-- ---------------------------------------------------------------------------
create table if not exists recommendations (
  id uuid primary key default uuid_generate_v4(),
  plot_id uuid references plots(id) on delete cascade,
  action text,
  action_label text,
  risk_score numeric,
  risk_level text check (risk_level in ('low', 'moderate', 'high')),
  factors jsonb default '[]',
  counterfactuals jsonb default '[]',
  recommendation_text text,
  engine_version text,
  created_at timestamptz not null default now()
);
create index if not exists idx_recommendations_plot on recommendations(plot_id, created_at desc);

-- ---------------------------------------------------------------------------
-- decision_scenarios
-- ---------------------------------------------------------------------------
create table if not exists decision_scenarios (
  id uuid primary key default uuid_generate_v4(),
  recommendation_id uuid references recommendations(id) on delete cascade,
  plot_id uuid references plots(id) on delete cascade,
  scenario_action text,
  scenario_label text,
  risk_score numeric,
  risk_level text,
  recommended boolean default false,
  drivers jsonb default '[]',
  created_at timestamptz not null default now()
);
create index if not exists idx_scenarios_plot on decision_scenarios(plot_id, created_at desc);

-- ---------------------------------------------------------------------------
-- farmer_actions (feedback loop, step 1: "what did you actually do?")
-- ---------------------------------------------------------------------------
create table if not exists farmer_actions (
  id uuid primary key default uuid_generate_v4(),
  plot_id uuid references plots(id) on delete cascade,
  recommendation_id uuid references recommendations(id),
  recommended_action text,
  actual_action text not null,
  farmer_feedback text,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists idx_actions_plot on farmer_actions(plot_id, created_at desc);

-- ---------------------------------------------------------------------------
-- outcomes (feedback loop, step 2: "what happened?")
-- ---------------------------------------------------------------------------
create table if not exists outcomes (
  id uuid primary key default uuid_generate_v4(),
  plot_id uuid references plots(id) on delete cascade,
  action_id uuid references farmer_actions(id),
  outcome_type text not null,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_outcomes_plot on outcomes(plot_id, created_at desc);

-- ---------------------------------------------------------------------------
-- monthly_reports
-- ---------------------------------------------------------------------------
create table if not exists monthly_reports (
  id text primary key,
  farm_id uuid references farms(id) on delete cascade,
  month text not null,
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'validated', 'needs_revision')),
  sections jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_reports_farm on monthly_reports(farm_id, month desc);

-- ---------------------------------------------------------------------------
-- report_reviews
-- ---------------------------------------------------------------------------
create table if not exists report_reviews (
  id uuid primary key default uuid_generate_v4(),
  report_id text references monthly_reports(id) on delete cascade,
  reviewer_id uuid references profiles(id),
  reviewer_name text,
  status text not null check (status in ('pending_review', 'validated', 'needs_revision')),
  comments text,
  created_at timestamptz not null default now()
);
create index if not exists idx_reviews_report on report_reviews(report_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Storage bucket for crop photos (run once)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('crop-photos', 'crop-photos', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security — enabled with permissive policies for the MVP.
-- Tighten these before handling real farmer data in production.
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table farms enable row level security;
alter table plots enable row level security;
alter table farmer_observations enable row level security;
alter table crop_photos enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'allow_all_profiles') then
    create policy allow_all_profiles on profiles for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_all_farms') then
    create policy allow_all_farms on farms for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_all_plots') then
    create policy allow_all_plots on plots for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_all_observations') then
    create policy allow_all_observations on farmer_observations for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_all_photos') then
    create policy allow_all_photos on crop_photos for all using (true) with check (true);
  end if;
end $$;
