import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  BrainCircuit,
  Cloud,
  Palette,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Play,
  Calendar,
  MapPin
} from 'lucide-react';
import { GithubIcon as Github } from '../components/common/BrandIcons';
import { apiService, getAssetUrl } from '../services/api';
import type { EventItem, MemberItem, GalleryImageItem, PublicStats } from '../types';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';
import { Lightbox } from '../components/gallery/Lightbox';
import { Hero3DShowcase } from '../components/hero/Hero3DShowcase';

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImageItem[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedEventForReg, setSelectedEventForReg] = useState<EventItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, membersData, galleryData, statsData] = await Promise.all([
          apiService.getEvents(),
          apiService.getMembers(),
          apiService.getGallery(),
          apiService.getPublicStats(),
        ]);
        setEvents(eventsData);
        setMembers(membersData);
        setGallery(galleryData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const codestormEvent = events.find((e) => e.slug.includes('codestorm')) || events[0];

  const domains = [
    {
      title: 'Web Development',
      desc: 'Modern frontend, responsive UI/UX, scalable backend APIs, and full-stack architecture.',
      icon: Code2,
      color: 'blue',
      badge: '01',
    },
    {
      title: 'AI & Machine Learning',
      desc: 'Computer vision, natural language processing, deep learning models, and practical AI applications.',
      icon: BrainCircuit,
      color: 'orange',
      badge: '02',
    },
    {
      title: 'Cloud & Google Technologies',
      desc: 'Google Cloud Platform, Firebase, serverless architectures, and scalable cloud infrastructure.',
      icon: Cloud,
      color: 'cyan',
      badge: '03',
    },
    {
      title: 'Design & Product Innovation',
      desc: 'Design systems, accessibility principles, user research, wireframing, and product design.',
      icon: Palette,
      color: 'lime',
      badge: '04',
    },
  ];

  return (
    <div className="relative overflow-x-clip bg-[#080B14] text-[#F5F7FF]">
      {/* 1. HERO SECTION (Same layout, upgraded 3D futuristic visuals) */}
      <section className="relative min-h-[84vh] flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
        {/* Calibrated Volumetric Ambient Lighting */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[660px] h-[300px] sm:h-[400px] bg-[#4285F4]/16 rounded-full blur-[130px] pointer-events-none animate-ambient-drift"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/6 w-[240px] sm:w-[360px] h-[240px] sm:h-[320px] bg-[#00D4FF]/10 rounded-full blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-12 right-1/6 w-[220px] sm:w-[340px] h-[220px] sm:h-[280px] bg-[#FF7043]/10 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center relative z-10">
          {/* Left Text Column (Exact same positions & copy) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Live Campus Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151E30]/90 border border-[#00D4FF]/30 backdrop-blur-md shadow-[0_8px_20px_-8px_rgba(0,212,255,0.3),inset_0_1px_0_rgba(245,247,255,0.14)]">
              <span className="w-2 h-2 rounded-full bg-[#A8FF60] shadow-[0_0_8px_#A8FF60] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#F5F7FF] uppercase">
                GDG on Campus &middot; RIT Hassan, Karnataka
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#F5F7FF] leading-[1.08] drop-shadow-[0_6px_24px_rgba(0,0,0,0.65)]">
              Building Tomorrow&apos;s{' '}
              <span className="google-gradient-text block sm:inline">
                Technology, Together.
              </span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-[#A6B0C3] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              A community of curious minds, creative developers and future innovators.
              Learn new technologies, build real-world projects, and grow together.
            </p>

            {/* Official Tagline Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-bold uppercase tracking-widest text-[#A6B0C3]">
              <span className="text-[#4285F4]">Learn</span> &middot;
              <span className="text-[#FF7043]">Build</span> &middot;
              <span className="text-[#00D4FF]">Connect</span> &middot;
              <span className="text-[#A8FF60]">Innovate</span>
            </div>

            {/* Hero Actions (3D Tactile Buttons) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                to="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm btn-3d-primary"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm btn-3d-secondary"
              >
                <Play className="w-4 h-4 text-[#00D4FF] fill-current" />
                <span>Discover Our Community</span>
              </Link>

              <Link
                to="/membership"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm btn-3d-highlight"
              >
                <span>Become a Member</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-2 text-xs text-[#A6B0C3] flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2 overflow-hidden" aria-hidden="true">
                <span className="h-7 w-7 rounded-full ring-2 ring-[#080B14] bg-[#4285F4] text-white font-bold text-[10px] flex items-center justify-center shadow-md">DS</span>
                <span className="h-7 w-7 rounded-full ring-2 ring-[#080B14] bg-[#FF7043] text-white font-bold text-[10px] flex items-center justify-center shadow-md">YH</span>
                <span className="h-7 w-7 rounded-full ring-2 ring-[#080B14] bg-[#00D4FF] text-[#080B14] font-bold text-[10px] flex items-center justify-center shadow-md">SM</span>
                <span className="h-7 w-7 rounded-full ring-2 ring-[#080B14] bg-[#A8FF60] text-[#080B14] font-bold text-[10px] flex items-center justify-center shadow-md">JH</span>
              </div>
              <p>
                <strong className="text-[#F5F7FF]">Department of Computer Science &amp; Engineering</strong> &middot; RIT Hassan
              </p>
            </div>
          </motion.div>

          {/* Right Visual Genuine 3D WebGL GDG Emblem Stage (Exact same hero column & position) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center py-4 sm:py-2"
          >
            <Hero3DShowcase />
          </motion.div>
        </div>
      </section>

      {/* 2. COMMUNITY STRIP VALUES */}
      <section className="relative border-y border-[#4285F4]/20 bg-[#101625]/90 backdrop-blur-md py-4 shadow-[inset_0_1px_0_rgba(245,247,255,0.06)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center sm:justify-around gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#F5F7FF]">
          <div className="flex items-center gap-2">
            <span className="text-[#4285F4] font-bold" aria-hidden="true">&#10035;</span> Open to every learner
          </div>
          <div className="hidden sm:block text-white/15" aria-hidden="true">|</div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF7043] font-bold" aria-hidden="true">&#10035;</span> Built by students
          </div>
          <div className="hidden sm:block text-white/15" aria-hidden="true">|</div>
          <div className="flex items-center gap-2">
            <span className="text-[#A8FF60] font-bold" aria-hidden="true">&#10035;</span> Powered by curiosity
          </div>
          <div className="hidden sm:block text-white/15" aria-hidden="true">|</div>
          <div className="flex items-center gap-2">
            <span className="text-[#00D4FF] font-bold" aria-hidden="true">&#10035;</span> Connected to the world
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC STATS SECTION (3D Layered Metric Pedestals) */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Community Statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            { value: stats?.community_members, label: 'Core & Faculty Team', color: 'text-[#4285F4]', bar: 'from-[#4285F4] to-[#00D4FF]' },
            { value: stats?.events_conducted, label: 'Events & Challenges', color: 'text-[#FF7043]', bar: 'from-[#FF7043] to-amber-400' },
            { value: stats?.activities_count, label: 'Club Activities', color: 'text-[#A8FF60]', bar: 'from-[#A8FF60] to-[#34A853]' },
            { value: stats?.certificates_verified, label: 'Verified Credentials', color: 'text-[#00D4FF]', bar: 'from-[#00D4FF] to-[#4285F4]' },
          ].map((stat) => (
            <div key={stat.label} className="relative overflow-hidden p-5 sm:p-6 rounded-2xl surface-3d card-3d">
              <div aria-hidden="true" className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${stat.bar} opacity-75`} />
              {loading || stat.value === undefined ? (
                <div className="h-9 w-16 mx-auto rounded-lg bg-white/10 animate-pulse" />
              ) : (
                <span className={`block font-extrabold text-3xl sm:text-4xl font-mono ${stat.color} drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}>
                  {stat.value}+
                </span>
              )}
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#A6B0C3] mt-1.5 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED UPCOMING EVENT (CODESTORM 2026) */}
      {codestormEvent && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="py-16 bg-gradient-to-b from-[#101625] via-[#0E1525] to-[#0B101D] border-y border-[#4285F4]/20 relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 right-0 w-96 h-96 bg-[#4285F4]/12 rounded-full blur-[120px] pointer-events-none"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Event Info */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-[#FF7043]/15 text-[#FF7043] border border-[#FF7043]/35 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    NOVEMBER EDITION &middot; {codestormEvent.registration_open ? 'REGISTRATION OPEN' : 'FEATURED'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#A6B0C3] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#00D4FF]" />
                    {codestormEvent.event_date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#A6B0C3] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#A8FF60]" />
                    {codestormEvent.venue}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7FF] tracking-tight">
                  {codestormEvent.title}
                </h2>

                <p className="text-sm font-semibold text-[#00D4FF] tracking-wide uppercase">
                  Think. Create. Innovate. Build the Future.
                </p>

                <p className="text-sm text-[#A6B0C3] leading-relaxed font-normal">
                  {codestormEvent.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F5F7FF]/90 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8FF60] shrink-0" />
                    <span>Individual &amp; Team Participation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8FF60] shrink-0" />
                    <span>Hands-on Problem Solving &amp; Build Rounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8FF60] shrink-0" />
                    <span>Verified Digital Certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8FF60] shrink-0" />
                    <span>100% Free Student Registration</span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="pt-3 pb-2">
                  <p className="text-xs uppercase font-bold text-[#A6B0C3] tracking-wider mb-3">
                    Countdown to Event Sprint (IST):
                  </p>
                  <CountdownTimer targetDate="2026-11-18T09:00:00+05:30" eventName="CODESTORM 2026" />
                </div>

                {/* CTAs */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  {codestormEvent.registration_open && (
                    <button
                      type="button"
                      onClick={() => setSelectedEventForReg(codestormEvent)}
                      className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-3d-primary"
                    >
                      Register Now (Free) &#8599;
                    </button>
                  )}

                  <Link
                    to={`/events/${codestormEvent.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold btn-3d-secondary"
                  >
                    <span>Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00D4FF]" />
                  </Link>

                  <a
                    href="https://chat.whatsapp.com/IbvN7a5LEGpGqVoffjDWPw?s=cl&p=a&iam=2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold btn-3d-highlight"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>November WhatsApp</span>
                  </a>

                  <a
                    href="https://github.com/Yashawantha26/codestorm-2026.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium text-[#A6B0C3] hover:text-[#F5F7FF] bg-[#151E30]/90 hover:bg-[#1B2740] border border-white/15 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repo</span>
                  </a>
                </div>
              </div>

              {/* Event Poster Card with 3D Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <Link
                  to={`/events/${codestormEvent.slug}`}
                  className="relative w-full max-w-md rounded-2xl overflow-hidden bg-[#151E30] image-3d-frame group block"
                >
                  <img
                    src={getAssetUrl(codestormEvent.poster_url)}
                    alt={`${codestormEvent.title} Official Event Poster`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent opacity-85" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[11px] font-bold text-[#00D4FF] uppercase tracking-widest block">
                      RAJEEV INSTITUTE OF TECHNOLOGY
                    </span>
                    <h3 className="text-lg font-bold text-[#F5F7FF]">{codestormEvent.title}</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 5. TECHNOLOGY DOMAINS (3D Layered Interactive Cards) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF]">
            FOLLOW YOUR CURIOSITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FF] tracking-tight">
            There&apos;s more than one way to start.
          </h2>
          <p className="text-sm text-[#A6B0C3] font-normal">
            No prerequisites. No perfect starting point. Pick a domain that sparks curiosity and learn by building real projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((d) => {
            const Icon = d.icon;
            return (
              <Link
                key={d.title}
                to="/activities"
                className="p-6 rounded-2xl surface-3d card-3d flex flex-col justify-between space-y-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${
                        d.color === 'blue'
                          ? 'bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/35'
                          : d.color === 'orange'
                          ? 'bg-[#FF7043]/20 text-[#FF7043] border border-[#FF7043]/35'
                          : d.color === 'cyan'
                          ? 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/35'
                          : 'bg-[#A8FF60]/15 text-[#A8FF60] border border-[#A8FF60]/35'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#A6B0C3]/60">{d.badge}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F7FF] mt-4 group-hover:text-[#00D4FF] transition-colors">
                    {d.title}
                  </h3>
                  <p className="text-xs text-[#A6B0C3] mt-2 leading-relaxed">
                    {d.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#F5F7FF]/80 group-hover:text-[#00D4FF] transition-colors">
                  <span>Explore Activities</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. RECENT ACTIVITIES & FEATURED GALLERY */}
      <section className="py-16 sm:py-20 bg-[#0D1322] border-t border-[#4285F4]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A8FF60]">
                COMMUNITY IN ACTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FF] tracking-tight mt-1">
                Moments that make our community.
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#00D4FF] hover:text-[#A8FF60] transition-colors"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-[#151E30] border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.slice(0, 6).map((img, idx) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                  aria-label={`View gallery photo: ${img.title}`}
                  className="group relative h-64 w-full text-left rounded-2xl overflow-hidden bg-[#151E30] image-3d-frame cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
                >
                  <img
                    src={getAssetUrl(img.image_url)}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B14]/92 via-[#080B14]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#4285F4]/25 text-[#00D4FF] border border-[#00D4FF]/35 backdrop-blur-sm">
                      {img.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#F5F7FF] mt-1.5 line-clamp-1">{img.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. AUTHENTIC TEAM PREVIEW */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#4285F4]">
              COMMUNITY BUILDERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FF] tracking-tight mt-1">
              Meet our team.
            </h2>
          </div>
          <Link
            to="/team"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00D4FF] hover:text-[#A8FF60] transition-colors"
          >
            <span>See All {members.length || 12} Coordinators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.slice(0, 4).map((m) => (
            <div key={m.id} className="p-5 rounded-2xl surface-3d card-3d text-center space-y-4">
              <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-[#00D4FF]/35 bg-[#101625] shadow-[0_10px_24px_-8px_rgba(66,133,244,0.45)]">
                {m.photo_url ? (
                  <img
                    src={getAssetUrl(m.photo_url)}
                    alt={`${m.name} - ${m.role}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#00D4FF] bg-[#4285F4]/20">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6B0C3]">
                  {m.category}
                </span>
                <h3 className="font-bold text-base text-[#F5F7FF] mt-0.5">{m.name}</h3>
                <p className="text-xs text-[#00D4FF] font-medium line-clamp-1">{m.role}</p>
                <p className="text-[11px] text-[#A6B0C3] mt-1">{m.department}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. JOIN OUR COMMUNITY CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#101625] to-[#080B14] border-t border-[#4285F4]/20 text-center px-4 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[520px] h-[220px] bg-[#4285F4]/12 rounded-full blur-[110px] pointer-events-none"
        />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex p-3.5 rounded-2xl surface-3d border border-[#00D4FF]/30 text-[#00D4FF]">
            <Sparkles className="w-8 h-8 text-[#A8FF60] animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7FF] tracking-tight">
            Come curious. Leave a builder.
          </h2>

          <p className="text-sm sm:text-base text-[#A6B0C3] max-w-xl mx-auto font-normal">
            Meet your people, try something new, and make your time at Rajeev Institute of Technology count.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/membership"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm btn-3d-primary"
            >
              Apply for Membership &#8599;
            </Link>

            <a
              href="https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm btn-3d-highlight"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEventForReg && (
        <EventRegistrationModal
          event={selectedEventForReg}
          isOpen={!!selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
        />
      )}

      {/* Lightbox */}
      <Lightbox
        images={gallery}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
};
