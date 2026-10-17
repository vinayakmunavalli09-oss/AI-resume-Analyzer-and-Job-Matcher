-- ============================================================
-- Seed: 001_jobs_seed.sql
-- Project:   AI Resume Analyzer & Job Matcher
-- Database:  Supabase PostgreSQL
-- Created:   2026-10-16
-- ============================================================
-- 60 realistic entry-level job listings for the Indian market.
--
-- ⚠️  DEMO DATA NOTICE ⚠️
-- All companies listed below are FICTIONAL and created solely
-- for demonstration and testing purposes. They do NOT represent
-- real organisations and do NOT have real job openings.
-- All records carry is_demo = TRUE and source_label = 'Demo Data'.
-- ============================================================
-- Run AFTER 001_initial_schema.sql and 002_rls_policies.sql.
-- Safe to re-run (ON CONFLICT DO NOTHING pattern).
-- ============================================================

BEGIN;

-- Truncate any existing seed rows before re-seeding
DELETE FROM public.jobs WHERE is_demo = true AND provider = 'seed';

-- ============================================================
-- CATEGORY 1: Marketing Executive / Digital Marketing Trainee
-- 10 jobs
-- ============================================================

INSERT INTO public.jobs (
  provider, title, company, location, city, state,
  description, required_skills, preferred_skills,
  education_required, experience_level, experience_years_max,
  employment_type, work_arrangement,
  salary_min, salary_max, salary_currency, salary_period,
  is_demo, is_active, source_label,
  published_at, expires_at
) VALUES

