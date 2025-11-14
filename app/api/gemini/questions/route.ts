import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('❌ [GEMINI] Missing GOOGLE_API_KEY environment variable');
}

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { bio } = body;

    if (!bio || typeof bio !== 'string' || bio.trim().length === 0) {
      return NextResponse.json(
        { error: 'Bio is required' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.9, // Higher for creative, fun questions
        maxOutputTokens: 1024,
      },
    });

    const promptText = `Je bent een creatieve dating coach die persoonlijke vervolgvragen bedenkt voor een dating app.

Analyseer de volgende bio en genereer 5 leuke, laagdrempelige vragen die een ANDER persoon kan stellen aan de persoon uit de bio. De vragen moeten:
- Volledig afgestemd zijn op de specifieke bio en thema's die erin voorkomen
- Leuk en laagdrempelige zijn (niet te zwaar of te persoonlijk)
- Nieuwsgierigheid opwekken en een gesprek op gang brengen
- Aansluiten bij de tech-forward, diepgaande vibe van de bio
- In het Nederlands zijn
- Kort en bondig zijn (maximaal 1 regel per vraag)

Bio:
${bio}

Genereer nu 5 vragen. Geef alleen de vragen terug, één per regel, zonder nummering of opsommingstekens.`;

    console.log('🤖 [GEMINI] Generating follow-up questions...');
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const questionsText = response.text();

    console.log('📝 [GEMINI] Raw questions text:', questionsText);

    // Parse the questions - split by newlines and filter empty lines
    let questions = questionsText
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .map((q) => {
        // Remove numbered list prefixes (1., 2., etc.)
        q = q.replace(/^\d+[\.\)]\s*/, '');
        // Remove bullet points
        q = q.replace(/^[-•*]\s*/, '');
        // Remove any markdown formatting
        q = q.replace(/^\*\*/, '').replace(/\*\*$/, '');
        return q.trim();
      })
      .filter((q) => q.length > 0 && !q.match(/^(vraag|question|vragen|questions)/i)) // Remove meta text
      .filter((q, index, self) => self.indexOf(q) === index); // Remove duplicates

    // Ensure we have unique questions
    const uniqueQuestions: string[] = [];
    for (const q of questions) {
      if (uniqueQuestions.length >= 5) break;
      if (!uniqueQuestions.includes(q)) {
        uniqueQuestions.push(q);
      }
    }

    questions = uniqueQuestions;

    console.log('📝 [GEMINI] Parsed questions:', questions);

    // If we don't have 5 questions, pad with fallback
    const fallbackQuestions = [
      'Wat geeft jou vandaag het meeste energie?',
      'Hoe zou jij je huidige vibe omschrijven aan iemand die je net ontmoet?',
      'Waar voel jij dat je nu naar op weg bent?',
      'Wat heeft jou gemaakt tot wie je nu bent?',
      'Wat is voor jou het belangrijkste in verbinding met anderen?',
    ];

    while (questions.length < 5) {
      const fallbackIndex = questions.length;
      if (fallbackIndex < fallbackQuestions.length) {
        questions.push(fallbackQuestions[fallbackIndex]);
      } else {
        questions.push(fallbackQuestions[0]);
      }
    }

    // Ensure exactly 5 questions
    questions = questions.slice(0, 5);

    console.log('✅ [GEMINI] Questions generated successfully:', questions);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('❌ [GEMINI] Error generating questions:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate questions',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

