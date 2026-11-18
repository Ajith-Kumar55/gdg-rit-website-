import React, { useEffect, useState } from 'react';
import {
  Search,
  FileSpreadsheet,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { RegistrationItem, EventItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminRegistrationsPage: React.FC = () => {
  const { addToast } = useToast();
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [regs, evs] = await Promise.all([
        apiService.getRegistrations(),
        apiService.getEvents(undefined, true),
      ]);
      setRegistrations(regs);
      setEvents(evs);
    } catch (err) {
      addToast('Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiService.updateRegistrationStatus(id, status);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      addToast(`Status updated to ${status}`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this registration record?')) {
      return;
    }
    try {
      await apiService.deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      addToast('Registration record deleted', 'success');
    } catch (err) {
      addToast('Failed to delete registration', 'error');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    addToast('Code copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter registrations locally based on criteria
  const filtered = registrations.filter((r) => {
    const matchesSearch =
      !search ||
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.registration_code.toLowerCase().includes(search.toLowerCase()) ||
      (r.usn && r.usn.toLowerCase().includes(search.toLowerCase()));

    const matchesEvent =
      selectedEventId === 'all' || r.event_id.toString() === selectedEventId;

    const matchesDept =
      selectedDept === 'all' || r.department.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesSearch && matchesEvent && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Event Registrations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review participant registrations, verify student USNs, and export attendee rosters
          </p>
        </div>

        <button
          onClick={async () => {
            try {
              await apiService.downloadRegistrationsCsv(
                selectedEventId !== 'all' ? parseInt(selectedEventId) : undefined
              );
              addToast('Registrations CSV exported successfully', 'success');
            } catch {
              addToast('Failed to export CSV', 'error');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-600/20"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Filtered Roster (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl surface-3d grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, USN, Code, or Email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Events ({events.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id.toString()}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="computer science">Computer Science & Eng</option>
            <option value="information science">Information Science</option>
            <option value="artificial intelligence">AI & Data Science</option>
            <option value="electronics">Electronics & Comm</option>
            <option value="mechanical">Mechanical Eng</option>
            <option value="civil">Civil Eng</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="p-6 rounded-2xl surface-3d">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filtered.length}</strong> of{' '}
            <strong className="text-white">{registrations.length}</strong> total registrations
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading registrations...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No registrations matching your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Pass Code</th>
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">USN / Branch</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-blue-400">
                        <span>{r.registration_code}</span>
                        <button
                          onClick={() => copyCode(r.registration_code)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                          title="Copy pass code"
                        >
                          {copiedId === r.registration_code ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="font-semibold text-white">{r.full_name}</p>
                      <p className="text-[10px] text-slate-400">{r.year}</p>
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="font-mono text-slate-300 font-medium">{r.usn || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{r.department}</p>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className="font-medium text-slate-200 line-clamp-1 max-w-[140px]">
                        {r.event_title}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="text-slate-300 truncate max-w-[140px]">{r.email}</p>
                      <p className="text-[10px] text-slate-400">{r.phone}</p>
                    </td>
                    <td className="py-3.5 pr-3">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : r.status === 'WAITLIST'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="CONFIRMED" className="bg-[#101625] text-white">CONFIRMED</option>
                        <option value="WAITLIST" className="bg-[#101625] text-white">WAITLIST</option>
                        <option value="CANCELLED" className="bg-[#101625] text-white">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete registration"
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
