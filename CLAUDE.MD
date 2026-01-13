# CLAUDE.MD - MemeLog AI

This document helps Claude Code understand the memolog_ai project structure, conventions, and workflows.

## ⚠️ CRITICAL RULE - Project Structure Maintenance

**BEFORE EVERY COMMIT:**
1. Review the `## Project Structure` section below
2. Update it to reflect any new files, directories, or changes made in this iteration
3. Ensure all file descriptions are accurate and current
4. Add new files with clear, concise descriptions
5. Remove deleted files from the structure

This keeps the documentation synchronized with the actual codebase at all times.

## Project Overview

**memolog_ai** is an AI-powered meme generator that helps users create viral-worthy memes in seconds. Users browse 50+ meme templates, select one, enter a topic, and receive 4 AI-generated caption variations ready to download.

**Live Demo:** https://memolog-ai.vercel.app/

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Next.js API Routes
- **AI:** OpenAI GPT-5.1 (optional, with fallback)
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
│   ├── MemeGallery.tsx       # Gallery with search & display logic
│   ├── SearchBar.tsx         # Template search component
│   ├── TemplateCard.tsx      # Individual template card (image only)
│   └── TemplateGrid.tsx      # Responsive grid: 2 cols (mobile) → 6 cols (desktop)
├── types/
│   └── meme.ts               # TypeScript interfaces
├── PRD.md                    # Product Requirements Document
├── README.md                 # User-facing documentation
├── CLAUDE.MD                 # This file - AI context & conventions
└── package.json              # Dependencies and scripts
```

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
- Model: `gpt-5.1` (Responses API with `client.responses.create()`)
- Purpose: Generate 4 caption variations with different tones (sarcastic, wholesome, edgy, meta)
- Dynamically adapts to template box_count (1-5+ text boxes)
- Fallback: Template-based generic captions if API key not provided

## Development Workflow

**This project uses LOCAL development workflow.**

### Local Development Process

```
1. Plan changes thoroughly
   ↓
2. Edit code with Claude
   ↓
3. Test locally with npm run dev
   ↓
4. Iterate and refine
   ↓
5. Update ## Project Structure section (if files changed)
   ↓
6. Commit with clear, descriptive message when ready
   ↓
7. Push to feature branch
   ↓
8. Vercel auto-deploys preview for final testing
   ↓
9. Merge to main for production deployment
```

### Testing Strategy

**Local Development:**
1. Run `npm run dev` to start dev server (localhost:3000)
2. Make changes and test in browser immediately
3. Check browser DevTools console for errors
4. Verify mobile responsiveness using browser DevTools device mode
5. Iterate quickly with hot-reload

### Debugging Tools

- **Local Dev Server** - npm run dev with hot-reload
- **Browser DevTools** - Frontend debugging locally and on preview URLs
- **Console logging** - Add detailed logs for debugging
- **Error boundaries** - Catch and display React errors gracefully
- **Vercel Runtime Logs** - Check deployment logs for production errors

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
- Displays 2×2 grid of generated memes with tone labels
- Shows all text boxes for multi-panel memes
- Download functionality for individual and bulk downloads

### API Generate Route (`app/api/generate/route.ts`)
- Uses GPT-5.1 to generate 4 caption variations with tones: sarcastic, wholesome, edgy, meta
- Caption structure: `{texts: string[], tone?: string}` (supports 1-5+ text boxes)
- Uses Imgflip `boxes[index][text]` parameter format for multi-box templates
- Sequentially calls Imgflip API 4 times
- Takes ~10-15 seconds to complete
- Returns array of meme objects with imageUrl and caption data

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
- **Text rendering issue**: Some templates (e.g., Grant Gustin grave) show black boxes behind text. Imgflip API has no parameter to control text box backgrounds. Current workaround: using `boxes[index][text]` without color parameters, but issue persists for certain templates.

## Deployment

**Platform:** Vercel
**Live URL:** https://memolog-ai.vercel.app/

**Deployment Process:**
1. Push to branch
2. Vercel auto-deploys preview
3. Merge to main for production deployment
4. Set environment variables in Vercel dashboard

## Helpful Context for Claude

### General Principles
- This is a production app already deployed to Vercel
- Prioritize simplicity over over-engineering
- The app must work without OpenAI API key (fallback captions)
- All meme images are hosted on Imgflip CDN (no storage needed)
- Keep generation flow fast and user-friendly
- Follow Next.js 16 App Router patterns
- Use Server Components where possible for better performance

### Documentation Writing Rules

**When user requests documentation for new features or logic:**

1. **Create separate MD file** - Never add to CLAUDE.MD or existing docs
2. **File naming:** `docs/FEATURE_NAME.md` or `FEATURE_NAME_DOCS.md`
3. **NO code examples** - Only describe what was done and how it works
4. **Content to include:**
   - What was implemented
   - How the feature works
   - Technical implementation details
   - Integration points with existing code
5. **Content to EXCLUDE:**
   - Limitations or constraints
   - Risks or potential issues
   - Potential user experience considerations
   - Future improvements or "nice to haves"
   - Code snippets or examples
   - Warnings or caveats

**Format:**
- Brief and factual
- Describe what exists, not what could be
- Focus on "what" and "how", not "why" or "what if"
- Keep it technical and straightforward
