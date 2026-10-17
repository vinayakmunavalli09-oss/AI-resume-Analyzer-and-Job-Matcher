'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, IndianRupee, Bookmark, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MatchScoreRing } from './MatchScoreRing';
import { SkillBadgeList } from './SkillBadgeList';
import { useSavedJobs } from '@/context/AppContext';
import { formatSalary } from '@/lib/utils';
import type { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  className?: string;
}

export function JobCard({
  job,
  matchScore,
  matchedSkills = [],
  missingSkills = [],
  className,
}: JobCardProps) {
  const { isSaved, saveJob, unsaveJob } = useSavedJobs();
  const bookmarked = isSaved(job.id);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      await unsaveJob(job.id);
    } else {
      await saveJob(job.id);
    }
  };

  const score = matchScore ?? job.match_score;

  return (
    <Card hoverable className={`p-5 transition group relative ${className || ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {job.is_demo && <DemoBadge />}
            {job.category && (
              <Badge variant="brand" className="text-[11px]">
                {job.category}
              </Badge>
            )}
            {job.work_arrangement && (
              <span className="text-[11px] font-medium text-ink-muted capitalize bg-gray-100 px-2 py-0.5 rounded-md">
                {job.work_arrangement}
              </span>
            )}
            {job.experience_level && (
              <span className="text-[11px] font-medium text-ink-muted capitalize bg-gray-100 px-2 py-0.5 rounded-md">
                {job.experience_level}
              </span>
            )}
          </div>

          {/* Job Title & Company */}
          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-base font-semibold text-ink group-hover:text-brand-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm font-medium text-ink-light mb-2">{job.company}</p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span className="flex items-center gap-1 text-ink font-medium">
                <IndianRupee className="w-3.5 h-3.5 text-accent-600" />
                {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
              </span>
            )}
          </div>

          {/* Skills snippet */}
          <div className="mt-2">
            <SkillBadgeList
              matchedSkills={matchedSkills.length ? matchedSkills : job.required_skills?.slice(0, 3)}
              missingRequired={missingSkills.slice(0, 2)}
              maxDisplay={5}
            />
          </div>
        </div>

        {/* Right side: Match score ring & bookmark */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-lg border transition ${
              bookmarked
                ? 'bg-brand-50 border-brand-200 text-brand-600'
                : 'border-gray-200 text-gray-400 hover:text-ink hover:border-gray-300'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark job'}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark job'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>

          {score !== undefined && score !== null ? (
            <MatchScoreRing score={score} size="sm" showLabel={false} />
          ) : null}
        </div>
      </div>

      {/* Footer action bar */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-ink-muted">
          {job.source_label || (job.is_demo ? 'Curated Demo Listing' : 'Verified Listing')}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job.id}`}
            className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1"
          >
            Match Report & Details →
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default JobCard;
