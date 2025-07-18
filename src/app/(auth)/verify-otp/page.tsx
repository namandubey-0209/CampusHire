'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyOtpPage() {
  const router = useRouter();
  const email = useSearchParams().get('email') || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('/api/verify-forgot-pass-code', {
        email,
        code: otp,
      });

      if (res.status === 200) {
        setSuccess('OTP verified.');
        router.push(`/new-password?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <form
        onSubmit={handleVerify}
        className="max-w-md w-full bg-white dark:bg-zinc-900 p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-2 rounded border dark:bg-zinc-800"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 ${
            loading && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </main>
  );
}
