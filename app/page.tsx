'use client';

import { useEffect, useState } from 'react';
import { MemeTemplate } from '@/types/meme';
import SearchBar from '@/components/SearchBar';
import TemplateCarousel from '@/components/TemplateCarousel';

export default function HomePage() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MemeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/templates');
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch templates');
      }

      setTemplates(data.templates);
      setFilteredTemplates(data.templates);
      setError(null);
    } catch (err) {
      setError('Failed to load meme templates. Please try again.');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredTemplates(templates);
      return;
    }

    const filtered = templates.filter((template) =>
      template.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTemplates(filtered);
  };

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
        {/* Search Section */}
        <section className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            <button
              onClick={fetchTemplates}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Templates Section */}
        {!loading && !error && (
          <>
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {searchQuery ? 'Search Results' : 'Popular Meme Templates'}
                </h2>
                <span className="text-gray-500 dark:text-gray-400">
                  {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
                </span>
              </div>

              {filteredTemplates.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    No templates found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => handleSearch('')}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <TemplateCarousel templates={filteredTemplates} />
              )}
            </section>

            {/* Instructions */}
            {!searchQuery && (
              <section className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                  How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      Choose Template
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Browse or search for the perfect meme template
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">2</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      Enter Topic
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tell us what your meme is about
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      Get 4 Memes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI generates 4 variations - download or regenerate
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
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
