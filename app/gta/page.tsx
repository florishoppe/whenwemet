'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GTALandingPage() {
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
        <h1 className="mb-8 text-4xl font-black uppercase leading-tight tracking-tight text-[#F97068] md:text-5xl">
          WHEN WE MET
        </h1>
        <p className="mb-12 max-w-md text-lg leading-relaxed text-[#F5E8DC]/90">
          Geef vijf korte antwoorden en één foto. Krijg een heldere beschrijving van je huidige vibe en een bijpassend visueel persona.
        </p>
        <Link
          href="/questions"
          className="block w-full max-w-md border-2 border-[#F97068] bg-[#F97068] px-8 py-4 text-center font-black uppercase tracking-wider text-white transition-all hover:bg-[#8B2C3D] hover:border-[#8B2C3D]"
        >
          START
        </Link>
      </main>
    </div>
  );
}

