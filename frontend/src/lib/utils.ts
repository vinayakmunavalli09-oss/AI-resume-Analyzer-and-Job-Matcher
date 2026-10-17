import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a match score to a percentage string */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/** Get color class based on match score */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent-600';
  if (score >= 60) return 'text-brand-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-500';
}

/** Get background color class based on match score */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-accent-500';
  if (score >= 60) return 'bg-brand-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

/** Get label for match score */
export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Strong Match';
  if (score >= 55) return 'Good Match';
  if (score >= 40) return 'Moderate Match';
  return 'Low Match';
}

/** Format salary range */
export function formatSalary(
  min?: number,
  max?: number,
  currency = 'INR'
): string {
  if (!min && !max) return 'Salary not specified';
  const fmt = (n: number) => {
    if (currency === 'INR') {
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      return `₹${n.toLocaleString()}`;
    }
    return `$${n.toLocaleString()}`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

/** Format date relative to now */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Truncate text to given length */
export function truncate(text: string, maxLen = 120): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

/** Get initials from a name */
export function getInitials(name?: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Convert experience_level to readable label */
export function formatExperienceLevel(level?: string): string {
  const map: Record<string, string> = {
    fresher: 'Fresher (0 years)',
    '0-1': '0–1 year',
    '1-2': '1–2 years',
    '2-5': '2–5 years',
    '5+': '5+ years',
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level',
  };
  return level ? (map[level] ?? capitalize(level)) : 'Not specified';
}

/** Convert work arrangement to readable label */
export function formatWorkArrangement(arrangement?: string): string {
  const map: Record<string, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
    'on-site': 'On-site',
    wfh: 'Work From Home',
  };
  return arrangement ? (map[arrangement.toLowerCase()] ?? capitalize(arrangement)) : '';
}

/** Get or generate a session ID */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('resume_session_id');
  if (!id) {
    id = `session_${crypto.randomUUID()}${crypto.randomUUID()}`;
    localStorage.setItem('resume_session_id', id);
  }
  return id;
}

/** Store analysis ID in sessionStorage */
export function storeAnalysisId(id: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('analysis_id', id);
  }
}

/** Retrieve analysis ID from sessionStorage */
export function getStoredAnalysisId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('analysis_id');
}

/** Clear stored analysis */
export function clearStoredAnalysis(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('analysis_id');
    localStorage.removeItem('resume_session_id');
  }
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Validate file for resume upload */
export function validateResumeFile(file: File): string | null {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF and DOCX files are supported.';
  }
  if (file.size > maxSize) {
    return `File size must be less than 5MB. Your file is ${formatFileSize(file.size)}.`;
  }
  return null;
}

/** Score breakdown label map */
export const SCORE_LABELS: Record<string, string> = {
  skills_score: 'Skills Match',
  education_score: 'Education',
  projects_score: 'Projects',
  role_relevance_score: 'Role Relevance',
  experience_score: 'Experience',
};

/** Saved job status config */
export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  interested: { label: 'Interested', color: 'text-brand-700', bg: 'bg-brand-50' },
  applied: { label: 'Applied', color: 'text-amber-700', bg: 'bg-amber-50' },
  interview: { label: 'Interview', color: 'text-purple-700', bg: 'bg-purple-50' },
  offer: { label: 'Offer', color: 'text-accent-700', bg: 'bg-accent-50' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50' },
};
