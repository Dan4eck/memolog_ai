'use client';

import { useState } from 'react';
import { MemeTemplate } from '@/types/meme';
import SearchBar from './SearchBar';
import TemplateCarousel from './TemplateCarousel';

interface MemeGalleryProps {
    initialTemplates: MemeTemplate[];
}

export default function MemeGallery({ initialTemplates }: MemeGalleryProps) {
    const [filteredTemplates, setFilteredTemplates] = useState<MemeTemplate[]>(initialTemplates);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredTemplates(initialTemplates);
            return;
        }

        const filtered = initialTemplates.filter((template) =>
            template.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTemplates(filtered);
    };

    return (
        <>
            {/* Search Section */}
            <section className="mb-12">
                <SearchBar onSearch={handleSearch} />
            </section>

            {/* Templates Section */}
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

            {/* Instructions - Only show when not searching */}
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
    );
}
