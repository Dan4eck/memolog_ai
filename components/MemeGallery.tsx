'use client';

import { useState } from 'react';
import { MemeTemplate } from '@/types/meme';
import SearchBar from './SearchBar';
import TemplateGrid from './TemplateGrid';

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
                    <TemplateGrid templates={filteredTemplates} />
                )}
            </section>
        </>
    );
}
