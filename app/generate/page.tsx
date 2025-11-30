'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MemeTemplate, GeneratedMeme } from '@/types/meme';

function GeneratePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  const [template, setTemplate] = useState<MemeTemplate | null>(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedMemes, setGeneratedMemes] = useState<GeneratedMeme[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);

  useEffect(() => {
    if (!templateId) {
      router.push('/');
      return;
    }
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoadingTemplate(true);
      const response = await fetch('/api/templates');
      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch templates');
      }

      const selectedTemplate = data.templates.find(
        (t: MemeTemplate) => t.id === templateId
      );

      if (!selectedTemplate) {
        router.push('/');
        return;
      }

      setTemplate(selectedTemplate);
    } catch (err) {
      console.error('Error fetching template:', err);
      router.push('/');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !template) {
      setError('Please enter a topic');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          topic: topic.trim(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate memes');
      }

      setGeneratedMemes(data.memes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate memes');
      console.error('Error generating memes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (meme: GeneratedMeme) => {
    try {
      const response = await fetch(meme.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meme-${meme.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading meme:', err);
      setError('Failed to download meme');
    }
  };

  const handleDownloadAll = async () => {
    // For now, download them one by one
    // In a production app, you'd create a ZIP file
    for (const meme of generatedMemes) {
      await handleDownload(meme);
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const handleRegenerate = () => {
    setGeneratedMemes([]);
    handleGenerate();
  };

  const handleBackToTemplates = () => {
    router.push('/');
  };

  if (loadingTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  const hasResults = generatedMemes.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Generate Memes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Using template: {template.name}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!hasResults ? (
          /* Generation Form */
          <div className="max-w-4xl mx-auto">
            {/* Template Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Template Preview
              </h2>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    src={template.url}
                    alt={template.name}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 448px"
                  />
                </div>
              </div>
              <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
                {template.box_count} text {template.box_count === 1 ? 'box' : 'boxes'}
              </div>
            </div>

            {/* Topic Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                What's your meme about?
              </h2>

              <textarea
                value={topic}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setTopic(e.target.value);
                    setError(null);
                  }
                }}
                placeholder="e.g., remote work, coffee addiction, Monday mornings..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
                maxLength={200}
              />

              <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Enter a topic for your meme</span>
                <span>{topic.length}/200</span>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleBackToTemplates}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  ← Choose Different Template
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating 4 memes...
                    </span>
                  ) : (
                    'Generate Memes ✨'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results Display */
          <div>
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-2">
                ✨ Your Memes Are Ready!
              </h2>
              <p className="text-green-700 dark:text-green-300">
                Generated 4 variations for: "{topic}"
              </p>
            </div>

            {/* Memes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {generatedMemes.map((meme, index) => (
                <div
                  key={meme.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={meme.imageUrl}
                      alt={`Generated meme ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      {meme.caption.tone && (
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase">
                          {meme.caption.tone}
                        </p>
                      )}
                      {meme.caption.texts.map((text, textIndex) => (
                        <p
                          key={textIndex}
                          className="text-sm text-gray-600 dark:text-gray-400 mb-1"
                        >
                          <strong>Text {textIndex + 1}:</strong> {text}
                        </p>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDownload(meme)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBackToTemplates}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Choose Different Template
              </button>

              <button
                onClick={handleDownloadAll}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
              >
                📥 Download All (4 memes)
              </button>

              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? 'Regenerating...' : '🔄 Regenerate'}
              </button>
            </div>
          </div>
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

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
