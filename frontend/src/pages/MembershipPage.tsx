import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  CheckCircle2,
  Sparkles,
  Rocket,
  Code2,
  Users,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import type { MembershipApplicationItem } from '../types';

export const MembershipPage: React.FC = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    college: 'Rajeev Institute of Technology, Hassan',
    department: 'Computer Science & Engineering',
    year: '2nd Year',
    tech_interests: [] as string[],
    reason_for_joining: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<MembershipApplicationItem | null>(null);
  const [copied, setCopied] = useState(false);

  const interestOptions = [
    'Web Development (React / Next.js / Node)',
    'AI & Machine Learning (Gemini, PyTorch)',
    'Cloud Computing & Google Cloud',
    'Mobile App Dev (Flutter / Android)',
    'UI/UX & Product Design',
    'Cybersecurity & Network Defense',
    'Open Source & Git Collaboration',
    'Competitive Programming & DSA',
  ];

  const handleInterestToggle = (interest: string) => {
    if (formData.tech_interests.includes(interest)) {
      setFormData({
        ...formData,
        tech_interests: formData.tech_interests.filter((i) => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        tech_interests: [...formData.tech_interests, interest],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone || !formData.reason_for_joining) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    if (formData.tech_interests.length === 0) {
      addToast('Please select at least one area of technical interest', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        tech_interests: formData.tech_interests.join(', '),
      };
      const result = await apiService.applyMembership(payload);
      setSubmittedData(result);
      addToast('Membership application submitted successfully!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit application. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (submittedData) {
      navigator.clipboard.writeText(submittedData.application_code);
      setCopied(true);
      addToast('Tracking ID copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F5F7FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151E30] border border-[#00D4FF]/35 text-[#00D4FF] text-xs font-semibold uppercase tracking-wider mb-4 shadow-[inset_0_1px_0_rgba(245,247,255,0.12)]">
            <Sparkles className="w-3.5 h-3.5 text-[#A8FF60]" />
            <span>Official Membership Portal 2026-2027</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7FF] mb-4">
            Join <span className="google-gradient-text">GDG on Campus</span> RIT Hassan
          </h1>
          <p className="text-[#A6B0C3] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Be part of the most vibrant developer collective at Rajeev Institute of Technology. Learn modern tech, ship real-world projects, access Google dev resources, and build meaningful peer connections.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-2xl surface-3d card-3d">
            <div className="w-10 h-10 rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/35 text-[#4285F4] flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#F5F7FF] text-sm mb-1">Hands-on Workshops</h3>
            <p className="text-xs text-[#A6B0C3]">Regular labs on Web, Cloud, AI, and Android guided by student leads and industry mentors.</p>
          </div>

          <div className="p-5 rounded-2xl surface-3d card-3d">
            <div className="w-10 h-10 rounded-xl bg-[#A8FF60]/15 border border-[#A8FF60]/35 text-[#A8FF60] flex items-center justify-center mb-3">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#F5F7FF] text-sm mb-1">Hackathons &amp; Competitions</h3>
            <p className="text-xs text-[#A6B0C3]">Priority passes to CODESTORM, Solution Challenge, internal hack sprints, and tech summits.</p>
          </div>

          <div className="p-5 rounded-2xl surface-3d card-3d">
            <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/15 border border-[#00D4FF]/35 text-[#00D4FF] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#F5F7FF] text-sm mb-1">Campus Community</h3>
            <p className="text-xs text-[#A6B0C3]">Join ambitious engineers across departments working together on open source code.</p>
          </div>
        </div>

        {/* Success Card or Application Form */}
        {submittedData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl surface-3d border-[#A8FF60]/30 relative overflow-hidden text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#A8FF60]/15 border border-[#A8FF60]/40 text-[#A8FF60] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-[#A8FF60]/10 text-[#A8FF60] text-xs font-bold border border-[#A8FF60]/30">
              Application Received
            </span>

            <h2 className="text-2xl font-bold text-[#F5F7FF] mt-4 mb-2">Welcome to the GDG Family, {submittedData.full_name}!</h2>
            <p className="text-[#A6B0C3] text-sm max-w-lg mx-auto mb-6">
              Your application has been logged into our membership registry. Our core team reviews submissions weekly and will reach out via WhatsApp & Email.
            </p>

            <div className="bg-[#080B14]/80 border border-[#4285F4]/25 p-5 rounded-2xl max-w-md mx-auto mb-8 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs text-[#A6B0C3]">Application Tracking ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#00D4FF]">{submittedData.application_code}</span>
                  <button
                    onClick={copyCode}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                <span className="text-slate-400">Department:</span>
                <span className="text-white font-medium">{submittedData.department} ({submittedData.year})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  {submittedData.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Join Official WhatsApp Community</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedData(null);
                  setFormData({
                    full_name: '',
                    email: '',
                    phone: '',
                    college: 'Rajeev Institute of Technology, Hassan',
                    department: 'Computer Science & Engineering',
                    year: '2nd Year',
                    tech_interests: [],
                    reason_for_joining: '',
                  });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm border border-white/10 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl surface-3d border border-[#4285F4]/25 relative"
          >
            <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Membership Application Form</h2>
                <p className="text-xs text-slate-400">Please provide accurate contact details for official communication</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Yashawantha H M"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    WhatsApp Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Institution / College
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Department / Branch <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B101D] border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Information Science & Engineering">Information Science & Engineering (ISE)</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science (AI/DS)</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering">Civil Engineering (Civil)</option>
                    <option value="Master of Business Administration">MBA / Management</option>
                    <option value="Other Technical Branch">Other Branch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Current Year of Study <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B101D] border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Technical Interests */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Technical Interests & Domains <span className="text-rose-400">*</span> (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {interestOptions.map((opt) => {
                    const isSelected = formData.tech_interests.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleInterestToggle(opt)}
                        className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate pr-2">{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason for joining */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Statement of Interest / What do you hope to achieve? <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.reason_for_joining}
                  onChange={(e) => setFormData({ ...formData, reason_for_joining: e.target.value })}
                  placeholder="Tell us about your learning goals, projects you want to build, or how you want to contribute to the GDG RIT community..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-3d-primary w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Membership Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Your information is safely stored and only used for club communications</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
