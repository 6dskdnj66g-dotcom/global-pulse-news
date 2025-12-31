import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockArticles } from '../../data/mockData';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(mockArticles);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Filter logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = mockArticles.filter(article =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.category.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl animate-fade-in flex flex-col">
            {/* Header */}
            <div className="container px-4 py-4 flex items-center justify-between border-b border-border/50">
                <h2 className="text-lg font-bold text-muted">Search</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Search Input */}
            <div className="container px-4 py-8">
                <div className="relative max-w-3xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('common.search_placeholder', 'Search for news, topics, or categories...')}
                        className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-6 pl-14 pr-4 text-xl md:text-2xl font-medium focus:ring-2 focus:ring-primary outline-none shadow-inner"
                    />
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto container px-4 pb-12">
                <div className="max-w-3xl mx-auto space-y-4">
                    {query && results.length === 0 && (
                        <div className="text-center text-muted py-12">
                            No results found for "{query}"
                        </div>
                    )}

                    {results.map(article => (
                        <div
                            key={article.id}
                            onClick={() => {
                                navigate(`/article/${article.id}`);
                                onClose();
                            }}
                            className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-border"
                        >
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-24 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <span className="text-xs font-bold text-primary uppercase">{article.category}</span>
                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                            </div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                <ArrowRight size={20} className="text-primary rtl:rotate-180" />
                            </div>
                        </div>
                    ))}

                    {!query && (
                        <div className="text-center py-12 text-muted">
                            <p>Type to start searching...</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {['Politics', 'Economy', 'Technology', 'Sports'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setQuery(tag)}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
