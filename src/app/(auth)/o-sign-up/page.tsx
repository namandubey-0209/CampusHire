'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OSignUpPage() {
  const router = useRouter();

  const handleChoice = (role: 'admin' | 'student') => {
    router.push(`/sign-up?role=${role}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">
        <h1 className="text-3xl font-bold">👋 Welcome to <span className="text-purple-600">CampusHire</span></h1>
        <p className="text-lg">Join as a Student or an Admin to get started</p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => handleChoice('student')}
            className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white text-lg font-semibold hover:bg-purple-700 transition-all"
          >
            Continue as Student
          </button>

          <button
            onClick={() => handleChoice('admin')}
            className="w-full px-6 py-3 rounded-lg border border-purple-600 text-purple-600 text-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900 transition-all"
          >
            Continue as Admin
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Already have an account? <Link href="/sign-in" className="underline hover:text-purple-600">Sign In</Link>
        </p>
      </div>
    </main>
  );
}
