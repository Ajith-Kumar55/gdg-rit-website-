import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { InstagramIcon as Instagram, GithubIcon as Github } from '../components/common/BrandIcons';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast('Please fill in all fields before sending', 'error');
      return;
    }

    try {
      setLoading(true);
      await apiService.sendContactMessage(formData);
      setSent(true);
      addToast('Message sent successfully! We will get back to you shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to send message. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F5F7FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151E30] border border-[#00D4FF]/35 text-[#00D4FF] text-xs font-semibold uppercase tracking-wider mb-4 shadow-[inset_0_1px_0_rgba(245,247,255,0.12)]">
            <Sparkles className="w-3.5 h-3.5 text-[#A8FF60]" />
            <span>Connect &amp; Collaborate</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7FF] mb-4">
            Get in Touch with <span className="google-gradient-text">GDG RIT Hassan</span>
          </h1>
          <p className="text-[#A6B0C3] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Have a question about upcoming hackathons, interested in conducting a workshop, or seeking student project collaborations? Our core lead team is ready to connect.
          </p>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {/* Card 1: Email */}
          <div className="p-6 rounded-2xl surface-3d card-3d flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/35 text-[#4285F4] flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#F5F7FF] text-base mb-1">Official Email</h3>
              <p className="text-xs text-[#A6B0C3] mb-3">For official inquiries, sponsorships, and permissions.</p>
            </div>
            <a
              href="mailto:gdgoncampusgdgclubrit@gmail.com"
              className="text-xs font-semibold text-[#00D4FF] hover:text-[#A8FF60] break-all transition-colors"
            >
              gdgoncampusgdgclubrit@gmail.com
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="p-6 rounded-2xl surface-3d card-3d flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#A8FF60]/15 border border-[#A8FF60]/35 text-[#A8FF60] flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#F5F7FF] text-base mb-1">WhatsApp Community</h3>
              <p className="text-xs text-[#A6B0C3] mb-3">Instant announcements, discussions, and event links.</p>
            </div>
            <a
              href="https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#A8FF60] hover:text-[#00D4FF] transition-colors"
            >
              Join Official Group &rarr;
            </a>
          </div>

          {/* Card 3: Instagram */}
          <div className="p-6 rounded-2xl surface-3d card-3d flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FF7043]/15 border border-[#FF7043]/35 text-[#FF7043] flex items-center justify-center mb-4">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#F5F7FF] text-base mb-1">Instagram</h3>
              <p className="text-xs text-[#A6B0C3] mb-3">Follow event highlights, reels, and stories.</p>
            </div>
            <a
              href="https://www.instagram.com/gdg_club_rit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#FF7043] hover:text-[#00D4FF] transition-colors"
            >
              @gdg_club_rit &rarr;
            </a>
          </div>

          {/* Card 4: Location */}
          <div className="p-6 rounded-2xl surface-3d card-3d flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/15 border border-[#00D4FF]/35 text-[#00D4FF] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#F5F7FF] text-base mb-1">Campus Desk</h3>
              <p className="text-xs text-[#A6B0C3] mb-3">Department of CSE, Civil Block Seminar Hall &amp; Labs.</p>
            </div>
            <p className="text-xs font-semibold text-[#00D4FF]">
              RIT Hassan, Karnataka
            </p>
          </div>
        </div>

        {/* Two-Column Form & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl surface-3d border border-[#4285F4]/25">
            <h2 className="text-2xl font-bold text-[#F5F7FF] mb-2">Send a Direct Message</h2>
            <p className="text-xs text-[#A6B0C3] mb-6">We typically reply within 24 business hours.</p>

            {sent && (
              <div className="p-4 mb-6 rounded-2xl bg-[#A8FF60]/10 border border-[#A8FF60]/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A8FF60] shrink-0" />
                <p className="text-xs text-[#A8FF60]">
                  Your message has reached the GDG RIT administrative desk. Thank you!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider mb-2">
                    Your Name <span className="text-[#FF7043]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yashawantha H M"
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1322] border border-[#4285F4]/20 text-[#F5F7FF] placeholder-[#A6B0C3]/50 focus:outline-none focus:border-[#00D4FF] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider mb-2">
                    Email Address <span className="text-[#FF7043]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1322] border border-[#4285F4]/20 text-[#F5F7FF] placeholder-[#A6B0C3]/50 focus:outline-none focus:border-[#00D4FF] text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider mb-2">
                  Subject <span className="text-[#FF7043]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Speaker session proposal / Hackathon query"
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1322] border border-[#4285F4]/20 text-[#F5F7FF] placeholder-[#A6B0C3]/50 focus:outline-none focus:border-[#00D4FF] text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider mb-2">
                  Message <span className="text-[#FF7043]">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1322] border border-[#4285F4]/20 text-[#F5F7FF] placeholder-[#A6B0C3]/50 focus:outline-none focus:border-[#00D4FF] text-sm transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-3d-primary font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to GDG Desk</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map & College Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl surface-3d border border-[#4285F4]/25">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-[#00D4FF]" />
                <div>
                  <h3 className="font-bold text-[#F5F7FF] text-base">Rajeev Institute of Technology</h3>
                  <p className="text-xs text-[#A6B0C3]">Department of Computer Science &amp; Engineering</p>
                </div>
              </div>

              <p className="text-xs text-[#A6B0C3] leading-relaxed mb-4">
                Plot No. 1-D, Growth Center, Industrial Area, B.M Bypass Road, Hassan, Karnataka 573201
              </p>

              {/* Responsive Embedded Map */}
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#4285F4]/25 shadow-inner">
                <iframe
                  title="Rajeev Institute of Technology Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.685250489246!2d76.10860887484307!3d13.012574087306263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba54854b73b5f39%3A0xe5a3eb1d3680fe0a!2sRajeev%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="p-6 rounded-3xl surface-3d space-y-4">
              <h4 className="font-bold text-sm text-white">Community Code Repositories</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore club projects, hackathon starter kits, and workshop repositories on GitHub.
              </p>
              <a
                href="https://github.com/Yashawantha26/codestorm-2026.git"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>codestorm-2026 on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
