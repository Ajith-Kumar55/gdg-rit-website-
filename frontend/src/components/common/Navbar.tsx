import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Activities', path: '/activities' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our Team', path: '/team' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0F1E]/90 backdrop-blur-2xl border-b border-[#4285F4]/25 shadow-[0_14px_38px_-12px_rgba(0,0,0,0.85),0_4px_20px_-8px_rgba(66,133,244,0.22)]'
          : 'bg-[#080B14]/78 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.65)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Lockup */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] rounded-xl p-1 shrink-0"
            aria-label="GDG on Campus RIT Hassan Home"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#00D4FF]/40 shadow-[0_6px_18px_-4px_rgba(66,133,244,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-105 bg-white shrink-0">
              <img
                src="/assets/gdg-logo.jpeg"
                alt="GDG on Campus RIT Hassan Logo"
                className="w-full h-full object-contain p-0.5"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#F5F7FF] flex items-center gap-1.5 leading-tight">
                GDG <span className="text-[#00D4FF] font-semibold text-xs sm:text-sm">on Campus</span>
              </span>
              <span className="text-[10px] sm:text-xs text-[#A6B0C3] font-medium tracking-wide">
                RIT HASSAN &middot; CSE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Exact same links & positions) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5" aria-label="Main Navigation" role="navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] ${
                    active
                      ? 'text-[#F5F7FF] bg-gradient-to-b from-[#1A2742] to-[#121C32] border border-[#00D4FF]/35 shadow-[0_6px_16px_-6px_rgba(66,133,244,0.45),inset_0_1px_0_rgba(245,247,255,0.16)]'
                      : 'text-[#A6B0C3] hover:text-[#F5F7FF] hover:bg-[#151E30]/75 border border-transparent hover:border-[#4285F4]/20'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#4285F4] via-[#00D4FF] to-[#A8FF60]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons with 3D Depth */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <a
              href="https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-xl text-xs font-semibold bg-[#151E30]/90 hover:bg-[#1A2740] text-[#A8FF60] border border-[#A8FF60]/30 shadow-[0_8px_18px_-8px_rgba(168,255,96,0.3),inset_0_1px_0_rgba(168,255,96,0.2)] transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
              <span className="hidden xl:inline">Community</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/membership"
              className="inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-2 rounded-xl text-xs font-bold btn-3d-primary whitespace-nowrap"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2.5 rounded-xl bg-[#151E30] border border-[#4285F4]/25 text-[#F5F7FF] hover:border-[#00D4FF]/45 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(245,247,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-[#0E1525]/96 backdrop-blur-2xl border-b border-[#4285F4]/25 px-4 pt-3 pb-6 space-y-3 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.9)] max-h-[82vh] overflow-y-auto"
        >
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#4285F4]/25 to-[#00D4FF]/15 text-[#F5F7FF] border border-[#00D4FF]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                      : 'text-[#A6B0C3] hover:text-[#F5F7FF] hover:bg-[#151E30]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href="https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold btn-3d-highlight"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join GDG WhatsApp Community</span>
            </a>
            <Link
              to="/membership"
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-xs font-bold btn-3d-primary"
            >
              Become a Member
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
