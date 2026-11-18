import React, { useEffect, useState } from 'react';
import {
  Bell,
  Lock,
  Globe,
  Trash2,
  Save,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { AnnouncementItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'announcements' | 'website' | 'security'>('announcements');

  // Announcements state matching backend AnnouncementCreate schema
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    link_url: '',
    badge: 'NEW',
    is_active: true,
  });

  // Website settings state
  const [websiteSettings, setWebsiteSettings] = useState<Record<string, string>>({
    site_title: 'GDG on Campus – Rajeev Institute of Technology, Hassan',
    tagline: 'Learn. Build. Connect. Innovate.',
    contact_email: 'gdgoncampusgdgclubrit@gmail.com',
    instagram_handle: '@gdg_club_rit',
    whatsapp_main_link: 'https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1',
    whatsapp_nov_link: 'https://chat.whatsapp.com/IbvN7a5LEGpGqVoffjDWPw?s=cl&p=a&iam=2',
    github_link: 'https://github.com/Yashawantha26/codestorm-2026.git',
    developer_credit: 'Designed & Developed by Yashawantha H M',
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    fetchWebsiteSettings();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true);
      const data = await apiService.getAdminAnnouncements();
      setAnnouncements(data);
    } catch {
      addToast('Failed to load announcements', 'error');
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchWebsiteSettings = async () => {
    try {
      const data = await apiService.getContentSettings();
      if (data && Object.keys(data).length > 0) {
        setWebsiteSettings((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // Use defaults if empty
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      addToast('Please enter both title and message for announcement', 'error');
      return;
    }

    try {
      await apiService.createAnnouncement(newAnnouncement);
      addToast('Announcement posted and live on banner', 'success');
      setNewAnnouncement({
        title: '',
        content: '',
        link_url: '',
        badge: 'NEW',
        is_active: true,
      });
      fetchAnnouncements();
    } catch {
      addToast('Failed to post announcement', 'error');
    }
  };

  const handleToggleAnnouncement = async (id: number) => {
    try {
      const res = await apiService.toggleAnnouncement(id);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: res.is_active } : a))
      );
      addToast('Announcement visibility updated', 'success');
    } catch {
      addToast('Failed to toggle announcement', 'error');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await apiService.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      addToast('Announcement removed', 'success');
    } catch {
      addToast('Failed to delete announcement', 'error');
    }
  };

  const handleSaveSetting = async (key: string, value: string) => {
    try {
      await apiService.setContentSetting(key, value);
      addToast(`Updated ${key.replace(/_/g, ' ')}`, 'success');
    } catch {
      addToast('Failed to save setting', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      addToast('New password and confirmation do not match', 'error');
      return;
    }

    if (passwords.new_password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setSavingPassword(true);
      await apiService.changePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      addToast('Administrator password updated successfully', 'success');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to change password. Verify your current password.';
      addToast(msg, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">System Settings & Controls</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage banner broadcasts, public club links, contact information, and administrative security
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'announcements'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Live Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'website'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Site Content & Socials</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Passwords</span>
        </button>
      </div>

      {/* Tab 1: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Post New Announcement */}
          <div className="p-6 rounded-2xl surface-3d">
            <h2 className="text-base font-bold text-white mb-1">Create Broadcast Announcement</h2>
            <p className="text-xs text-slate-400 mb-4">
              Broadcast high-priority notices, registrations opening, and hackathon schedules on the top marquee banner.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Announcement Headline <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="e.g. CODESTORM 2026 Registration Open"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Badge Label
                  </label>
                  <select
                    value={newAnnouncement.badge}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, badge: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="LIVE">LIVE</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Message Content <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="e.g. Registrations for Rajeev Institute of Technology's flagship hackathon are now open!"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Action Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.link_url}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, link_url: e.target.value })}
                    placeholder="/events/codestorm-2026 or https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.is_active}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_active: e.target.checked })}
                      className="rounded bg-white/5 border-white/10 text-blue-500"
                    />
                    <span>Publish & Activate Immediately</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-3d-primary px-6 py-2.5 rounded-xl text-white text-xs font-bold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>

          {/* Announcements Table */}
          <div className="p-6 rounded-2xl surface-3d">
            <h3 className="text-sm font-bold text-white mb-4">Active & Archived Broadcasts</h3>
            {loadingAnnouncements ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No announcements in history.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {announcements.map((a) => (
                  <div key={a.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.badge === 'URGENT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          a.badge === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          a.badge === 'UPCOMING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {a.badge}
                        </span>
                        <h4 className="font-bold text-white text-xs">{a.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400">{a.content}</p>
                      {a.link_url && <p className="text-[10px] text-blue-400 font-mono truncate">{a.link_url}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleAnnouncement(a.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          a.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {a.is_active ? 'Broadcasting Live' : 'Hidden'}
                      </button>

                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Site Content & Socials */}
      {activeTab === 'website' && (
        <div className="p-6 rounded-2xl surface-3d space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Official Club Information</h2>
            <p className="text-xs text-slate-400">
              Customize dynamic branding variables, contact emails, WhatsApp group invitations, and developer credits.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(websiteSettings).map(([key, val]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="sm:w-1/3">
                  <span className="font-mono text-xs font-semibold text-slate-300 block capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{key}</span>
                </div>

                <div className="sm:w-2/3 flex items-center gap-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) =>
                      setWebsiteSettings({ ...websiteSettings, [key]: e.target.value })
                    }
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSaveSetting(key, val)}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Passwords */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl surface-3d max-w-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Administrator Password Security</h2>
              <p className="text-xs text-slate-400">Update your control panel access key</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Current Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                New Secure Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirm New Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
