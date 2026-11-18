import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AnnouncementBanner } from '../components/common/AnnouncementBanner';
import { useCard3DTilt } from '../hooks/useCard3DTilt';

export const MainLayout: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useCard3DTilt();

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14] text-[#F5F7FF] relative selection:bg-[#4285F4] selection:text-white overflow-x-clip">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#4285F4] focus:text-white focus:text-xs focus:font-bold focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Unified Sticky Top Shell */}
      <div className="sticky top-0 z-40 w-full">
        <AnnouncementBanner />
        <Navbar />
      </div>

      <main id="main-content" className="flex-grow relative" role="main">
        <Outlet />
      </main>

      <Footer />

      {/* 3D Tactile Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full btn-3d-primary backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] no-print"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
