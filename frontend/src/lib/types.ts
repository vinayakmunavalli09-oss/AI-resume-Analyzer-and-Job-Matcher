// TypeScript types matching backend schemas exactly

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  city?: string;
  state?: string;
  description: string;
  role_category?: string;
  category?: string;
  required_skills: string[];
  preferred_skills: string[];
  education_required?: string;
  education_requirement?: string;
  experience_level?: string;
  min_experience_years?: number;
  max_experience_years?: number;
  experience_years_max?: number;
  employment_type?: string;
  work_arrangement?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  application_url?: string;
  apply_url?: string;
  is_demo: boolean;
  source_label?: string;
  match_score?: number;
  posted_at?: string;
}

export interface Education {
  degree?: string;
  field?: string;
  institution?: string;
  year?: string;
  graduation_year?: number;
  percentage?: string;
  gpa?: number;
  cgpa?: number;
}

export interface Internship {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface Project {
  name?: string;
  description?: string;
  technologies?: string[];
  url?: string;
}

export interface Certification {
  name?: string;
  issuer?: string;
  year?: string;
  date?: string;
  url?: string;
}

export interface StructuredProfile {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  education: Education[];
  skills: string[];
  work_experience: Internship[];
  internships: Internship[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  summary?: string;
  missing_sections: string[];
}

export interface Suggestion {
  category: string;
  issue: string;
  recommendation: string;
}

export interface ResumeFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: Suggestion[];
  overall_score?: number;
  readability?: string;
}

export interface ResumeAnalysis {
  analysis_id: string;
  session_id?: string;
  structured_profile: StructuredProfile;
  feedback: ResumeFeedback;
  warnings: string[];
  word_count?: number;
  created_at?: string;
  file_name?: string;
}

export interface ScoreCategory {
  score: number;
  weight: number;
}

export interface MatchResult {
  match_id: string;
  analysis_id: string;
  job_id: string;
  overall_score: number;
  skills_score: number;
  education_score: number;
  projects_score: number;
  role_relevance_score: number;
  experience_score: number;
  matched_skills: string[];
  missing_required_skills: string[];
  missing_preferred_skills: string[];
  has_mandatory_failure: boolean;
  explanation: string;
  score_breakdown: Record<string, ScoreCategory | any>;
  scoring_version?: string;
}

export interface SkillGapItem {
  skill: string;
  status: string;
  category: string;
  recommendation: string;
}

export interface SkillGapReport {
  matched_skills: string[];
  missing_required: SkillGapItem[];
  missing_preferred: SkillGapItem[];
  total_required: number;
  total_matched: number;
  coverage_percent: number;
}

export type SavedJobStatus = 'interested' | 'applied' | 'interview' | 'offer' | 'rejected' | 'saved' | 'interviewing' | 'offered' | 'withdrawn';

export interface SavedJob {
  id: string;
  job_id: string;
  job: Job;
  application_status: SavedJobStatus;
  status?: SavedJobStatus;
  notes?: string;
  saved_at?: string;
  updated_at?: string;
  match_score?: number;
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  location?: string;
  experience_level?: string;
  target_roles?: string[];
  preferred_locations?: string[];
  skills?: string[];
  graduation_year?: number;
  preferred_work_arrangement?: string[];
}

export interface JobFilters {
  q?: string;
  search?: string;
  category?: string;
  role_category?: string;
  location?: string;
  experience_level?: string;
  work_arrangement?: string;
  employment_type?: string;
  page?: number;
  page_size?: number;
  limit?: number;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface PaginatedResponse<T> {
  jobs?: T[];
  items?: T[];
  total: number;
  page: number;
  page_size?: number;
  limit?: number;
  has_more?: boolean;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
