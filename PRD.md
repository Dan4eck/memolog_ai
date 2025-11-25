# Product Requirements Document: MemeLog AI
## Simple AI Meme Generator

**Version:** 2.0
**Last Updated:** 2025-11-25
**Status:** Draft

---

## Executive Summary

**MemeLog AI** is a simple web application that helps users quickly generate memes using AI. Users select a meme template, input a topic, and receive 4 AI-generated variations ready to download.

### Problem
Creating engaging memes requires creativity and time. Users need a quick way to generate multiple meme variations for a given topic.

### Solution
A streamlined meme generator: pick template → input topic → get 4 AI-generated memes → download or regenerate.

---

## User Flow

```
1. Homepage
   ├─> Meme Template Carousel (displays popular templates)
   ├─> Search Bar (find template by name)
   └─> Click template to select

2. Generation Page
   ├─> Selected template preview
   ├─> Topic input field (text area)
   └─> Click "Generate" button

3. Loading State
   └─> Generating 4 meme variations... (~10 seconds)

4. Results Page
   ├─> Display 4 generated memes in grid
   ├─> Each meme shows: template + AI-generated caption
   └─> Actions per meme:
       ├─> Download (individual PNG)
       └─> View full size

5. Page Actions
   ├─> "Download All" (ZIP file with 4 memes)
   ├─> "Regenerate" (create 4 new variations)
   └─> "Choose Different Template" (back to homepage)
```

---

## Technical Architecture

### Frontend
**Framework:** React.js with Next.js
**UI Components:**
- **Homepage:**
  - Horizontal carousel of meme templates (scrollable)
  - Search bar with autocomplete
  - Template cards showing: thumbnail, name, popularity count

- **Generation Page:**
  - Template preview (large)
  - Topic textarea (max 200 characters)
  - Generate button with loading state

- **Results Page:**
  - 2×2 grid of generated memes
  - Download buttons (individual + bulk)
  - Regenerate and back buttons

**Styling:** Tailwind CSS
**State Management:** React Context or useState hooks

### Backend
**Framework:** Node.js with Express (or Python FastAPI)
**Routes:**
```
GET  /api/templates          → List all meme templates
GET  /api/templates/search   → Search templates by name
POST /api/generate           → Generate 4 memes (body: {templateId, topic})
GET  /api/images/:id         → Serve generated image
```

### API Integrations

#### 1. Imgflip API (Meme Templates & Generation)
**Purpose:** Fetch templates and generate meme images

**Endpoints:**
```bash
# Get all available templates
GET https://api.imgflip.com/get_memes

# Generate meme with captions
POST https://api.imgflip.com/caption_image
Body:
{
  "template_id": "181913649",
  "username": "your_username",
  "password": "your_password",
  "text0": "Top text",
  "text1": "Bottom text"
}
```

**Authentication:** Username/Password (stored in env variables)
**Rate Limits:**
- Free: 100 requests/day
- Paid ($9/month): Unlimited

**Cost Estimate:**
- 4 memes per generation = 4 API calls
- Free tier: ~25 generations/day
- Paid tier: Unlimited for $9/month

#### 2. OpenAI API (Caption Generation)
**Purpose:** Generate witty, contextual captions based on topic

**Endpoint:**
```bash
POST https://api.openai.com/v1/chat/completions
Body:
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a meme caption writer. Generate funny, concise captions."
    },
    {
      "role": "user",
      "content": "Generate 4 different captions for the 'Drake Hotline Bling' meme about the topic: remote work"
    }
  ],
  "temperature": 0.8
}
```

**Authentication:** API key (Bearer token)
**Model:** GPT-4o-mini (cost-effective)
**Cost:** ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

**Cost Estimate per Generation:**
- Input: ~100 tokens = $0.000015
- Output: ~200 tokens = $0.00012
- **Total: ~$0.0002 per generation (4 captions)**

#### Combined Cost Per User Generation
- OpenAI (captions): $0.0002
- Imgflip (4 images): $0 (free tier) or ~$0.001 (paid)
- **Total: ~$0.0002 - $0.001 per generation**

---

## System Architecture

```
┌──────────────────────────────────────┐
│         User Browser                 │
│  (React Frontend - Next.js)          │
└─────────────┬────────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│      Backend API Server              │
│   (Node.js Express / Python FastAPI) │
│                                      │
│  Routes:                             │
│  - GET /api/templates                │
│  - POST /api/generate                │
│  - GET /api/images/:id               │
└─────────┬───────────────┬────────────┘
          │               │
          ▼               ▼
┌──────────────┐  ┌─────────────────┐
│   OpenAI     │  │   Imgflip API   │
│   API        │  │                 │
│  (Captions)  │  │ - Get templates │
│              │  │ - Generate img  │
└──────────────┘  └─────────────────┘
```

### Data Flow

**Step 1: Load Templates**
```
Frontend → Backend: GET /api/templates
Backend → Imgflip: GET /get_memes
Backend ← Imgflip: Returns list of templates
Frontend ← Backend: JSON array of templates
```

**Step 2: Generate Memes**
```
Frontend → Backend: POST /api/generate
                     {templateId: "123", topic: "remote work"}

Backend → OpenAI: Generate 4 caption variations
Backend ← OpenAI: Returns 4 captions

Backend → Imgflip: Generate image 1 with caption 1
Backend ← Imgflip: Returns image URL
(Repeat 4 times)

Frontend ← Backend: Returns 4 meme URLs
```

