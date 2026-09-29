import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../../components/auth/AuthShell';
import { useAuth } from '../../lib/AuthContext';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setError(res.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <AuthShell
      tag="SIGN IN"
      headline={
        <span>
          Welcome
          <br />
          <span className="italic font-normal">back.</span>
        </span>
      }
      subheadline="Your safety circle and quiet companions are waiting right where you left them."
      points={[
        'Instant access to live safety corridor',
        'Cryptographically secured incident logs',
        'Zero tracking until you explicitly trigger an alert',
      ]}
    >
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#171515] tracking-tight mb-2">
          Sign in to your space
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#625B55] mb-6">
          Enter your credentials to access your safety dashboard.
        </p>

        {isAuthenticated && user && !isSuccess && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-5 flex items-center justify-between">
            <span>Signed in as <strong>{user.name || user.email}</strong></span>
            <Link to="/dashboard" className="font-semibold underline underline-offset-2 hover:text-black">
              Go to Dashboard →
            </Link>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 mb-5 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Signing you in... Loading dashboard.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="email"
              required
              className="w-full px-3.5 py-2.5 sm:py-3 bg-white rounded-xl border border-[#171515]/20 text-sm font-sans text-[#171515] placeholder:text-[#625B55]/40 focus:outline-none focus:border-[#171515] focus:ring-1 focus:ring-[#171515] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-sans text-xs text-[#625B55] hover:text-[#171515] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full px-3.5 py-2.5 sm:py-3 pr-10 bg-white rounded-xl border border-[#171515]/20 text-sm font-sans text-[#171515] placeholder:text-[#625B55]/40 focus:outline-none focus:border-[#171515] focus:ring-1 focus:ring-[#171515] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#625B55] hover:text-[#171515]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full py-3.5 px-6 rounded-xl bg-[#171515] hover:bg-black text-[#FAF7F2] font-sans text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#171515]/10 text-center">
          <p className="font-sans text-xs text-[#625B55]">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="text-[#171515] font-semibold underline underline-offset-4 hover:text-[#F62440] transition-colors"
            >
              Create your safety space →
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
