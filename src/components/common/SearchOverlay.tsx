import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Article } from '../../data/mockData';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const CACHE_KEY = 'gp_news_cache_v2';

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    const suggestedTopics = [
        { key: 'nav.politics', fallback: 'Politics' },
        { key: 'nav.economy', fallback: 'Economy' },
        { key: 'nav.technology', fallback: 'Technology' },
        { key: 'nav.sports', fallback: 'Sports' },
        { key: 'nav.health', fallback: 'Health' },
    ];

    // Load real articles from cache on open
    useEffect(() => {
        if (isOpen) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const data = JSON.parse(cached);
                    if (data.articles && data.articles.length > 0) {
                        setAllArticles(data.articles);
                    }
                }
            } catch {
                // fallback to empty
            }
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Filter logic — searches real cached articles
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = allArticles.filter(article =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.category.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery) ||
            (article.source && article.source.toLowerCase().includes(lowerQuery))
        );
        setResults(filtered.slice(0, 10)); // Limit to 10 results
    }, [query, allArticles]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl animate-fade-in flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="container px-4 py-4 flex items-center justify-between border-b border-border/50">
                <h2 className="text-lg font-bold text-muted">{t('common.search_title', 'Search')}</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    aria-label="Close search"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Search Input */}
            <div className="container px-4 py-8">
                <div className="relative max-w-3xl mx-auto">
                    <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted-foreground`} size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('common.search_placeholder', 'Search for news, topics, or categories...')}
                        className={`w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-6 text-xl md:text-2xl font-medium focus:ring-2 focus:ring-primary outline-none shadow-inner ${isRtl ? 'pr-14 pl-4' : 'pl-14 pr-4'}`}
                    />
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto container px-4 pb-12">
                <div className="max-w-3xl mx-auto space-y-4">
                    {query && results.length === 0 && (
                        <div className="text-center text-muted py-12">
                            {t('common.no_results', 'No results found for "{{query}}"', { query })}
                        </div>
                    )}

                    {results.map(article => (
                        <div
                            key={article.id}
                            onClick={() => {
                                navigate(`/article/${article.id}`, { state: { article } });
                                onClose();
                            }}
                            className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-border"
                        >
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-primary uppercase">
                                    {t(`nav.${article.category.toLowerCase()}`, { defaultValue: article.category })}
                                </span>
                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                {article.source && (
                                    <p className="text-xs text-slate-500 mt-1">{article.source}</p>
                                )}
                            </div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <ArrowRight size={20} className={`text-primary ${isRtl ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    ))}

                    {!query && (
                        <div className="text-center py-12 text-muted">
                            <Search size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">{t('common.type_to_search', 'Type to start searching...')}</p>
                            <p className="text-xs mt-2 opacity-60">
                                {allArticles.length > 0
                                    ? t('common.searching_articles', 'Searching through {{count}} real articles', { count: allArticles.length })
                                    : t('common.load_home_first', 'Load the home page first to enable search')}
                            </p>
                            <p className="text-xs mt-6 font-bold uppercase tracking-widest opacity-60">{t('common.suggested_topics', 'Suggested Topics')}</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {suggestedTopics.map(topic => (
                                    <button
                                        key={topic.key}
                                        onClick={() => setQuery(t(topic.key, topic.fallback))}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                                    >
                                        #{t(topic.key, topic.fallback)}
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
