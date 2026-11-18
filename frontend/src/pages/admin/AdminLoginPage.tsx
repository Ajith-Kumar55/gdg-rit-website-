import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const { token, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please provide both username and password');
      return;
    }

    try {
      setLoading(true);
      await login({ username: username.trim(), password });
      addToast('Authentication successful! Welcome to the GDG RIT Control Panel.', 'success');

      const origin = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(origin, { replace: true });
    } catch (err: any) {
      let msg = 'Unable to sign in. Please check your credentials and try again.';
      if (!err.response) {
        msg = 'Cannot reach the backend API server. Verify that FastAPI is running on http://localhost:8000.';
      } else if (err.response.status === 429) {
        msg = err.response.data?.detail || 'Too many failed attempts. Please wait 60 seconds and try again.';
      } else if (err.response.status === 403) {
        msg = err.response.data?.detail || 'This administrator account is disabled.';
      } else if (err.response.status === 401) {
        msg = err.response.data?.detail || 'Invalid username/email or password.';
      } else if (err.response.data?.detail) {
        msg = typeof err.response.data.detail === 'string'
          ? err.response.data.detail
          : 'Login validation failed. Please check your inputs.';
      }
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] bg-grid-pattern text-[#F5F7FF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Ambient Depth Orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#4285F4]/15 rounded-full blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 w-[320px] h-[240px] bg-[#00D4FF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full p-1 mx-auto logo-3d-medallion mb-4 flex items-center justify-center">
            <img src="/assets/gdg-logo.jpeg" alt="GDG on Campus RIT Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-2xl font-black text-[#F5F7FF]">Administrator Portal</h1>
          <p className="text-xs text-[#A6B0C3] mt-1">GDG on Campus &bull; Rajeev Institute of Technology, Hassan</p>
        </div>

        {/* 3D Layered Login Box */}
        <div className="p-8 rounded-3xl surface-3d border border-[#4285F4]/30 relative">
          <div className="flex items-center gap-2 text-xs text-[#A8FF60] bg-[#A8FF60]/10 border border-[#A8FF60]/25 px-3 py-2 rounded-xl mb-6">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Authorized Club Administrators Only &bull; JWT Protected</span>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-[#FF7043]/12 border border-[#FF7043]/35 text-[#FF7043] text-xs flex items-center gap-2" role="alert">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A6B0C3]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username or email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D1322] border border-[#4285F4]/25 text-[#F5F7FF] placeholder-[#A6B0C3]/50 focus:outline-none focus:border-[#00D4FF] text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-[#A6B0C3] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A6B0C3]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#0D1322] border border-[#4285F4]/25 text-[#F5F7FF] placeholder-[#A6B0C3]/50 focus:outline-none focus:border-[#00D4FF] text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A6B0C3] hover:text-[#00D4FF]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-3d-primary font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Control Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-[#A6B0C3] hover:text-[#00D4FF] transition-colors"
            >
              &larr; Return to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
