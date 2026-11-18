import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { apiService } from '../../services/api';
import type { AnnouncementItem } from '../../types';

export const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await apiService.getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[0];

  return (
    <div className="relative bg-gradient-to-r from-[#0D162B] via-[#13223F] to-[#0E1A30] border-b border-[#4285F4]/25 text-[#F5F7FF] px-4 py-2 text-xs sm:text-sm z-50 backdrop-blur-md shadow-[0_6px_20px_-8px_rgba(66,133,244,0.35)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#4285F4]/20 text-[#00D4FF] border border-[#00D4FF]/35 uppercase flex items-center gap-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <Sparkles className="w-3 h-3 text-[#A8FF60]" />
            {current.badge || 'UPDATE'}
          </span>
          <span className="font-semibold text-[#F5F7FF] truncate">
            {current.title}
          </span>
          <span className="hidden md:inline text-[#A6B0C3] text-xs truncate">
            — {current.content}
          </span>
          {current.link_url && (
            <Link
              to={current.link_url}
              className="shrink-0 inline-flex items-center gap-1 text-[#00D4FF] hover:text-[#A8FF60] font-semibold underline underline-offset-2 ml-1 transition-colors"
            >
              Learn More <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[#A6B0C3] hover:text-[#F5F7FF] p-1 rounded-md hover:bg-white/10 shrink-0 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
