import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { LinkedinIcon as Linkedin, GithubIcon as Github } from '../components/common/BrandIcons';
import { apiService, getAssetUrl } from '../services/api';
import type { MemberItem } from '../types';

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'FACULTY' | 'LEADERSHIP' | 'STUDENT'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiService.getMembers();
        setMembers(data);
      } catch (err) {
        console.error("Error loading team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    if (categoryFilter === 'ALL') return true;
    return m.category === categoryFilter;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-blue-400 font-bold uppercase tracking-wider">
          <span>BUILT BY STUDENTS</span>
          <span>✳</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Meet our team <span className="google-gradient-text">the community builders.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Meet the students, faculty, and club coordinators who make space for others to learn, share, and build.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#090D18] border border-white/10 w-fit">
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            categoryFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All Members ({members.length})
        </button>

        <button
          onClick={() => setCategoryFilter('LEADERSHIP')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            categoryFilter === 'LEADERSHIP'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Club Leadership
        </button>

        <button
          onClick={() => setCategoryFilter('FACULTY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            categoryFilter === 'FACULTY'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Faculty Coordinators
        </button>

        <button
          onClick={() => setCategoryFilter('STUDENT')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            categoryFilter === 'STUDENT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Student Coordinators
        </button>
      </div>

      {/* Team Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const isExpanded = expandedId === member.id;
            return (
              <div
                key={member.id}
                className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between space-y-4 group transition-all"
              >
                <div>
                  {/* Photo or Initials */}
                  <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {member.photo_url ? (
                      <img
                        src={getAssetUrl(member.photo_url)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-300 bg-blue-600/30">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Top Category Badge */}
                  <div className="text-center mt-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {member.category === 'FACULTY'
                        ? 'Faculty Coordinator'
                        : member.category === 'LEADERSHIP'
                        ? 'Club Lead'
                        : 'Student Coordinator'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-blue-300 font-semibold mt-0.5">{member.role}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{member.department}</p>
                  </div>

                  {/* Bio expander */}
                  {member.bio && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <p
                        className={`text-xs text-slate-300 leading-relaxed font-normal ${
                          isExpanded ? '' : 'line-clamp-3'
                        }`}
                      >
                        {member.bio}
                      </p>
                      {member.bio.length > 120 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : member.id)}
                          className="mt-2 text-[11px] text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Show Less' : 'Read Full Bio'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Social links */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-3">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 transition-colors"
                      title="LinkedIn Profile"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}

                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-slate-700 hover:text-white text-slate-400 transition-colors"
                      title="GitHub Profile"
                      aria-label={`${member.name} on GitHub`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                      title="Email Member"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Team Privacy Note */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 inline-block mr-1.5 -mt-0.5" />
        <span>Only public profile information is shown. Student USNs and other private details are never exposed.</span>
      </div>
    </div>
  );
};
