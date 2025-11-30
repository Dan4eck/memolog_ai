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
    const [currentPage, setCurrentPage] = useState(1);
    const templatesPerPage = 25;

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on new search

        if (!query.trim()) {
            setFilteredTemplates(initialTemplates);
            return;
        }

        const filtered = initialTemplates.filter((template) =>
            template.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTemplates(filtered);
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
    const startIndex = (currentPage - 1) * templatesPerPage;
    const endIndex = startIndex + templatesPerPage;
    const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

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
                    <>
                        <TemplateGrid templates={currentTemplates} />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-3">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white shadow-lg scale-110'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}
