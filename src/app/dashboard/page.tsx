'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-bold text-purple-700">Dashboard</h1>
        <p className="text-lg">Welcome! You are signed in.</p>
        <button
          onClick={handleSignOut}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
