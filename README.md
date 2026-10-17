# AI Resume Analyzer and Job Matcher

A fresher-first career guidance demo for candidates in India. The app extracts a profile from PDF/DOCX resumes, gives structured feedback, calculates explainable job matches, and reports skills that are not demonstrated in the resume.

## What is implemented

- Next.js 14 App Router frontend with TypeScript, Tailwind, and responsive pages for landing, dashboard, resume analysis, job search, profile preferences, saved jobs, and job details.
- FastAPI backend with in-memory demonstration storage and optional Supabase access, server-side NVIDIA NIM client, PDF/DOCX parsing, structured education, skills, work experience, internships, projects, certifications, deterministic resume fallback, match scoring, skill-gap reports, bookmarks, and application statuses.
- 60 clearly labeled fictional demo listings. They are not real vacancies, are not verified, and do not have real application destinations.
- A guest session capability is generated in the browser and required to access that session's resume report and matches. This is a local demo access model, not user accounts or production authentication.
- Uploaded file bytes are parsed in memory and are not retained. Extracted profile/report data is held in process memory by default, or in Supabase if configured, until deleted. Browser session storage holds the current report ID; the private guest capability is stored in local storage.

## Requirements

- Node.js 20 or compatible and npm.
- Python 3.11 or compatible.
- Optional NVIDIA NIM API key for AI extraction and feedback. Without it, deterministic extraction and feedback remain available and are marked as such.
- Optional Supabase project. The current frontend is guest based; do not treat its client supplied guest identifier as authenticated identity for a public deployment.

## Local setup

Copy `.env.example` to `backend/.env` and set only credentials you have obtained. Never commit the copied file. From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 3000
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open ` http://127.0.0.1:3000`. The frontend reads `NEXT_PUBLIC_API_BASE_URL` (default ` http://127.0.0.1:3000`). The API health endpoint is ` http://127.0.0.1:3000`; interactive API docs are at `/docs`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NVIDIA_API_KEY` | NVIDIA NIM credential, kept on backend only |
| `NVIDIA_BASE_URL` | Defaults to `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_MODEL` | Defaults to `nvidia/nemotron-3.5-lightning-30b-a3b` |
| `SUPABASE_URL` | Optional Supabase project URL |
| `SUPABASE_SECRET_KEY` | Backend-only Supabase key; currently enables service-side persistence |
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL exposed to the browser; contains no credential |
| `BACKEND_CORS_ORIGINS` | Comma-separated allowed browser origins |
| `BACKEND_HOST`, `BACKEND_PORT` | Backend bind address and port for `python main.py` |
| `MAX_FILE_SIZE_MB` | Upload size cap (default 5 MB) |

NVIDIA's official model page documents the OpenAI-compatible `https://integrate.api.nvidia.com/v1` endpoint and model identifier `nvidia/nemotron-3.5-lightning-30b-a3b`. Keep `NVIDIA_API_KEY` only in the ignored `backend/.env`; the committed environment templates intentionally leave it blank. See [NVIDIA's Nemotron 3.5 Lightning model page](https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b) and [NIM LLM API reference](https://docs.api.nvidia.com/nim/reference/llm-apis).

No job listing API is implemented. Adzuna credentials are intentionally omitted: this demo uses explicitly fictional seed listings.

## Database setup

For Supabase, run migrations in order:

1. `database/migrations/001_initial_schema.sql`
2. `database/migrations/002_rls_policies.sql`
3. `database/migrations/003_runtime_columns.sql`
4. `database/seeds/001_jobs_seed.sql`

The RLS policies expect Supabase Auth identities. The current browser app has no sign-in flow; consequently profile and saved-job persistence for real users is not production-ready. Use the in-memory mode for local demos, or implement and verify Supabase Auth ownership before enabling persisted private user records in a deployment. Never expose `SUPABASE_SECRET_KEY` in a `NEXT_PUBLIC_*` variable.

## API routes

- `GET /health`
- `GET /api/v1/jobs` and `GET /api/v1/jobs/{job_id}`
- `POST /api/v1/resumes/analyze`, `GET/PUT/DELETE /api/v1/resumes/{analysis_id}`
- `POST /api/v1/matches`, `POST /api/v1/matches/batch`, `GET /api/v1/matches/{match_id}`, `GET /api/v1/matches/{match_id}/skill-gaps`
- `GET/POST /api/v1/saved-jobs`, `PATCH/DELETE /api/v1/saved-jobs/{job_id}`
- `GET/PUT /api/v1/profile`

Resume and match report routes require the `X-Session-Id` capability created by the frontend. This protects casual cross-session access but is not a substitute for authenticated accounts or a reviewed production security model.

## Validation

- Backend tests: `cd backend; .\.venv\Scripts\python.exe -m unittest discover -s tests -v`
  - Result: 22 tests executed across API endpoints, matching engine, resume parser, and security/privacy — all 22 passed (OK).
- Live API end-to-end verification: `cd backend; .\.venv\Scripts\python.exe tests/verify_live.py`
  - Result: Passed (Health, jobs catalog, resume parsing/extraction, matching engine, skill gap generation, saved jobs lifecycle, and privacy deletion).
- Frontend production build: `cd frontend; npm run build`
  - Result: Successfully compiled and optimized all static and dynamic pages with zero errors.
- Frontend runtime verification: `cd frontend; npm run start -- -p 3000`
  - Result: All routes (`/`, `/dashboard`, `/resume`, `/jobs`, `/jobs/[id]`, `/saved`, `/profile`) verified returning HTTP 200 OK.


## Privacy and limitations

- Resumes can contain sensitive personal information. The original upload is not saved, but the extracted report may include name, email, phone, education, and skills.
- Delete the report from its analysis page to remove its report and associated matches.
- Guest reports in in-memory mode disappear when the backend process restarts. Supabase persistence requires a configured secret key and the auth/ownership work described above.
- Demo scores are based on documented initial weights (skills 35%, education 25%, projects 20%, role relevance 10%, experience 10%). These are product hypotheses, not scientifically validated predictors.
- A skill absent from the resume is reported as not demonstrated, not as proof the candidate lacks it.
- No deployment has been performed.
