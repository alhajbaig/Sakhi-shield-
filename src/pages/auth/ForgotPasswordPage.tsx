import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../../components/auth/AuthShell';
import { useAuth } from '../../lib/AuthContext';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await forgotPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.error || 'Failed to send recovery link. Please try again.');
    }
  };

  return (
    <AuthShell
      tag="ACCOUNT RECOVERY"
      headline={
        <span>
          Let's get
          <br />
          <span className="italic font-normal">you back in.</span>
        </span>
      }
      subheadline="Enter the email associated with your SakhiShield account. We'll send you a private recovery link to safely regain access."
      points={[
        'Recovery links expire after 15 minutes',
        'End-to-end encrypted password reset',
        'Your guardian network remains uninterrupted',
      ]}
    >
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#171515] tracking-tight mb-2">
          Reset password
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#625B55] mb-6">
          We'll send a secure reset link to your registered email.
        </p>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 mb-5 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#171515]">
              Check your inbox
            </h3>
            <p className="font-sans text-xs text-[#625B55] leading-relaxed">
              We've sent a recovery link to <strong className="text-[#171515]">{email}</strong>. Please check your email to reset your credentials.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#171515] text-[#FAF7F2] text-xs font-mono font-bold tracking-wider rounded-xl hover:bg-black transition-colors"
              >
                Back to sign in →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[11px] font-semibold tracking-wider text-[#171515] uppercase mb-1.5"
              >
                Registered Email Address
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#171515] hover:bg-black text-[#FAF7F2] font-sans text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <span>Send reset link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#171515]/10 text-center">
          <p className="font-sans text-xs text-[#625B55]">
            Remember your password?{' '}
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

export default ForgotPasswordPage;
