'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes

  // 🕒 Countdown for resend
  useEffect(() => {
    if (otpSent && !canResend && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer <= 0) {
      setCanResend(true);
    }
  }, [otpSent, timer, canResend]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) return setError('Please enter your email first.');

    try {
      setError('');
      const res = await axios.post('/api/send-otp', { email });

      if (res.data.success) {
        setOtpSent(true);
        setTimer(120); // 2 min timer
        setCanResend(false);
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post('/api/resend-otp', { email });

      if (res.data.success) {
        setError('');
        setTimer(120);
        setCanResend(false);
        setOtpSent(true);
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.data.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error resending OTP');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 border rounded dark:bg-zinc-800"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border rounded dark:bg-zinc-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={!email || otpSent}
            className="text-sm text-purple-600 hover:underline disabled:opacity-50"
          >
            Forgot password?
          </button>

          {otpSent && !canResend && (
            <p className="text-xs text-muted-foreground">
              Wait {timer} seconds to resend OTP
            </p>
          )}

          {otpSent && canResend && (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-purple-600 hover:underline"
            >
              Resend OTP?
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
