'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CameraCapture from '@/components/CameraCapture';

export default function PhotoPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if answers exist
    if (typeof window !== 'undefined') {
      const answers = sessionStorage.getItem('answers');
      if (!answers) {
        router.push('/questions');
      }
    }
  }, [router]);

  const handleCapture = (photo: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('photo', photo);
      router.push('/processing');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col items-center">
        <h2 className="mb-8 text-2xl font-black leading-tight md:text-3xl">
          MAAK ÉÉN FOTO
        </h2>
        <p className="mb-8 text-center text-[#F5E8DC]/80">
          Niet perfect, gewoon jij.
        </p>
        <CameraCapture onCapture={handleCapture} />
      </div>
    </div>
  );
}

