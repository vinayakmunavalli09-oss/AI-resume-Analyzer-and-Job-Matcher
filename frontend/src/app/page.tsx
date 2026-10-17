'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Target,
  GraduationCap,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { MatchScoreRing } from '@/components/jobs/MatchScoreRing';

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 md:pt-20 border-b border-surface-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-16">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Fresher-First Career Guidance for Indian Graduates
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
                Find your first role. <br />
                <span className="text-brand-600">Know why you match.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-light max-w-xl leading-relaxed">
                Stop guessing why applications get ignored. Upload your resume to extract demonstrated skills, discover verified entry-level vacancies, and understand exact qualification breakdowns.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link href="/resume">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Analyze My Resume
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" leftIcon={<Briefcase className="w-4 h-4" />}>
                    Browse Entry-Level Jobs
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> 100% Free for Students
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" /> Private & Secure
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-accent-600" /> Explainable Scoring
                </span>
              </div>
            </div>

            {/* Product Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-surface-border bg-surface p-6 shadow-card-lg">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-2">
                    <DemoBadge />
                    <span className="text-xs text-ink-muted">Live Sample Match</span>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Strong Candidate Fit
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-base text-ink">Business Analyst Trainee</h3>
                    <p className="text-xs font-medium text-ink-light">BrightPath Analytics • Bengaluru</p>
                    <p className="text-xs text-ink-muted mt-1">₹3.6L – ₹4.8L/yr • Fresher friendly</p>
                  </div>
                  <MatchScoreRing score={82} size="md" />
                </div>

                {/* Score breakdown snippet */}
                <div className="space-y-2 mb-4 bg-white p-3.5 rounded-xl border border-gray-100 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-ink-muted">Skills Overlap (35%)</span>
                    <span className="font-semibold text-green-700">85% Demonstrated</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '85%' }} />
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span className="text-ink-muted">Academics & Eligibility (25%)</span>
                    <span className="font-semibold text-brand-700">100% Eligible</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-ink-light uppercase tracking-wider">Demonstrated Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {['SQL', 'Excel / Sheets', 'Data Visualization', 'Python Basics'].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-green-50 text-green-700 border border-green-200 font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                  <span className="text-xs text-brand-600 font-semibold hover:underline">
                    See full transparent breakdown in app →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Fresher-First Section ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <Badge variant="brand" className="uppercase tracking-wider">Built for Indian Freshers</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink">
            No 5-year experience required for entry-level roles
          </h2>
          <p className="text-sm sm:text-base text-ink-light leading-relaxed">
            Standard job boards rank candidates by years of full-time employment. We evaluate your college capstone projects, academic internships, certifications, and transferable problem-solving skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink mb-2">Academic & Project Focus</h3>
            <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
              We extract and evaluate your coursework, mini-projects, final-year capstone, and certifications so you aren't penalized for zero corporate years.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-700 mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink mb-2">Deterministic Match Engine</h3>
            <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
              Scores are calculated using transparent mathematical rules: Skills (35%), Education (25%), Projects (20%), Role Relevance (10%), Experience (10%). No opaque black-box AI scores.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink mb-2">Actionable Skill Gaps</h3>
            <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
              Understand which specific skills you haven't demonstrated yet, without claiming you lack ability. Receive practical recommendations to enhance your profile.
            </p>
          </Card>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-ink p-8 sm:p-12 text-white">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs uppercase tracking-wider text-brand-100 font-semibold">How It Works</span>
            <h2 className="text-2xl sm:text-3xl font-bold">Three steps to your first interview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-bold text-base">Upload PDF or DOCX</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Upload your college or fresher resume. Safe extraction parses your education, skills, and projects without storing private files permanently.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm">2</div>
              <h4 className="font-bold text-base">Get Transparent Matching</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Explore 60 clearly labeled sample entry-level roles across Indian cities. Each listing is demonstration data, not a verified vacancy.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm">3</div>
              <h4 className="font-bold text-base">Apply with Confidence</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Review missing requirements, prepare your talking points, and apply directly through the provided employer application links.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/resume">
              <Button size="lg" className="bg-white text-ink hover:bg-gray-100">
                Start Resume Analysis Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
