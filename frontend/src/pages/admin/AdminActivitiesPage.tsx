import React, { useEffect, useState } from 'react';
import {
  Zap,
  Award,
  Plus,
  Trash2
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { ActivityItem, AchievementItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminActivitiesPage: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'activities' | 'achievements'>('activities');

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);

  // Activity Form matching backend ActivityCreate schema
  const [activityForm, setActivityForm] = useState({
    title: '',
    category: 'WORKSHOP',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    highlights: '50+ active participants, hands-on code labs',
  });

  // Achievement Form matching backend AchievementCreate schema
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    category: 'COMPETITION',
    recipient_name: 'GDG on Campus RIT Team',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [act, ach] = await Promise.all([
        apiService.getActivities(),
        apiService.getAchievements(),
      ]);
      setActivities(act);
      setAchievements(ach);
    } catch {
      addToast('Failed to load activities and achievements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createActivity(activityForm);
      addToast('Activity published', 'success');
      setActivityModalOpen(false);
      setActivityForm({
        title: '',
        category: 'WORKSHOP',
        description: '',
        date: new Date().toISOString().slice(0, 10),
        highlights: '',
      });
      fetchData();
    } catch {
      addToast('Failed to create activity', 'error');
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!window.confirm('Delete this activity entry?')) return;
    try {
      await apiService.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      addToast('Activity deleted', 'success');
    } catch {
      addToast('Failed to delete activity', 'error');
    }
  };

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createAchievement(achievementForm);
      addToast('Achievement added', 'success');
      setAchievementModalOpen(false);
      setAchievementForm({
        title: '',
        category: 'COMPETITION',
        recipient_name: '',
        date: new Date().toISOString().slice(0, 10),
        description: '',
      });
      fetchData();
    } catch {
      addToast('Failed to create achievement', 'error');
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!window.confirm('Delete this achievement entry?')) return;
    try {
      await apiService.deleteAchievement(id);
      setAchievements((prev) => prev.filter((a) => a.id !== id));
      addToast('Achievement deleted', 'success');
    } catch {
      addToast('Failed to delete achievement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Activities & Impact Portfolio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showcase club accomplishments, technical sprints, workshop milestones, and recognition awards
          </p>
        </div>

        {activeTab === 'activities' ? (
          <button
            onClick={() => setActivityModalOpen(true)}
            className="btn-3d-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        ) : (
          <button
            onClick={() => setAchievementModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-amber-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'activities'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Activities ({activities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievements ({achievements.length})</span>
        </button>
      </div>

      {/* Tab 1: Activities */}
      {activeTab === 'activities' && (
        <div className="p-6 rounded-2xl surface-3d">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No activities listed.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Title & Category</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Highlights</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activities.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-white">{a.title}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {a.category}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-300">{a.date}</td>
                      <td className="py-3.5 pr-4 text-emerald-400 truncate max-w-[180px]">{a.highlights || 'Community Milestone'}</td>
                      <td className="py-3.5 pr-4 text-slate-400 truncate max-w-[220px]">{a.description}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteActivity(a.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Achievements */}
      {activeTab === 'achievements' && (
        <div className="p-6 rounded-2xl surface-3d">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading achievements...</div>
          ) : achievements.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No achievements recorded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Achievement Title</th>
                    <th className="pb-3">Category & Recipient</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {achievements.map((ach) => (
                    <tr key={ach.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4 font-bold text-white">{ach.title}</td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 mr-1.5">
                          {ach.category}
                        </span>
                        <span className="text-slate-300">{ach.recipient_name || 'GDG RIT'}</span>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-300">{ach.date}</td>
                      <td className="py-3.5 pr-4 text-slate-400 truncate max-w-[260px]">{ach.description}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteAchievement(ach.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete achievement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Activity Form */}
      {activityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg surface-3d rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Add Technical Activity</h2>
            <p className="text-xs text-slate-400 mb-6">Record a workshop, study jam, or coding session.</p>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="e.g. Flutter Mobile Development Masterclass"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={activityForm.category}
                    onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="STUDY_JAM">STUDY JAM</option>
                    <option value="CEREMONY">CEREMONY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={activityForm.date}
                    onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Key Highlights / Impact Metrics
                </label>
                <input
                  type="text"
                  value={activityForm.highlights}
                  onChange={(e) => setActivityForm({ ...activityForm, highlights: e.target.value })}
                  placeholder="e.g. 100+ attendees, 15 projects built"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Detailed Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActivityModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Achievement Form */}
      {achievementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg surface-3d rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Add Community Achievement</h2>
            <p className="text-xs text-slate-400 mb-6">Document a major club milestone or award honor.</p>

            <form onSubmit={handleCreateAchievement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  placeholder="e.g. Best Emerging Campus Community Award"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={achievementForm.category}
                    onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="COMPETITION">COMPETITION</option>
                    <option value="RECOGNITION">RECOGNITION</option>
                    <option value="OPEN_SOURCE">OPEN SOURCE</option>
                    <option value="MILESTONE">MILESTONE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={achievementForm.date}
                    onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Recipient / Team Name
                </label>
                <input
                  type="text"
                  value={achievementForm.recipient_name}
                  onChange={(e) => setAchievementForm({ ...achievementForm, recipient_name: e.target.value })}
                  placeholder="e.g. GDG on Campus RIT Core Team"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Summary Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={achievementForm.description}
                  onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAchievementModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
