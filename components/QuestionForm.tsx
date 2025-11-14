'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';

interface QuestionFormProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionForm({
  question,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}: QuestionFormProps) {
  const handleFillContent = () => {
    if (!value.trim()) {
      onChange(question.placeholder);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col">
      <h2 className="mb-6 text-2xl font-black leading-tight md:text-3xl">
        {question.question.toUpperCase()}
      </h2>
      
      {!value.trim() && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleFillContent}
            className="text-sm text-[#F97068]/80 hover:text-[#F97068] underline transition-colors"
          >
            Fill with content
          </button>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Typ hier je antwoord..."
        className="mb-8 min-h-[200px] w-full rounded-lg border-2 border-[#F97068]/30 bg-[rgba(51,92,103,0.8)] p-4 text-[#F5E8DC] placeholder:text-[#F5E8DC]/40 focus:border-[#F97068] focus:outline-none focus:ring-2 focus:ring-[#F97068]/30 md:min-h-[300px]"
        rows={10}
      />

      <div className="flex gap-4">
        {!isFirst && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary flex-1 rounded-full px-6 py-3 transition-all hover:scale-105"
          >
            TERUG
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!value.trim()}
          className="btn-primary flex-1 rounded-full px-6 py-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLast ? 'VOLTOOIEN' : 'VOLGENDE'}
        </button>
      </div>
    </div>
  );
}

