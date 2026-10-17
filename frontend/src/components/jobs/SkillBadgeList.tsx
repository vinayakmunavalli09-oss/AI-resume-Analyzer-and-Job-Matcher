import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillBadgeListProps {
  matchedSkills?: string[];
  missingRequired?: string[];
  missingPreferred?: string[];
  maxDisplay?: number;
  className?: string;
  showCategoryHeaders?: boolean;
}

export function SkillBadgeList({
  matchedSkills = [],
  missingRequired = [],
  missingPreferred = [],
  maxDisplay,
  className,
  showCategoryHeaders = false,
}: SkillBadgeListProps) {
  if (showCategoryHeaders) {
    return (
      <div className={cn('space-y-3', className)}>
        {matchedSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 mb-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Skills Demonstrated ({matchedSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <Badge key={skill} variant="matched" icon={<Check className="w-3 h-3 text-green-600" />}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {missingRequired.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Required Skills Not Demonstrated in Resume ({missingRequired.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingRequired.map((skill) => (
                <Badge key={skill} variant="warning" icon={<AlertCircle className="w-3 h-3 text-amber-600" />}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {missingPreferred.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Preferred Skills ({missingPreferred.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingPreferred.map((skill) => (
                <Badge key={skill} variant="preferred">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Flat compact list with optional limit
  const allSkills = [
    ...matchedSkills.map((s) => ({ name: s, type: 'matched' as const })),
    ...missingRequired.map((s) => ({ name: s, type: 'missing' as const })),
    ...missingPreferred.map((s) => ({ name: s, type: 'preferred' as const })),
  ];

  const displayed = maxDisplay ? allSkills.slice(0, maxDisplay) : allSkills;
  const remaining = maxDisplay ? Math.max(0, allSkills.length - maxDisplay) : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {displayed.map(({ name, type }) => (
        <Badge
          key={name}
          variant={type === 'matched' ? 'matched' : type === 'missing' ? 'warning' : 'default'}
          className="text-xs"
        >
          {type === 'matched' && <Check className="w-2.5 h-2.5 text-green-600 mr-1 inline" />}
          {name}
        </Badge>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-ink-muted font-medium px-1">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

export default SkillBadgeList;
