# MemeLog AI

AI-powered meme generator - Pick a template, enter a topic, get 4 AI-generated meme variations.

## Features

- 🎨 Browse 50+ popular meme templates
- 🔍 Real-time search to find templates by name
- 📱 Responsive design with dark mode support
- ⚡ Fast, smooth carousel navigation
- 🤖 AI-powered caption generation (coming next)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Integration:** Imgflip API for meme templates
- **Image Handling:** Next.js Image component

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd memolog_ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API credentials:
```env
IMGFLIP_USERNAME=your_imgflip_username
IMGFLIP_PASSWORD=your_imgflip_password
OPENAI_API_KEY=sk-your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
memolog_ai/
├── app/
│   ├── api/
│   │   └── templates/
│   │       └── route.ts          # API route to fetch meme templates
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Homepage
├── components/
│   ├── SearchBar.tsx             # Search component with filtering
│   ├── TemplateCard.tsx          # Individual template card
│   └── TemplateCarousel.tsx      # Horizontal scrollable carousel
├── types/
│   └── meme.ts                   # TypeScript interfaces
├── .env.example                  # Environment variables template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Current Implementation Status

### ✅ Completed
- [x] Next.js project setup with TypeScript and Tailwind CSS
- [x] API route to fetch meme templates from Imgflip
- [x] Homepage with header and instructions
- [x] Template carousel with smooth scrolling
- [x] Search bar with real-time filtering
- [x] Responsive design with dark mode

### 🚧 Next Steps
- [ ] Generation page (topic input)
- [ ] OpenAI integration for caption generation
- [ ] Results page with 4 meme variations
- [ ] Download functionality
- [ ] Regenerate option

## API Endpoints

### GET /api/templates
Fetches the top 50 meme templates from Imgflip API.

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "181913649",
      "name": "Drake Hotline Bling",
      "url": "https://i.imgflip.com/...",
      "width": 1200,
      "height": 1200,
      "box_count": 2
    }
  ],
  "count": 50
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dan4eck/memolog_ai)

### Manual Deployment Steps

1. **Push your code to GitHub** (already done)

2. **Sign up for Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (free)

3. **Import your project**
   - Click "Add New Project"
   - Import your `memolog_ai` repository from GitHub
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**
   - In Vercel project settings, add these environment variables:
     - `IMGFLIP_USERNAME` - Your Imgflip username
     - `IMGFLIP_PASSWORD` - Your Imgflip password
     - `OPENAI_API_KEY` - Your OpenAI API key (for future use)

5. **Deploy**
   - Click "Deploy"
   - Your site will be live in ~2 minutes at: `https://your-project.vercel.app`

6. **Automatic Deployments**
   - Every push to your main branch auto-deploys
   - Pull requests get preview URLs
   - Perfect for cloud-based development!

### Cloud Development with GitHub Codespaces

To develop directly in the cloud:

1. Go to your GitHub repository
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for environment to load
6. Run `npm install` and `npm run dev`
7. Access preview URL automatically provided by Codespaces

**Benefits:**
- No local setup needed
- Develop from any device (even tablets!)
- Instant preview of changes
- Integrated with GitHub for easy commits

## Getting API Keys

### Imgflip API
1. Visit [Imgflip](https://imgflip.com/)
2. Create a free account
3. Use your username and password as API credentials
4. Free tier: 100 requests/day

### OpenAI API (for future caption generation)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account
3. Generate an API key
4. Recommended model: GPT-4o-mini (~$0.0002 per generation)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues or questions, please open an issue on the GitHub repository.
