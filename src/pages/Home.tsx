import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Article } from '../data/mockData';
import { fetchBreakingNews } from '../services/newsApi';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { fetchRealNews, fetchBatchRealNews } from '../services/newsFeedService';
import { saveArticleToDb } from '../services/articleService';
import { ArrowRight, Share2, Clock, Globe } from 'lucide-react';

const Home: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState<Article[]>([]);
    const [breakingNews, setBreakingNews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [realArticles, tickerData] = await Promise.all([
                fetchBatchRealNews(12),
                fetchBreakingNews()
            ]);
            setArticles(realArticles);

            // Auto-save all articles to DB for direct link support
            realArticles.forEach(article => saveArticleToDb(article));

            // Inject Market Data
            const marketPrefix = t('home.markets_ticker', { defaultValue: 'MARKETS:' });
            const marketData = `${marketPrefix} BTC $93,000 ▲ | ETH $3,400 ▲ | OIL $78.20 ▼ | GOLD $2,050 ▲ | S&P 500 5,100 ▲`;
            setBreakingNews([marketData, ...tickerData]);
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

    const filteredArticles = activeCategory === 'All'
        ? articles
        : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <Layout>
            <SEO title={t('nav.home')} />

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
                                    Global Pulse
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                                {t('home.hero_description', 'Experience the world in real-time. Unfiltered, verified, and immersive 3D news coverage from every corner of the globe.')}
                            </p>
                        </div>

                        {/* Floating Glass Ticker */}
                        <div className="glass-panel mx-auto max-w-4xl p-2 flex items-center gap-4 transform hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 shrink-0 z-10">
                                {t('common.breaking')}
                            </div>

                            <div className="flex-1 overflow-hidden relative h-6 mask-gradient">
                                <div className="absolute w-full animate-marquee whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-8">
                                    {breakingNews.map((item, i) => (
                                        <span key={i} className="flex items-center gap-2">
                                            <Globe size={12} className="text-indigo-500" />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main className="container max-w-7xl mx-auto px-4 mt-16">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Clock size={16} />
                            <span className="text-sm font-bold uppercase tracking-widest">
                                {new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Glass Filters */}
                        <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full overflow-x-auto max-w-full">
                            {['All', 'Politics', 'Economy', 'Technology', 'Sports', 'Health'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 transform relative overflow-hidden ${activeCategory === cat
                                        ? 'text-white shadow-lg scale-105'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
                                        }`}
                                >
                                    {activeCategory === cat && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 -z-10 animate-fade-in" />
                                    )}
                                    {cat === 'All' ? t('nav.home') : t(`nav.${cat.toLowerCase()}`, { defaultValue: cat })}
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
                                                <button
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const articleData = encodeURIComponent(JSON.stringify({
                                                            t: item.title,
                                                            e: item.excerpt,
                                                            i: item.imageUrl,
                                                            a: item.author,
                                                            c: item.category,
                                                            s: item.source,
                                                            d: item.date,
                                                            u: item.sourceUrl
                                                        }));
                                                        const shareUrl = window.location.origin + `/article/${item.id}?data=${articleData}`;
                                                        if (navigator.share) {
                                                            try {
                                                                await navigator.share({
                                                                    title: item.title,
                                                                    text: item.excerpt,
                                                                    url: shareUrl
                                                                });
                                                            } catch (err) {
                                                                console.log('Share cancelled');
                                                            }
                                                        } else {
                                                            navigator.clipboard.writeText(shareUrl);
                                                            alert(t('common.link_copied', 'Link copied!'));
                                                        }
                                                    }}
                                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                    aria-label="Share"
                                                >
                                                    <Share2 size={16} className="text-slate-400 hover:text-indigo-500 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Opinion Section - Coming Soon */}
                </main>
            </div>
        </Layout>
    );
};

export default Home;
