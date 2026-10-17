'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import type { ResumeFeedback } from '@/lib/types';

interface FeedbackSectionProps {
  feedback?: ResumeFeedback;
  warnings?: string[];
}

export function FeedbackSection({ feedback, warnings = [] }: FeedbackSectionProps) {
  if (!feedback && (!warnings || warnings.length === 0)) {
    return (
      <div className="text-center py-8 text-ink-muted text-sm">
        No qualitative feedback available for this resume.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warnings Banner if any */}
      {warnings && warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> System Notice
          </div>
          {warnings.map((w, idx) => (
            <p key={idx} className="text-xs text-amber-800/90 leading-relaxed pl-6">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="p-5 border-green-100 bg-green-50/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center text-green-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-ink">Demonstrated Strengths</h4>
          </div>
          {feedback?.strengths && feedback.strengths.length > 0 ? (
            <ul className="space-y-2 text-xs text-ink-light">
              {feedback.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink-muted">No explicit strengths highlighted yet.</p>
          )}
        </Card>

        {/* Weaknesses / Missing Elements */}
        <Card className="p-5 border-amber-100 bg-amber-50/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-ink">Areas Needing Demonstration</h4>
          </div>
          {feedback?.weaknesses && feedback.weaknesses.length > 0 ? (
            <ul className="space-y-2 text-xs text-ink-light">
              {feedback.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink-muted">No major omissions detected.</p>
          )}
        </Card>
      </div>

      {/* Actionable Improvement Suggestions */}
      {feedback?.suggestions && feedback.suggestions.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-brand-50 flex items-center justify-center text-brand-600">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-ink">Actionable Resume Suggestions</h4>
              <p className="text-xs text-ink-muted">Practical steps to increase fresher competitiveness</p>
            </div>
          </div>
          <div className="space-y-3">
            {feedback.suggestions.map((sug, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{sug.issue}</span>
                  {sug.category && (
                    <Badge variant="brand" className="text-[10px] capitalize">
                      {sug.category}
                    </Badge>
                  )}
                </div>
                <p className="text-ink-light leading-relaxed">
                  <span className="font-medium text-brand-700">Recommendation:</span> {sug.recommendation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default FeedbackSection;
