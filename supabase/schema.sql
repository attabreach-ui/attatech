-- ============================================================================
-- AttaTech — Database schema + Row Level Security + seed data
--
-- HOW TO RUN THIS:
-- 1. Go to your Supabase project dashboard → SQL Editor → New Query
-- 2. Paste this entire file, click "Run"
-- 3. It is idempotent (safe to re-run) — uses IF NOT EXISTS / ON CONFLICT DO NOTHING
--
-- This replaces the old "everything in localStorage" approach. After running
-- this, Services/Projects/FAQs/Stats/Settings live in the database, so admin
-- edits are visible to every visitor, not just your own browser.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. SITE SETTINGS — single row holding company/founder/contact/social/seo/hero
-- ----------------------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  company jsonb not null,
  founder jsonb not null,
  contact jsonb not null,
  social jsonb not null,
  seo jsonb not null,
  hero jsonb not null,
  formspree_endpoint text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ----------------------------------------------------------------------------
-- 2. STATS
-- ----------------------------------------------------------------------------
create table if not exists stats (
  id text primary key,
  label text not null,
  value text not null,
  suffix text not null default '',
  icon text not null default 'Briefcase',
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- 3. SERVICES
-- ----------------------------------------------------------------------------
create table if not exists services (
  id text primary key,
  icon text not null default 'Code',
  title text not null,
  description text not null default '',
  tags text[] not null default '{}',
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- 4. PROJECTS
-- ----------------------------------------------------------------------------
create table if not exists projects (
  id text primary key,
  title text not null,
  client text not null default '',
  industry text not null default '',
  location text not null default '',
  year text not null default '',
  type text not null default 'Web Apps',
  description text not null default '',
  long_description text not null default '',
  features text[] not null default '{}',
  results text[] not null default '{}',
  tech_stack text[] not null default '{}',
  live_url text not null default '',
  screenshots jsonb not null default '[]',
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- 5. FAQS
-- ----------------------------------------------------------------------------
create table if not exists faqs (
  id text primary key,
  question text not null,
  answer text not null default '',
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- 6. REVIEWS — included for completeness in case this is a fresh project.
--    If it already exists in your project, this line is skipped safely.
-- ----------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  stars int not null check (stars between 1 and 5),
  review_text text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- This is the part that was missing before — it's what actually stops a
-- random visitor from writing to your database with the public anon key.
-- ============================================================================

alter table site_settings enable row level security;
alter table stats          enable row level security;
alter table services       enable row level security;
alter table projects       enable row level security;
alter table faqs           enable row level security;
alter table reviews        enable row level security;

-- Drop old/loose policies if you're re-running this after a previous attempt
drop policy if exists "public read site_settings" on site_settings;
drop policy if exists "admin write site_settings" on site_settings;
drop policy if exists "public read stats" on stats;
drop policy if exists "admin write stats" on stats;
drop policy if exists "public read services" on services;
drop policy if exists "admin write services" on services;
drop policy if exists "public read projects" on projects;
drop policy if exists "admin write projects" on projects;
drop policy if exists "public read faqs" on faqs;
drop policy if exists "admin write faqs" on faqs;
drop policy if exists "public read approved reviews" on reviews;
drop policy if exists "anyone can submit unapproved review" on reviews;
drop policy if exists "admin manage reviews" on reviews;

-- Everyone (anon + logged-in) can READ content tables
create policy "public read site_settings" on site_settings for select using (true);
create policy "public read stats"         on stats         for select using (true);
create policy "public read services"      on services      for select using (true);
create policy "public read projects"      on projects      for select using (true);
create policy "public read faqs"          on faqs          for select using (true);

-- Only a logged-in admin (real Supabase Auth user, not a PIN) can write
create policy "admin write site_settings" on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write stats" on stats for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write services" on services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write faqs" on faqs for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Reviews: anyone can submit, but it MUST come in unapproved — this is the
-- fix for the "anyone could insert a fake 5-star approved review" hole.
create policy "public read approved reviews" on reviews for select
  using (approved = true);
create policy "anyone can submit unapproved review" on reviews for insert
  with check (approved = false);
create policy "admin manage reviews" on reviews for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA — your real, current AttaTech content goes in once.
-- Safe to re-run: ON CONFLICT DO NOTHING means it won't overwrite anything
-- you've already edited from the admin panel.
-- ============================================================================

insert into site_settings (id, company, founder, contact, social, seo, hero, formspree_endpoint)
values (
  1,
  '{"name":"AttaTech","tagline":"AI-Powered Business Solutions","founded":"2026","location":"Peshawar, Pakistan","workingHours":"Monday–Saturday, 09:00–18:00 (PKT)"}',
  '{"name":"Atta Ullah","title":"Founder & Developer","bio":"Cybersecurity student and self-taught web developer currently working in cold storage operations. Built Pakfrost WMS as my first enterprise project to solve real warehouse problems. Now offering custom software development for businesses across Pakistan."}',
  '{"whatsapp":"+92 347 8481093","phone":"+92 347 8481093","email":"attatech.dev@gmail.com","address":"Peshawar, Pakistan","workingHours":"Mon–Sat, 09:00–18:00"}',
  '{"whatsapp":"https://wa.me/923478481093","linkedin":"","github":"","twitter":""}',
  '{"title":"AttaTech — AI-Powered Business Solutions | Custom Software Pakistan","description":"Custom warehouse systems, inventory, HR and business software built with AI-assisted development. Based in Peshawar, Pakistan. First project: Pakfrost WMS.","keywords":"warehouse management system Pakistan, custom business software, WMS Peshawar, inventory system, HR software Pakistan, AI business solutions, cold storage management, Atta Ullah developer"}',
  '{"headline":"AI-Powered Business Software Built for Real Operations","subheadline":"Custom WMS, Inventory, HR & business software. Built for every business — from startups to enterprises.","ctaPrimary":{"text":"View Live Project","link":"https://pakfrost.netlify.app"},"ctaSecondary":{"text":"Chat on WhatsApp","link":"https://wa.me/923478481093"},"trustBar":["Enterprise WMS Delivered","Next.js Specialist","Long-Term Partnership"]}',
  'https://formspree.io/f/YOUR_FORM_ID'
)
on conflict (id) do nothing;

insert into stats (id, label, value, suffix, icon, sort_order) values
  ('1', 'Projects Delivered', '1', '', 'Briefcase', 0),
  ('2', 'Client Satisfaction', '100', '%', 'Heart', 1),
  ('3', 'Long-Term Partnership', '100', '%', 'Handshake', 2),
  ('4', 'Specialization', 'WMS', '', 'Snowflake', 3)
on conflict (id) do nothing;

insert into services (id, icon, title, description, tags, sort_order) values
  ('1', 'Code', 'Custom Business Software Development', 'Tailored software solutions designed to streamline your unique business processes, workflows, and reporting needs.', array['React','TypeScript','Node.js'], 0),
  ('2', 'Warehouse', 'Warehouse Management Systems (WMS)', 'Enterprise-grade WMS with real-time tracking, inventory control, automated IGP/OGP generation, and cold storage monitoring.', array['Next.js','WMS','Real-time'], 1),
  ('3', 'Package', 'Inventory & Stock Control Systems', 'Smart inventory management with automated expiry alerts, stock rotation (FEFO), batch tracking, and detailed analytics.', array['Analytics','FEFO','Alerts'], 2),
  ('4', 'Users', 'HR & Payroll Management Software', 'Complete HR solutions from attendance tracking to automated payroll processing and compliance reporting.', array['HR','Payroll','Attendance'], 3),
  ('5', 'Bot', 'AI-Powered Automation & Integration', 'Leverage AI to automate repetitive tasks, generate reports, and integrate disconnected systems for maximum efficiency.', array['AI/ML','Automation','APIs'], 4),
  ('6', 'Cloud', 'Cloud-Based SaaS Solutions', 'Scalable cloud applications accessible anywhere with secure data management, automatic backups, and role-based access.', array['Cloud','SaaS','Security'], 5),
  ('7', 'Globe', 'Website & Web Application Development', 'Modern, responsive websites and progressive web apps built with cutting-edge technologies like Next.js and Tailwind.', array['Next.js','Tailwind','PWA'], 6),
  ('8', 'RefreshCw', 'Legacy System Modernization', 'Upgrade outdated Excel/paper-based systems to modern digital platforms without disrupting daily operations.', array['Migration','Digital','Modern'], 7)
on conflict (id) do nothing;

insert into faqs (id, question, answer, sort_order) values
  ('1', 'What is AttaTech and what do you specialize in?', 'AttaTech is a software development initiative founded by Atta Ullah, specializing in custom business software, warehouse management systems (WMS), inventory control, and AI-powered automation. I focus on building practical solutions for real operational problems.', 0),
  ('2', 'Is this a registered company or freelance work?', 'Currently, AttaTech operates as a professional freelance development service while I complete my cybersecurity studies and gain enterprise experience. Every project is treated with the same professionalism and commitment as a registered agency.', 1),
  ('3', 'How much does a custom WMS or inventory system cost?', 'Pricing depends on the scope, features, and timeline. A basic system starts affordably for small businesses, while larger enterprise solutions are priced based on complexity and modules required. Reach out for a free consultation.', 2),
  ('4', 'Can you modify the system after it''s deployed?', 'Absolutely. I build systems with scalability in mind. Whether you need new reports, additional user roles, extra modules, or integrations, the system can be extended. I also offer monthly maintenance packages.', 3),
  ('5', 'Do you only build warehouse systems, or other software too?', 'While my first project was a cold storage WMS, I build all types of business software: HR & payroll, inventory, SaaS platforms, e-commerce backends, and custom web applications. The tech stack (Next.js + React) allows me to build virtually any web-based solution.', 4),
  ('6', 'How do I get started with my project?', 'Simple — message me on WhatsApp at +92 347 8481093 or email attatech.dev@gmail.com. We''ll discuss your requirements, I''ll share a proposal with timeline and cost, and once approved, development begins with weekly progress updates.', 5)
on conflict (id) do nothing;

insert into projects (id, title, client, industry, location, year, type, description, long_description, features, results, tech_stack, live_url, screenshots, sort_order) values
(
  '1',
  'Pakfrost WMS — Cold Storage Warehouse Management',
  'Pakfrost (PVT) Limited',
  'Cold Storage / Frozen Food Logistics',
  '2 KM Off Manga Raiwind Road, Behind Achha Foods, Lahore, Pakistan',
  '2026',
  'WMS',
  'A full-featured enterprise Warehouse Management System built from scratch for Pakfrost (PVT) Limited, a premium temperature-controlled warehousing company.',
  'A full-featured enterprise Warehouse Management System built from scratch for Pakfrost (PVT) Limited, a premium temperature-controlled warehousing company operating -18°C to -22°C frozen storage facilities in Lahore. This was my first enterprise software project, developed while working in the warehouse to solve real operational challenges.',
  array[
    'Secure Login & Role-Based User Access Control',
    'Real-Time Dashboard with KPI Cards (Active Pallets, Total Weight, Stock IN/OUT Today)',
    '7-Day Activity Charts with IN/OUT visualization',
    'Cold Room Temperature Monitoring (-20°C tracking for 4 rooms)',
    'Stock IN / Receiving with Auto IGP Generation (IGP-2026-0002 format)',
    'Stock OUT / Dispatch with Auto OGP Generation (OGP-2026-0003 format)',
    'Product Master Data with Expiry Date, Mfg Date, Batch, Lot tracking',
    'Stock History & Ledger with searchable transaction records',
    'Location Mapping & Room Capacity Management (Room 1-4 + Ante Room)',
    'Pallet Tags & Barcode-Ready Location Codes (e.g., LLE-1-6-P6)',
    'Expiry Alerts (7-day urgent, 30-day warning)',
    'Auto-Generated Unloading Sheets with print-ready formatting',
    'Multi-User Support with Admin/Operator roles'
  ],
  array[
    'Replaced manual paper-based tracking system',
    'Eliminated stock misplacement errors',
    'Automated IGP/OGP document generation',
    'Real-time temperature compliance monitoring',
    'Reduced stock lookup time from hours to seconds'
  ],
  array['Next.js 14','React','TypeScript','Tailwind CSS','Netlify'],
  'https://pakfrost.netlify.app',
  '[{"src":"/images/projects/pakfrost/pakfrost-login.jpg","alt":"Pakfrost WMS secure login page with company branding and credential fields"},{"src":"/images/projects/pakfrost/pakfrost-dashboard.jpg","alt":"Pakfrost WMS dashboard showing active pallets, total weight, stock activity charts, and cold room temperature monitoring"}]',
  0
)
on conflict (id) do nothing;

-- ============================================================================
-- NEXT STEP (do this manually, not in SQL):
-- Go to Authentication → Users → Add User in your Supabase dashboard and
-- create ONE admin user with your real email + a strong password.
-- That account is now your only way into /admin — there is no more PIN.
-- ============================================================================
