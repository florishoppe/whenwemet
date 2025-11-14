'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Clear session data when landing on home page
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('answers');
      sessionStorage.removeItem('photo');
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <h1 className="mb-8 text-4xl font-black leading-tight tracking-tight md:text-5xl">
          WHEN WE MET
        </h1>
        <p className="mb-12 max-w-md text-lg leading-relaxed text-[#F5E8DC]/90">
          Geef vijf korte antwoorden en één foto. Krijg een heldere beschrijving van je huidige vibe en een bijpassend visueel persona.
        </p>
        <Link
          href="/questions"
          className="btn-primary rounded-full px-8 py-4 text-lg transition-all hover:scale-105"
        >
          START
        </Link>
      </main>
    </div>
  );
}
