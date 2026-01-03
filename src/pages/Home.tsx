import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Article } from '../data/mockData';
import { fetchBreakingNews, TickerItem } from '../services/newsApi';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { fetchRealNews, fetchBatchRealNews } from '../services/newsFeedService';
import { saveArticleToDb, generateArticleId } from '../services/articleService';
import { translateToArabic } from '../services/translationService';
import { ArrowRight, Share2, Clock, Bookmark } from 'lucide-react';
import { useSavedArticles } from '../hooks/useSavedArticles';

const Home: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState<Article[]>([]);
    const [breakingNews, setBreakingNews] = useState<TickerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [translatedArticles, setTranslatedArticles] = useState<Article[]>([]);
    const { isSaved, toggleSave } = useSavedArticles();
    const [currentBreakingIndex, setCurrentBreakingIndex] = useState(0);

    const isRtl = i18n.dir() === 'rtl';

    // Cycle breaking news
    useEffect(() => {
        if (breakingNews.length > 0) {
            const interval = setInterval(() => {
                setCurrentBreakingIndex(prev => (prev + 1) % breakingNews.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [breakingNews]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [realArticles, tickerData] = await Promise.all([
                fetchBatchRealNews(30),
                fetchBreakingNews()
            ]);
            setArticles(realArticles);

            // Auto-save all articles to DB for direct link support
            realArticles.forEach(article => saveArticleToDb(article));

            // Set breaking news headlines
            setBreakingNews(tickerData);
            setLoading(false);
        };
        loadData();
    }, [t]);

    // Real-time updates
    useEffect(() => {
        const interval = setInterval(async () => {
            const newArticle = await fetchRealNews();
            if (newArticle) {
                setArticles(prev => {
                    const exists = prev.some(a => a.title === newArticle.title);
                    return exists ? prev : [newArticle, ...prev];
                });
            }
        }, 30000); // 30 seconds - balanced for performance
        return () => clearInterval(interval);
    }, []);

    // Load More Articles
    const loadMore = async () => {
        setLoadingMore(true);
        const moreArticles = await fetchBatchRealNews(15);
        // Filter out duplicates
        setArticles(prev => {
            const existingTitles = prev.map(a => a.title);
            const newUnique = moreArticles.filter(a => !existingTitles.includes(a.title));
            newUnique.forEach(article => saveArticleToDb(article));
            return [...prev, ...newUnique];
        });
        setLoadingMore(false);
    };

    // Translate articles when language is Arabic
    useEffect(() => {
        const translateArticles = async () => {
            if (i18n.language === 'ar' && articles.length > 0) {
                const translated = await Promise.all(
                    articles.map(async (article) => {
                        const [translatedTitle, translatedExcerpt] = await Promise.all([
                            translateToArabic(article.title),
                            translateToArabic(article.excerpt)
                        ]);
                        return {
                            ...article,
                            title: translatedTitle,
                            excerpt: translatedExcerpt
                        };
                    })
                );
                setTranslatedArticles(translated);
            } else {
                setTranslatedArticles([]);
            }
        };
        translateArticles();
    }, [i18n.language, articles]);

    // Use translated articles if available, otherwise use original
    const displayArticles = i18n.language === 'ar' && translatedArticles.length > 0
        ? translatedArticles
        : articles;

    const filteredArticles = activeCategory === 'All'
        ? displayArticles
        : displayArticles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <Layout>
            <SEO title="News" />

            <div className="min-h-screen pb-20 overflow-hidden relative">
                {/* Aurora Background Effects */}
                <div className="fixed top-0 left-0 w-full h-[800px] bg-aurora opacity-10 dark:opacity-20 blur-[120px] -z-10 animate-pulse-slow pointer-events-none" />

                {/* Hero Section with 3D Float Effect */}
                <section className="relative pt-32 pb-12 px-4">
                    <div className="container max-w-7xl mx-auto text-center perspective-1000">
                        <div className="animate-float">
                            <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 dark:bg-black/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wider mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {t('home.hero_subtitle', 'LIVE GLOBAL COVERAGE')}
                            </span>

                            <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 text-glow">
                                    {isRtl ? 'النبض العالمي' : 'Global Pulse'}
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                                {t('home.hero_description', 'Your trusted source for breaking news. Real-time updates from around the world, verified and delivered instantly.')}
                            </p>
                        </div>

                        {/* Breaking News Ticker */}
                        <div className="glass-panel mx-auto max-w-4xl p-3 md:p-2 flex flex-col md:flex-row items-center gap-3 md:gap-4 transform hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 shrink-0 z-10 animate-pulse">
                                🔴 {t('common.breaking')}
                            </div>

                            <div className="flex-1 text-center md:text-left overflow-hidden min-h-[40px] md:min-h-[24px] flex items-center justify-center md:justify-start">
                                <a
                                    key={currentBreakingIndex}
                                    href={breakingNews[currentBreakingIndex]?.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2 md:line-clamp-1 hover:text-indigo-500 hover:underline transition-all animate-fade-in"
                                >
                                    {breakingNews[currentBreakingIndex]?.title || t('common.loading_news', 'Loading breaking news...')}
                                </a>
                            </div>

                            {/* Ticker Indicators */}
                            <div className="hidden md:flex gap-1">
                                {breakingNews.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`block w-1.5 h-1.5 rounded-full transition-colors ${idx === currentBreakingIndex ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main className="container max-w-7xl mx-auto px-4 mt-8">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Clock size={16} />
                            <span className="text-sm font-bold uppercase tracking-widest">
                                {new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Glass Filters - Scrollable on mobile */}
                        <div className="flex gap-1 p-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full overflow-x-auto max-w-full scrollbar-hide">
                            {['All', 'Politics', 'Economy', 'Technology', 'Sports', 'Health'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-300 transform relative overflow-hidden ${activeCategory === cat
                                        ? 'text-white shadow-lg scale-105'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
                                        }`}
                                >
                                    {activeCategory === cat && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 -z-10 animate-fade-in" />
                                    )}
                                    {cat === 'All' ? t('common.all', 'All') : t(`nav.${cat.toLowerCase()}`, { defaultValue: cat })}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3D Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="glass-panel h-96 animate-pulse bg-slate-200/20" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                            {filteredArticles.map((item, index) => (
                                <Link
                                    key={item.id}
                                    to={`/article/${item.id}`}
                                    state={{ article: item }}
                                    className="group relative block h-full"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <article className="glass-panel h-full flex flex-col overflow-hidden transform transition-all duration-500 hover:-translate-y-3 hover:rotate-x-2 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                    {t(`nav.${item.category.toLowerCase()}`, { defaultValue: item.category })}
                                                </span>
                                                {item.isBreaking && (
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1 relative -mt-12 mx-4 mb-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/5 shadow-lg">
                                            <div className="flex items-center gap-2 text-[10px] text-indigo-500 dark:text-indigo-400 font-bold mb-3 uppercase tracking-widest">
                                                <span>{item.source}</span>
                                                <span className="w-1 h-1 rounded-full bg-indigo-500/50" />
                                                <span>{item.date}</span>
                                            </div>

                                            <h3 className="text-xl font-display font-bold mb-3 leading-tight text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300">
                                                {item.title}
                                            </h3>

                                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                                                {item.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                                <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-2 transition-transform duration-300">
                                                    {t('home.read_more')}
                                                    <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();

                                                            // Generate unique hash ID and save article
                                                            const shareId = generateArticleId(item.title);
                                                            const shareableArticle = { ...item, id: shareId };
                                                            saveArticleToDb(shareableArticle);

                                                            // Encode article data as backup (for when Firestore is offline)
                                                            const articleData = {
                                                                t: item.title,
                                                                e: item.excerpt,
                                                                i: item.imageUrl,
                                                                a: item.author,
                                                                c: item.category,
                                                                s: item.source,
                                                                d: item.date,
                                                                u: item.sourceUrl
                                                            };
                                                            const encodedData = encodeURIComponent(JSON.stringify(articleData));
                                                            const shareUrl = `${window.location.origin}/article/${shareId}?data=${encodedData}`;

                                                            // Try native share first (mobile)
                                                            if ((navigator as any).share) {
                                                                try {
                                                                    await (navigator as any).share({
                                                                        title: item.title,
                                                                        text: item.excerpt?.substring(0, 100) + '...',
                                                                        url: shareUrl
                                                                    });
                                                                    return;
                                                                } catch (err) {
                                                                    // User cancelled or error
                                                                }
                                                            }

                                                            // Fallback: copy to clipboard
                                                            try {
                                                                await navigator.clipboard.writeText(shareUrl);
                                                                alert(isRtl ? 'تم نسخ الرابط!' : 'Link copied!');
                                                            } catch (err) {
                                                                // Fallback for older browsers
                                                                const textArea = document.createElement('textarea');
                                                                textArea.value = shareUrl;
                                                                document.body.appendChild(textArea);
                                                                textArea.select();
                                                                document.execCommand('copy');
                                                                document.body.removeChild(textArea);
                                                                alert(isRtl ? 'تم نسخ الرابط!' : 'Link copied!');
                                                            }
                                                        }}
                                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                        aria-label="Share"
                                                    >
                                                        <Share2 size={16} className="text-slate-400 hover:text-indigo-500 transition-colors" />
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleSave(item);
                                                        }}
                                                        className={`p-2 rounded-full transition-all duration-300 ${isSaved(item.id)
                                                            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500'
                                                            }`}
                                                        aria-label="Save Article"
                                                    >
                                                        <Bookmark size={16} fill={isSaved(item.id) ? "currentColor" : "none"} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {!loading && filteredArticles.length > 0 && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-full shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {loadingMore ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {isRtl ? 'جارٍ التحميل...' : 'Loading...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isRtl ? 'تحميل المزيد' : 'Load More'}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Opinion Section - Coming Soon */}
                </main>
            </div>
        </Layout>
    );
};

export default Home;
