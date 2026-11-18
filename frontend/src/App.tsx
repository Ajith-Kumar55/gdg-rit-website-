import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Eagerly loaded landing page for fastest LCP
import { HomePage } from './pages/HomePage';

// Lazy-loaded Public Pages for optimal bundle splitting
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage })));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage').then((m) => ({ default: m.ActivitiesPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const TeamPage = lazy(() => import('./pages/TeamPage').then((m) => ({ default: m.TeamPage })));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage').then((m) => ({ default: m.CertificatesPage })));
const MembershipPage = lazy(() => import('./pages/MembershipPage').then((m) => ({ default: m.MembershipPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Lazy-loaded Admin Portal Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage').then((m) => ({ default: m.AdminEventsPage })));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/AdminRegistrationsPage').then((m) => ({ default: m.AdminRegistrationsPage })));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage').then((m) => ({ default: m.AdminGalleryPage })));
const AdminMembersPage = lazy(() => import('./pages/admin/AdminMembersPage').then((m) => ({ default: m.AdminMembersPage })));
const AdminCertificatesPage = lazy(() => import('./pages/admin/AdminCertificatesPage').then((m) => ({ default: m.AdminCertificatesPage })));
const AdminMembershipPage = lazy(() => import('./pages/admin/AdminMembershipPage').then((m) => ({ default: m.AdminMembershipPage })));
const AdminContactPage = lazy(() => import('./pages/admin/AdminContactPage').then((m) => ({ default: m.AdminContactPage })));
const AdminActivitiesPage = lazy(() => import('./pages/admin/AdminActivitiesPage').then((m) => ({ default: m.AdminActivitiesPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#080B14]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#4285F4]/20 border-t-[#00D4FF] rounded-full animate-spin" />
      <span className="text-xs text-[#A6B0C3] font-medium tracking-wide">Loading GDG on Campus RIT...</span>
    </div>
  </div>
);

// Scroll to top helper on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Layout and Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="events/:slug" element={<EventDetailPage />} />
                    <Route path="activities" element={<ActivitiesPage />} />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="team" element={<TeamPage />} />
                    <Route path="certificates" element={<CertificatesPage />} />
                    <Route path="membership" element={<MembershipPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Admin Authentication Route */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Protected Admin Control Panel */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="events" element={<AdminEventsPage />} />
                    <Route path="registrations" element={<AdminRegistrationsPage />} />
                    <Route path="gallery" element={<AdminGalleryPage />} />
                    <Route path="members" element={<AdminMembersPage />} />
                    <Route path="certificates" element={<AdminCertificatesPage />} />
                    <Route path="membership" element={<AdminMembershipPage />} />
                    <Route path="contact" element={<AdminContactPage />} />
                    <Route path="activities" element={<AdminActivitiesPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
};

export default App;
