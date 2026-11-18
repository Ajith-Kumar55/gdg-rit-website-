import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Upload
} from 'lucide-react';
import { apiService, getAssetUrl } from '../../services/api';
import type { MemberItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminMembersPage: React.FC = () => {
  const { addToast } = useToast();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);

  // Form State matching backend MemberCreate / MemberUpdate schemas
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'STUDENT',
    department: 'Computer Science & Engineering',
    academic_year: '2026-2027',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    github_url: '',
    email: '',
    sort_order: 10,
    is_active: true,
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminMembers();
      setMembers(data);
    } catch {
      addToast('Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      category: 'STUDENT',
      department: 'Computer Science & Engineering',
      academic_year: '2026-2027',
      bio: '',
      photo_url: '',
      linkedin_url: '',
      github_url: '',
      email: '',
      sort_order: members.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (m: MemberItem) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      category: m.category,
      department: m.department || '',
      academic_year: m.academic_year || '2026-2027',
      bio: m.bio || '',
      photo_url: m.photo_url || '',
      linkedin_url: m.linkedin_url || '',
      github_url: m.github_url || '',
      email: m.email || '',
      sort_order: m.sort_order,
      is_active: m.is_active,
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiService.uploadMemberPhoto(fd);
      setFormData((prev) => ({ ...prev, photo_url: res.url }));
      addToast('Photo uploaded successfully', 'success');
    } catch {
      addToast('Failed to upload photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await apiService.updateMember(editingMember.id, formData);
        addToast('Member profile updated', 'success');
      } else {
        await apiService.createMember(formData);
        addToast('New member added to directory', 'success');
      }
      setModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save member';
      addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }
    try {
      await apiService.deleteMember(id);
      addToast('Member removed', 'success');
      fetchMembers();
    } catch {
      addToast('Failed to delete member', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Team & Leadership Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage faculty coordinators, lead organizers, and domain leads for GDG on Campus RIT Hassan
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-3d-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="p-6 rounded-2xl surface-3d">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading team directory...</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Member</th>
                  <th className="pb-3">Role & Category</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAssetUrl(m.photo_url)}
                          alt={m.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 bg-white/5 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white">{m.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{m.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-slate-200">{m.role}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 truncate max-w-[160px]">
                      {m.department}
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-slate-400">
                      #{m.sort_order}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {m.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                          title="Edit member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Member */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl surface-3d rounded-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-1">
              {editingMember ? 'Edit Member Profile' : 'Add Team Member'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Configure leadership profile, official department assignment, and social links.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yashawantha H M"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Role Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Organizer / Club Lead"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="FACULTY">FACULTY</option>
                    <option value="LEADERSHIP">LEADERSHIP</option>
                    <option value="STUDENT">STUDENT / CORE TEAM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Computer Science & Eng"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Short Bio / Specialization
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Passionate about cloud architecture, community mentoring, and full-stack software development..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Member Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="/assets/gdg-logo.jpeg or https://..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPhoto ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded bg-white/5 border-white/10 text-blue-500"
                  />
                  <span>Active & Visible on Public Team Page</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-600/30"
                >
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