-- 1
(
  'seed',
  'Digital Marketing Trainee',
  'BrightPath Technologies [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'BrightPath Technologies is looking for an enthusiastic Digital Marketing Trainee to support campaigns across Google Ads, social media platforms, and email channels. You will assist the marketing team in creating content, tracking KPIs, and analysing campaign performance dashboards. This is an ideal role for fresh graduates eager to build a career in performance marketing.',
  ARRAY['Social Media Marketing', 'Google Analytics', 'Content Writing', 'MS Excel', 'Email Marketing'],
  ARRAY['SEO Basics', 'Canva', 'Google Ads', 'WordPress'],
  'Bachelor''s degree in Marketing, Mass Communication, or any field',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 2
(
  'seed',
  'Marketing Executive',
  'NexaCorps India [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'NexaCorps India seeks a motivated Marketing Executive to coordinate brand awareness initiatives and support the sales team with collateral and lead generation activities. You will manage social media accounts, track competitors, and prepare weekly marketing reports for the leadership team. Prior internship experience in marketing is a plus.',
  ARRAY['Social Media Management', 'Content Creation', 'MS PowerPoint', 'Communication Skills', 'Market Research'],
  ARRAY['Adobe Photoshop', 'HubSpot', 'Email Marketing', 'Copywriting'],
  'Bachelor''s degree in Business, Marketing, or related field',
  '0-1year', 1,
  'full-time', 'on-site',
  20000, 28000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 3
(
  'seed',
  'Social Media Executive',
  'TalentBridge Solutions [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'TalentBridge Solutions requires a creative Social Media Executive to manage Instagram, LinkedIn, and Twitter handles, craft engaging posts, and grow organic follower bases. You will collaborate with designers and copywriters to run campaigns, reply to audience comments, and monitor engagement metrics weekly. A strong sense of brand voice and trend awareness is essential.',
  ARRAY['Instagram Marketing', 'LinkedIn Marketing', 'Content Scheduling', 'Copywriting', 'Analytics Reporting'],
  ARRAY['Video Editing', 'Canva', 'Buffer / Hootsuite', 'Photography Basics'],
  'Bachelor''s degree in any discipline',
  'fresher', 1,
  'full-time', 'hybrid',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 4
(
  'seed',
  'SEO & Content Trainee',
  'Zenith Digital Hub [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'Zenith Digital Hub is hiring an SEO & Content Trainee to write optimised blog posts, perform keyword research, and build backlink outreach lists. You will learn on-page and off-page SEO under senior mentorship and contribute to doubling organic traffic over the next two quarters. Candidates with a blog or portfolio of written work will be preferred.',
  ARRAY['SEO', 'Keyword Research', 'Content Writing', 'Google Search Console', 'MS Word'],
  ARRAY['WordPress', 'Ahrefs / Semrush Basics', 'HTML Basics', 'Link Building'],
  'Bachelor''s degree in English, Journalism, Marketing, or any field',
  'fresher', 1,
  'full-time', 'remote',
  16000, 22000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 5
(
  'seed',
  'Marketing Communications Trainee',
  'Aura Brands Collective [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'Aura Brands Collective is seeking a Marketing Communications Trainee to draft press releases, internal newsletters, and product launch mailers. You will liaise with PR vendors, coordinate event logistics, and maintain the brand asset library. Excellent written English and an eye for detail are mandatory.',
  ARRAY['Written Communication', 'Press Release Writing', 'Event Coordination', 'MS Office Suite', 'Email Drafting'],
  ARRAY['PR Basics', 'InDesign Basics', 'Canva', 'Social Media'],
  'Bachelor''s degree in Mass Communication, English, or Marketing',
  'fresher', 1,
  'full-time', 'on-site',
  19000, 26000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 6
(
  'seed',
  'Digital Marketing Executive',
  'CloudNova Ventures [DEMO]',
  'Chennai, Tamil Nadu',
  'Chennai', 'Tamil Nadu',
  'CloudNova Ventures is on the lookout for a Digital Marketing Executive to run paid social campaigns on Meta and Google platforms and report on ROAS weekly. You will own end-to-end campaign setup — targeting, creatives, budgets, and optimisation — with guidance from the Head of Growth. Experience with A/B testing is a strong advantage.',
  ARRAY['Meta Ads', 'Google Ads', 'Campaign Management', 'Data Analysis', 'Reporting'],
  ARRAY['A/B Testing', 'Looker Studio', 'Pixel Setup', 'Audience Segmentation'],
  'Bachelor''s degree in Marketing, Business, or Engineering',
  '0-1year', 2,
  'full-time', 'on-site',
  22000, 30000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 7
(
  'seed',
  'Content Marketing Trainee',
  'Springboard Media Labs [DEMO]',
  'Kolkata, West Bengal',
  'Kolkata', 'West Bengal',
  'Springboard Media Labs needs a Content Marketing Trainee to create long-form blog articles, social captions, and video scripts aligned with our content calendar. You will research industry topics, interview subject-matter experts, and manage content scheduling tools. Candidates who bring creative storytelling skills will thrive here.',
  ARRAY['Content Writing', 'Research Skills', 'SEO Writing', 'Content Calendar Management', 'Editing'],
  ARRAY['Video Scripting', 'Notion / Trello', 'WordPress', 'Interview Skills'],
  'Bachelor''s degree in English, Journalism, or any field',
  'fresher', 1,
  'full-time', 'hybrid',
  16000, 21000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days'
),

-- 8
(
  'seed',
  'Brand Marketing Executive',
  'Orion Retail Group [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Orion Retail Group is hiring a Brand Marketing Executive to assist in visual merchandising guidelines, in-store promotions, and vendor co-branding initiatives. The role involves coordinating with design agencies, tracking activation budgets, and gathering post-event feedback. Strong interpersonal skills are needed for vendor and agency coordination.',
  ARRAY['Brand Management', 'Vendor Coordination', 'MS Excel', 'Communication Skills', 'Market Research'],
  ARRAY['Photoshop Basics', 'Budget Tracking', 'Event Management', 'Retail Analytics'],
  'Bachelor''s degree in Business, Marketing, or Retail Management',
  '0-1year', 2,
  'full-time', 'on-site',
  20000, 27000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days'
),

-- 9
(
  'seed',
  'Performance Marketing Trainee',
  'PulseGrowth Digital [DEMO]',
  'Gurgaon, Haryana',
  'Gurgaon', 'Haryana',
  'PulseGrowth Digital is recruiting a Performance Marketing Trainee to support paid acquisition across e-commerce clients. You will shadow senior media buyers, optimise product listings on Amazon/Flipkart, and analyse conversion funnels. An analytical mind and curiosity for numbers are key attributes.',
  ARRAY['E-commerce Basics', 'Data Analysis', 'MS Excel', 'Advertising Platforms', 'Communication Skills'],
  ARRAY['Amazon Seller Central', 'Flipkart Ads', 'Pivot Tables', 'Google Analytics'],
  'Bachelor''s degree in Business, Economics, or any analytical field',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 10
(
  'seed',
  'Marketing Analyst Trainee',
  'DataLens Analytics [DEMO]',
  'Noida, Uttar Pradesh',
  'Noida', 'Uttar Pradesh',
  'DataLens Analytics is seeking a Marketing Analyst Trainee to build dashboards, interpret campaign data, and present insights to the marketing leadership. You will work with Google Analytics, Looker Studio, and SQL queries to surface actionable recommendations. Freshers with strong data curiosity and Excel skills are welcome.',
  ARRAY['Google Analytics', 'MS Excel', 'Data Visualisation', 'Reporting', 'SQL Basics'],
  ARRAY['Looker Studio', 'Power BI', 'Python Basics', 'Dashboard Building'],
  'Bachelor''s degree in Statistics, Economics, CS, or related field',
  'fresher', 1,
  'full-time', 'hybrid',
  20000, 28000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- ============================================================
-- CATEGORY 2: Business Development Executive (BDE)
-- 10 jobs
-- ============================================================

-- 11
(
  'seed',
  'Business Development Executive',
  'NexaCorps India [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'NexaCorps India is looking for a target-driven Business Development Executive to identify new B2B clients, qualify leads, and close deals for IT services. You will maintain the CRM pipeline, make outbound calls, and participate in client meetings under senior mentorship. Consistent performance is rewarded with uncapped incentives.',
  ARRAY['B2B Sales', 'Lead Generation', 'CRM Tools', 'Negotiation', 'Cold Calling', 'MS Excel'],
  ARRAY['Salesforce', 'LinkedIn Sales Navigator', 'Email Prospecting', 'Proposal Writing'],
  'Bachelor''s degree in Business, Marketing, or any field',
  '0-1year', 2,
  'full-time', 'on-site',
  20000, 30000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 12
(
  'seed',
  'Business Development Executive',
  'BrightPath Technologies [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'BrightPath Technologies seeks a Business Development Executive to expand its SaaS product footprint among SMBs in Karnataka. Responsibilities include running outbound sequences, delivering product demos over Zoom, and nurturing trial users to paid conversions. A passion for technology and consultative selling style will set you apart.',
  ARRAY['SaaS Sales', 'Product Demos', 'Outbound Prospecting', 'Communication Skills', 'CRM', 'Follow-up Management'],
  ARRAY['HubSpot CRM', 'Zoom / Meet', 'Proposal Writing', 'Customer Success Basics'],
  'Bachelor''s degree in any field',
  '0-1year', 2,
  'full-time', 'hybrid',
  22000, 32000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 13
(
  'seed',
  'BDE – EdTech',
  'Learnova Edutech [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'Learnova Edutech is hiring a Business Development Executive to promote online upskilling courses to college students and working professionals. You will conduct outreach via WhatsApp, phone, and email, organise campus webinars, and achieve monthly enrolment targets. Freshers from any stream who love education and sales are encouraged to apply.',
  ARRAY['EdTech Sales', 'Cold Calling', 'Presentation Skills', 'Target Achievement', 'Student Counselling', 'MS Excel'],
  ARRAY['WhatsApp Business', 'Webinar Hosting', 'CRM Basics', 'Objection Handling'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 26000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 14
(
  'seed',
  'Business Development Executive',
  'TalentBridge Solutions [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'TalentBridge Solutions needs a BDE to acquire new corporate clients for its HR tech and staffing solutions. Duties include mapping prospect accounts, scheduling discovery calls, presenting proposals, and coordinating contracts with the legal team. Prior experience in HR-adjacent industries is an added advantage.',
  ARRAY['Corporate Sales', 'Account Mapping', 'Proposal Writing', 'CRM', 'Negotiation', 'Communication Skills'],
  ARRAY['LinkedIn Outreach', 'HR Industry Knowledge', 'Zoho CRM', 'Presentation Skills'],
  'Bachelor''s degree in Business, HR, or Marketing',
  '0-1year', 2,
  'full-time', 'on-site',
  22000, 31000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '9 days', NOW() + INTERVAL '21 days'
),

-- 15
(
  'seed',
  'BDE – FinTech',
  'MoneyMap Financial Tech [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'MoneyMap Financial Tech is seeking a BDE to onboard small retailers and kirana stores onto its digital payment and lending platform. You will conduct field visits, provide product walkthroughs on a tablet, and support first-month activation. Field sales experience or a two-wheeler is preferred.',
  ARRAY['Field Sales', 'FinTech Products', 'Merchant Onboarding', 'Target Achievement', 'Communication Skills', 'Product Walkthroughs'],
  ARRAY['UPI / Payment Basics', 'Geo-Navigation Apps', 'Regional Language Skills', 'Two-Wheeler Ownership'],
  'Bachelor''s degree (10+2 with strong field sales experience also considered)',
  'fresher', 1,
  'full-time', 'on-site',
  17000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 16
(
  'seed',
  'Business Development Executive',
  'Vertex Infra Solutions [DEMO]',
  'Chennai, Tamil Nadu',
  'Chennai', 'Tamil Nadu',
  'Vertex Infra Solutions is looking for a BDE to generate leads for its cloud infrastructure and managed services portfolio targeting mid-size enterprises. You will work closely with the pre-sales team to create tailored pitch decks and respond to RFPs. Knowledge of cloud platforms (AWS/Azure basics) will be favourably considered.',
  ARRAY['B2B Lead Generation', 'Cloud Services Awareness', 'CRM', 'Presentation Skills', 'Email Prospecting', 'MS PowerPoint'],
  ARRAY['AWS Basics', 'Azure Basics', 'RFP Writing', 'Solution Selling'],
  'Bachelor''s degree in Engineering, Computer Science, or Business',
  '0-1year', 2,
  'full-time', 'on-site',
  23000, 33000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 17
(
  'seed',
  'BDE – Real Estate',
  'Horizon Realty Hub [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Horizon Realty Hub needs a Business Development Executive to assist property consultants in generating buyer and investor leads through digital outreach and reference programmes. You will manage inbound inquiries on the CRM, schedule site visits, and follow up post-visit to accelerate decision-making. Weekend availability required.',
  ARRAY['Real Estate Sales', 'Lead Follow-up', 'CRM Tools', 'Client Relationship Management', 'Communication Skills', 'Negotiation'],
  ARRAY['MagicBricks / 99acres Basics', 'Site Visit Coordination', 'WhatsApp CRM', 'MS Excel'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 28000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 18
(
  'seed',
  'Business Development Executive',
  'Skyrocket Logistics [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Skyrocket Logistics is expanding its B2B courier and fulfilment services and needs a BDE to sign up e-commerce sellers, D2C brands, and SME exporters as clients. You will map the competitive landscape, run cold outreach, and negotiate service agreements. A background in logistics or supply chain is an advantage.',
  ARRAY['Logistics Sales', 'Cold Calling', 'Contract Negotiation', 'Relationship Building', 'MS Excel', 'CRM'],
  ARRAY['Courier Industry Knowledge', 'E-commerce Seller Ecosystem', 'Route Planning Basics', 'Zoho CRM'],
  'Bachelor''s degree in Business, Logistics, or any field',
  '0-1year', 2,
  'full-time', 'on-site',
  20000, 29000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 19
(
  'seed',
  'BDE – Healthcare SaaS',
  'MediLink Systems [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'MediLink Systems builds hospital management and clinic EHR software. We are hiring a BDE to approach private clinics, polyclinics, and small hospitals to present our solutions. You will set up demos, coordinate free trials, and manage the onboarding pipeline. Life sciences or healthcare background is preferred but not mandatory.',
  ARRAY['Healthcare Sales', 'Product Demo', 'SaaS Onboarding', 'CRM', 'Communication Skills', 'Target Achievement'],
  ARRAY['Hospital Management Software Awareness', 'EHR Basics', 'HubSpot', 'MS PowerPoint'],
  'Bachelor''s degree in Life Sciences, Pharma, or Business (MBA preferred)',
  '0-1year', 2,
  'full-time', 'hybrid',
  22000, 30000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 20
(
  'seed',
  'Business Development Executive',
  'GreenLeaf Agritech [DEMO]',
  'Nashik, Maharashtra',
  'Nashik', 'Maharashtra',
  'GreenLeaf Agritech connects farmers to premium buyers using its mobile marketplace. The BDE will onboard farmer producer organisations (FPOs), build relationships with agri-input dealers, and represent the company at state-level agri fairs. Willingness to travel within Maharashtra is essential.',
  ARRAY['Agritech Sales', 'FPO Onboarding', 'Relationship Management', 'Field Visits', 'Communication Skills', 'Regional Language (Marathi)'],
  ARRAY['Agri Value Chain Knowledge', 'Mobile App Onboarding', 'MS Excel', 'Two-Wheeler Ownership'],
  'Bachelor''s degree in Agriculture, Rural Management, or any field',
  'fresher', 1,
  'full-time', 'on-site',
  16000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days'
),

-- ============================================================
-- CATEGORY 3: Sales Trainee
-- 8 jobs
-- ============================================================

-- 21
(
  'seed',
  'Sales Trainee',
  'Orion Retail Group [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Orion Retail Group is offering a Sales Trainee programme for fresh graduates interested in a career in FMCG retail sales. Trainees will accompany senior territory managers to retail outlets, assist in order booking, and learn distribution and merchandising fundamentals over a 6-month structured learning track. Top performers are absorbed into a full-time role.',
  ARRAY['Retail Sales', 'Order Booking', 'Merchandising', 'Communication Skills', 'MS Excel'],
  ARRAY['FMCG Distribution', 'Route Mapping', 'POS Systems', 'Customer Relationship'],
  'Bachelor''s degree (any stream); BBA / B.Com preferred',
  'fresher', 0,
  'full-time', 'on-site',
  15000, 20000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 22
(
  'seed',
  'Sales Trainee – Insurance',
  'SecureLife Insurance Hub [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'SecureLife Insurance Hub is recruiting Sales Trainees to sell term, health, and motor insurance products to individual and SME clients. You will receive IRDAI-compliant product training, shadow senior advisors for two months, and then independently manage a client territory. Strong earning potential through performance incentives.',
  ARRAY['Insurance Sales', 'Client Acquisition', 'Cold Calling', 'Target Achievement', 'Communication Skills', 'Documentation'],
  ARRAY['IRDAI Basics', 'Objection Handling', 'Digital Insurance Tools', 'MS Excel'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  16000, 22000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 23
(
  'seed',
  'Inside Sales Trainee',
  'CloudNova Ventures [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'CloudNova Ventures is building its inside sales team and needs trainees who can execute high-volume outbound calls, qualify prospects, and pass warm leads to account executives. You will work on a power dialler, learn sales cadences, and track daily activity in Salesforce. Competitive base salary plus deal-closure bonuses.',
  ARRAY['Inside Sales', 'Cold Calling', 'Lead Qualification', 'Salesforce CRM', 'Communication Skills', 'Target Achievement'],
  ARRAY['Power Dialler Tools', 'Email Sequencing', 'Objection Handling', 'Sales Cadence Design'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 24
(
  'seed',
  'Sales Trainee – BFSI',
  'CapitalEdge Finance [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'CapitalEdge Finance is offering a structured BFSI Sales Trainee role for candidates who want to build a career in financial products sales — mutual funds, loans, and credit cards. You will undergo classroom plus on-the-job training, shadow relationship managers, and be evaluated at the end of month three for a permanent role.',
  ARRAY['Financial Products Knowledge', 'Client Relationship', 'Cold Calling', 'KYC Documentation', 'Communication Skills', 'MS Excel'],
  ARRAY['AMFI Certification', 'NISM Basics', 'Cross-selling', 'CRM Tools'],
  'Bachelor''s degree in Commerce, Finance, or Business',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 25
(
  'seed',
  'Sales Trainee – Real Estate',
  'Horizon Realty Hub [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'Horizon Realty Hub invites applications for Sales Trainee positions to assist customers in discovering residential properties matching their budget and lifestyle needs. You will be trained in consultative selling, RERA regulations basics, and site visit facilitation. Weekend work is mandatory in this field-intensive role.',
  ARRAY['Real Estate Knowledge', 'Customer Consultation', 'Site Visit Facilitation', 'Negotiation', 'Communication Skills', 'CRM'],
  ARRAY['RERA Basics', 'Google Maps', 'Photography', 'MS Excel'],
  'Bachelor''s degree in any field',
  'fresher', 0,
  'full-time', 'on-site',
  15000, 21000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 26
(
  'seed',
  'Telesales Trainee',
  'ConnectFirst Telecom [DEMO]',
  'Chennai, Tamil Nadu',
  'Chennai', 'Tamil Nadu',
  'ConnectFirst Telecom is hiring Telesales Trainees to sell broadband and enterprise telecom bundles to residential and small business customers via inbound and outbound calls. Daily call targets and quality monitoring will be part of the role. Bi-lingual candidates (Tamil + English) are preferred for this location.',
  ARRAY['Telesales', 'Inbound & Outbound Calling', 'Product Pitching', 'Target Achievement', 'Communication Skills', 'Tamil Language'],
  ARRAY['English Communication', 'Broadband Products Knowledge', 'CRM Basics', 'Objection Handling'],
  'Bachelor''s degree or Diploma (12th pass with strong communication also considered)',
  'fresher', 1,
  'full-time', 'on-site',
  15000, 20000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 27
(
  'seed',
  'Sales Trainee – EduTech',
  'Learnova Edutech [DEMO]',
  'Kolkata, West Bengal',
  'Kolkata', 'West Bengal',
  'Learnova Edutech is expanding rapidly in West Bengal and needs Sales Trainees to counsel students and parents about its online degree programmes and short courses. You will attend campus events, handle walk-in inquiries, and convert leads into enrolments through follow-up calls and WhatsApp engagement.',
  ARRAY['Student Counselling', 'Objection Handling', 'Follow-up Calls', 'Target Achievement', 'Communication Skills', 'MS Excel'],
  ARRAY['EdTech Industry Knowledge', 'WhatsApp Business', 'Campus Engagement', 'Bengali Language'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  16000, 22000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days'
),

-- 28
(
  'seed',
  'Sales Trainee – IT Products',
  'Vertex Infra Solutions [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Vertex Infra Solutions is seeking IT-savvy Sales Trainees to sell hardware, software licences, and AMC contracts to SME clients. You will learn solution selling approaches, accompany senior account managers on client calls, and receive technical training on key product lines over a structured 90-day induction plan.',
  ARRAY['IT Products Knowledge', 'Client Visits', 'Proposal Assistance', 'Communication Skills', 'MS Excel', 'Documentation'],
  ARRAY['Networking Basics', 'Hardware Knowledge', 'Quotation Preparation', 'ERP Basics'],
  'Bachelor''s degree in Computer Science, IT, Engineering, or B.Com',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- ============================================================
-- CATEGORY 4: HR Recruiter / HR Trainee
-- 8 jobs
-- ============================================================

-- 29
(
  'seed',
  'HR Trainee',
  'TalentBridge Solutions [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'TalentBridge Solutions is hiring an HR Trainee to assist the talent acquisition team in sourcing candidates, scheduling interviews, and maintaining ATS records. You will learn end-to-end recruitment operations, draft job descriptions, and support onboarding documentation. This role is ideal for fresh MBA-HR or BBA-HR graduates.',
  ARRAY['Recruitment', 'Job Portals (Naukri / LinkedIn)', 'ATS Tools', 'Communication Skills', 'MS Excel', 'Documentation'],
  ARRAY['HR Software', 'Offer Letter Drafting', 'Background Verification', 'Employee Onboarding'],
  'Bachelor''s degree in HR, Business, or Humanities; MBA-HR preferred',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 30
(
  'seed',
  'HR Recruiter',
  'NexaCorps India [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'NexaCorps India needs an HR Recruiter to manage high-volume IT and non-IT lateral hiring for its growing client base. You will source profiles on Naukri, LinkedIn, and internal referrals, coordinate shortlisting, and manage candidate experience through offer acceptance. Experience with Boolean search is preferred.',
  ARRAY['IT Recruitment', 'LinkedIn Sourcing', 'Naukri.com', 'Screening Interviews', 'Boolean Search', 'ATS Management'],
  ARRAY['Stakeholder Management', 'Salary Negotiation', 'Candidate Assessment', 'HR Analytics Basics'],
  'Bachelor''s degree in HR, Business, or any field; MBA preferred',
  '0-1year', 1,
  'full-time', 'hybrid',
  20000, 28000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 31
(
  'seed',
  'HR Trainee – Generalist',
  'CloudNova Ventures [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'CloudNova Ventures is looking for an HR Generalist Trainee to support payroll processing, leave management, and employee engagement activities. You will learn HRMS tools, prepare HR MIS reports, and help coordinate the annual appraisal cycle. Candidates with exposure to payroll software (GreytHR / Keka) will be preferred.',
  ARRAY['HR Generalist', 'Payroll Basics', 'Leave Management', 'HR MIS', 'Communication Skills', 'MS Excel'],
  ARRAY['GreytHR / Keka', 'Employee Engagement', 'HRMS Tools', 'Appraisal Coordination'],
  'Bachelor''s degree or MBA in HR',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 32
(
  'seed',
  'Talent Acquisition Trainee',
  'Springboard Media Labs [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Springboard Media Labs needs a Talent Acquisition Trainee to support hiring for creative and digital roles. Duties include writing compelling job posts, screening creative portfolios, coordinating assignment rounds, and scheduling final interviews with department heads. Exposure to media/creative industry hiring is a bonus.',
  ARRAY['Creative Recruitment', 'Job Posting', 'Portfolio Review', 'Candidate Screening', 'Communication Skills', 'MS Excel'],
  ARRAY['LinkedIn Recruiter Lite', 'Workable ATS', 'Interview Scheduling Tools', 'Employer Branding'],
  'Bachelor''s degree in HR, Mass Comm, or any field',
  'fresher', 1,
  'full-time', 'hybrid',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 33
(
  'seed',
  'HR Operations Trainee',
  'BrightPath Technologies [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'BrightPath Technologies is hiring an HR Operations Trainee to support PF/ESI compliance filings, statutory register maintenance, and new-hire paperwork. You will shadow the HR Operations Manager, prepare monthly compliance dashboards, and maintain digital employee files on Zoho People. Attention to detail is non-negotiable.',
  ARRAY['HR Compliance', 'PF/ESI Basics', 'Zoho People / HRMS', 'Documentation', 'MS Excel', 'Communication Skills'],
  ARRAY['Labour Law Basics', 'HRMS Administration', 'MIS Reporting', 'Audit Support'],
  'Bachelor''s degree in Commerce, HR, or Business Law',
  'fresher', 1,
  'full-time', 'on-site',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 34
(
  'seed',
  'Campus Recruiter Trainee',
  'PulseGrowth Digital [DEMO]',
  'Chennai, Tamil Nadu',
  'Chennai', 'Tamil Nadu',
  'PulseGrowth Digital needs a Campus Recruiter Trainee to manage university tie-ups and coordinate mass recruitment drives. You will prepare pre-placement talk materials, liaise with college placement cells, handle logistics for assessment days, and maintain a tracker of campus hiring pipelines.',
  ARRAY['Campus Recruitment', 'Event Coordination', 'Communication Skills', 'Stakeholder Management', 'MS Excel', 'Documentation'],
  ARRAY['Assessment Design', 'PPT Design', 'Applicant Tracking', 'Email Communication'],
  'MBA in HR or Bachelor''s with strong campus engagement experience',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '9 days', NOW() + INTERVAL '21 days'
),

-- 35
(
  'seed',
  'HR Recruiter – Non-IT',
  'Skyrocket Logistics [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Skyrocket Logistics is scaling operations and needs an HR Recruiter to manage bulk hiring for warehouse associates, delivery executives, and operations supervisors across Maharashtra. You will source via walk-in drives, manage onboarding paperwork, and coordinate with site managers. Experience with blue-collar hiring is a strong advantage.',
  ARRAY['Bulk Hiring', 'Walk-in Drives', 'Candidate Onboarding', 'Documentation', 'Communication Skills', 'MS Excel'],
  ARRAY['Blue-Collar Recruitment', 'Field Sourcing', 'Offer Management', 'Vendor Coordination'],
  'Bachelor''s degree in any field',
  '0-1year', 2,
  'full-time', 'on-site',
  19000, 26000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 36
(
  'seed',
  'HR Intern → Trainee',
  'DataLens Analytics [DEMO]',
  'Gurgaon, Haryana',
  'Gurgaon', 'Haryana',
  'DataLens Analytics is hiring an HR Intern transitioning to Trainee level within 3 months, supporting L&D scheduling, employee survey analysis, and culture initiatives. You will help manage the internal learning management system, analyse training completion data, and compile quarterly people analytics reports for the CHRO.',
  ARRAY['L&D Coordination', 'LMS Administration', 'Survey Analysis', 'People Analytics', 'MS Excel', 'Communication Skills'],
  ARRAY['Power BI Basics', 'Google Forms / SurveyMonkey', 'Culture Building', 'HR Metrics'],
  'Bachelor''s or Master''s in HR, Psychology, or Business',
  'fresher', 1,
  'full-time', 'hybrid',
  17000, 22000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days'
),

-- ============================================================
-- CATEGORY 5: Business Analyst Trainee
-- 8 jobs
-- ============================================================

-- 37
(
  'seed',
  'Business Analyst Trainee',
  'Zenith Digital Hub [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Zenith Digital Hub is looking for a Business Analyst Trainee to assist product managers in gathering requirements, writing user stories, and creating process flow diagrams. You will participate in sprint ceremonies, maintain the product backlog, and validate acceptance criteria with the QA team. Strong logical thinking and documentation skills are required.',
  ARRAY['Requirement Gathering', 'User Story Writing', 'Process Flow Diagrams', 'MS Excel', 'Communication Skills', 'Agile Basics'],
  ARRAY['JIRA / Confluence', 'SQL Basics', 'Wireframing Tools', 'Business Case Writing'],
  'Bachelor''s degree in Computer Science, IT, Business, or Engineering',
  'fresher', 1,
  'full-time', 'hybrid',
  22000, 30000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 38
(
  'seed',
  'Business Analyst Trainee – FinTech',
  'MoneyMap Financial Tech [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'MoneyMap Financial Tech needs a BA Trainee to analyse lending workflow data, identify process bottlenecks, and propose automation opportunities. You will create detailed BRDs, validate UAT scenarios, and coordinate sign-off between technology and operations. SQL and Excel proficiency is mandatory.',
  ARRAY['SQL', 'MS Excel', 'BRD Writing', 'UAT Coordination', 'Process Analysis', 'Communication Skills'],
  ARRAY['FinTech Domain Knowledge', 'Power BI', 'JIRA', 'Visio / Lucidchart'],
  'Bachelor''s degree in Computer Science, IT, Finance, or Engineering',
  '0-1year', 1,
  'full-time', 'on-site',
  24000, 32000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 39
(
  'seed',
  'Junior Business Analyst',
  'BrightPath Technologies [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'BrightPath Technologies is hiring a Junior Business Analyst to bridge the gap between client requirements and the engineering team for its SaaS products. You will document functional specifications, conduct stakeholder workshops, and perform gap analysis. An engineering background combined with strong communication will make you successful in this role.',
  ARRAY['Functional Specifications', 'Stakeholder Workshops', 'Gap Analysis', 'Agile / Scrum', 'SQL', 'MS Visio'],
  ARRAY['SaaS Product Knowledge', 'Wireframing (Figma)', 'JIRA', 'Python Basics'],
  'Bachelor''s or Master''s in CS, IT, or Engineering',
  '0-1year', 2,
  'full-time', 'hybrid',
  25000, 33000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 40
(
  'seed',
  'Business Analyst Trainee – E-commerce',
  'NexaCorps India [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'NexaCorps India requires a BA Trainee to analyse e-commerce funnel data, prepare category performance dashboards, and coordinate A/B test plans with the product team. You will work with large datasets in Excel, create management-ready PowerPoint decks, and participate in weekly business review meetings.',
  ARRAY['Data Analysis', 'MS Excel Advanced', 'Dashboard Creation', 'A/B Testing Basics', 'Communication Skills', 'PowerPoint'],
  ARRAY['Google Analytics', 'SQL', 'Tableau / Power BI', 'E-commerce Domain Knowledge'],
  'Bachelor''s degree in Statistics, Economics, Computer Science, or Business',
  'fresher', 1,
  'full-time', 'on-site',
  22000, 30000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 41
(
  'seed',
  'Operations Analyst Trainee',
  'CloudNova Ventures [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'CloudNova Ventures needs an Operations Analyst Trainee to build operational scorecards, monitor SLAs across service lines, and alert leadership to at-risk metrics. The role involves heavy use of Excel pivot tables, Power BI dashboards, and weekly leadership report packs. MBA freshers with strong analytical aptitude are encouraged to apply.',
  ARRAY['Operations Analysis', 'MS Excel Advanced', 'Power BI', 'SLA Monitoring', 'Report Writing', 'Communication Skills'],
  ARRAY['SQL Basics', 'Smartsheet / Monday.com', 'Process Documentation', 'Python Basics'],
  'Bachelor''s or MBA in Operations, Business, or Engineering',
  'fresher', 1,
  'full-time', 'on-site',
  22000, 30000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 42
(
  'seed',
  'Business Analyst Trainee – Healthcare',
  'MediLink Systems [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'MediLink Systems is recruiting a BA Trainee to support healthcare IT implementations — mapping hospital workflows, documenting configuration requirements, and conducting user training sessions. You will interface with clinicians and hospital administrators to understand pain points and translate them into feature requests for the engineering squad.',
  ARRAY['Healthcare Workflow Mapping', 'Requirement Documentation', 'User Training', 'Communication Skills', 'MS Excel', 'Process Analysis'],
  ARRAY['EHR / HMIS Knowledge', 'JIRA', 'HL7 / FHIR Basics', 'Presentation Skills'],
  'Bachelor''s in Life Sciences, Pharmacy, CS, or Engineering',
  '0-1year', 2,
  'full-time', 'on-site',
  23000, 31000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 43
(
  'seed',
  'Data Analyst Trainee',
  'DataLens Analytics [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'DataLens Analytics is building its analyst pool and needs freshers with strong SQL and Python skills to process client datasets, detect anomalies, and build visualisation reports. You will work under a senior analyst on 2-3 live client projects per month and present findings in weekly review meetings.',
  ARRAY['SQL', 'Python Basics', 'Data Cleaning', 'Data Visualisation', 'MS Excel', 'Communication Skills'],
  ARRAY['Tableau', 'Power BI', 'Pandas / NumPy', 'Statistics'],
  'Bachelor''s or Master''s in Statistics, Data Science, Mathematics, or CS',
  'fresher', 1,
  'full-time', 'hybrid',
  23000, 31000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days'
),

-- 44
(
  'seed',
  'Business Analyst Trainee – Logistics',
  'Skyrocket Logistics [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Skyrocket Logistics needs a BA Trainee to analyse shipment data, identify cost-saving routing optimisations, and prepare daily operations dashboards for fleet managers. You will use SQL queries against the TMS database, build Excel models for scenario analysis, and coordinate with IT for BI tool improvements.',
  ARRAY['SQL', 'MS Excel', 'Logistics Domain Knowledge', 'Data Analysis', 'Dashboard Building', 'Communication Skills'],
  ARRAY['TMS Software Basics', 'Power BI', 'Route Optimisation Concepts', 'Python'],
  'Bachelor''s in Logistics, Supply Chain, CS, or Engineering',
  'fresher', 1,
  'full-time', 'on-site',
  22000, 29000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- ============================================================
-- CATEGORY 6: Operations Executive
-- 8 jobs
-- ============================================================

-- 45
(
  'seed',
  'Operations Executive',
  'Skyrocket Logistics [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Skyrocket Logistics is seeking an Operations Executive to coordinate last-mile delivery operations across the Mumbai metro zone. Responsibilities include managing rider assignments, resolving delivery exceptions in real-time, and maintaining daily shift logs. Candidates comfortable working flexible shifts including weekends will be preferred.',
  ARRAY['Operations Coordination', 'Logistics Management', 'MS Excel', 'Communication Skills', 'Problem Solving', 'Shift Management'],
  ARRAY['TMS / OMS Software', 'Google Maps', 'Escalation Handling', 'Vendor Liaison'],
  'Bachelor''s degree in any field; Logistics background preferred',
  '0-1year', 2,
  'full-time', 'on-site',
  19000, 26000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 46
(
  'seed',
  'Operations Executive – E-commerce',
  'NexaCorps India [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'NexaCorps India needs an Operations Executive to oversee seller onboarding, catalogue management, and order fulfilment quality for its marketplace division. You will coordinate with seller partners, flag SLA breaches, and maintain operational dashboards. Experience with Seller Flex or WMS tools is an advantage.',
  ARRAY['Seller Onboarding', 'Catalogue Management', 'Order Fulfilment', 'MS Excel', 'Communication Skills', 'SLA Monitoring'],
  ARRAY['Seller Flex / WMS', 'ERP Basics', 'Returns Management', 'Power BI'],
  'Bachelor''s degree in Business, Supply Chain, or any field',
  '0-1year', 2,
  'full-time', 'on-site',
  20000, 27000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 47
(
  'seed',
  'Operations Executive – HealthTech',
  'MediLink Systems [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'MediLink Systems is hiring an Operations Executive to coordinate software deployment schedules across 30+ hospital accounts. You will manage go-live checklists, track pending action items from hospital IT teams, and escalate blockers to the project manager. Strong follow-up and multitasking skills are critical.',
  ARRAY['Project Coordination', 'Go-Live Management', 'Checklist Maintenance', 'MS Excel', 'Communication Skills', 'Escalation Management'],
  ARRAY['Healthcare IT Knowledge', 'Smartsheet / Asana', 'JIRA Basics', 'Stakeholder Communication'],
  'Bachelor''s in CS, IT, Healthcare, or Business',
  '0-1year', 2,
  'full-time', 'on-site',
  21000, 28000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 48
(
  'seed',
  'Office Operations Executive',
  'Aura Brands Collective [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Aura Brands Collective is looking for an Office Operations Executive to manage office facilities, vendor contracts, travel bookings, and admin procurement. You will maintain asset registers, coordinate with the housekeeping and security teams, and prepare monthly admin spend reports. This is a multi-faceted, hands-on role.',
  ARRAY['Facility Management', 'Vendor Management', 'Travel Booking', 'MS Excel', 'Communication Skills', 'Admin Procurement'],
  ARRAY['Petty Cash Management', 'Asset Register Maintenance', 'ERP Purchase Module', 'Budget Tracking'],
  'Bachelor''s degree in any field',
  '0-1year', 2,
  'full-time', 'on-site',
  18000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 49
(
  'seed',
  'Operations Executive – AgriSupply',
  'GreenLeaf Agritech [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'GreenLeaf Agritech needs an Operations Executive to coordinate produce procurement from FPOs, schedule transport, and reconcile quality-check reports at the aggregation centre. You will liaise with farmers, transporters, and buyer accounts to ensure on-time delivery and minimal wastage. Field travel is required 3 days a week.',
  ARRAY['Supply Chain Coordination', 'Procurement', 'Quality Check Basics', 'MS Excel', 'Communication Skills', 'Field Operations'],
  ARRAY['Cold Chain Basics', 'ERP / SAP', 'Inventory Management', 'Vendor Relations'],
  'Bachelor''s in Agriculture, Supply Chain, or Business',
  'fresher', 1,
  'full-time', 'on-site',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 50
(
  'seed',
  'Operations Coordinator',
  'PulseGrowth Digital [DEMO]',
  'Gurgaon, Haryana',
  'Gurgaon', 'Haryana',
  'PulseGrowth Digital is looking for an Operations Coordinator to manage project timelines, resource allocation, and client delivery workflows for its performance marketing agency. You will use project management tools, prepare status reports, and ensure milestones are communicated proactively to clients and internal teams.',
  ARRAY['Project Management Basics', 'Resource Allocation', 'Status Reporting', 'MS Excel', 'Communication Skills', 'Client Coordination'],
  ARRAY['Asana / Monday.com', 'Marketing Agency Operations', 'Billing Coordination', 'Slack / Teams'],
  'Bachelor''s degree in Business, Marketing, or any field',
  '0-1year', 2,
  'full-time', 'hybrid',
  20000, 27000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 51
(
  'seed',
  'Operations Executive – Banking Support',
  'CapitalEdge Finance [DEMO]',
  'Chennai, Tamil Nadu',
  'Chennai', 'Tamil Nadu',
  'CapitalEdge Finance is hiring Operations Executives to process loan applications, verify KYC documents, and coordinate with credit underwriting teams for personal and business loan disbursals. High accuracy, confidentiality, and turnaround discipline are essential. Training on the internal LOS will be provided.',
  ARRAY['Loan Processing', 'KYC Verification', 'Documentation', 'MS Excel', 'Communication Skills', 'Attention to Detail'],
  ARRAY['Loan Origination System (LOS)', 'CIBIL Basics', 'Banking Domain', 'Data Entry Speed'],
  'Bachelor''s in Commerce, Business, or Finance',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '9 days', NOW() + INTERVAL '21 days'
),

-- 52
(
  'seed',
  'Back Office Operations Executive',
  'TalentBridge Solutions [DEMO]',
  'Kolkata, West Bengal',
  'Kolkata', 'West Bengal',
  'TalentBridge Solutions requires a Back Office Operations Executive to handle candidate database updates, MIS generation, invoice coordination with clients, and billing reconciliation for its staffing business. The role demands high accuracy in data entry, comfort with Excel formulas, and proactive follow-up abilities.',
  ARRAY['Data Entry', 'MIS Reporting', 'Invoice Processing', 'MS Excel Advanced', 'Communication Skills', 'Billing Reconciliation'],
  ARRAY['HRMS Tools', 'Tally Basics', 'Pivot Tables', 'VLOOKUP / XLOOKUP'],
  'Bachelor''s in Commerce or Business',
  'fresher', 1,
  'full-time', 'on-site',
  16000, 22000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- ============================================================
-- CATEGORY 7: Customer Support Executive
-- 8 jobs
-- ============================================================

-- 53
(
  'seed',
  'Customer Support Executive',
  'ConnectFirst Telecom [DEMO]',
  'Hyderabad, Telangana',
  'Hyderabad', 'Telangana',
  'ConnectFirst Telecom is hiring Customer Support Executives to handle inbound calls and chats for broadband and postpaid customers experiencing service issues. You will log tickets in the CRM, coordinate with the technical team for resolution, and follow up to close tickets within SLA. Shift-based work including night shifts is part of the role.',
  ARRAY['Inbound Call Handling', 'CRM Tools', 'Complaint Resolution', 'Communication Skills', 'Active Listening', 'Typing Speed (30 WPM+)'],
  ARRAY['Technical Troubleshooting Basics', 'Telugu Language', 'Chat Support', 'Ticket Management'],
  'Bachelor''s degree or Diploma (12th pass with fluent English also considered)',
  'fresher', 1,
  'full-time', 'on-site',
  16000, 22000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'
),

-- 54
(
  'seed',
  'Customer Support Executive – E-commerce',
  'Orion Retail Group [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'Orion Retail Group needs Customer Support Executives to handle order status queries, return requests, and escalations from online shoppers via email, chat, and phone. You will use Freshdesk to track cases, coordinate with the fulfilment team, and ensure customer satisfaction scores stay above 90%. Weekend availability required.',
  ARRAY['E-commerce Support', 'Freshdesk / Zendesk', 'Chat & Email Support', 'Complaint Resolution', 'Communication Skills', 'Customer Empathy'],
  ARRAY['Returns & Refund Policies', 'Escalation Handling', 'CSAT Improvement', 'MS Excel'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
),

-- 55
(
  'seed',
  'Customer Success Associate',
  'Learnova Edutech [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Learnova Edutech is looking for a Customer Success Associate to onboard newly enrolled students, ensure they complete their first module within 7 days, and check in weekly to remove learning blockers. You will track cohort health metrics and escalate at-risk students to the academic team. Empathy and proactive outreach are your key tools.',
  ARRAY['Customer Onboarding', 'Proactive Outreach', 'Communication Skills', 'Cohort Health Tracking', 'Email Writing', 'MS Excel'],
  ARRAY['EdTech Platform Knowledge', 'LMS Administration', 'NPS / CSAT Metrics', 'WhatsApp Engagement'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'hybrid',
  18000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
),

-- 56
(
  'seed',
  'Customer Support Executive – Banking',
  'CapitalEdge Finance [DEMO]',
  'Delhi, Delhi NCR',
  'Delhi', 'Delhi',
  'CapitalEdge Finance needs Customer Support Executives for its contact centre to assist loan applicants with status queries, document upload guidance, and EMI schedule clarifications. You will comply with RBI call-recording norms, maintain call logs, and maintain zero mis-selling compliance. Hindi fluency is mandatory.',
  ARRAY['Banking Support', 'Inbound Calls', 'Loan Servicing Basics', 'Hindi Communication', 'CRM Tools', 'Compliance Awareness'],
  ARRAY['English Communication', 'NBFC Regulatory Basics', 'Escalation Management', 'Documentation'],
  'Bachelor''s in Commerce, Business, or any field',
  'fresher', 1,
  'full-time', 'on-site',
  17000, 23000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'
),

-- 57
(
  'seed',
  'Technical Support Executive',
  'Vertex Infra Solutions [DEMO]',
  'Chennai, Tamil Nadu',
  'Chennai', 'Tamil Nadu',
  'Vertex Infra Solutions provides managed IT support to SME clients and needs Technical Support Executives to handle Level 1 tickets — password resets, VPN issues, printer configurations, and basic network troubleshooting. You will work rotating shifts and escalate unresolved issues to L2 engineers within defined SLAs.',
  ARRAY['IT Helpdesk', 'Windows OS Troubleshooting', 'Network Basics', 'Ticket Management', 'Communication Skills', 'Remote Desktop Tools'],
  ARRAY['Active Directory Basics', 'O365 Administration', 'ITIL Awareness', 'Linux Basics'],
  'Bachelor''s in CS, IT, or Engineering; Hardware/Networking diploma considered',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days'
),

-- 58
(
  'seed',
  'Customer Support Executive – SaaS',
  'CloudNova Ventures [DEMO]',
  'Pune, Maharashtra',
  'Pune', 'Maharashtra',
  'CloudNova Ventures is expanding its customer support team to handle chats and emails from SaaS product users experiencing account or feature issues. You will document bugs with screenshots, replicate issues in a staging environment, and relay details to the engineering team. A tech-curious mindset with strong written English is essential.',
  ARRAY['SaaS Support', 'Chat & Email Handling', 'Bug Documentation', 'CRM Tools', 'Written English', 'Customer Empathy'],
  ARRAY['Zendesk', 'Basic Software Troubleshooting', 'API Concepts (basic)', 'CSAT Monitoring'],
  'Bachelor''s in CS, IT, Business, or any field',
  'fresher', 1,
  'full-time', 'hybrid',
  19000, 25000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'
),

-- 59
(
  'seed',
  'Customer Support Associate – Logistics',
  'Skyrocket Logistics [DEMO]',
  'Mumbai, Maharashtra',
  'Mumbai', 'Maharashtra',
  'Skyrocket Logistics needs Customer Support Associates to handle shipper and consignee queries about shipment tracking, exceptions, and claims. You will coordinate with the last-mile team to resolve delays in real-time and update clients proactively before they escalate. A calm, solutions-first attitude is key.',
  ARRAY['Logistics Support', 'Shipment Tracking', 'Exception Handling', 'Phone & Email Support', 'Communication Skills', 'MS Excel'],
  ARRAY['TMS Software', 'Escalation Management', 'Claims Processing Basics', 'Customer Empathy'],
  'Bachelor''s degree in any field',
  'fresher', 1,
  'full-time', 'on-site',
  16000, 21000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days'
),

-- 60
(
  'seed',
  'Customer Support Executive – HealthTech',
  'MediLink Systems [DEMO]',
  'Bangalore, Karnataka',
  'Bangalore', 'Karnataka',
  'MediLink Systems is hiring Customer Support Executives to assist hospital staff using its HMS software — answering how-to queries, logging feature requests, and escalating critical system issues to the implementation team. You will maintain a daily ticketing dashboard and ensure SLA adherence of 95%+. Healthcare background is an advantage.',
  ARRAY['Software Helpdesk', 'Ticket Resolution', 'SLA Adherence', 'Communication Skills', 'MS Excel', 'CRM Tools'],
  ARRAY['HMS / HMIS Basics', 'JIRA Service Management', 'Healthcare Terminology', 'Remote Support Tools'],
  'Bachelor''s in CS, IT, Life Sciences, or any field',
  'fresher', 1,
  'full-time', 'on-site',
  18000, 24000, 'INR', 'monthly',
  true, true, 'Demo Data',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
);

-- ============================================================
-- VERIFICATION COUNTS
-- ============================================================
DO $$
DECLARE
  total_count INT;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.jobs WHERE is_demo = true AND provider = 'seed';
  RAISE NOTICE 'Seed jobs inserted: % (expected 60)', total_count;
  IF total_count <> 60 THEN
    RAISE EXCEPTION 'Seed count mismatch! Expected 60, got %', total_count;
  END IF;
END $$;

COMMIT;

-- ============================================================
-- END OF SEED 001
-- ============================================================
