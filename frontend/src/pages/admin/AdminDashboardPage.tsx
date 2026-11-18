import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users2,
  Award,
  Image,
  UserPlus,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { DashboardStats, RegistrationItem, ContactMessageItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, regRes, msgRes] = await Promise.all([
        apiService.getDashboardStats().catch(() => null),
        apiService.getRegistrations().catch(() => []),
        apiService.getContactMessages().catch(() => []),
      ]);
      setStats(statsRes);
      setRegistrations(regRes.slice(0, 5));
      setMessages(msgRes.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Events',
      value: stats?.total_events ?? 4,
      sub: `${stats?.upcoming_events ?? 2} upcoming events`,
      icon: Calendar,
      color: 'from-blue-600 to-indigo-600',
      link: '/admin/events',
    },
    {
      title: 'Event Registrations',
      value: stats?.total_registrations ?? 0,
      sub: 'Across all club events',
      icon: Users2,
      color: 'from-emerald-600 to-teal-600',
      link: '/admin/registrations',
    },
    {
      title: 'Gallery Media',
      value: stats?.gallery_images ?? 6,
      sub: 'Photos & event captures',
      icon: Image,
      color: 'from-purple-600 to-pink-600',
      link: '/admin/gallery',
    },
    {
      title: 'Active Certificates',
      value: stats?.certificates ?? 3,
      sub: 'Digitally verifiable',
      icon: Award,
      color: 'from-amber-600 to-orange-600',
      link: '/admin/certificates',
    },
    {
      title: 'Team Members',
      value: stats?.total_members ?? 12,
      sub: 'Faculty, Leads & Core',
      icon: Users2,
      color: 'from-cyan-600 to-blue-600',
      link: '/admin/members',
    },
    {
      title: 'Membership Apps',
      value: stats?.membership_applications ?? 0,
      sub: `${stats?.pending_applications ?? 0} pending review`,
      icon: UserPlus,
      color: 'from-rose-600 to-red-600',
      link: '/admin/membership',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, {admin?.full_name || admin?.username}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            GDG on Campus &bull; Rajeev Institute of Technology &bull; Control Center
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-3d-primary font-semibold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Event</span>
          </Link>

          <button
            type="button"
            onClick={() => apiService.downloadRegistrationsCsv()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-3d-secondary font-semibold text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#A8FF60]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className="p-6 rounded-2xl surface-3d card-3d group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider">{c.title}</p>
                  <h3 className="text-3xl font-black text-[#F5F7FF] mt-1 font-mono">
                    {loading ? '...' : c.value}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} p-2.5 flex items-center justify-center text-white shadow-[0_10px_20px_-6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A6B0C3]">
                <span>{c.sub}</span>
                <span className="text-[#00D4FF] group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tables: Recent Registrations & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Registrations */}
        <div className="lg:col-span-7 p-6 rounded-2xl surface-3d">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#F5F7FF]">Recent Event Registrations</h2>
              <p className="text-xs text-[#A6B0C3]">Latest participant sign-ups</p>
            </div>
            <Link to="/admin/registrations" className="text-xs text-[#00D4FF] hover:text-[#A8FF60] font-semibold">
              View All &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#A6B0C3]">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A6B0C3]">No registrations received yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#4285F4]/20 text-[#A6B0C3] font-semibold uppercase tracking-wider">
                    <th className="pb-3">Code</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Event</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#151E30]/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#00D4FF]">{reg.registration_code}</td>
                      <td className="py-3 text-[#F5F7FF] font-medium">{reg.full_name}</td>
                      <td className="py-3 text-[#A6B0C3] truncate max-w-[140px]">{reg.event_title}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A8FF60]/12 text-[#A8FF60] border border-[#A8FF60]/30">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="lg:col-span-5 p-6 rounded-2xl surface-3d">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#F5F7FF]">Recent Messages</h2>
              <p className="text-xs text-[#A6B0C3]">Public contact form inquiries</p>
            </div>
            <Link to="/admin/contact" className="text-xs text-[#00D4FF] hover:text-[#A8FF60] font-semibold">
              View All &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#A6B0C3]">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A6B0C3]">No contact messages received.</div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-[#101625] border border-[#4285F4]/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#F5F7FF] truncate">{m.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${m.is_read ? 'bg-white/5 text-[#A6B0C3]' : 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30'}`}>
                      {m.is_read ? 'Read' : 'New'}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F7FF]/90 font-medium truncate">{m.subject}</p>
                  <p className="text-[11px] text-[#A6B0C3] line-clamp-1">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
