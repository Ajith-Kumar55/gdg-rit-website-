import React, { useState } from 'react';
import { CheckCircle2, XCircle, Printer } from 'lucide-react';
import { apiService } from '../services/api';
import type { CertificateVerifyResult } from '../types';

export const CertificatesPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CertificateVerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await apiService.verifyCertificate(query.trim());
      setResult(data);
    } catch (err: any) {
      setResult({
        is_valid: false,
        message: err.response?.data?.detail || 'An error occurred while verifying the certificate.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setSearched(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-blue-400 font-bold uppercase tracking-wider">
          <span>COMMUNITY ACHIEVEMENTS</span>
          <span>✳</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Certificates & <span className="google-gradient-text">Verification.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Verify and authenticate official certificates issued by Google Developer Groups on Campus – RIT Hassan. 
          Search by Certificate ID, Student Name, or USN.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            required
            placeholder="e.g. CODESTORM2026-001, Yashawantha, or 4RA22CS001"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-[#090D18] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-200 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Search'}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs px-2 text-slate-400">
          <span>Supported search: Certificate ID, USN, Student Name, or Event</span>
          {searched && (
            <button
              type="button"
              onClick={handleClear}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Clear search
            </button>
          )}
        </div>
      </form>

      {/* Verification Result Display */}
      {result && (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
          {result.is_valid && result.certificate ? (
            /* Digital Certificate Card */
            <div className="rounded-3xl glass-panel border border-emerald-500/40 p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0B1222] via-[#080C14] to-[#0A1424]">
              {/* Background watermark */}
              <div className="absolute right-6 -bottom-10 opacity-5 pointer-events-none">
                <img src="/assets/gdg-logo.jpeg" alt="Watermark" className="w-80 h-80" />
              </div>

              {/* Status banner */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
                      VERIFIED CREDENTIAL
                    </span>
                    <span className="text-[11px] text-slate-400">Official Authenticated Certificate</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono">Verified {result.certificate.verification_count} times</span>
                </div>
              </div>

              {/* Certificate Inner Layout */}
              <div className="text-center space-y-4 py-4">
                <div className="flex items-center justify-center gap-3">
                  <img src="/assets/gdg-logo.jpeg" alt="GDG" className="w-10 h-10 rounded-full bg-white p-0.5" />
                  <span className="font-extrabold text-sm sm:text-base text-white tracking-wider uppercase">
                    Google Developer Groups on Campus · RIT Hassan
                  </span>
                </div>

                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  Certificate of Participation & Achievement
                </p>

                <div className="py-2">
                  <span className="text-xs text-slate-400">This is to officially certify that</span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 google-gradient-text">
                    {result.certificate.student_name}
                  </h3>
                  {result.certificate.usn && (
                    <span className="text-xs font-mono text-slate-400 tracking-wider">
                      USN: {result.certificate.usn}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  has actively participated and demonstrated exemplary technical innovation in
                  <strong className="text-white block mt-1 text-base">{result.certificate.event_name}</strong>
                  organized by GDG on Campus, Department of Computer Science & Engineering, Rajeev Institute of Technology, Hassan.
                </p>

                <div className="pt-6 grid grid-cols-2 gap-6 border-t border-white/10 text-xs text-left max-w-md mx-auto">
                  <div>
                    <span className="text-slate-500 block font-medium">Issue Date</span>
                    <span className="font-semibold text-white">{result.certificate.issue_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Certificate ID</span>
                    <span className="font-mono font-bold text-blue-400">{result.certificate.certificate_code}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-200 transition-all shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          ) : (
            /* Invalid or Not Found Card */
            <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Verification Failed</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {result.message}
              </p>
              <p className="text-[11px] text-slate-400">
                Please double check the spelling of your name, USN, or the unique Certificate ID.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sample verifiable IDs for demonstration */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
          Demo Verified Certificate IDs to Try:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setQuery('CODESTORM2026-001')}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-mono border border-blue-500/30 transition-colors"
          >
            CODESTORM2026-001
          </button>
          <button
            onClick={() => setQuery('INAUG2026-042')}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-mono border border-blue-500/30 transition-colors"
          >
            INAUG2026-042
          </button>
          <button
            onClick={() => setQuery('CHALLENGE-2026-015')}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-mono border border-blue-500/30 transition-colors"
          >
            CHALLENGE-2026-015
          </button>
        </div>
      </div>
    </div>
  );
};
