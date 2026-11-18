import React, { Component, Suspense, lazy, useEffect, useState } from 'react';

const Hero3DCanvas = lazy(() => import('./Hero3DCanvas'));

function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

const Static3DFallback: React.FC = () => (
  <div className="relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 flex items-center justify-center">
    <div
      aria-hidden="true"
      className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#4285F4]/25 via-[#00D4FF]/20 to-[#A8FF60]/15 blur-2xl pointer-events-none"
    />
    <div
      aria-hidden="true"
      className="absolute -inset-4 rounded-full border border-[#00D4FF]/30 orbit-3d-plane pointer-events-none"
    />
    <div className="relative w-44 h-44 sm:w-52 sm:h-52 xl:w-56 xl:h-56 rounded-full p-2.5 logo-3d-medallion flex items-center justify-center">
      <img
        src="/assets/gdg-logo.jpeg"
        alt="Google Developer Groups on Campus - RIT Hassan Official Logo"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  </div>
);

interface WebGLErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const Hero3DShowcase: React.FC = () => {
  const [webglReady, setWebglReady] = useState<boolean>(true);
  const [webglFailed, setWebglFailed] = useState<boolean>(false);

  useEffect(() => {
    setWebglReady(detectWebGLSupport());
  }, []);

  const show3D = webglReady && !webglFailed;

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[430px] lg:max-w-[500px] xl:max-w-[540px] aspect-square flex items-center justify-center">
      {/* Subtle studio volumetric backlight behind the 3D WebGL stage */}
      <div
        aria-hidden="true"
        className="absolute inset-10 rounded-full bg-[radial-gradient(circle_at_50%_46%,rgba(66,133,244,0.22),rgba(0,212,255,0.1)_44%,transparent_72%)] blur-2xl pointer-events-none"
      />

      {/* Genuine 3D WebGL Stage (Lazy-Loaded with Graceful Fallback) */}
      <div className="relative w-full h-full flex items-center justify-center">
        {show3D ? (
          <WebGLErrorBoundary fallback={<Static3DFallback />}>
            <Suspense fallback={<Static3DFallback />}>
              <Hero3DCanvas onWebGLError={() => setWebglFailed(true)} />
            </Suspense>
          </WebGLErrorBoundary>
        ) : (
          <Static3DFallback />
        )}
      </div>

      {/* Institutional Support Badges (Preserved in exact positions) */}
      <div className="absolute -bottom-2 left-0 sm:left-2 p-2 sm:p-2.5 rounded-2xl surface-3d border border-[#4285F4]/35 flex items-center gap-2 z-20 pointer-events-auto">
        <img
          src="/assets/rit-logo.jpeg"
          alt="Rajeev Institute of Technology Official Logo"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg bg-white p-0.5 shrink-0 shadow-sm"
        />
        <div className="text-[10px] sm:text-[11px] leading-tight text-left">
          <span className="font-bold text-[#F5F7FF] block">RIT Hassan</span>
          <span className="text-[#A6B0C3] text-[9px] sm:text-[10px]">Inaugurated 2026</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 sm:right-2 p-2 sm:p-2.5 rounded-2xl surface-3d border border-[#00D4FF]/35 flex items-center gap-2 z-20 pointer-events-auto">
        <img
          src="/assets/cse-logo.jpeg"
          alt="Department of Computer Science and Engineering Logo"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg bg-white p-0.5 shrink-0 shadow-sm"
        />
        <div className="text-[10px] sm:text-[11px] leading-tight text-left">
          <span className="font-bold text-[#F5F7FF] block">Dept. of CSE</span>
          <span className="text-[#A6B0C3] text-[9px] sm:text-[10px]">Student Chapter</span>
        </div>
      </div>
    </div>
  );
};
