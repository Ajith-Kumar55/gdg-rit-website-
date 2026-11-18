import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Copy, Check, MessageCircle, ArrowUpRight, Users } from 'lucide-react';
import type { EventItem, RegistrationItem } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface EventRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (reg: RegistrationItem) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegistered,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredItem, setRegisteredItem] = useState<RegistrationItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college] = useState('Rajeev Institute of Technology, Hassan');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [usn, setUsn] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [semester] = useState('5th Semester');
  const [isTeam, setIsTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !year) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (isTeam && !teamName.trim()) {
      setFormError('Please enter a team name for team participation.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        event_id: event.id,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim(),
        usn: usn.trim().toUpperCase() || undefined,
        year,
        semester,
        is_team: isTeam,
        team_name: isTeam ? teamName.trim() : undefined,
        team_members: isTeam ? teamMembers.trim() : undefined,
      };

      const result = await apiService.registerForEvent(payload);
      setRegisteredItem(result);
      success(`Successfully registered! Registration Code: ${result.registration_code}`);
      if (onRegistered) onRegistered(result);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit registration. Please try again.';
      setFormError(msg);
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (registeredItem?.registration_code) {
      navigator.clipboard.writeText(registeredItem.registration_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080B14]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl surface-3d rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101625]/90">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#00D4FF] uppercase bg-[#4285F4]/15 px-2.5 py-0.5 rounded-full border border-[#4285F4]/30">
              {event.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#F5F7FF] mt-1">
              Register: {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {registeredItem ? (
            /* Confirmation Success State */
            <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">Registration Confirmed!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  We look forward to seeing you at {event.venue} on {event.event_date}.
                </p>
              </div>

              {/* Code Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Your Unique Pass ID:</span>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>
                <div className="font-mono font-bold text-lg text-blue-400 tracking-wide select-all">
                  {registeredItem.registration_code}
                </div>
                <p className="text-[11px] text-slate-400">
                  Attendee: <strong className="text-white">{registeredItem.full_name}</strong> ({registeredItem.department})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://chat.whatsapp.com/IbvN7a5LEGpGqVoffjDWPw?s=cl&p=a&iam=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Join Event WhatsApp Group</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashawantha H M"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    University Seat No (USN)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4RA22CS001"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Science & Engineering">Information Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Other Department">Other Department</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Team Participation Toggle */}
              <div className="pt-2 border-t border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTeam}
                    onChange={(e) => setIsTeam(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    Register as a Team (Max 4 Members)
                  </span>
                </label>

                {isTeam && (
                  <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-white/5 border border-white/10 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Team Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Byte Builders"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#090D18] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Team Members (Names & USNs)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Member 2: Yashwanth Gowda (4RA22CS002), Member 3: Dhanyatha SM (4RA22CS042)"
                        value={teamMembers}
                        onChange={(e) => setTeamMembers(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#090D18] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-3d-primary w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing Registration...' : 'Complete Free Registration'}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Instant registration ID generated upon submission. Free entry for all students.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
