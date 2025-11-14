'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonaCard from '@/components/PersonaCard';
import Link from 'next/link';

export default function ResultPage() {
  const router = useRouter();
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have the necessary data
    if (typeof window !== 'undefined') {
      const storedBio = sessionStorage.getItem('bio');
      const storedTransformedImage = sessionStorage.getItem('transformedImage');
      const storedQuestions = sessionStorage.getItem('questions');

      if (!storedBio || !storedTransformedImage) {
        // If processing didn't complete, redirect back
        router.push('/processing');
        return;
      }

      setBio(storedBio);
      setTransformedImage(storedTransformedImage);
      
      // Load questions from sessionStorage, fallback to placeholders if not found
      const placeholderQuestions = [
        'Wat geeft jou vandaag het meeste energie?',
        'Hoe zou jij je huidige vibe omschrijven aan iemand die je net ontmoet?',
        'Waar voel jij dat je nu naar op weg bent?',
        'Wat heeft jou gemaakt tot wie je nu bent?',
        'Wat is voor jou het belangrijkste in verbinding met anderen?',
      ];
      
      if (storedQuestions) {
        try {
          const parsedQuestions = JSON.parse(storedQuestions);
          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
            setQuestions(parsedQuestions);
          } else {
            setQuestions(placeholderQuestions);
          }
        } catch (error) {
          console.warn('Failed to parse questions from sessionStorage:', error);
          setQuestions(placeholderQuestions);
        }
      } else {
        // Fallback to placeholder questions if none found in sessionStorage
        setQuestions(placeholderQuestions);
      }
      
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-[#F97068]"></div>
          </div>
          <p className="text-lg text-[#F5E8DC]/90 font-medium">
            Laden...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8">
        <h2 className="text-2xl font-black leading-tight md:text-3xl">
          JE PERSONA-KAART
        </h2>
        <PersonaCard
          bio={bio || ''}
          followUpQuestions={questions}
          imageUrl={transformedImage || undefined}
        />
        <div className="flex gap-4">
          <Link
            href="/complete"
            className="btn-primary rounded-full px-6 py-3 transition-all hover:scale-105"
          >
            VOLTOOIEN
          </Link>
        </div>
      </div>
    </div>
  );
}

