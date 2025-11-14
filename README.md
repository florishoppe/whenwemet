# When We Met

A Next.js application that creates personalized dating profiles using AI. Users answer 5 questions, upload a photo, and receive a creative bio with a GTA-style character illustration.

## Features

- 📝 Multi-step questionnaire flow
- 📸 Camera capture functionality
- 🤖 Google Gemini AI for persona generation
- 🎨 FAL AI for GTA-style image transformation
- 🎯 Modern, responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API key
- FAL AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/florishoppe/whenwemet.git
cd whenwemet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
FAL_API_KEY_ATHAR_ONLY=your_fal_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

- `GOOGLE_API_KEY` - Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- `FAL_API_KEY_ATHAR_ONLY` - FAL AI API key ([Get one here](https://fal.ai/dashboard))

## Deployment

The project is ready to deploy! See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in the Vercel dashboard
4. Deploy!

For more deployment options, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Project Structure

```
whenwemet/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes (Gemini, FAL)
│   ├── questions/         # Questionnaire page
│   ├── photo/             # Photo capture page
│   ├── processing/        # Processing page
│   ├── result/            # Results page
│   └── ...
├── components/            # React components
├── lib/                   # Utilities and types
└── public/                # Static assets
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Services**: 
  - Google Gemini (persona generation)
  - FAL AI (image transformation)

## License

Private project
