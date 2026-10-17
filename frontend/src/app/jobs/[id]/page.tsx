'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { MatchScoreRing } from '@/components/jobs/MatchScoreRing';
import { useAnalysis, useSavedJobs } from '@/context/AppContext';
import { getJob, getMatchForJob, getSkillGaps } from '@/lib/api';
import { formatSalary } from '@/lib/utils';
import type { Job, MatchResult, SkillGapReport } from '@/lib/types';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const { analysisId } = useAnalysis();
  const { isSaved, saveJob, unsaveJob } = useSavedJobs();

  const [job, setJob] = useState<Job | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGapReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookmarked = jobId ? isSaved(jobId) : false;

  useEffect(() => {
    async function loadJobAndMatch() {
      if (!jobId) return;
      setLoading(true);
      setError(null);
      try {
        const jobRes = await getJob(jobId);
        setJob(jobRes.data);

        // If resume active, fetch or calculate match
        if (analysisId) {
          try {
            const matchRes = await getMatchForJob(jobId, analysisId);
            setMatch(matchRes.data);

            if (matchRes.data.match_id) {
              const gapRes = await getSkillGaps(matchRes.data.match_id);
              setSkillGaps(gapRes.data);
            }
          } catch (mErr) {
            console.warn('Could not calculate match for job', mErr);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Job not found.');
      } finally {
        setLoading(false);
      }
    }
    loadJobAndMatch();
  }, [jobId, analysisId]);

  const handleBookmarkToggle = async () => {
    if (!jobId) return;
    if (bookmarked) {
      await unsaveJob(jobId);
    } else {
      await saveJob(jobId);
    }
  };

  if (loading) {
    return (
      <PageWrapper maxWidth="lg">
        <div className="space-y-6 py-8">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !job) {
    return (
      <PageWrapper maxWidth="md">
        <Card className="p-8 text-center space-y-4 my-12">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-ink">Vacancy Not Found</h2>
          <p className="text-xs text-ink-muted">{error || 'This job listing may have expired or is unavailable.'}</p>
          <Link href="/jobs">
            <Button variant="secondary" size="sm">
              Back to Job Search
            </Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="lg">
      <div className="space-y-8 pb-12">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to job search
          </button>
        </div>

        {/* Header Job Overview Card */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-surface-border">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {job.is_demo && <DemoBadge />}
                {job.role_category && (
                  <Badge variant="brand" className="text-xs">
                    {job.role_category}
                  </Badge>
                )}
                {job.work_arrangement && (
                  <span className="text-xs font-medium text-ink-muted capitalize bg-gray-100 px-2.5 py-0.5 rounded-md">
                    {job.work_arrangement}
                  </span>
                )}
                <span className="text-xs font-medium text-ink-muted capitalize bg-gray-100 px-2.5 py-0.5 rounded-md">
                  {job.experience_level || 'Fresher (0–2 yrs)'}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {job.title}
                </h1>
                <p className="text-base font-semibold text-brand-700 mt-1">{job.company}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-light pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-ink-muted" /> {job.location}
                </span>
                {(job.salary_min || job.salary_max) && (
                  <span className="flex items-center gap-1.5 font-semibold text-ink">
                    <IndianRupee className="w-4 h-4 text-accent-700" />
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <Briefcase className="w-4 h-4" /> {job.employment_type || 'Full-time'}
                </span>
              </div>
            </div>

            {/* Actions: Apply & Save */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <Button
                variant={bookmarked ? 'secondary' : 'outline'}
                size="md"
                onClick={handleBookmarkToggle}
                leftIcon={<Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current text-brand-600' : ''}`} />}
              >
                {bookmarked ? 'Bookmarked' : 'Save Job'}
              </Button>

              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
                    Apply Now
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Transparent Scoring Summary or Upload Prompt */}
          {analysisId && match ? (
            <div className="mt-6 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-linear-to-r from-brand-50/60 to-white border border-brand-100">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                      Deterministic Profile Match
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink">
                    Compatibility: {match.overall_score}%
                  </h3>
                  <p className="text-xs text-ink-light max-w-lg leading-relaxed">
                    {match.explanation}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center">
                  <MatchScoreRing score={match.overall_score} size="lg" />
                  <span className="text-[10px] text-ink-muted mt-1 font-semibold uppercase">Scoring {match.scoring_version || 'v1'}</span>
                </div>
              </div>

              {/* 5-part score breakdown table */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Transparent Weighted Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <span className="text-[11px] text-ink-muted block">Relevant Skills (35%)</span>
                    <span className="text-sm font-bold text-ink">{match.skills_score}%</span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-1" style={{ width: `${match.skills_score}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <span className="text-[11px] text-ink-muted block">Academics (25%)</span>
                    <span className="text-sm font-bold text-ink">{match.education_score}%</span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-1" style={{ width: `${match.education_score}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <span className="text-[11px] text-ink-muted block">Projects (20%)</span>
                    <span className="text-sm font-bold text-ink">{match.projects_score}%</span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-1" style={{ width: `${match.projects_score}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <span className="text-[11px] text-ink-muted block">Role Relevance (10%)</span>
                    <span className="text-sm font-bold text-ink">{match.role_relevance_score}%</span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-1" style={{ width: `${match.role_relevance_score}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <span className="text-[11px] text-ink-muted block">Experience (10%)</span>
                    <span className="text-sm font-bold text-ink">{match.experience_score}%</span>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-1" style={{ width: `${match.experience_score}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-amber-900">Want to see your match score for this job?</span>
                <p className="text-amber-800 text-[11px]">
                  Upload your resume to calculate your exact percentage fit, demonstrated skills, and learning gaps.
                </p>
              </div>
              <Link href="/resume">
                <Button size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                  Analyze Resume
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Skill Gap Analysis Section */}
        {match && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-600" />
              Skill Gap & Requirement Report
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Demonstrated Skills */}
              <Card className="p-5 border-green-200 bg-green-50/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
                    Demonstrated Skills ({match.matched_skills.length})
                  </h4>
                </div>
                {match.matched_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {match.matched_skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-800 border border-green-200"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted">
                    No matching skills detected from your resume for this position.
                  </p>
                )}
              </Card>

              {/* Required Skills Not Demonstrated */}
              <Card className="p-5 border-amber-200 bg-amber-50/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
                    Required — Not Demonstrated ({match.missing_required_skills.length})
                  </h4>
                </div>
                {match.missing_required_skills.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-ink-muted">
                      Not found in your resume text. Confirm your experience or add to profile:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.missing_required_skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200"
                        >
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-green-700 font-medium">
                    ✓ All required skills are demonstrated in your profile!
                  </p>
                )}
              </Card>

              {/* Preferred Skills Not Demonstrated */}
              <Card className="p-5 border-blue-200 bg-blue-50/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
                    Bonus / Preferred Skills ({match.missing_preferred_skills.length})
                  </h4>
                </div>
                {match.missing_preferred_skills.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-ink-muted">
                      Not mandatory, but learning these will increase your interview readiness:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.missing_preferred_skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-brand-700 border border-brand-200"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted">No additional preferred skills listed.</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Job Description & Eligibility Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-ink">Role Overview & Responsibilities</h3>
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed whitespace-pre-line">
                {job.description}
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">All Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-xs bg-gray-100 text-ink font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.preferred_skills && job.preferred_skills.length > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">Preferred / Nice-to-Have</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.preferred_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs bg-brand-50 text-brand-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-ink">Eligibility & Details</h4>

              <div className="space-y-3">
                <div>
                  <span className="text-ink-muted block text-[11px]">Academic Requirement</span>
                  <span className="font-semibold text-ink capitalize">
                    {job.education_requirement || job.education_required || 'Any Bachelor degree'}
                  </span>
                </div>

                <div>
                  <span className="text-ink-muted block text-[11px]">Experience Window</span>
                  <span className="font-semibold text-ink capitalize">
                    {job.experience_level || 'Fresher'} (Max {job.max_experience_years || 2} years)
                  </span>
                </div>

                <div>
                  <span className="text-ink-muted block text-[11px]">Work Arrangement</span>
                  <span className="font-semibold text-ink capitalize">
                    {job.work_arrangement || 'On-site'}
                  </span>
                </div>

                <div>
                  <span className="text-ink-muted block text-[11px]">Data Source</span>
                  <span className="font-semibold text-ink">
                    {job.source_label || (job.is_demo ? 'Demonstration Listing' : 'Verified Partner')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                {job.apply_url && (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="sm" className="w-full" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Visit Application Page
                    </Button>
                  </a>
                )}
              </div>
            </Card>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-ink-muted space-y-1.5">
              <span className="font-bold text-ink flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Candidate Notice
              </span>
              <p className="leading-relaxed text-[11px]">
                Matches are advisory guidance computed by deterministic weighted criteria. Absence of a skill does not mean you lack capability — feel free to update your resume and rerun analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
