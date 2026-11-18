import React, { useEffect, useState } from 'react';
import {
  Trash2,
  CheckCircle,
  Clock,
  Send,
  Search
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { ContactMessageItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactMessages();
      setMessages(data);
    } catch {
      addToast('Failed to load contact messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await apiService.markMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
      addToast('Marked as read', 'success');
    } catch {
      addToast('Failed to mark message as read', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      await apiService.deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      addToast('Message deleted', 'success');
    } catch {
      addToast('Failed to delete message', 'error');
    }
  };

  const filtered = messages.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Public Messages &amp; Inquiries</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, review, mark as read, reply, and manage incoming campus communications
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, subject, or message..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101625] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF] text-xs"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="p-6 rounded-2xl surface-3d">
        <div className="pb-4 border-b border-white/10 mb-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filtered.length}</strong> of{' '}
            <strong className="text-white">{messages.length}</strong> inquiries
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading messages...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No contact messages matching search.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  m.is_read
                    ? 'bg-white/[0.01] border-white/5 opacity-80'
                    : 'bg-blue-500/[0.03] border-blue-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {m.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{m.name}</h3>
                      <p className="text-xs text-blue-400">{m.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {m.created_at ? new Date(m.created_at).toLocaleString() : 'Recent'}
                    </span>
                    {!m.is_read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        New Message
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-black/20 p-4 rounded-xl mb-4 border border-white/5">
                  <h4 className="font-semibold text-xs text-slate-200 mb-1">Subject: {m.subject}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{m.message}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  {!m.is_read && (
                    <button
                      onClick={() => handleMarkRead(m.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mark Read</span>
                    </button>
                  )}

                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)} - GDG on Campus RIT Hassan`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete message"
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
  );
};
