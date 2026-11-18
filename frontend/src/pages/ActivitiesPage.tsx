import React, { useState, useEffect } from 'react';
import { Calendar, Award, Zap } from 'lucide-react';
import { apiService, getAssetUrl } from '../services/api';
import type { ActivityItem, AchievementItem } from '../types';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ACTIVITIES' | 'ACHIEVEMENTS'>('ACTIVITIES');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [acts, achs] = await Promise.all([
          apiService.getActivities(),
          apiService.getAchievements(),
        ]);
        setActivities(acts);
        setAchievements(achs);
      } catch (err) {
        console.error("Error loading activities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-blue-400 font-bold uppercase tracking-wider">
          <span>CAMPUS ENGAGEMENT</span>
          <span>✳</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Activities & <span className="google-gradient-text">Milestones.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          From hands-on design programs and interactive tech quizzes to competitive hackathons and recognized student projects.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('ACTIVITIES')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'ACTIVITIES'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Club Activities & Programs ({activities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ACHIEVEMENTS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'ACHIEVEMENTS'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Recognized Achievements ({achievements.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : activeTab === 'ACTIVITIES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((act) => (
            <div key={act.id} className="p-6 rounded-3xl glass-panel glass-panel-hover space-y-4 flex flex-col justify-between">
              <div>
                {act.image_url && (
                  <div className="h-48 rounded-2xl overflow-hidden bg-slate-900 mb-4 border border-white/10">
                    <img src={getAssetUrl(act.image_url)} alt={act.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-[10px]">
                    {act.category}
                  </span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{act.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">{act.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  {act.description}
                </p>
              </div>

              {act.highlights && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-white block">Key Highlights:</span>
                  <p className="text-slate-400">{act.highlights}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-6 rounded-3xl glass-panel border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  {ach.category}
                </span>
                <span className="text-xs text-slate-400">{ach.date}</span>
              </div>

              <h3 className="text-xl font-bold text-white">{ach.title}</h3>
              {ach.recipient_name && (
                <p className="text-xs text-blue-400 font-semibold">Awarded to: {ach.recipient_name}</p>
              )}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
