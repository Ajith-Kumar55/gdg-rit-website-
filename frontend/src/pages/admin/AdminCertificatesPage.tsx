import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  FileSpreadsheet
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { CertificateItem, EventItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCertificatesPage: React.FC = () => {
  const { addToast } = useToast();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State matching backend CertificateCreate / CertificateUpdate schemas
  const [formData, setFormData] = useState({
    certificate_code: '',
    student_name: '',
    usn: '',
    event_id: '' as string,
    event_name: 'CODESTORM 2026 – November Edition',
    issue_date: new Date().toISOString().slice(0, 10),
    status: 'VERIFIED',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [certsData, eventsData] = await Promise.all([
        apiService.getCertificates(),
        apiService.getEvents(undefined, true).catch(() => []),
      ]);
      setCertificates(certsData);
      setEvents(eventsData);
    } catch {
      addToast('Failed to load certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCert(null);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      certificate_code: `CODESTORM2026-${randomSuffix}`,
      student_name: '',
      usn: '4RA23CS',
      event_id: events[0]?.id?.toString() || '',
      event_name: events[0]?.title || 'CODESTORM 2026 – November Edition',
      issue_date: new Date().toISOString().slice(0, 10),
      status: 'VERIFIED',
    });
    setModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormData({
      certificate_code: cert.certificate_code,
      student_name: cert.student_name,
      usn: cert.usn || '',
      event_id: cert.event_id ? cert.event_id.toString() : '',
      event_name: cert.event_name,
      issue_date: cert.issue_date,
      status: cert.status,
    });
    setModalOpen(true);
  };

  const handleEventSelect = (evId: string) => {
    const found = events.find((e) => e.id.toString() === evId);
    setFormData((prev) => ({
      ...prev,
      event_id: evId,
      event_name: found ? found.title : prev.event_name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<CertificateItem> = {
        certificate_code: formData.certificate_code,
        student_name: formData.student_name,
        usn: formData.usn || undefined,
        event_id: formData.event_id ? parseInt(formData.event_id) : undefined,
        event_name: formData.event_name,
        issue_date: formData.issue_date,
        status: formData.status,
      };

      if (editingCert) {
        await apiService.updateCertificate(editingCert.id, payload);
        addToast('Certificate record updated', 'success');
      } else {
        await apiService.createCertificate(payload);
        addToast('Certificate issued and registered successfully', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save certificate';
      addToast(msg, 'error');
    }
  };

  const toggleStatus = async (cert: CertificateItem) => {
    const nextStatus = cert.status === 'VERIFIED' ? 'REVOKED' : 'VERIFIED';
    try {
      await apiService.updateCertificate(cert.id, { status: nextStatus });
      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, status: nextStatus } : c))
      );
      addToast(`Certificate marked as ${nextStatus}`, 'success');
    } catch {
      addToast('Failed to update certificate status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this certificate?')) {
      return;
    }
    try {
      await apiService.deleteCertificate(id);
      addToast('Certificate deleted', 'success');
      fetchData();
    } catch {
      addToast('Failed to delete certificate', 'error');
    }
  };

  const exportCsv = () => {
    const headers = ['Certificate Code', 'Student Name', 'USN', 'Event Name', 'Issue Date', 'Status', 'Verifications'];
    const rows = filtered.map((c) => [
      c.certificate_code,
      `"${c.student_name.replace(/"/g, '""')}"`,
      c.usn || '',
      `"${c.event_name.replace(/"/g, '""')}"`,
      c.issue_date,
      c.status,
      c.verification_count.toString(),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gdg_rit_certificates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Certificates exported as CSV', 'success');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    addToast('Certificate code copied', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = certificates.filter(
    (c) =>
      !search ||
      c.certificate_code.toLowerCase().includes(search.toLowerCase()) ||
      c.student_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.usn && c.usn.toLowerCase().includes(search.toLowerCase())) ||
      c.event_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Digital Certificate Registry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Issue, edit, approve/revoke, link to events, and export verifiable student achievement certificates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="btn-3d-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl surface-3d flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Code, Student Name, USN, or Event..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Showing <strong className="text-white">{filtered.length}</strong> certificates
        </span>
      </div>

      {/* Certificates Table */}
      <div className="p-6 rounded-2xl surface-3d">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading certificate registry...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No certificates matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Certificate Code</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">USN</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Issue Date</th>
                  <th className="pb-3">Status (Click to Toggle)</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400">
                        <span>{c.certificate_code}</span>
                        <button
                          onClick={() => copyCode(c.certificate_code)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                          title="Copy Code"
                        >
                          {copiedId === c.certificate_code ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-white">{c.student_name}</td>
                    <td className="py-3.5 pr-4 font-mono text-slate-300">{c.usn || 'N/A'}</td>
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-200">{c.event_name}</p>
                      <span className="text-[10px] text-slate-500">{c.verification_count} verifications</span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-400">{c.issue_date}</td>
                    <td className="py-3.5 pr-4">
                      <button
                        onClick={() => toggleStatus(c)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          c.status === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Click to approve or revoke"
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href="/certificates"
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                          title="Verify on public portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                          title="Edit certificate"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete certificate"
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

      {/* Modal: Issue / Edit Certificate */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg surface-3d rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">
              {editingCert ? 'Edit Certificate Record' : 'Issue Digital Certificate'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Approved certificates are instantly verifiable on the public portal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Certificate Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCert}
                    value={formData.certificate_code}
                    onChange={(e) => setFormData({ ...formData, certificate_code: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    USN Number
                  </label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                    placeholder="4RA23CS001"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Student / Recipient Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. Yashawantha H M"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Link to Official Event
                </label>
                <select
                  value={formData.event_id}
                  onChange={(e) => handleEventSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="">Custom Event Name</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id.toString()}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Event Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.event_name}
                    onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Verification Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="VERIFIED">VERIFIED (Approved)</option>
                    <option value="REVOKED">REVOKED (Rejected)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
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
                  {editingCert ? 'Save Changes' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
