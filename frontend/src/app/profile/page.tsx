'use client';

import React, { useState, useEffect } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useProfile, useAnalysis } from '@/context/AppContext';
import type { UserProfile } from '@/lib/types';
import {
  User,
  Briefcase,
  MapPin,
  GraduationCap,
  Sparkles,
  Save,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';

const COMMON_ROLES = [
  'Business Analyst Trainee',
  'Digital Marketing Trainee',
  'Business Development Executive (BDE)',
  'HR Recruiter',
  'Operations Executive',
  'Customer Support Specialist',
  'Junior Python Developer',
  'Frontend React Developer',
  'Finance & Accounting Trainee',
  'QA / Software Testing Trainee',
];

const COMMON_CITIES = ['Bengaluru', 'Pune', 'Mumbai', 'Delhi / NCR', 'Hyderabad', 'Chennai', 'Kolkata', 'Remote'];

export default function ProfilePage() {
  const { profile, saveProfile, isLoading } = useProfile();
  const { analysis } = useAnalysis();

  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    location: 'Bengaluru, Karnataka',
    experience_level: 'fresher',
    target_roles: ['Business Analyst Trainee'],
    preferred_locations: ['Bengaluru', 'Remote'],
    skills: [],
    graduation_year: 2026,
    preferred_work_arrangement: ['hybrid', 'remote'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync profile data or pre-fill from uploaded resume analysis
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({ ...prev, ...profile }));
    } else if (analysis?.structured_profile) {
      const sp = analysis.structured_profile;
      setFormData((prev) => ({
        ...prev,
        name: sp.name || prev.name,
        email: sp.email || prev.email,
        location: sp.location || prev.location,
        skills: sp.skills?.length ? sp.skills : prev.skills,
      }));
    }
  }, [profile, analysis]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!formData.skills?.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skill),
    }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const exists = prev.target_roles?.includes(role);
      const roles = exists
        ? (prev.target_roles || []).filter((r) => r !== role)
        : [...(prev.target_roles || []), role];
      return { ...prev, target_roles: roles };
    });
  };

  const handleLocationToggle = (city: string) => {
    setFormData((prev) => {
      const exists = prev.preferred_locations?.includes(city);
      const locs = exists
        ? (prev.preferred_locations || []).filter((l) => l !== city)
        : [...(prev.preferred_locations || []), city];
      return { ...prev, preferred_locations: locs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageWrapper maxWidth="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-surface-border">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-xs font-semibold text-brand-700 mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Preferences & Targeting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Candidate Career Profile
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Specify your career targets, graduation year, and preferred cities to personalize vacancy recommendations.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-xs font-semibold text-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Profile and career preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Basic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-ink-light mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-lg border border-surface-border bg-white text-ink text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-light mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full p-2.5 rounded-lg border border-surface-border bg-white text-ink text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-light mb-1">Current City / State</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Bengaluru, Karnataka"
                  className="w-full p-2.5 rounded-lg border border-surface-border bg-white text-ink text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-light mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={formData.graduation_year || 2026}
                  onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-surface-border bg-white text-ink text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Target Roles */}
          <Card className="p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Target Role Categories
            </h3>
            <p className="text-[11px] text-ink-muted">
              Select roles you are actively targeting in your job search:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {COMMON_ROLES.map((role) => {
                const selected = formData.target_roles?.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => handleRoleToggle(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      selected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-gray-50 text-ink border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '} {role}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Preferred Locations */}
          <Card className="p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Preferred Work Locations
            </h3>
            <p className="text-[11px] text-ink-muted">
              Choose hubs you are open to relocating or commuting to:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {COMMON_CITIES.map((city) => {
                const selected = formData.preferred_locations?.includes(city);
                return (
                  <button
                    type="button"
                    key={city}
                    onClick={() => handleLocationToggle(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      selected
                        ? 'bg-accent-600 text-ink-900 border-accent-600 font-bold'
                        : 'bg-gray-50 text-ink border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '} {city}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Key Competencies / Skills */}
          <Card className="p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Self-Reported Skills
            </h3>
            <p className="text-[11px] text-ink-muted">
              Add skills from your coursework, internships, or personal projects:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-ink-muted italic">No skills listed yet.</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add another skill (e.g. Power BI, Excel, SEO)..."
                className="flex-1 p-2 rounded-lg border border-surface-border text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button type="submit" size="md" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
              Save Career Preferences
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
