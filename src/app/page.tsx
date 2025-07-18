// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-6 p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold">Welcome to <span className="text-purple-600">CampusHire</span></h1>
      <p className="text-lg">Find your path. Join as a Student or Admin.</p>
      <div className="flex gap-4">
        <Link href="/o-sign-up">
          <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Sign Up</button>
        </Link>
        <Link href="/sign-in">
          <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-50 dark:hover:bg-purple-900">Sign In</button>
        </Link>
      </div>
    </main>
  );
}
