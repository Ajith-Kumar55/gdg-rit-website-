import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { apiService, getAssetUrl } from '../services/api';
import type { EventItem } from '../types';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';

export const EventDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!idOrSlug) return;
      try {
        const data = await apiService.getEvent(idOrSlug);
        setEvent(data);
      } catch (err) {
        console.error("Error loading event detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-32 max-w-xl mx-auto text-center px-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-sm text-slate-400">The event you are searching for might have moved or does not exist.</p>
        <Link to="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to All Events
        </Link>
      </div>
    );
  }

  // Parse FAQs if JSON string
  let parsedFaqs: Array<{ q: string; a: string }> = [];
  try {
    if (event.faqs) {
      parsedFaqs = JSON.parse(event.faqs);
    }
  } catch {
    parsedFaqs = [];
  }

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Hero Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Poster / Banner */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 sticky top-24">
          <img
            src={getAssetUrl(event.poster_url)}
            alt={event.title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* Right Column: Title, Metadata, CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {event.category}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  event.registration_open
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {event.registration_open ? 'REGISTRATION OPEN' : 'REGISTRATION CLOSED'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h1>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#090D18] border border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <span className="block text-slate-500 font-medium text-[10px] uppercase">Date</span>
                <span className="font-semibold text-white">{event.event_date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="block text-slate-500 font-medium text-[10px] uppercase">Time</span>
                <span className="font-semibold text-white">{event.event_time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <span className="block text-slate-500 font-medium text-[10px] uppercase">Venue</span>
                <span className="font-semibold text-white">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Countdown if active */}
          {event.registration_open && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Time Remaining to Event:
              </span>
              <CountdownTimer targetDate="2026-11-18T09:00:00+05:30" eventName={event.title} />
            </div>
          )}

          {/* Registration CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {event.registration_open ? (
              <button
                onClick={() => setRegModalOpen(true)}
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                Register Now (Free Entry) ↗
              </button>
            ) : (
              <div className="px-6 py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold">
                This event has successfully concluded.
              </div>
            )}

            <a
              href="https://chat.whatsapp.com/IbvN7a5LEGpGqVoffjDWPw?s=cl&p=a&iam=2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs font-bold text-[#25D366] bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <h3 className="text-lg font-bold text-white">About the Event</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {event.description}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
        {/* Agenda */}
        {event.agenda && (
          <div className="p-8 rounded-3xl glass-panel space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Schedule & Agenda
            </h3>
            <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {event.agenda}
            </div>
          </div>
        )}

        {/* Rules & Eligibility */}
        <div className="p-8 rounded-3xl glass-panel space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Eligibility & Guidelines
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Eligibility:</strong> {event.eligibility}
            </p>
            {event.rules && (
              <div>
                <strong className="text-white block mb-1">Participation Rules:</strong>
                <div className="whitespace-pre-line text-slate-400">{event.rules}</div>
              </div>
            )}
            {event.coordinators && (
              <p className="pt-2 border-t border-white/10 text-xs text-slate-400">
                <strong className="text-white">Coordinators:</strong> {event.coordinators}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FAQs */}
      {parsedFaqs.length > 0 && (
        <section className="pt-8 border-t border-white/10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">FREQUENTLY ASKED</span>
            <h3 className="text-2xl font-bold text-white">Event FAQs</h3>
          </div>

          <div className="space-y-3">
            {parsedFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-panel overflow-hidden border border-white/10 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left text-sm font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Registration Modal */}
      {regModalOpen && (
        <EventRegistrationModal
          event={event}
          isOpen={regModalOpen}
          onClose={() => setRegModalOpen(false)}
        />
      )}
    </div>
  );
};
