import axios, { AxiosError } from 'axios';
import { getSessionId } from './utils';
import type {
  Job,
  JobFilters,
  JobListResponse,
  ResumeAnalysis,
  StructuredProfile,
  MatchResult,
  SkillGapReport,
  SavedJob,
  SavedJobStatus,
  UserProfile,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for clear error extraction
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const data = error.response?.data as { detail?: string; error?: string } | undefined;
    const message = data?.detail || data?.error || error.message || 'An unexpected server error occurred';
    return Promise.reject(new Error(message));
  }
);

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.headers.set('X-Session-Id', getSessionId());
    config.headers.set('X-User-Id', getSessionId());
  }
  return config;
});

// ─── Job Endpoints ──────────────────────────────────────────────────────────

export const getJobs = (params?: JobFilters) =>
  api.get<JobListResponse>('/api/v1/jobs', { params });

export const getJob = (id: string) =>
  api.get<Job>(`/api/v1/jobs/${id}`);

// ─── Resume Endpoints ────────────────────────────────────────────────────────

export const analyzeResume = (file: File, sessionId?: string) => {
  const form = new FormData();
  form.append('file', file);
  form.append('session_id', sessionId || getSessionId());
  return api.post<ResumeAnalysis>('/api/v1/resumes/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
};

export const getAnalysis = (analysisId: string) =>
  api.get<ResumeAnalysis>(`/api/v1/resumes/${analysisId}`);

export const updateAnalysis = (analysisId: string, profile: StructuredProfile) =>
  api.put<ResumeAnalysis>(`/api/v1/resumes/${analysisId}`, profile);

export const deleteAnalysis = (analysisId: string) =>
  api.delete(`/api/v1/resumes/${analysisId}`);

// ─── Match Endpoints ─────────────────────────────────────────────────────────

export const createMatches = (data: { analysis_id: string; job_ids?: string[]; filters?: JobFilters }) =>
  api.post<MatchResult[]>('/api/v1/matches/batch', data);

export const getMatch = (matchId: string) =>
  api.get<MatchResult>(`/api/v1/matches/${matchId}`);

export const getMatchForJob = (jobId: string, analysisId: string) =>
  api.get<MatchResult>(`/api/v1/matches/by-job/${jobId}`, {
    params: { analysis_id: analysisId },
  });

export const getSkillGaps = (matchId: string) =>
  api.get<SkillGapReport>(`/api/v1/matches/${matchId}/skill-gaps`);

// ─── Saved Jobs Endpoints ────────────────────────────────────────────────────

export const getSavedJobs = () =>
  api.get<SavedJob[]>('/api/v1/saved-jobs');

export const saveJob = (data: { job_id: string; status?: SavedJobStatus; notes?: string }) =>
  api.post<SavedJob>('/api/v1/saved-jobs', data);

export const unsaveJob = (jobId: string) =>
  api.delete(`/api/v1/saved-jobs/${jobId}`);

export const updateJobStatus = (jobId: string, status: SavedJobStatus) =>
  api.patch<SavedJob>(`/api/v1/saved-jobs/${jobId}`, { status });

// ─── Profile Endpoints ───────────────────────────────────────────────────────

export const getProfile = () =>
  api.get<UserProfile>('/api/v1/profile');

export const updateProfile = (data: UserProfile) =>
  api.put<UserProfile>('/api/v1/profile', data);
