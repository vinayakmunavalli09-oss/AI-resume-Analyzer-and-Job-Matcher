import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-ink">CareerPath AI</span>
            </div>
            <p className="text-sm text-ink-muted max-w-sm">
              Empowering final-year students, fresh graduates, and career changers across India with transparent, fresher-first resume analysis and job matching.
            </p>
            <div className="flex items-center gap-4 text-xs text-ink-muted pt-2">
              <span className="inline-flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-brand-500" /> NVIDIA NIM Powered
              </span>
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-accent-600" /> Private & Secure
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><Link href="/dashboard" className="hover:text-brand-600 transition">Candidate Dashboard</Link></li>
              <li><Link href="/resume" className="hover:text-brand-600 transition">Resume Analyzer</Link></li>
              <li><Link href="/jobs" className="hover:text-brand-600 transition">Entry-Level Jobs</Link></li>
              <li><Link href="/saved" className="hover:text-brand-600 transition">Application Tracker</Link></li>
            </ul>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Target Roles</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>Digital Marketing Trainee</li>
              <li>Business Development (BDE)</li>
              <li>Business Analyst Trainee</li>
              <li>HR Recruiter / Trainee</li>
              <li>Operations & Sales Trainee</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} CareerPath AI. All rights reserved. Indian Market Fresher Guidance.</p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Demo Data Mode Available
            </span>
            <span className="hover:text-ink cursor-pointer">Privacy Notice</span>
            <span className="hover:text-ink cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
