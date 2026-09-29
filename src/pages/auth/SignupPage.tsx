import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../../components/auth/AuthShell';
import { useAuth } from '../../lib/AuthContext';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Mail } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, user } = useAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(name, email, password, phone);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      // Check if the user was set (immediate login) or if email confirmation is needed
      // If isAuthenticated becomes true, the useEffect redirect will handle navigation
      if (!isAuthenticated) {
        // Email confirmation is likely required
        setNeedsEmailConfirmation(true);
      } else {
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } else {
      setError(res.error || 'Failed to create account. Please check your information.');
    }
  };

  return (
    <AuthShell
      tag="CREATE ACCOUNT"
      headline={
        <span>
          Your journey.
          <br />
          Your people.
          <br />
          <span className="italic font-normal">Your safety.</span>
        </span>
      }
      subheadline="Enter a calm private safety space. You stay in control of who you trust and what you share."
      points={[
        'Zero persistent location tracking',
        'Direct connection to your trusted guardians',
        'Private incident vault with cryptographic integrity',
      ]}
    >
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#171515] tracking-tight mb-2">
          Create your space
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#625B55] mb-6">
          Set up your private safety space in seconds.
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

        {isSuccess && !needsEmailConfirmation && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 mb-5 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Account created successfully. Loading dashboard...</span>
          </div>
        )}

        {needsEmailConfirmation && (
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#171515]">
              Check your email
            </h3>
            <p className="font-sans text-xs text-[#625B55] leading-relaxed">
              We've sent a confirmation link to <strong className="text-[#171515]">{email}</strong>.
              Please verify your email to complete registration.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#171515] text-[#FAF7F2] text-xs font-mono font-bold tracking-wider rounded-xl hover:bg-black transition-colors"
              >
                Go to sign in →
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aanchal Tewani"
              autoComplete="name"
              required
              className="w-full px-3.5 py-2.5 sm:py-3 bg-white rounded-xl border border-[#171515]/20 text-sm font-sans text-[#171515] placeholder:text-[#625B55]/40 focus:outline-none focus:border-[#171515] focus:ring-1 focus:ring-[#171515] transition-colors"
            />
          </div>

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
            <label
              htmlFor="phone"
              className="block font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase mb-1.5"
            >
              Phone Number <span className="font-normal text-[#625B55] lowercase">(for SOS alerts)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98XXX XXXXX"
              autoComplete="tel"
              className="w-full px-3.5 py-2.5 sm:py-3 bg-white rounded-xl border border-[#171515]/20 text-sm font-sans text-[#171515] placeholder:text-[#625B55]/40 focus:outline-none focus:border-[#171515] focus:ring-1 focus:ring-[#171515] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                className="w-full px-3.5 py-2.5 sm:py-3 bg-white rounded-xl border border-[#171515]/20 text-sm font-sans text-[#171515] placeholder:text-[#625B55]/40 focus:outline-none focus:border-[#171515] focus:ring-1 focus:ring-[#171515] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full py-3.5 px-6 rounded-xl bg-[#171515] hover:bg-black text-[#FAF7F2] font-sans text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <span>Creating your space...</span>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#171515]/10 text-center">
          <p className="font-sans text-xs text-[#625B55]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#171515] font-semibold underline underline-offset-4 hover:text-[#F62440] transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

export default SignupPage;
