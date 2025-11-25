# memolog_ai

AI-powered meme generator - Pick a template, enter a topic, get 4 AI-generated meme variations.

## Description

**memolog_ai** is a web application that helps users quickly generate memes using artificial intelligence. Users browse popular meme templates, select one, input a topic, and receive 4 AI-generated caption variations ready to download or share.

## Features

- **Browse 50+ Popular Meme Templates** - Curated collection of the most recognizable internet meme formats
- **Real-time Search** - Find specific meme templates by name instantly
- **Smooth Carousel Navigation** - Horizontal scrolling gallery with intuitive controls
- **AI Caption Generation** - Generates witty, contextual captions based on user's topic (in development)
- **Multiple Variations** - Creates 4 different caption versions for each meme
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support** - Automatic theme switching based on system preferences
- **Fast Performance** - Optimized image loading and smooth animations

## Capabilities

### Current (v1.0)
- ✅ Template browsing with 50+ popular meme formats
- ✅ Search functionality with live filtering
- ✅ Interactive carousel with keyboard and mouse navigation
- ✅ Template preview with metadata (text boxes, dimensions)
- ✅ Click-to-select navigation flow

### In Development
- 🚧 AI-powered caption generation using OpenAI GPT-4o-mini
- 🚧 Meme generation with custom text overlays
- 🚧 Download individual or bulk memes
- 🚧 Regenerate caption variations
- 🚧 Social media optimization (platform-specific dimensions)

### Planned Features
- 📋 User accounts and meme history
- 📋 Custom template uploads
- 📋 Trending topics suggestions
- 📋 Multi-language support
- 📋 Direct social media posting

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **APIs:**
  - Imgflip API (meme templates & image generation)
  - OpenAI GPT-4o-mini (caption generation)
- **Hosting:** Vercel
- **Image Optimization:** Next.js Image component with CDN

## Architecture

```
Frontend (Next.js)
├── Template Browser (carousel + search)
├── Generation Interface (topic input)
└── Results Display (4 meme variations)

Backend (Next.js API Routes)
├── /api/templates - Fetch meme templates from Imgflip
├── /api/generate - Generate captions via OpenAI + create memes via Imgflip
└── /api/images - Serve generated meme images

External APIs
├── Imgflip API - Template library & image generation
└── OpenAI API - AI caption generation
```

## User Flow

1. **Homepage** → User browses carousel or searches for meme template
2. **Selection** → User clicks template to proceed
3. **Input** → User enters topic/theme for the meme
4. **Generation** → AI generates 4 caption variations
5. **Results** → User views 4 generated memes
6. **Actions** → Download, regenerate, or choose different template

## API Integration

### Imgflip API
- **Purpose:** Fetch meme templates and generate images with text overlays
- **Endpoints Used:**
  - `GET /get_memes` - Retrieve popular templates
  - `POST /caption_image` - Generate meme with custom text
- **Cost:** Free tier (100 requests/day) or $9/month (unlimited)

### OpenAI API
- **Purpose:** Generate contextual, witty meme captions
- **Model:** GPT-4o-mini (cost-effective)
- **Cost:** ~$0.0002 per generation (4 captions)
- **Prompt Strategy:** Template-aware caption generation with tone control

## Project Structure

```
memolog_ai/
├── app/
│   ├── api/
│   │   └── templates/
│   │       └── route.ts          # API route to fetch meme templates
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Homepage with carousel and search
├── components/
│   ├── SearchBar.tsx             # Search with real-time filtering
│   ├── TemplateCard.tsx          # Individual template display
│   └── TemplateCarousel.tsx      # Horizontal scrollable gallery
├── types/
│   └── meme.ts                   # TypeScript interfaces
├── .env.example                  # Environment variables template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Performance

- **Initial Load:** <2 seconds
- **Template Carousel:** 50 templates load instantly
- **Search Filtering:** Real-time (no debounce needed)
- **Image Optimization:** WebP format with lazy loading
- **Bundle Size:** Optimized with Next.js tree shaking

## License

ISC
