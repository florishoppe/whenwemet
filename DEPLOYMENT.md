# Deployment Guide

This project is ready to deploy to Vercel (recommended) or other platforms.

## Required Environment Variables

Before deploying, you need to set up the following environment variables:

1. **GOOGLE_API_KEY** - Your Google Gemini API key
   - Get it from: https://makersuite.google.com/app/apikey
   - Used for: Persona generation and question handling

2. **FAL_API_KEY_ATHAR_ONLY** - Your FAL AI API key
   - Get it from: https://fal.ai/dashboard
   - Used for: Image transformation to GTA-style

## Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository: `florishoppe/whenwemet`
4. Configure environment variables:
   - Add `GOOGLE_API_KEY` with your Gemini API key
   - Add `FAL_API_KEY_ATHAR_ONLY` with your FAL AI API key
5. Click "Deploy"
6. Your app will be live at `https://whenwemet.vercel.app` (or your custom domain)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add GOOGLE_API_KEY
vercel env add FAL_API_KEY_ATHAR_ONLY

# Deploy to production
vercel --prod
```

## Deploy to Other Platforms

### Netlify

1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Deploy

### Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Railway will auto-detect Next.js and deploy

### Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test the camera capture functionality
- [ ] Test the Gemini API integration
- [ ] Test the FAL AI image transformation
- [ ] Check that all routes are working
- [ ] Verify HTTPS is enabled (required for camera access)
- [ ] Test on mobile devices (camera functionality)

## Troubleshooting

### Camera not working
- Ensure the site is served over HTTPS (required for getUserMedia API)
- Check browser permissions for camera access

### API errors
- Verify environment variables are set correctly
- Check API key permissions and quotas
- Review server logs in Vercel dashboard

### Build errors
- Ensure all dependencies are in `package.json`
- Check Node.js version (requires 18+)
- Review build logs for specific errors

