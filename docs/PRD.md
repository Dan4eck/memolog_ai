# Product Requirements Document: MemeLog AI
## Simple AI Meme Generator

**Version:** 2.1
**Last Updated:** 2025-11-26
**Status:** In Production

---

## Executive Summary

MemeLog AI is a web application that generates memes using AI. Users select a template, enter a topic, and receive 4 variations ready to download.

**User Flow:** Browse templates → Select → Enter topic → Generate → Download

**Deployment:** Vercel (Production)

---

## Technical Architecture

### Stack
- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS
- **Backend:** Next.js API Routes
- **Deployment:** Vercel
- **State:** React useState hooks

### API Routes
- `GET /api/templates` - Fetch meme templates from Imgflip
- `POST /api/generate` - Generate 4 memes with captions

### External APIs
1. **Imgflip API** - Template fetching and image generation
   - `GET /get_memes` - List templates
   - `POST /caption_image` - Generate meme images

2. **OpenAI API** (Optional) - AI caption generation
   - Model: gpt-4o-mini
   - Fallback: Template-based captions if key not provided

---

## System Architecture

```
Browser (Next.js App)
    ↓
Next.js API Routes
    ↓
External APIs:
  - Imgflip (templates & images)
  - OpenAI (captions - optional)
```

### Generation Flow
1. User selects template → `/generate?templateId=X`
2. User enters topic → POST `/api/generate`
3. Backend generates 4 captions (OpenAI or fallback)
4. Backend calls Imgflip 4x to create images
5. Returns 4 meme URLs to frontend
6. User downloads individual or all memes

---

## Implementation Status

### ✅ Completed
- Homepage with template carousel and search
- Generation page with topic input (200 char limit)
- AI caption generation via OpenAI (with fallback)
- Imgflip integration for meme creation
- 2×2 grid display of 4 generated memes
- Individual and bulk download functionality
- Regenerate and navigation controls
- Deployed to Vercel

### 🔄 Optional Enhancements
- Rate limiting
- User analytics
- Mobile optimization
- Custom template upload
- Social media sharing

---

## Environment Variables

**Required:**
- `IMGFLIP_USERNAME` - Imgflip account username
- `IMGFLIP_PASSWORD` - Imgflip account password

**Optional:**
- `OPENAI_API_KEY` - OpenAI API key (app works without it using fallback captions)

**Vercel Setup:**
Add these in: Project Settings → Environment Variables → Redeploy

---

## Notes

- App works without OpenAI key (uses template-based fallback captions)
- Imgflip free tier: 100 requests/day (~25 generations)
- Generation time: ~10-15 seconds for 4 memes
- All meme images hosted on Imgflip CDN (no storage needed)
