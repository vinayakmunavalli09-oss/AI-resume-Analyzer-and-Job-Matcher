-- ============================================================
-- Migration: 001_initial_schema.sql
-- Project:   AI Resume Analyzer & Job Matcher
-- Database:  Supabase PostgreSQL
-- Created:   2026-10-16
-- ============================================================
-- Run this migration first before any other migrations.
-- Requires Supabase Auth (auth.users) to be enabled.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- HELPER: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: profiles
-- Stores user preferences, skills, and career targets.
-- Linked 1:1 to auth.users via id.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name        TEXT,
  email               TEXT,
  phone               TEXT,
  location            TEXT,
  target_roles        TEXT[]      DEFAULT '{}',
  preferred_locations TEXT[]      DEFAULT '{}',
  experience_level    TEXT        CHECK (experience_level IN ('fresher', '0-1year', '1-2years')),
  education_level     TEXT,
  skills              TEXT[]      DEFAULT '{}',
  preferences         JSONB       DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'User profile with career preferences and skills. Linked 1:1 to auth.users.';
COMMENT ON COLUMN public.profiles.target_roles        IS 'Array of job titles the user is targeting.';
COMMENT ON COLUMN public.profiles.preferred_locations IS 'Array of preferred work cities/states.';
COMMENT ON COLUMN public.profiles.experience_level    IS 'Candidate self-reported experience band.';
COMMENT ON COLUMN public.profiles.preferences         IS 'Misc. UI/notification preferences as JSON.';

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON public.profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_skills           ON public.profiles USING gin(skills);

-- ============================================================
-- TABLE: jobs
-- Job listings from seed data and external providers.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id         TEXT,
  provider            TEXT        DEFAULT 'seed',
  title               TEXT        NOT NULL,
  company             TEXT        NOT NULL,
  location            TEXT        NOT NULL,
  city                TEXT,
  state               TEXT,
  country             TEXT        DEFAULT 'India',
  description         TEXT        NOT NULL,
  required_skills     TEXT[]      NOT NULL DEFAULT '{}',
  preferred_skills    TEXT[]      DEFAULT '{}',
  education_required  TEXT,
  experience_level    TEXT,
  experience_years_max INT        DEFAULT 2,
  employment_type     TEXT        DEFAULT 'full-time',
  work_arrangement    TEXT        DEFAULT 'on-site',
  salary_min          INT,
  salary_max          INT,
  salary_currency     TEXT        DEFAULT 'INR',
  salary_period       TEXT        DEFAULT 'monthly',
  application_url     TEXT,
  is_demo             BOOLEAN     DEFAULT false,
  is_active           BOOLEAN     DEFAULT true,
  source_label        TEXT,
  published_at        TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ,
  last_verified_at    TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.jobs IS 'Job listings from seed data and external job providers.';
COMMENT ON COLUMN public.jobs.external_id        IS 'Original ID from the external provider (Adzuna, Greenhouse, etc.).';
COMMENT ON COLUMN public.jobs.is_demo            IS 'TRUE for seed/demo data — never a real live vacancy.';
COMMENT ON COLUMN public.jobs.source_label       IS 'Human-readable label shown in UI (e.g. "Demo Data").';
COMMENT ON COLUMN public.jobs.experience_years_max IS 'Upper bound of experience required (0 = fresher).';

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_jobs_title             ON public.jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_city              ON public.jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active         ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_is_demo           ON public.jobs(is_demo);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level  ON public.jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_required_skills   ON public.jobs USING gin(required_skills);
CREATE INDEX IF NOT EXISTS idx_jobs_preferred_skills  ON public.jobs USING gin(preferred_skills);
CREATE INDEX IF NOT EXISTS idx_jobs_provider          ON public.jobs(provider);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at      ON public.jobs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_salary            ON public.jobs(salary_min, salary_max);

-- Composite: provider + external_id uniqueness (allows nulls for seed data)
CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_provider_external_id
  ON public.jobs(provider, external_id)
  WHERE external_id IS NOT NULL;

-- ============================================================
-- TABLE: resume_analyses
-- Stores uploaded resume content and AI analysis results.
-- Supports both authenticated users and anonymous guest sessions.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id         TEXT,                    -- Guest tracking token
  status             TEXT        NOT NULL DEFAULT 'processing'
                                  CHECK (status IN ('processing', 'completed', 'failed')),
  original_filename  TEXT,
  file_size_bytes    INT,
  raw_text           TEXT,
  structured_profile JSONB       DEFAULT '{}',
  ai_feedback        JSONB       DEFAULT '{}',
  scoring_version    TEXT        DEFAULT 'v1',
  error_message      TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Either user_id or session_id must be present
  CONSTRAINT chk_resume_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

