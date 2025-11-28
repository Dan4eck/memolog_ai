import { getMemeTemplates } from '@/lib/memes';
import MemeGallery from '@/components/MemeGallery';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const templates = await getMemeTemplates();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
            memolog_ai
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            Generate memes with AI - Pick a template, enter a topic, get 4 variations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <MemeGallery initialTemplates={templates} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>memolog_ai - AI-Powered Meme Generator</p>
        </div>
      </footer>
    </div>
  );
}
