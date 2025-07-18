'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function NewPasswordPage() {
  const router = useRouter();
  const email = useSearchParams().get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/change-password', {
        email,
        newPassword: password,
      });

      if (res.status === 200) {
        setSuccess('Password changed. Redirecting to sign in...');
        setTimeout(() => router.push('/sign-in'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <form
        onSubmit={handleReset}
        className="max-w-md w-full bg-white dark:bg-zinc-900 p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Create New Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 rounded border dark:bg-zinc-800"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
          {loading ? 'Saving...' : 'Save Password'}
        </button>
      </form>
    </main>
  );
}
