import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Compass,
  BrainCircuit,
  Code2,
  Cloud,
  Sparkles,
  Palette,
  GitBranch,
  Calendar
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const goals = [
    { num: '01', text: 'Encourage learning modern technologies.' },
    { num: '02', text: 'Promote practical software development.' },
    { num: '03', text: 'Organize technical workshops and hackathons.' },
    { num: '04', text: 'Encourage open-source contributions.' },
    { num: '05', text: 'Develop teamwork and leadership.' },
    { num: '06', text: 'Support innovative student projects.' },
    { num: '07', text: 'Build developer community connections.' },
    { num: '08', text: 'Improve industry-ready technical skills.' },
  ];

  const domains = [
    {
      title: 'Artificial Intelligence & Machine Learning',
      desc: 'Exploring Gemini APIs, deep learning, computer vision, and practical ML pipelines built by students.',
      icon: BrainCircuit,
      accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Web Development',
      desc: 'Modern full-stack architecture with React, TypeScript, Next.js, FastAPI, REST APIs, and responsive UI.',
      icon: Code2,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Cloud Computing',
      desc: 'Hands-on cloud infrastructure, CI/CD, containerization, serverless deployment, and scalable architecture.',
      icon: Cloud,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Google Technologies',
      desc: 'Firebase, Google Cloud Platform, Android, Flutter, Angular, TensorFlow, and Google AI Studio.',
      icon: Sparkles,
      accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'UI/UX Design',
      desc: 'Human-centered interface design, accessible design systems, Figma prototyping, and product thinking.',
      icon: Palette,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Open Source Development',
      desc: 'Collaborative Git workflows, community codebases, pull requests, and real-world software engineering.',
      icon: GitBranch,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-blue-400 font-bold uppercase tracking-wider">
          <span>ABOUT OUR COMMUNITY</span>
          <span>&bull;</span>
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Calendar className="w-3 h-3" /> Inaugurated 23 Sep 2026
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          A place to learn <span className="google-gradient-text">by building.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Google Developer Groups on Campus brings students together to learn, share, and build with technology.
          At Rajeev Institute of Technology, Hassan, we bridge the gap between classroom theory and industry-grade engineering.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl glass-panel space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">01 &middot; OUR MISSION</span>
          <h2 className="text-2xl font-bold text-white">Make Tech Approachable</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            "Make modern technology more approachable through hands-on learning, collaboration, and a welcoming campus community."
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">02 &middot; OUR VISION</span>
          <h2 className="text-2xl font-bold text-white">Turn Curiosity into Impact</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            "Help students turn curiosity into skills, ideas into projects, and collaboration into lasting growth."
          </p>
        </div>
      </section>

      {/* Technology Domains (All 6 Cards) */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">WHAT WE EXPLORE</span>
          <h2 className="text-3xl font-extrabold text-white">Technology Domains</h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            From foundational full-stack skills to Google AI & Cloud ecosystems, our study jams and hackathons span six core engineering tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.title}
                className="p-6 rounded-2xl glass-panel glass-panel-hover space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${domain.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{domain.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{domain.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Core Goals Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">WHAT WE WORK TOWARD</span>
          <h2 className="text-3xl font-extrabold text-white">Our 8 Strategic Goals</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((g) => (
            <div key={g.num} className="p-5 rounded-2xl surface-3d card-3d flex items-start gap-3.5">
              <span className="font-mono text-sm font-bold text-[#00D4FF] shrink-0 mt-0.5">
                {g.num}
              </span>
              <p className="text-xs font-medium text-[#F5F7FF]/90 leading-snug">
                {g.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Required Placement: All 3 Logos in About/Organization Section */}
      <section className="p-8 sm:p-12 rounded-3xl surface-3d border border-[#4285F4]/25 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF]">
            ORGANIZATION &amp; AFFILIATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FF]">
            Rooted in Academic &amp; Engineering Excellence
          </h2>
          <p className="text-xs sm:text-sm text-[#A6B0C3]">
            GDG on Campus &ndash; RIT Hassan is supported by the Department of Computer Science &amp; Engineering
            at Rajeev Institute of Technology, Hassan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Logo 1: GDG on Campus */}
          <div className="p-6 rounded-2xl bg-[#101625] border border-[#4285F4]/25 card-3d flex flex-col items-center text-center space-y-4 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(245,247,255,0.1)]">
            <div className="w-24 h-24 rounded-full p-2 logo-3d-medallion flex items-center justify-center">
              <img
                src="/assets/gdg-logo.jpeg"
                alt="GDG on Campus RIT Hassan Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F5F7FF]">GDG on Campus</h3>
              <p className="text-xs text-[#00D4FF] font-medium">RIT Hassan Chapter</p>
              <p className="text-[11px] text-[#A6B0C3] mt-2 leading-relaxed">
                Global developer community initiative empowering university students to build real-world solutions.
              </p>
            </div>
          </div>

          {/* Logo 2: College Logo */}
          <div className="p-6 rounded-2xl bg-[#101625] border border-[#4285F4]/25 card-3d flex flex-col items-center text-center space-y-4 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(245,247,255,0.1)]">
            <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-[#4285F4]/35 shadow-[0_12px_28px_-8px_rgba(66,133,244,0.4)] flex items-center justify-center">
              <img
                src="/assets/rit-logo.jpeg"
                alt="Rajeev Institute of Technology Institutional Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F5F7FF]">Rajeev Institute of Technology</h3>
              <p className="text-xs text-[#F5F7FF]/80 font-medium">Hassan, Karnataka</p>
              <p className="text-[11px] text-[#A6B0C3] mt-2 leading-relaxed">
                Premier technical institution affiliated to VTU Belagavi, committed to technical and research excellence.
              </p>
            </div>
          </div>

          {/* Logo 3: Department Logo */}
          <div className="p-6 rounded-2xl bg-[#101625] border border-[#4285F4]/25 card-3d flex flex-col items-center text-center space-y-4 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(245,247,255,0.1)]">
            <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-[#00D4FF]/35 shadow-[0_12px_28px_-8px_rgba(0,212,255,0.38)] flex items-center justify-center">
              <img
                src="/assets/cse-logo.jpeg"
                alt="Department of Computer Science and Engineering Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F5F7FF]">Department of CSE</h3>
              <p className="text-xs text-[#A8FF60] font-medium">Computer Science &amp; Engineering</p>
              <p className="text-[11px] text-[#A6B0C3] mt-2 leading-relaxed">
                Empowering future software engineers with advanced computing labs, mentorship, and research opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="p-8 rounded-2xl surface-3d border border-[#00D4FF]/25 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF]">LEARN. BUILD. CONNECT. INNOVATE.</span>
          <h3 className="text-2xl font-extrabold text-[#F5F7FF] mt-1">Your next step starts with curiosity.</h3>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/membership"
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-3d-primary"
          >
            Become a Member
          </Link>
          <Link
            to="/events"
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider btn-3d-secondary"
          >
            Explore Events &#8599;
          </Link>
        </div>
      </div>
    </div>
  );
};
