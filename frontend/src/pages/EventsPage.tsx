import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Search, AlertCircle } from 'lucide-react';
import { apiService, getAssetUrl } from '../services/api';
import type { EventItem } from '../types';
import { EventRegistrationModal } from '../components/events/EventRegistrationModal';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesFilter =
      filter === 'ALL'
        ? true
        : filter === 'UPCOMING'
        ? e.registration_open === true
        : e.registration_open === false;

    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400 font-bold uppercase tracking-wider">
          <span>LEARN BY DOING</span>
          <span>✳</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Good things are <span className="google-gradient-text">happening.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Take on a hands-on website-building challenge, test your coding skills in CODESTORM, or develop a technology solution to real-world problems.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-[#090D18] border border-white/10">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'UPCOMING'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'COMPLETED'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No events match your criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const isCompleted = !event.registration_open;
            return (
              <div
                key={event.id}
                className="rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Event Poster or Graphic Banner */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={getAssetUrl(event.poster_url)}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-blue-400 border border-white/10">
                        {event.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isCompleted ? 'COMPLETED' : 'REGISTRATION OPEN'}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{event.event_date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between gap-3 mt-4">
                  <Link
                    to={`/events/${event.slug || event.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {event.registration_open ? (
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all hover:scale-[1.02]"
                    >
                      Register Now ↗
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">Event Concluded</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Special Challenges Briefs */}
      <section className="pt-12 border-t border-white/10 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">FLAGSHIP CLUB CHALLENGES</span>
          <h2 className="text-3xl font-extrabold text-white">Challenge Briefs & Guidelines</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenge 1 */}
          <div className="p-8 rounded-3xl glass-panel space-y-5 border border-blue-500/20">
            <div>
              <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">CHALLENGE 01</span>
              <h3 className="text-2xl font-bold text-white mt-1">Website Building Challenge</h3>
              <p className="text-xs text-blue-300 italic">"Don't Just Imagine It. Build It. Launch It."</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Build a professional, responsive, and fully functional website that solves a real-world requirement or demonstrates an innovative idea. Showcase frontend styling, backend integration, and cloud deployment.
            </p>
            <div className="p-4 rounded-xl bg-white/5 space-y-2 text-xs">
              <span className="font-bold text-white block">Evaluation Criteria:</span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>• UI/UX Design: 20%</div>
                <div>• Functionality: 25%</div>
                <div>• Technical Code: 25%</div>
                <div>• Innovation: 15%</div>
                <div>• Presentation: 15%</div>
              </div>
            </div>
          </div>

          {/* Challenge 2 */}
          <div className="p-8 rounded-3xl glass-panel space-y-5 border border-emerald-500/20">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">CHALLENGE 02</span>
              <h3 className="text-2xl font-bold text-white mt-1">Real-World Problem & Solution</h3>
              <p className="text-xs text-emerald-300 italic">"Find a Problem. Create a Solution. Make an Impact."</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              People face challenges every day in agriculture, healthcare, education, smart cities, and environment. Identify a genuine problem and propose an innovative, technology-based solution that makes a measurable difference.
            </p>
            <div className="p-4 rounded-xl bg-white/5 space-y-2 text-xs">
              <span className="font-bold text-white block">Domains Accepted:</span>
              <p className="text-slate-300">
                Agriculture & Farmer Support, Healthcare Assistance, Student Education, Smart Cities, Women's Safety, Rural Development, and AI Automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegistered={() => {
            // refresh events
            apiService.getEvents().then(setEvents);
          }}
        />
      )}
    </div>
  );
};
