import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users2,
  Image,
  Award,
  UserPlus,
  Mail,
  Zap,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCard3DTilt } from '../hooks/useCard3DTilt';

export const AdminLayout: React.FC = () => {
  const { admin, token, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useCard3DTilt();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#4285F4]/20 border-t-[#00D4FF] rounded-full animate-spin" />
          <p className="text-sm text-[#A6B0C3] font-medium">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events Manager', path: '/admin/events', icon: Calendar },
    { name: 'Registrations', path: '/admin/registrations', icon: Users2 },
    { name: 'Gallery & Media', path: '/admin/gallery', icon: Image },
    { name: 'Team Members', path: '/admin/members', icon: Users2 },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Membership', path: '/admin/membership', icon: UserPlus },
    { name: 'Messages', path: '/admin/contact', icon: Mail },
    { name: 'Activities & Awards', path: '/admin/activities', icon: Zap },
    { name: 'Announcements', path: '/admin/settings', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F5F7FF] flex flex-col lg:flex-row">
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#101625] border-b border-[#4285F4]/20 shadow-lg">
        <div className="flex items-center space-x-2.5">
          <img src="/assets/gdg-logo.jpeg" alt="GDG" className="w-8 h-8 rounded-full bg-white p-0.5 border border-[#00D4FF]/40" />
          <span className="font-bold text-sm text-[#F5F7FF]">GDG Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close admin sidebar' : 'Open admin sidebar'}
          className="p-2 rounded-lg bg-[#151E30] border border-[#4285F4]/25 text-[#F5F7FF] hover:border-[#00D4FF]/45"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/75 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 3D Layered Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-[#101625] via-[#0D1322] to-[#080B14] border-r border-[#4285F4]/20 shadow-[8px_0_32px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#4285F4]/20">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00D4FF]/40 bg-white p-0.5 shrink-0 shadow-[0_6px_16px_-4px_rgba(66,133,244,0.45)]">
              <img src="/assets/gdg-logo.jpeg" alt="GDG Logo" className="w-full h-full object-contain" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-sm text-[#F5F7FF] leading-tight truncate">
                GDG on Campus
              </h2>
              <span className="text-[11px] text-[#00D4FF] font-semibold tracking-wider uppercase">
                Control Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'btn-3d-primary'
                      : 'text-[#A6B0C3] hover:text-[#F5F7FF] hover:bg-[#151E30]/90 border border-transparent hover:border-[#4285F4]/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#A6B0C3]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#4285F4]/20 bg-[#0A0F1D] space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[#4285F4]/20 border border-[#00D4FF]/40 flex items-center justify-center font-bold text-xs text-[#00D4FF] shadow-inner">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="text-xs overflow-hidden">
              <p className="font-semibold text-[#F5F7FF] truncate">{admin?.full_name || admin?.username}</p>
              <p className="text-[10px] text-[#A6B0C3] truncate">{admin?.role || 'Admin'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg btn-3d-secondary text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>Public Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg bg-[#FF7043]/15 hover:bg-[#FF7043]/25 border border-[#FF7043]/35 text-[#FF7043] transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar for desktop */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-[#101625]/85 backdrop-blur-xl border-b border-[#4285F4]/20 sticky top-0 z-30 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-2 text-xs text-[#A6B0C3]">
            <span className="text-[#F5F7FF] font-semibold">GDG RIT Hassan</span>
            <span>/</span>
            <span className="capitalize text-[#00D4FF] font-semibold">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-3d-secondary text-xs font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>View Live Website</span>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
