-- Align the initial Supabase schema with fields used by the FastAPI runtime.
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS role_category TEXT NOT NULL DEFAULT 'Entry-level';

UPDATE public.jobs SET role_category = CASE
  WHEN title ILIKE '%market%' OR title ILIKE '%SEO%' OR title ILIKE '%content%' THEN 'Digital Marketing'
  WHEN title ILIKE '%business development%' OR title ILIKE '%BDR%' THEN 'Business Development'
  WHEN title ILIKE '%sales%' THEN 'Sales'
  WHEN title ILIKE '%recruit%' OR title ILIKE '% HR %' OR title ILIKE 'HR %' THEN 'Human Resources'
  WHEN title ILIKE '%analyst%' THEN 'Business Analytics'
  WHEN title ILIKE '%finance%' OR title ILIKE '%account%' THEN 'Finance & Accounting'
  WHEN title ILIKE '%operation%' OR title ILIKE '%coordinator%' THEN 'Operations'
  WHEN title ILIKE '%support%' OR title ILIKE '%customer success%' THEN 'Customer Support'
  WHEN title ILIKE '%test%' OR title ILIKE '%QA%' THEN 'Quality Assurance'
  WHEN title ILIKE '%developer%' OR title ILIKE '%engineer%' THEN 'Software Engineering'
  ELSE 'Entry-level'
END
WHERE provider = 'seed';

ALTER TABLE public.resume_analyses
  ADD COLUMN IF NOT EXISTS word_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS warnings JSONB NOT NULL DEFAULT '[]'::jsonb;
