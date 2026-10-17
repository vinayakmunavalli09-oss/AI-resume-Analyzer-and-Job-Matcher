'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { useAnalysis } from '@/context/AppContext';
import { getJobs, createMatches } from '@/lib/api';
import type { Job, MatchResult } from '@/lib/types';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'All Roles',
  'Software Engineering',
  'Business Analytics',
  'Digital Marketing',
  'Business Development',
  'Sales',
  'Human Resources',
  'Operations',
  'Customer Support',
  'Finance & Accounting',
  'Quality Assurance',
];

const LOCATIONS = [
  'All Locations',
  'Bangalore',
  'Pune',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Remote',
];

const WORK_ARRANGEMENTS = ['All', 'on-site', 'hybrid', 'remote'];

export default function JobsPage() {
  const { analysisId } = useAnalysis();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<Record<string, MatchResult>>({});
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Roles');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedArrangement, setSelectedArrangement] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'recent'>('match');

  // Load all jobs
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const res = await getJobs({ page_size: 100 });
        const jobList = res.data.jobs || [];
        setJobs(jobList);

        // If resume is analyzed, compute matches for all jobs
        if (analysisId && jobList.length > 0) {
          setMatchingLoading(true);
          try {
            const matchRes = await createMatches({
              analysis_id: analysisId,
              job_ids: jobList.map((j) => j.id),
            });
            const matchMap: Record<string, MatchResult> = {};
            (matchRes.data || []).forEach((m) => {
              matchMap[m.job_id] = m;
            });
            setMatches(matchMap);
          } catch (mErr) {
            console.error('Match calculation error:', mErr);
          } finally {
            setMatchingLoading(false);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load jobs. Ensure backend server is running on port 8000.');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [analysisId]);

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search text
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesText =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.required_skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Category
      if (selectedCategory !== 'All Roles') {
        const cat = (job.role_category || job.category || '').toLowerCase();
        if (!cat.includes(selectedCategory.toLowerCase()) && !job.title.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Location
      if (selectedLocation !== 'All Locations') {
        const loc = (job.location || job.city || '').toLowerCase();
        if (selectedLocation === 'Remote') {
          if ((job.work_arrangement || '').toLowerCase() !== 'remote' && !loc.includes('remote')) {
            return false;
          }
        } else if (!loc.includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Work arrangement
      if (selectedArrangement !== 'All') {
        if ((job.work_arrangement || '').toLowerCase() !== selectedArrangement.toLowerCase()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match' && analysisId) {
        const scoreA = matches[a.id]?.overall_score ?? -1;
        const scoreB = matches[b.id]?.overall_score ?? -1;
        return scoreB - scoreA;
      }
      if (sortBy === 'salary') {
        const salA = a.salary_max || a.salary_min || 0;
        const salB = b.salary_max || b.salary_min || 0;
        return salB - salA;
      }
      return 0; // default order
    });
  }, [jobs, matches, searchTerm, selectedCategory, selectedLocation, selectedArrangement, sortBy, analysisId]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Roles');
    setSelectedLocation('All Locations');
    setSelectedArrangement('All');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All Roles' ||
    selectedLocation !== 'All Locations' ||
    selectedArrangement !== 'All';

  return (
    <PageWrapper maxWidth="xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-xs font-semibold text-brand-700 mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Fresher Job Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              Entry-Level Job Vacancies
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Curated opportunities tailored for recent graduates and candidates with 0–2 years experience.
            </p>
          </div>

          {!analysisId && (
            <Link href="/resume" className="shrink-0">
              <Button size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Upload Resume for Match Scores
              </Button>
            </Link>
          )}
        </div>

        {/* Notice banner if matching active */}
        {analysisId && (
          <div className="p-3.5 rounded-xl bg-linear-to-r from-brand-50 to-white border border-brand-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-ink">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              <span>
                Matching active for your uploaded resume. Scores are calculated deterministically across skills, education, and projects.
              </span>
            </div>
            <Link href="/resume" className="text-brand-600 font-semibold hover:underline flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> View Extracted Profile
            </Link>
          </div>
        )}

        {/* Search & Filter Controls */}
        <Card className="p-4 sm:p-5 space-y-4 shadow-card">
          {/* Main search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, or skills (e.g. Python, SQL, Marketing, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-gray-100 text-ink-light hover:bg-gray-200/80 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-xs">
            {/* Location */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1 uppercase tracking-wider">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-ink text-xs focus:ring-1 focus:ring-brand-500"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Arrangement */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1 uppercase tracking-wider">
                Work Arrangement
              </label>
              <select
                value={selectedArrangement}
                onChange={(e) => setSelectedArrangement(e.target.value)}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-ink text-xs capitalize focus:ring-1 focus:ring-brand-500"
              >
                {WORK_ARRANGEMENTS.map((wa) => (
                  <option key={wa} value={wa} className="capitalize">
                    {wa === 'All' ? 'All Arrangements' : wa}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1 uppercase tracking-wider">
                Sort Results By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-ink text-xs focus:ring-1 focus:ring-brand-500"
              >
                {analysisId && <option value="match">Highest Match Score</option>}
                <option value="recent">Default Listing Order</option>
                <option value="salary">Highest Compensation</option>
              </select>
            </div>
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs pt-1 text-ink-muted">
              <span>
                Showing <strong className="text-ink">{filteredJobs.length}</strong> of{' '}
                <strong className="text-ink">{jobs.length}</strong> total vacancies
              </span>
              <button
                onClick={clearFilters}
                className="text-brand-600 hover:text-brand-700 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </Card>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-xs text-red-800">
              <p className="font-semibold">Unable to fetch vacancies</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-ink-muted flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">No vacancies match your criteria</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
                Try broadening your keyword search or resetting location and category filters.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>{filteredJobs.length} entry-level listings available</span>
              {matchingLoading && (
                <span className="flex items-center gap-1.5 text-brand-600 font-medium">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Calculating match scores...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => {
                const match = matches[job.id];
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
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
