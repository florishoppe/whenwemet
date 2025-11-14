'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import ProgressIndicator from '@/components/ProgressIndicator';
import QuestionForm from '@/components/QuestionForm';

export default function QuestionsPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

  useEffect(() => {
    // Store answers in sessionStorage for navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('answers', JSON.stringify(answers));
    }
  }, [answers]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, go to photo
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('answers', JSON.stringify(answers));
      }
      router.push('/photo');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col items-center">
        <ProgressIndicator current={currentQuestion + 1} total={questions.length} />
        <QuestionForm
          question={questions[currentQuestion]}
          value={answers[currentQuestion]}
          onChange={handleAnswerChange}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentQuestion === 0}
          isLast={currentQuestion === questions.length - 1}
        />
      </div>
    </div>
  );
}

