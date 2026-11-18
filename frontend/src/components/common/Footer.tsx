import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon as Instagram } from './BrandIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#0C1220] to-[#080B14] border-t border-[#4285F4]/20 text-[#A6B0C3]">
      {/* Futuristic Metallic Spectrum Bar */}
      <div className="h-[2px] google-gradient-bar w-full opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Logos */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#00D4FF]/40 bg-white p-0.5 shadow-[0_8px_20px_-6px_rgba(66,133,244,0.45)] transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/gdg-logo.jpeg"
                  alt="GDG on Campus RIT Hassan"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-[#F5F7FF] font-extrabold text-lg tracking-tight">
                  GDG on Campus
                </h3>
                <p className="text-xs text-[#00D4FF] font-medium">
                  Rajeev Institute of Technology, Hassan
                </p>
              </div>
            </Link>

            <p className="text-sm text-[#A6B0C3] leading-relaxed font-normal">
              A community of curious minds, creative developers and future innovators.
              Learn new technologies, build real-world projects, and grow together.
            </p>

            <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#151E30] border border-[#4285F4]/25 text-xs text-[#F5F7FF] font-semibold tracking-wide shadow-[inset_0_1px_0_rgba(245,247,255,0.12)]">
              &ldquo;Learn. Build. Connect. Innovate.&rdquo;
            </div>

            {/* Institutional Logos Required in Footer */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-[#A6B0C3]/75 font-bold mb-3">
                Affiliated Institutions
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl surface-3d">
                  <img
                    src="/assets/rit-logo.jpeg"
                    alt="Rajeev Institute of Technology"
                    className="w-9 h-9 object-contain rounded-lg bg-white p-0.5 shadow-sm"
                  />
                  <div className="text-[11px] leading-tight">
                    <span className="block font-bold text-[#F5F7FF]">RIT Hassan</span>
                    <span className="text-[#A6B0C3]">Institutional Campus</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl surface-3d">
                  <img
                    src="/assets/cse-logo.jpeg"
                    alt="Department of Computer Science & Engineering"
                    className="w-9 h-9 object-contain rounded-lg bg-white p-0.5 shadow-sm"
                  />
                  <div className="text-[11px] leading-tight">
                    <span className="block font-bold text-[#F5F7FF]">Dept of CSE</span>
                    <span className="text-[#A6B0C3]">Computer Science &amp; Engg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FF] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#00D4FF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00D4FF] transition-colors">
                  About the Club
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-[#00D4FF] transition-colors">
                  Activities &amp; Milestones
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#00D4FF] transition-colors">
                  Events &amp; Competitions
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#00D4FF] transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-[#00D4FF] transition-colors">
                  Core Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Students & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FF] mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/certificates" className="hover:text-[#00D4FF] transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-[#00D4FF] transition-colors">
                  Apply for Membership
                </Link>
              </li>
              <li>
                <Link to="/events/codestorm-2026" className="hover:text-[#00D4FF] transition-colors">
                  CODESTORM 2026
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00D4FF] transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Yashawantha26/codestorm-2026.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00D4FF] transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Connect */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FF] mb-4">
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:gdgoncampusgdgclubrit@gmail.com"
                className="flex items-center gap-2 text-[#A6B0C3] hover:text-[#00D4FF] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#FF7043] shrink-0" />
                <span className="text-xs">gdgoncampusgdgclubrit@gmail.com</span>
              </a>

              <a
                href="https://www.instagram.com/gdg_club_rit/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#A6B0C3] hover:text-[#FF7043] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#FF7043] shrink-0" />
                <span>@gdg_club_rit</span>
              </a>

              <a
                href="https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#A6B0C3] hover:text-[#A8FF60] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#A8FF60] shrink-0" />
                <span>WhatsApp Community</span>
              </a>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#A6B0C3]/75 hover:text-[#00D4FF] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#4285F4]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A6B0C3]/80">
          <p>&copy; 2026 GDG on Campus &middot; Rajeev Institute of Technology, Hassan</p>
          <div className="flex items-center gap-1.5 text-[#A6B0C3]">
            <span>Designed &amp; Developed with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF7043] fill-current" />
            <span className="font-semibold text-[#F5F7FF]">by Yashawantha H M</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
