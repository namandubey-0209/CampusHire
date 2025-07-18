'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as 'student' | 'admin' | null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-sm">
          No role selected. Please go back to{' '}
          <a href="/o-sign-up" className="underline text-purple-600">
            choose your role
          </a>
          .
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/sign-up', {
        ...formData,
        role,
      });

      if (res.data.success) {
        router.push('/sign-in');
      } else {
        setError(res.data.message || 'Something went wrong.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold text-center">
          Sign up as <span className="capitalize">{role}</span>
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-zinc-800"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-zinc-800"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-zinc-800"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </main>
  );
}
