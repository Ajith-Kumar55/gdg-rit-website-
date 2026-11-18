import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 bg-[#080B14] text-[#F5F7FF]">
      <div className="max-w-md w-full text-center p-8 rounded-3xl surface-3d border border-[#4285F4]/25 relative">
        <div className="w-16 h-16 rounded-2xl bg-[#4285F4]/15 border border-[#00D4FF]/35 text-[#00D4FF] flex items-center justify-center mx-auto mb-6 shadow-[0_10px_24px_-6px_rgba(0,212,255,0.3)]">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <h1 className="text-6xl font-black google-gradient-text mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-[#F5F7FF] mb-3">Page Not Found</h2>
        <p className="text-xs text-[#A6B0C3] mb-8 leading-relaxed">
          The page or resource you are looking for has been moved, renamed, or does not exist in the GDG on Campus RIT directory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl btn-3d-primary font-semibold text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl btn-3d-secondary font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
