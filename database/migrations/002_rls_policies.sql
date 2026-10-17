-- ============================================================
-- Migration: 002_rls_policies.sql
-- Project:   AI Resume Analyzer & Job Matcher
-- Database:  Supabase PostgreSQL
-- Created:   2026-10-16
-- ============================================================
-- Run AFTER 001_initial_schema.sql
-- Enables Row Level Security on all application tables and
-- defines granular access policies.
-- ============================================================

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TABLE: profiles
-- Users can only read/write their own profile row.
-- ============================================================

-- SELECT: own row only
CREATE POLICY "profiles: user can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- INSERT: authenticated users insert their own row
CREATE POLICY "profiles: user can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: own row only
CREATE POLICY "profiles: user can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: own row only
CREATE POLICY "profiles: user can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- TABLE: jobs
-- Public read for active listings.
-- Only service_role (server-side) can insert/update/delete.
-- ============================================================

-- SELECT: any visitor (including anon) can browse active jobs
CREATE POLICY "jobs: public read active listings"
  ON public.jobs FOR SELECT
  USING (is_active = true);

-- INSERT / UPDATE / DELETE: service_role only (admin server calls)
-- These are intentionally omitted from user-facing policies;
-- use service_role key server-side for job management.

-- ============================================================
-- TABLE: resume_analyses
-- Authenticated users own their rows (user_id = auth.uid()).
-- Guest rows are accessible via session_id (server-managed).
-- ============================================================

-- SELECT: authenticated user can read own analyses
CREATE POLICY "resume_analyses: user can view own analyses"
  ON public.resume_analyses FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: authenticated user inserts with own user_id
CREATE POLICY "resume_analyses: user can create analysis"
  ON public.resume_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: own analyses only (e.g. status transitions by server)
CREATE POLICY "resume_analyses: user can update own analysis"
  ON public.resume_analyses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: own analyses only
CREATE POLICY "resume_analyses: user can delete own analysis"
  ON public.resume_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- NOTE: Guest/session-based inserts must use service_role key
-- server-side. Anon users cannot INSERT directly into this table.

-- ============================================================
-- TABLE: job_matches
-- Readable when the parent resume_analysis belongs to the user.
-- Writes are server-side only (service_role).
-- ============================================================

-- SELECT: user can view matches for analyses they own
CREATE POLICY "job_matches: user can view own matches"
  ON public.job_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.resume_analyses ra
      WHERE ra.id = job_matches.analysis_id
        AND ra.user_id = auth.uid()
    )
  );

-- INSERT: restricted to service_role (AI scoring pipeline)
-- UPDATE: restricted to service_role (score recalculation)
-- DELETE: restricted to service_role

-- ============================================================
-- TABLE: saved_jobs
-- Users fully manage their own bookmarks.
-- ============================================================

-- SELECT: own bookmarks
CREATE POLICY "saved_jobs: user can view own saved jobs"
  ON public.saved_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: authenticated user saves a job (must own the row)
CREATE POLICY "saved_jobs: user can save a job"
  ON public.saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: own row (e.g. change application_status, add notes)
CREATE POLICY "saved_jobs: user can update own saved job"
  ON public.saved_jobs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: own bookmark
CREATE POLICY "saved_jobs: user can remove saved job"
  ON public.saved_jobs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- SERVICE ROLE BYPASS
-- ============================================================
-- Supabase service_role key automatically bypasses RLS.
-- Use it server-side for:
--   • Writing job_matches (AI pipeline)
--   • Managing guest resume_analyses (session_id rows)
--   • Admin CRUD on jobs table
--   • Bulk seed data operations

-- ============================================================
-- GRANT PERMISSIONS TO AUTHENTICATED ROLE
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles        TO authenticated;
GRANT SELECT                          ON public.jobs            TO authenticated;
GRANT SELECT                          ON public.jobs            TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_analyses TO authenticated;
GRANT SELECT                          ON public.job_matches     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_jobs      TO authenticated;

-- ============================================================
-- END OF MIGRATION 002
-- ============================================================
