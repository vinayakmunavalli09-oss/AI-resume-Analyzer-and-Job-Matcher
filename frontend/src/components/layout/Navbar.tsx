'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Briefcase, Bookmark, User, Compass, Sparkles } from 'lucide-react';
import { useAnalysis } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { analysisId } = useAnalysis();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Compass },
    { href: '/resume', label: 'Resume Analyzer', icon: FileText },
    { href: '/jobs', label: 'Job Matches', icon: Briefcase },
    { href: '/saved', label: 'Saved Jobs', icon: Bookmark },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-ink tracking-tight">CareerPath<span className="text-brand-600">AI</span></span>
                <span className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">Fresher Job Matcher</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-ink-light hover:text-ink hover:bg-gray-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-ink-muted'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>{analysisId ? 'Update Resume' : 'Analyze Resume'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
