import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { MembershipApplicationItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminMembershipPage: React.FC = () => {
  const { addToast } = useToast();
  const [applications, setApplications] = useState<MembershipApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMembershipApplications(
        statusFilter !== 'ALL' ? statusFilter : undefined
      );
      setApplications(data);
    } catch (err) {
      addToast('Failed to load membership applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiService.updateMembershipStatus(id, status);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      addToast(`Application status updated to ${status}`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this membership application?')) {
      return;
    }
    try {
      await apiService.deleteMembershipApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      addToast('Application deleted', 'success');
    } catch (err) {
      addToast('Failed to delete application', 'error');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast('Code copied', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Membership Applications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review and evaluate student candidates applying to join the GDG on Campus RIT collective
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#101625] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Applications</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved Members</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-6 rounded-2xl surface-3d">
        <div className="pb-4 border-b border-white/10 mb-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Total records: <strong className="text-white">{applications.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No membership applications found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">App Code</th>
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Department & Year</th>
                  <th className="pb-3">Tech Interests</th>
                  <th className="pb-3">Statement of Purpose</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-400">
                        <span>{app.application_code}</span>
                        <button
                          onClick={() => copyCode(app.application_code)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                          title="Copy tracking ID"
                        >
                          {copiedCode === app.application_code ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="font-bold text-white">{app.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{app.email}</p>
                      <p className="text-[10px] text-slate-500">{app.phone}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-slate-200 font-medium truncate max-w-[140px]">{app.department}</p>
                      <p className="text-[10px] text-slate-400">{app.year}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-slate-300 line-clamp-2 max-w-[180px]">{app.tech_interests}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-slate-400 line-clamp-2 max-w-[200px]" title={app.reason_for_joining}>
                        {app.reason_for_joining}
                      </p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : app.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="PENDING" className="bg-[#101625] text-white">PENDING</option>
                        <option value="APPROVED" className="bg-[#101625] text-white">APPROVED</option>
                        <option value="REJECTED" className="bg-[#101625] text-white">REJECTED</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete application"
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
    </div>
  );
};
