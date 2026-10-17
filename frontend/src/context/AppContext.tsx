'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type { ResumeAnalysis, SavedJob, SavedJobStatus, UserProfile } from '@/lib/types';
import { storeAnalysisId, getStoredAnalysisId, clearStoredAnalysis } from '@/lib/utils';
import * as api from '@/lib/api';

// ─── Analysis Context ────────────────────────────────────────────────────────

interface AnalysisContextValue {
  analysis: ResumeAnalysis | null;
  analysisId: string | null;
  setAnalysis: (a: ResumeAnalysis | null) => void;
  clearAnalysis: () => void;
  isLoading: boolean;
  error: string | null;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

// ─── Saved Jobs Context ──────────────────────────────────────────────────────

interface SavedJobsContextValue {
  savedJobs: SavedJob[];
  isSaved: (jobId: string) => boolean;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  updateStatus: (jobId: string, status: SavedJobStatus) => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextValue | undefined>(undefined);

// ─── Profile Context ─────────────────────────────────────────────────────────

interface ProfileContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  saveProfile: (p: UserProfile) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

// ─── App Provider ────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // Analysis state
  const [analysis, setAnalysisState] = useState<ResumeAnalysis | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [analysisLoading] = useState(false);
  const [analysisError] = useState<string | null>(null);

  // Saved jobs state
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  // Profile state
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Hydrate analysisId from sessionStorage
  useEffect(() => {
    const stored = getStoredAnalysisId();
    if (stored) setAnalysisId(stored);
  }, []);

  const setAnalysis = useCallback((a: ResumeAnalysis | null) => {
    setAnalysisState(a);
    if (a) {
      storeAnalysisId(a.analysis_id);
      setAnalysisId(a.analysis_id);
    } else {
      setAnalysisId(null);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisState(null);
    setAnalysisId(null);
    clearStoredAnalysis();
  }, []);

  // ── Saved jobs helpers ──────────────────────────────────────────────────

  const loadSavedJobs = useCallback(async () => {
    setSavedLoading(true);
    try {
      const res = await api.getSavedJobs();
      setSavedJobs(res.data);
    } catch {
      // Fallback: load from localStorage
      try {
        const local = localStorage.getItem('saved_jobs');
        if (local) setSavedJobs(JSON.parse(local));
      } catch {
        // ignore
      }
    } finally {
      setSavedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const isSaved = useCallback(
    (jobId: string) => savedJobs.some((sj) => sj.job_id === jobId),
    [savedJobs]
  );

  const handleSaveJob = useCallback(
    async (jobId: string) => {
      try {
        const res = await api.saveJob({ job_id: jobId, status: 'interested' });
        setSavedJobs((prev) => [...prev, res.data]);
      } catch {
        // Fallback: store locally
        const newEntry: SavedJob = {
          id: `local_${Date.now()}`,
          job_id: jobId,
          job: { id: jobId } as SavedJob['job'],
          application_status: 'interested',
          status: 'interested',
          saved_at: new Date().toISOString(),
        };
        setSavedJobs((prev) => {
          const updated = [...prev, newEntry];
          localStorage.setItem('saved_jobs', JSON.stringify(updated));
          return updated;
        });
      }
    },
    []
  );

  const handleUnsaveJob = useCallback(async (jobId: string) => {
    try {
      await api.unsaveJob(jobId);
    } catch {
      // ignore API error, still remove locally
    }
    setSavedJobs((prev) => {
      const updated = prev.filter((sj) => sj.job_id !== jobId);
      localStorage.setItem('saved_jobs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleUpdateStatus = useCallback(
    async (jobId: string, status: SavedJobStatus) => {
      try {
        await api.updateJobStatus(jobId, status);
      } catch {
        // ignore
      }
      setSavedJobs((prev) =>
        prev.map((sj) => (sj.job_id === jobId ? { ...sj, application_status: status, status } : sj))
      );
    },
    []
  );

  // ── Profile helpers ─────────────────────────────────────────────────────

  const saveProfile = useCallback(async (p: UserProfile) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await api.updateProfile(p);
      setProfileState(res.data);
      localStorage.setItem('user_profile', JSON.stringify(res.data));
    } catch (err) {
      // Fallback: store locally
      setProfileState(p);
      localStorage.setItem('user_profile', JSON.stringify(p));
      setProfileError(null); // Silently succeed for offline mode
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Hydrate profile from localStorage
  useEffect(() => {
    try {
      const local = localStorage.getItem('user_profile');
      if (local) setProfileState(JSON.parse(local));
    } catch {
      // ignore
    }
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        analysisId,
        setAnalysis,
        clearAnalysis,
        isLoading: analysisLoading,
        error: analysisError,
      }}
    >
      <SavedJobsContext.Provider
        value={{
          savedJobs,
          isSaved,
          saveJob: handleSaveJob,
          unsaveJob: handleUnsaveJob,
          updateStatus: handleUpdateStatus,
          refresh: loadSavedJobs,
          isLoading: savedLoading,
        }}
      >
        <ProfileContext.Provider
          value={{
            profile,
            setProfile: setProfileState,
            saveProfile,
            isLoading: profileLoading,
            error: profileError,
          }}
        >
          {children}
        </ProfileContext.Provider>
      </SavedJobsContext.Provider>
    </AnalysisContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AppProvider');
  return ctx;
}

export function useSavedJobs() {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) throw new Error('useSavedJobs must be used within AppProvider');
  return ctx;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within AppProvider');
  return ctx;
}
