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
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.8, // Higher for creative, over-the-top bio
        maxOutputTokens: 2048,
      },
    });

    // Build prompt from questionnaire answers
    const questions = [
      'Wie ben je in de kern?',
      'Wat vormt jouw dagelijks leven en wat geeft je energie?',
      'Welke ervaringen hebben jou gemaakt wie je bent?',
      'Hoe functioneer je sociaal — in vriendschappen, groepen en relaties?',
      'Wat vind jij écht belangrijk dat iemand over jou weet?',
    ];

    let promptText = `Je bent een creatieve schrijver die persoonlijke bios schrijft voor een dating app voor tech mensen. 

Analyseer de volgende antwoorden op vragenlijsten en schrijf een BOLD, "upgraded", over-the-top bio die de persoon op een aantrekkelijke en interessante manier presenteert. De bio moet:
- Zelfverzekerd en aantrekkelijk zijn
- De kern van de persoon vangen
- Tech-forward en modern klinken
- Geschikt zijn voor een dating context
- Maximaal 4-5 paragrafen

BELANGRIJK: Begin DIRECT met de bio content. Gebruik GEEN introductie tekst zoals "Oké, hier gaan we", "Dit is geen standaard bio", "Dit is een manifest" of andere inleidende zinnen. Start direct met de hoofdinhoud van de bio.

Vragen en antwoorden:\n\n`;

    answers.forEach((answer: string, index: number) => {
      if (answer && answer.trim()) {
        promptText += `Vraag ${index + 1}: ${questions[index]}\nAntwoord: ${answer}\n\n`;
      }
    });

    promptText += `\nSchrijf nu een bold, over-the-top bio in het Nederlands die deze persoon op een aantrekkelijke manier presenteert. Focus op wat hen uniek maakt, hun energie, en wat ze zoeken in verbinding. Begin DIRECT met de bio content zonder inleidende tekst.`;

    console.log('🤖 [GEMINI] Generating persona bio...');
    const result = await model.generateContent(promptText);
    const response = await result.response;
    let bio = response.text();

    // Post-processing: Remove common intro phrases if they still appear
    const introPhrases = [
      /^Oké, hier gaan we\.?\s*/i,
      /^Dit is geen standaard bio[^.]*\.?\s*/i,
      /^Dit is een manifest[^.]*\.?\s*/i,
      /^Hier gaan we[^.]*\.?\s*/i,
      /^Oké[^.]*\.?\s*/i,
    ];

    for (const phrase of introPhrases) {
      bio = bio.replace(phrase, '');
    }

    // Remove leading whitespace and newlines
    bio = bio.trim();

    console.log('✅ [GEMINI] Bio generated successfully');

    return NextResponse.json({ bio });
  } catch (error) {
    console.error('❌ [GEMINI] Error generating bio:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate bio',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

