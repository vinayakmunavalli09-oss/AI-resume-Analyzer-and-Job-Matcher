'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { MatchScoreRing } from '@/components/jobs/MatchScoreRing';
import { useAnalysis, useSavedJobs } from '@/context/AppContext';
import { getJobs, createMatches } from '@/lib/api';
import type { Job, MatchResult } from '@/lib/types';
import {
  FileText,
  Briefcase,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Compass,
} from 'lucide-react';

export default function DashboardPage() {
  const { analysis, analysisId } = useAnalysis();
  const { savedJobs } = useSavedJobs();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load some sample jobs
        const res = await getJobs({ page_size: 6 });
        const jobs = res.data.jobs || [];
        setTotalJobs(res.data.total || jobs.length);
        setRecentJobs(jobs);

        // If an analysis exists, run matching against these jobs
        if (analysisId) {
          try {
            const matchRes = await createMatches({
              analysis_id: analysisId,
              job_ids: jobs.map((j) => j.id),
            });
            setMatches(matchRes.data || []);
          } catch {
            // gracefully fallback
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard jobs', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [analysisId]);

  const profile = analysis?.structured_profile;
  const skillsCount = profile?.skills?.length || 0;
  const projectsCount = profile?.projects?.length || 0;

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
              <Compass className="w-3.5 h-3.5" /> Candidate Career Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              {profile?.name ? `Welcome back, ${profile.name}` : 'Welcome, Job Seeker'}
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              {analysisId
                ? 'Your resume profile is active. Review job matches and skill gaps below.'
                : 'Upload your resume to calculate personalized match scores against open vacancies.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/resume">
              <Button size="md" leftIcon={<FileText className="w-4 h-4" />}>
                {analysisId ? 'Update Resume' : 'Analyze Resume'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-ink-muted">Resume Profile</p>
              <h3 className="text-lg font-bold text-ink">
                {analysisId ? 'Active & Analyzed' : 'Not Uploaded'}
              </h3>
              <p className="text-[11px] text-ink-light">
                {analysisId ? `${skillsCount} skills • ${projectsCount} projects` : 'Get started in 1 min'}
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-ink-muted">Available Vacancies</p>
              <h3 className="text-lg font-bold text-ink">
                {loading ? 'Loading...' : `${totalJobs} Demo Listings`}
              </h3>
              <p className="text-[11px] text-ink-light">Clearly labeled sample opportunities</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-ink-muted">Saved & Tracked</p>
              <h3 className="text-lg font-bold text-ink">{savedJobs.length} Opportunities</h3>
              <Link href="/saved" className="text-[11px] text-brand-600 hover:underline font-medium">
                View saved tracker →
              </Link>
            </div>
          </Card>
        </div>

        {/* Onboarding Callout if no resume analyzed */}
        {!analysisId && (
          <div className="p-6 rounded-2xl bg-linear-to-r from-brand-50 to-white border border-brand-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Fresher Onboarding</span>
              </div>
              <h3 className="text-base font-bold text-ink">Upload your college resume to unlock match percentages</h3>
              <p className="text-xs text-ink-muted max-w-xl">
                We accept PDF and DOCX files. Our engine extracts your education, projects, and demonstrated skills safely without executing files.
              </p>
            </div>
            <Link href="/resume" className="shrink-0">
              <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Upload & Analyze
              </Button>
            </Link>
          </div>
        )}

        {/* Recommended Roles Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Popular Fresher Roles in India</h2>
            <Link href="/jobs" className="text-xs font-semibold text-brand-600 hover:underline">
              Explore All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { title: 'Business Analyst Trainee', desc: 'SQL, Excel, Reporting' },
              { title: 'Digital Marketing Trainee', desc: 'SEO, Content, Analytics' },
              { title: 'Business Development (BDE)', desc: 'Client relations, Sales' },
              { title: 'HR Recruiter / Trainee', desc: 'Talent sourcing, Ops' },
            ].map((role) => (
              <Link
                key={role.title}
                href={`/jobs?role_category=${encodeURIComponent(role.title.split(' ')[0])}`}
                className="p-4 rounded-xl border border-surface-border bg-white hover:border-brand-300 hover:shadow-xs transition"
              >
                <h4 className="text-xs font-bold text-ink mb-1">{role.title}</h4>
                <p className="text-[11px] text-ink-muted">{role.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured / Recent Matches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                {analysisId ? 'Your Top Recommended Matches' : 'Latest Entry-Level Postings'}
              </h2>
              <p className="text-xs text-ink-muted">
                {analysisId
                  ? 'Sorted by your personal skills, education, and project compatibility.'
                  : 'Demonstrated fresher positions across India.'}
              </p>
            </div>
            <Link href="/jobs">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Vacancies
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentJobs.slice(0, 4).map((job) => {
                const match = matches.find((m) => m.job_id === job.id);
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    matchScore={match?.overall_score}
                    matchedSkills={match?.matched_skills}
                    missingSkills={match?.missing_required_skills}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