COMMENT ON TABLE public.resume_analyses IS 'AI-extracted resume data and feedback. Supports authenticated and guest users.';
COMMENT ON COLUMN public.resume_analyses.session_id         IS 'Guest session token — used when user_id is NULL.';
COMMENT ON COLUMN public.resume_analyses.structured_profile IS 'JSON with extracted education, skills, experience, projects, certifications.';
COMMENT ON COLUMN public.resume_analyses.ai_feedback        IS 'JSON with AI-generated strengths, weaknesses, improvement suggestions.';
COMMENT ON COLUMN public.resume_analyses.scoring_version    IS 'Algorithm version tag for reproducibility.';

CREATE TRIGGER trg_resume_analyses_updated_at
  BEFORE UPDATE ON public.resume_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id    ON public.resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_session_id ON public.resume_analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_status     ON public.resume_analyses(status);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON public.resume_analyses(created_at DESC);

-- ============================================================
-- TABLE: job_matches
-- Match scores between a resume analysis and a job listing.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.job_matches (
  id                        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id               UUID         NOT NULL REFERENCES public.resume_analyses(id) ON DELETE CASCADE,
  job_id                    UUID         NOT NULL REFERENCES public.jobs(id)            ON DELETE CASCADE,
  overall_score             NUMERIC(5,2) NOT NULL,
  skills_score              NUMERIC(5,2),
  education_score           NUMERIC(5,2),
  projects_score            NUMERIC(5,2),
  role_relevance_score      NUMERIC(5,2),
  experience_score          NUMERIC(5,2),
  matched_skills            TEXT[]       DEFAULT '{}',
  missing_required_skills   TEXT[]       DEFAULT '{}',
  missing_preferred_skills  TEXT[]       DEFAULT '{}',
  unverified_requirements   TEXT[]       DEFAULT '{}',
  has_mandatory_failure     BOOLEAN      DEFAULT false,
  explanation               TEXT,
  score_breakdown           JSONB        DEFAULT '{}',
  scoring_version           TEXT         DEFAULT 'v1',
  created_at                TIMESTAMPTZ  DEFAULT NOW() NOT NULL,

  -- One match record per (analysis, job) pair
  CONSTRAINT uq_job_matches_analysis_job UNIQUE (analysis_id, job_id),

  -- Scores must be 0–100
  CONSTRAINT chk_overall_score_range      CHECK (overall_score      BETWEEN 0 AND 100),
  CONSTRAINT chk_skills_score_range       CHECK (skills_score       IS NULL OR skills_score       BETWEEN 0 AND 100),
  CONSTRAINT chk_education_score_range    CHECK (education_score    IS NULL OR education_score    BETWEEN 0 AND 100),
  CONSTRAINT chk_projects_score_range     CHECK (projects_score     IS NULL OR projects_score     BETWEEN 0 AND 100),
  CONSTRAINT chk_role_relevance_range     CHECK (role_relevance_score IS NULL OR role_relevance_score BETWEEN 0 AND 100),
  CONSTRAINT chk_experience_score_range   CHECK (experience_score   IS NULL OR experience_score   BETWEEN 0 AND 100)
);

COMMENT ON TABLE public.job_matches IS 'AI-generated match scores between a resume analysis and a job listing.';
COMMENT ON COLUMN public.job_matches.has_mandatory_failure IS 'TRUE when a hard-fail condition was triggered (e.g. degree mismatch).';
COMMENT ON COLUMN public.job_matches.score_breakdown       IS 'Detailed per-criterion scoring breakdown as JSON.';

CREATE INDEX IF NOT EXISTS idx_job_matches_analysis_id    ON public.job_matches(analysis_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_job_id         ON public.job_matches(job_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_overall_score  ON public.job_matches(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_job_matches_created_at     ON public.job_matches(created_at DESC);

-- ============================================================
-- TABLE: saved_jobs
-- User bookmarks and application status tracking.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES auth.users(id)     ON DELETE CASCADE,
  job_id             UUID        NOT NULL REFERENCES public.jobs(id)    ON DELETE CASCADE,
  analysis_id        UUID        REFERENCES public.resume_analyses(id)  ON DELETE SET NULL,
  application_status TEXT        NOT NULL DEFAULT 'interested'
                                  CHECK (application_status IN ('interested', 'applied', 'interview', 'offer', 'rejected')),
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Each user can bookmark a job only once
  CONSTRAINT uq_saved_jobs_user_job UNIQUE (user_id, job_id)
);

COMMENT ON TABLE public.saved_jobs IS 'User job bookmarks with application lifecycle tracking.';
COMMENT ON COLUMN public.saved_jobs.application_status IS 'Stage in the job application pipeline.';
COMMENT ON COLUMN public.saved_jobs.analysis_id        IS 'Optional: the resume analysis used when matching this job.';

CREATE TRIGGER trg_saved_jobs_updated_at
  BEFORE UPDATE ON public.saved_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id            ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id             ON public.saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_application_status ON public.saved_jobs(application_status);

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGN-UP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- END OF MIGRATION 001
-- ============================================================
