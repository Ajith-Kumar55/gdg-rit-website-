import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Upload
} from 'lucide-react';
import { apiService, getAssetUrl } from '../../services/api';
import type { EventItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminEventsPage: React.FC = () => {
  const { addToast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Full Form state matching backend EventCreate / EventUpdate schemas
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'WORKSHOP',
    description: '',
    event_date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    event_time: '09:00 AM - 05:00 PM',
    venue: 'Civil Block Seminar Hall, RIT Hassan',
    registration_deadline: '',
    max_participants: 100,
    agenda: '',
    speakers: '',
    coordinators: 'Prof. Dinesh S, Yashawantha H M',
    eligibility: 'Open to all engineering students',
    rules: '',
    poster_url: '',
    registration_open: true,
    is_published: true,
  });

  const [uploadingPoster, setUploadingPoster] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEvents(undefined, true);
      setEvents(data);
    } catch {
      addToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      slug: '',
      category: 'WORKSHOP',
      description: '',
      event_date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      event_time: '09:00 AM - 05:00 PM',
      venue: 'Civil Block Seminar Hall, RIT Hassan',
      registration_deadline: '',
      max_participants: 100,
      agenda: '',
      speakers: '',
      coordinators: 'Prof. Dinesh S, Yashawantha H M',
      eligibility: 'Open to all engineering students',
      rules: '',
      poster_url: '',
      registration_open: true,
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (ev: EventItem) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      slug: ev.slug,
      category: ev.category,
      description: ev.description || '',
      event_date: ev.event_date || '',
      event_time: ev.event_time || '09:00 AM - 05:00 PM',
      venue: ev.venue || '',
      registration_deadline: ev.registration_deadline || '',
      max_participants: ev.max_participants || 100,
      agenda: ev.agenda || '',
      speakers: ev.speakers || '',
      coordinators: ev.coordinators || '',
      eligibility: ev.eligibility || 'Open to all engineering students',
      rules: ev.rules || '',
      poster_url: ev.poster_url || '',
      registration_open: ev.registration_open,
      is_published: ev.is_published,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingEvent
        ? prev.slug
        : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    }));
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPoster(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiService.uploadPoster(fd);
      setFormData((prev) => ({ ...prev, poster_url: res.url }));
      addToast('Poster image uploaded successfully', 'success');
    } catch {
      addToast('Failed to upload image file', 'error');
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await apiService.updateEvent(editingEvent.id, formData);
        addToast('Event updated successfully', 'success');
      } else {
        await apiService.createEvent(formData);
        addToast('Event created successfully', 'success');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save event';
      addToast(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove associated registrations.')) {
      return;
    }
    try {
      await apiService.deleteEvent(id);
      addToast('Event deleted successfully', 'success');
      fetchEvents();
    } catch {
      addToast('Failed to delete event', 'error');
    }
  };

  const toggleStatus = async (ev: EventItem, field: 'registration_open' | 'is_published') => {
    try {
      const payload = { [field]: !ev[field] };
      await apiService.updateEvent(ev.id, payload);
      setEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? { ...e, [field]: !e[field] } : e))
      );
      addToast(`Updated ${field.replace(/_/g, ' ')}`, 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Events Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, publish, edit, and monitor all GDG RIT technical events &amp; workshops
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-3d-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table */}
      <div className="p-6 rounded-2xl surface-3d overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No events found. Click "Create New Event" to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Event Details</th>
                  <th className="pb-3">Category / Seats</th>
                  <th className="pb-3">Date &amp; Venue</th>
                  <th className="pb-3">Reg. Open</th>
                  <th className="pb-3">Published</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAssetUrl(ev.poster_url)}
                          alt={ev.title}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 bg-black/40 shrink-0"
                        />
                        <div className="max-w-[240px]">
                          <p className="font-bold text-white truncate">{ev.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{ev.description}</p>
                          <span className="text-[10px] text-blue-400 font-mono">/{ev.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mr-1.5">
                        {ev.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {ev.current_participants}/{ev.max_participants}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <p className="text-white font-medium">{ev.event_date}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{ev.venue}</p>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleStatus(ev, 'registration_open')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          ev.registration_open
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                      >
                        {ev.registration_open ? 'Open' : 'Closed'}
                      </button>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleStatus(ev, 'is_published')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          ev.is_published
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/30 hover:bg-slate-500/20'
                        }`}
                      >
                        {ev.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/events/${ev.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                          title="View public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(ev)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete event"
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

      {/* Modal: Create / Edit Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl surface-3d rounded-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-1">
              {editingEvent ? 'Edit Event Details' : 'Create New Technical Event'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Configure event details, agenda, speakers, coordinators, rules, and poster image.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Event Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. CODESTORM 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    URL Slug <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="codestorm-2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="CEREMONY">CEREMONY</option>
                    <option value="STUDY_JAM">STUDY JAM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Event Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Reg. Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Max Seats
                  </label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 100 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Event Time
                  </label>
                  <input
                    type="text"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Venue Location <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="ME Block Seminar Hall, RIT Hassan"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Detailed Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide comprehensive details about this event..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Speakers / Resource Persons
                  </label>
                  <input
                    type="text"
                    value={formData.speakers}
                    onChange={(e) => setFormData({ ...formData, speakers: e.target.value })}
                    placeholder="e.g. Dr. Suresha D, Industry Mentors"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Event Coordinators
                  </label>
                  <input
                    type="text"
                    value={formData.coordinators}
                    onChange={(e) => setFormData({ ...formData, coordinators: e.target.value })}
                    placeholder="e.g. Prof. Dinesh S, Yashawantha H M"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Agenda / Schedule
                  </label>
                  <textarea
                    rows={2}
                    value={formData.agenda}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                    placeholder="09:00 AM Check-in, 10:00 AM Keynote, 02:00 PM Hackathon Sprint..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eligibility &amp; Rules
                  </label>
                  <textarea
                    rows={2}
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    placeholder="Bring laptops, valid student ID, original code submissions..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Poster Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Poster Image (Upload File or URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    placeholder="/assets/gdg-logo.jpeg or https://..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPoster ? 'Uploading...' : 'Upload Poster'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                      disabled={uploadingPoster}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.registration_open}
                    onChange={(e) => setFormData({ ...formData, registration_open: e.target.checked })}
                    className="rounded bg-white/5 border-white/10 text-blue-500"
                  />
                  <span>Registration Open</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-white/5 border-white/10 text-blue-500"
                  />
                  <span>Published on Public Site</span>
                </label>
              </div>

              {/* Actions */}
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
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
