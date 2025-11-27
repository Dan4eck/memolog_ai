# CLAUDE.MD - MemeLog AI

This document helps Claude Code understand the memolog_ai project structure, conventions, and workflows.

## Project Overview

**memolog_ai** is an AI-powered meme generator that helps users create viral-worthy memes in seconds. Users browse 50+ meme templates, select one, enter a topic, and receive 4 AI-generated caption variations ready to download.

**Live Demo:** https://memolog-ai.vercel.app/

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Next.js API Routes
- **AI:** OpenAI GPT-4o-mini (optional, with fallback)
- **Meme API:** Imgflip API
- **Deployment:** Vercel
- **State Management:** React useState hooks

## Project Structure

```
/home/user/memolog_ai/
├── app/
│   ├── page.tsx              # Homepage - template browsing & search
│   ├── layout.tsx            # Root layout with metadata
│   ├── generate/
│   │   └── page.tsx          # Generation page - topic input & results
│   └── api/
│       ├── templates/
│       │   └── route.ts      # GET /api/templates - Fetch from Imgflip
│       └── generate/
│           └── route.ts      # POST /api/generate - Generate 4 memes
├── components/
│   ├── SearchBar.tsx         # Template search component
│   ├── TemplateCard.tsx      # Individual template card
│   └── TemplateCarousel.tsx  # Template grid/carousel
├── types/
│   └── meme.ts               # TypeScript interfaces
├── PRD.md                    # Product Requirements Document
├── README.md                 # User-facing documentation
└── package.json              # Dependencies and scripts
```

## Key Files

### Frontend Pages

- **app/page.tsx** - Homepage with template carousel and search functionality
- **app/generate/page.tsx** - Generation page with topic input (200 char limit), 2×2 meme grid, download, and regenerate controls

### API Routes

- **app/api/templates/route.ts** - Fetches meme templates from Imgflip API
- **app/api/generate/route.ts** - Generates 4 meme variations:
  1. Generates 4 captions using OpenAI (or fallback if no API key)
  2. Calls Imgflip API 4 times to create meme images
  3. Returns 4 meme URLs

### Components

- **SearchBar.tsx** - Real-time template search
- **TemplateCard.tsx** - Displays template preview with click handler
- **TemplateCarousel.tsx** - Grid layout of templates with loading states

### Types

- **types/meme.ts** - TypeScript interfaces for templates and memes

## Environment Variables

**Required:**
- `IMGFLIP_USERNAME` - Imgflip account username
- `IMGFLIP_PASSWORD` - Imgflip account password

**Optional:**
- `OPENAI_API_KEY` - OpenAI API key (app works without it using fallback captions)

See `.env.example` for reference.

## User Flow

1. **Browse** - User views 50+ popular meme templates on homepage
2. **Search** - User can search templates by name
3. **Select** - User clicks a template → redirects to `/generate?templateId=X`
4. **Input** - User enters topic/idea (max 200 characters)
5. **Generate** - Backend creates 4 caption variations and generates images
6. **Download** - User can download individual memes or all 4 at once
7. **Regenerate** - User can generate new variations with same topic

## External API Integrations

### Imgflip API
- **GET** `https://api.imgflip.com/get_memes` - List all templates
- **POST** `https://api.imgflip.com/caption_image` - Generate meme image
- Free tier: 100 requests/day (~25 generations)

### OpenAI API
- Model: `gpt-4o-mini`
- Purpose: Generate witty, contextual meme captions
- Fallback: Template-based generic captions if API key not provided

## Development Workflow

### Common Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Git Workflow

- **Main branch:** `main` (production)
- **Feature branches:** `claude/*` prefix for AI-assisted development
- **Current branch:** `claude/update-claude-md-01JWagznyL3d9dmboBusMxoG`
- Always commit with clear, descriptive messages
- Push to feature branch before creating PRs

### Testing Changes

1. Run `npm run dev` to test locally
2. Test both with and without `OPENAI_API_KEY` to verify fallback
3. Verify mobile responsiveness
4. Check Vercel deployment preview after pushing

## Coding Conventions

### TypeScript
- All components and routes use TypeScript
- Interfaces defined in `/types/meme.ts`
- Strict mode enabled

### React/Next.js
- Use App Router (not Pages Router)
- Server Components by default, Client Components only when needed (`'use client'`)
- Async Server Components for data fetching when possible

### Styling
- Tailwind CSS for all styling
- Dark mode support via Tailwind's `dark:` variant
- Responsive design: mobile-first approach

### Error Handling
- Try/catch blocks in API routes
- User-friendly error messages
- Fallback mechanisms (e.g., OpenAI → template-based captions)

### Code Organization
- Keep components small and focused
- Extract reusable logic into separate functions
- Use meaningful variable names
- Comment complex logic

## Important Implementation Notes

### Generation Page (`app/generate/page.tsx`)
- Uses Suspense boundary to prevent 404 errors with URL params
- Fetches template data on mount using templateId from query params
- Displays 2×2 grid of generated memes
- Download functionality for individual and bulk downloads

### API Generate Route (`app/api/generate/route.ts`)
- Generates 4 caption variations (varied tone/style)
- Sequentially calls Imgflip API 4 times
- Takes ~10-15 seconds to complete
- Returns array of meme URLs

### Template Search
- Client-side filtering for instant results
- Case-insensitive search
- Searches template names only

## Known Limitations

- Imgflip free tier: 100 requests/day (~25 generations)
- Generation time: ~10-15 seconds for 4 memes
- No custom template upload (uses Imgflip's catalog only)
- No user accounts or saved memes
- No rate limiting implemented yet

## Future Enhancements (from PRD)

- Rate limiting
- User analytics
- Enhanced mobile optimization
- Custom template upload
- Social media sharing integration

## Deployment

**Platform:** Vercel
**Live URL:** https://memolog-ai.vercel.app/

**Deployment Process:**
1. Push to branch
2. Vercel auto-deploys preview
3. Merge to main for production deployment
4. Set environment variables in Vercel dashboard

## Helpful Context for Claude

- This is a production app already deployed to Vercel
- Prioritize simplicity over over-engineering
- The app must work without OpenAI API key (fallback captions)
- All meme images are hosted on Imgflip CDN (no storage needed)
- Keep generation flow fast and user-friendly
- Follow Next.js 16 App Router patterns
- Use Server Components where possible for better performance
