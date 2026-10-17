'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { useSavedJobs } from '@/context/AppContext';
import { formatSalary } from '@/lib/utils';
import type { SavedJobStatus } from '@/lib/types';
import {
  Bookmark,
  Briefcase,
  MapPin,
  ExternalLink,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';

const STATUS_OPTIONS: { value: SavedJobStatus; label: string; color: string }[] = [
  { value: 'interested', label: 'Interested', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'applied', label: 'Applied', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'interview', label: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'offer', label: 'Offer Received', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'rejected', label: 'Archived / Rejected', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

export default function SavedJobsPage() {
  const { savedJobs, unsaveJob, updateStatus, isLoading } = useSavedJobs();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredJobs = savedJobs.filter((item) => {
    if (activeFilter === 'all') return true;
    const currentStatus = item.application_status || item.status || 'interested';
    return currentStatus === activeFilter;
  });

  return (
    <PageWrapper maxWidth="lg">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-xs font-semibold text-brand-700 mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Job Tracker & Bookmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              Application Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Track your entry-level opportunities across stages from initial bookmark to interview and offer.
            </p>
          </div>

          <Link href="/jobs">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Find More Vacancies
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-gray-100 text-ink-light hover:bg-gray-200'
            }`}
          >
            All Saved ({savedJobs.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = savedJobs.filter(
              (j) => (j.application_status || j.status || 'interested') === opt.value
            ).length;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeFilter === opt.value
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-gray-100 text-ink-light hover:bg-gray-200'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Saved Jobs List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-ink-muted flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">No saved jobs in this stage</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
                Explore clearly labeled sample roles in India and bookmark them to track your progress.
              </p>
            </div>
            <Link href="/jobs">
              <Button size="sm">Browse Job Listings</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((item) => {
              const currentStatus = (item.application_status || item.status || 'interested') as SavedJobStatus;
              const job = item.job || { id: item.job_id, title: 'Job Opportunity', company: 'Employer' };

              return (
                <Card key={item.id || item.job_id} className="p-5 hover:border-gray-300 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Job overview */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {job.is_demo && <DemoBadge />}
                        {job.role_category && (
                          <Badge variant="brand" className="text-[10px]">
                            {job.role_category}
                          </Badge>
                        )}
                      </div>

                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-base font-bold text-ink hover:text-brand-600 transition">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-xs font-semibold text-brand-700">{job.company}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted pt-1">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        {(job.salary_min || job.salary_max) && (
                          <span className="font-medium text-ink">
                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status selector & Actions */}
                    <div className="flex sm:flex-col items-end gap-3 shrink-0">
                      {/* Application stage dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-ink-muted hidden sm:inline">
                          Status:
                        </label>
                        <select
                          value={currentStatus}
                          onChange={(e) => updateStatus(item.job_id, e.target.value as SavedJobStatus)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-surface-border bg-white text-ink focus:ring-1 focus:ring-brand-500"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="secondary" size="sm">
                            Match Report
                          </Button>
                        </Link>
                        <button
                          onClick={() => unsaveJob(item.job_id)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
