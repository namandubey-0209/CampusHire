'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';

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
      identifier: email,
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
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to CampusHire
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back! Please enter your credentials.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSignIn}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Forgot your password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {otpSent && !canResend && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-800">
                OTP sent! Wait {timer} seconds to resend.
              </div>
            </div>
          )}

          {otpSent && canResend && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Resend OTP
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/o-sign-up" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);

}