---

## Data Models

### Template
```typescript
interface Template {
  id: string;           // Imgflip template ID
  name: string;         // "Drake Hotline Bling"
  url: string;          // Template image URL
  width: number;
  height: number;
  box_count: number;    // Number of text boxes (usually 2)
}
```

### Generation Request
```typescript
interface GenerationRequest {
  templateId: string;   // Selected template
  topic: string;        // User input (e.g., "remote work")
}
```

### Generation Response
```typescript
interface GenerationResponse {
  memes: Array<{
    id: string;         // Unique meme ID
    imageUrl: string;   // Generated image URL
    caption: {
      top: string;      // Top text
      bottom: string;   // Bottom text (if applicable)
    };
  }>;
}
```

---

## Implementation Steps

### Phase 1: Basic Setup (Week 1)
1. Initialize Next.js project
2. Set up Express/FastAPI backend
3. Configure environment variables (API keys)
4. Test Imgflip API connection
5. Test OpenAI API connection

### Phase 2: Template Display (Week 1)
1. Create homepage with template carousel
2. Fetch templates from Imgflip on load
3. Implement search functionality
4. Add template selection logic

### Phase 3: Meme Generation (Week 2)
1. Build generation page UI
2. Implement OpenAI caption generation
   - Create prompt template
   - Parse response into 4 captions
3. Implement Imgflip image generation
   - Call API 4 times with different captions
4. Handle loading states and errors

### Phase 4: Results & Download (Week 2)
1. Display generated memes in grid
2. Implement individual download (save image)
3. Implement bulk download (ZIP file)
4. Add regenerate functionality
5. Add "back to templates" navigation

### Phase 5: Polish (Week 3)
1. Add responsive design (mobile)
2. Optimize image loading
3. Add error handling
4. Implement rate limiting
5. Add basic analytics

---

## Technical Specifications

### Image Specifications
- **Format:** PNG or JPEG
- **Resolution:** Original template resolution (typically 500-800px width)
- **File Size:** <2MB per image
- **Download:** Direct browser download via `<a>` tag with `download` attribute

### OpenAI Prompt Template
```python
def generate_captions(template_name, topic, box_count):
    prompt = f"""Generate {box_count * 4} short, funny captions for the "{template_name}" meme template about: {topic}

The template has {box_count} text boxes. Generate 4 variations.

For each variation, provide:
- Top text (max 50 characters)
- Bottom text (max 50 characters) [if box_count > 1]

Format as JSON:
[
  {{"top": "text", "bottom": "text"}},
  ...
]

Make captions witty, relatable, and appropriate for social media."""

    return prompt
```

### API Error Handling

**OpenAI Failures:**
- Timeout (>30s): Show error, allow retry
- Rate limit: Queue request, show wait time
- Invalid response: Use fallback generic captions

**Imgflip Failures:**
- Rate limit reached: Show upgrade prompt (paid plan)
- Invalid template: Redirect to homepage
- Image generation failed: Retry up to 3 times

---

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Imgflip
IMGFLIP_USERNAME=your_username
IMGFLIP_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=production

# Optional: Rate Limiting
RATE_LIMIT_MAX=10  # requests per minute per IP
```

---

## Non-Functional Requirements

### Performance
- Template carousel loads in <2 seconds
- Meme generation completes in <15 seconds
- Image downloads are instant (no processing delay)

### Scalability
- Support 50 concurrent users (MVP)
- Handle 500 generations/day

### Security
- API keys stored in environment variables
- Rate limiting: 10 generations per IP per hour (free tier)
- Input validation: Sanitize topic input (max 200 chars, no HTML)

### Accessibility
- Keyboard navigation for carousel
- Alt text for all images
- ARIA labels for buttons

---

## Future Enhancements (Post-MVP)

### Phase 2
- User accounts (save history)
- Custom text editing (manual caption override)
- More caption variations (1-10 options)
- Social media direct posting

### Phase 3
- Custom template upload
- Meme library (save favorites)
- Trending topics suggestions
- Multi-language support

---

## Success Metrics

### Launch Criteria (MVP)
- [ ] User can browse 20+ meme templates
- [ ] User can search templates by name
- [ ] User can generate 4 memes in <15 seconds
- [ ] User can download individual or all memes
- [ ] Mobile responsive design works
- [ ] No crashes under normal usage

### KPIs
- Generations per day
- Template selection distribution
- Average time to generation
- Download rate (% of generated memes downloaded)
- Return user rate

---

## Open Questions

1. **Pricing:** Launch as free tool or freemium?
   - **Recommendation:** Free with rate limits (10/day), paid for unlimited

2. **Storage:** Store generated memes or generate on-demand?
   - **Recommendation:** Store for 24 hours for downloads, then delete

3. **Templates:** Use all Imgflip templates or curate top 50?
   - **Recommendation:** Curate top 50 most popular, add more based on usage

---

## API Documentation

**Imgflip API:** https://imgflip.com/api
**OpenAI API:** https://platform.openai.com/docs/api-reference/chat

---

## Next Steps

1. ✅ Approve simplified PRD
2. Set up development environment
3. Create wireframes/mockups (optional)
4. Begin Phase 1 implementation
5. Test with sample templates

---

**Questions?** Ready to start building!
