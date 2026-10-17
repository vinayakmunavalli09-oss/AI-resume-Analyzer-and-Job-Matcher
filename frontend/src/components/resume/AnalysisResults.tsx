'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FeedbackSection } from './FeedbackSection';
import { updateAnalysis, deleteAnalysis } from '@/lib/api';
import { useAnalysis } from '@/context/AppContext';
import {
  GraduationCap,
  Briefcase,
  FolderGit2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  RefreshCw,
  Edit3,
  Trash2,
  Plus,
  X,
  Check,
  Save,
} from 'lucide-react';
import type { ResumeAnalysis, StructuredProfile, Education, Project } from '@/lib/types';

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  onReset?: () => void;
}

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  const { setAnalysis, clearAnalysis } = useAnalysis();
  const [activeTab, setActiveTab] = useState<'profile' | 'feedback'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Editable profile copy
  const [editProfile, setEditProfile] = useState<StructuredProfile>(() => ({
    name: analysis.structured_profile?.name || '',
    email: analysis.structured_profile?.email || '',
    phone: analysis.structured_profile?.phone || '',
    location: analysis.structured_profile?.location || '',
    skills: [...(analysis.structured_profile?.skills || [])],
    work_experience: [...(analysis.structured_profile?.work_experience || [])],
    education: [...(analysis.structured_profile?.education || [])],
    internships: [...(analysis.structured_profile?.internships || [])],
    projects: [...(analysis.structured_profile?.projects || [])],
    certifications: [...(analysis.structured_profile?.certifications || [])],
    achievements: [...(analysis.structured_profile?.achievements || [])],
    missing_sections: [...(analysis.structured_profile?.missing_sections || [])],
    summary: analysis.structured_profile?.summary || '',
  }));

  const [newSkillInput, setNewSkillInput] = useState('');

  const profile = analysis.structured_profile;

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!editProfile.skills.includes(newSkillInput.trim())) {
      setEditProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkillInput.trim()],
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveCorrections = async () => {
    setSaving(true);
    try {
      const res = await updateAnalysis(analysis.analysis_id, editProfile);
      setAnalysis(res.data);
      setIsEditing(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update analysis profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (confirm('Permanently delete this resume analysis and all calculated match records?')) {
      try {
        await deleteAnalysis(analysis.analysis_id);
      } catch (err) {
        console.warn('Delete request returned error, clearing local state', err);
      }
      clearAnalysis();
      if (onReset) onReset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Card */}
      <Card className="p-6 bg-linear-to-r from-brand-50/50 to-white border-brand-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                Resume Analyzed Successfully
              </span>
              {analysis.warnings?.some((w) => w.includes('deterministic')) && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Deterministic Baseline
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-ink">
              {profile?.name || 'Extracted Profile'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
              {profile?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </span>
              )}
              {profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {profile.phone}
                </span>
              )}
              {profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              {isEditing ? 'Cancel Edit' : 'Review & Correct'}
            </Button>

            {onReset && (
              <Button variant="secondary" size="sm" onClick={onReset} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                Upload Another
              </Button>
            )}

            <Link href="/jobs">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Job Matches
              </Button>
            </Link>

            <button
              onClick={handleDeleteResume}
              className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition"
              title="Permanently delete resume data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {editSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Profile corrections saved! Match scores have been recomputed.</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-brand-100/60">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-gray-100'
            }`}
          >
            Extracted Profile & Skills
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'feedback'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-gray-100'
            }`}
          >
            AI Feedback & Recommendations
          </button>
        </div>
      </Card>

      {/* Profile Review & Edit Form Drawer */}
      {isEditing && (
        <Card className="p-6 border-brand-300 bg-brand-50/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-200">
            <div>
              <h3 className="text-sm font-bold text-ink">Candidate Review & Correction</h3>
              <p className="text-xs text-ink-muted">
                Review and correct parsed details. Updates immediately revise your job matching calculations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveCorrections} isLoading={saving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Corrections
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-ink-light mb-1">Candidate Name</label>
              <input
                type="text"
                value={editProfile.name || ''}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink-light mb-1">Email</label>
              <input
                type="email"
                value={editProfile.email || ''}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink-light mb-1">Phone</label>
              <input
                type="text"
                value={editProfile.phone || ''}
                onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink-light mb-1">Location</label>
              <input
                type="text"
                value={editProfile.location || ''}
                onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                className="w-full p-2 rounded-lg border border-surface-border bg-white text-xs"
              />
            </div>
          </div>

          {/* Edit Skills */}
          <div className="space-y-2 pt-2 border-t border-brand-100 text-xs">
            <label className="block font-semibold text-ink-light">Demonstrated Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {editProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-brand-200 text-brand-800 text-xs font-medium"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add missing skill (e.g. SQL, React, Excel)..."
                className="flex-1 p-2 rounded-lg border border-surface-border bg-white text-xs"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demonstrated Skills */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <h3 className="font-semibold text-sm text-ink">Demonstrated Skills</h3>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-brand-600 hover:underline"
              >
                + Add / Edit
              </button>
            </div>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill, idx) => (
                  <Badge key={idx} variant="brand" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">No explicit skills parsed from resume.</p>
            )}
          </Card>

          {/* Education */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-sm text-ink">Education & Academics</h3>
            </div>
            {profile?.education && profile.education.length > 0 ? (
              <div className="space-y-3">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="text-xs border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <p className="font-semibold text-ink">
                      {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-ink-muted">{edu.institution}</p>
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-0.5">
                      {edu.year && <span>Year: {edu.year}</span>}
                      {edu.percentage && <span>Score: {edu.percentage}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">No education entries parsed.</p>
            )}
          </Card>

          {/* Internships & Work */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-sm text-ink">Internships & Work</h3>
            </div>
            {((profile?.internships?.length || 0) + (profile?.work_experience?.length || 0)) > 0 ? (
              <div className="space-y-3">
                {(profile.work_experience || []).map((experience, idx) => (
                  <div key={`work-${idx}`} className="text-xs border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink">{experience.title}</p>
                      {experience.duration && <span className="text-[11px] text-ink-muted">{experience.duration}</span>}
                    </div>
                    <p className="text-ink-light font-medium">{experience.company}</p>
                    {experience.description && <p className="text-ink-muted mt-1 leading-relaxed">{experience.description}</p>}
                  </div>
                ))}
                {profile.internships.map((intern, idx) => (
                  <div key={idx} className="text-xs border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink">{intern.title}</p>
                      {intern.duration && <span className="text-[11px] text-ink-muted">{intern.duration}</span>}
                    </div>
                    <p className="text-ink-light font-medium">{intern.company}</p>
                    {intern.description && <p className="text-ink-muted mt-1 leading-relaxed">{intern.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">No prior internships or work recorded (Fresher Candidate).</p>
            )}
          </Card>

          {/* Academic / Personal Projects */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <FolderGit2 className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-sm text-ink">Academic & Personal Projects</h3>
            </div>
            {profile?.projects && profile.projects.length > 0 ? (
              <div className="space-y-3">
                {profile.projects.map((proj, idx) => (
                  <div key={idx} className="text-xs border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <p className="font-semibold text-ink">{proj.name}</p>
                    {proj.description && <p className="text-ink-muted mt-0.5 leading-relaxed">{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.map((t, tidx) => (
                          <span key={tidx} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-ink-light font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">No specific projects detected.</p>
            )}
          </Card>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <FeedbackSection feedback={analysis.feedback} warnings={analysis.warnings} />
      )}
    </div>
  );
}

export default AnalysisResults;
