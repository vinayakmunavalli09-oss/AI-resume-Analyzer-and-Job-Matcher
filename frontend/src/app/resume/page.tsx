'use client';

import React, { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { AnalysisResults } from '@/components/resume/AnalysisResults';
import { useAnalysis } from '@/context/AppContext';
import { analyzeResume } from '@/lib/api';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import type { ResumeAnalysis } from '@/lib/types';

export default function ResumePage() {
  const { analysis, setAnalysis, clearAnalysis } = useAnalysis();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<string>('idle');

  const handleFileSelect = async (file: File) => {
    setError(null);
    setUploading(true);
    setStage('Validating document format and security...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setStage('Extracting academic credentials, projects, and skills...');

      const response = await analyzeResume(file);
      setStage('Calculating feedback and profile structure...');
      await new Promise((r) => setTimeout(r, 400));

      setAnalysis(response.data);
    } catch (err: any) {
      console.error('Resume upload error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to analyze resume. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
      setStage('idle');
    }
  };

  const handleReset = () => {
    clearAnalysis();
    setError(null);
  };

  return (
    <PageWrapper maxWidth="lg">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            AI Resume Analyzer & Parser
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Extract & Understand Your Resume
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Upload your PDF or DOCX resume. We safely extract your skills, education, and projects to match you with entry-level openings across India.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-red-800">Analysis Error</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Analysis View */}
        {analysis ? (
          <AnalysisResults analysis={analysis} onReset={handleReset} />
        ) : (
          /* Upload State */
          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              {uploading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-ink">Analyzing Resume</h3>
                    <p className="text-xs text-brand-600 font-medium animate-pulse">{stage}</p>
                  </div>
                  <p className="text-[11px] text-ink-muted max-w-xs">
                    Treating your document securely without permanent file retention.
                  </p>
                </div>
              ) : (
                <FileUpload
                  onFileSelect={handleFileSelect}
                  disabled={uploading}
                />
              )}
            </Card>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-surface-border bg-white space-y-1">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent-600" /> Safe & Private
                </span>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  Original files are parsed in memory and discarded. The extracted profile and report are kept for this session so you can review, correct, and match them; delete the report when finished.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-surface-border bg-white space-y-1">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-600" /> Supported Formats
                </span>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  Clean text-based PDF and DOCX files up to 5 MB. Scanned images with unreadable text will show a warning.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-surface-border bg-white space-y-1">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Truthful Extraction
                </span>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  We never hallucinate degrees or fabricate work experience. Missing items are marked as unverified.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
