import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Ticker from '../components/news/Ticker';
import HeroSection from '../components/news/HeroSection';
import NewsCard from '../components/news/NewsCard';
import { Article } from '../data/mockData';
import { fetchBreakingNews } from '../services/newsApi';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { fetchRealNews, fetchBatchRealNews } from '../services/newsFeedService';
import { SkeletonGrid, SkeletonHero } from '../components/common/SkeletonCard';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const [articles, setArticles] = useState<Article[]>([]);
    const [breakingNews, setBreakingNews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // 1. Fetch Batch Real News (10+ items) -> NO OLD MOCKS
            // 2. Fetch Breaking News Ticker
            const [realArticles, tickerData] = await Promise.all([
                fetchBatchRealNews(12),
                fetchBreakingNews()
            ]);

            setArticles(realArticles);

            // Inject Market Data into Ticker
            const marketPrefix = t('home.markets_ticker');
            const marketData = `${marketPrefix} BTC $93,000 ▲ | ETH $3,400 ▲ | OIL $78.20 ▼ | GOLD $2,050 ▲ | S&P 500 5,100 ▲`;
            setBreakingNews([marketData, ...tickerData]);

            setLoading(false);
        };

        loadData();
    }, [t]);

    // === PHASE 10: REAL-TIME UPDATES ===
    useEffect(() => {
        // Fetch new real news every 20 seconds
        const interval = setInterval(async () => {
            const newArticle = await fetchRealNews();
            if (newArticle) {
                setArticles(prev => {
                    // Avoid duplicates by title
                    const exists = prev.some(a => a.title === newArticle.title);
                    if (!exists) {
                        return [newArticle, ...prev];
                    }
                    return prev;
                });
            }
        }, 10000); // Every 10 seconds for faster updates

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Layout>
                <SEO title={t('common.loading')} />
                <div className="container py-8 space-y-8">
                    {/* Skeleton Ticker */}
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />

                    {/* Skeleton Hero */}
                    <SkeletonHero />

                    {/* Skeleton Grid */}
                    <div className="mt-8">
                        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6 animate-pulse" />
                        <SkeletonGrid count={6} />
                    </div>
                </div>
            </Layout>
        );
    }

    const featuredArticle = articles[0];
    const latestNews = articles.slice(1);

    return (
        <Layout>
            <SEO title={t('nav.home')} />
            <Ticker items={breakingNews} />
            {featuredArticle && <HeroSection article={featuredArticle} />}

            <div className="container px-4 pb-12">
                <h2 className="text-2xl font-bold border-r-4 border-primary pr-4 mb-8 mt-8 text-secondary dark:text-white">
                    {t('common.latest_news')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10 rtl:divide-x-reverse">
                    {latestNews.map(article => (
                        <div key={article.id} className="pl-4 first:pl-0">
                            <NewsCard article={article} />
                        </div>
                    ))}
                </div>

                {/* Opinion Section */}
                <div className="mt-16 pt-12 border-t-4 border-black dark:border-white">
                    <h2 className="text-3xl font-serif font-black mb-8 text-center italic">{t('home.opinion_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-paper dark:bg-white/5 p-6 border border-black/5">
                                <div className="w-12 h-12 bg-black/10 rounded-full mx-auto mb-4" />
                                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-primary-accent mb-2">{t('home.columnist_name')}</h4>
                                <h3 className="font-serif text-xl font-bold leading-tight mb-3 hover:underline">The complex reality of global economic shifts requires new thinking.</h3>
                                <p className="text-sm font-serif text-muted italic line-clamp-3">
                                    "In a world where digital borders are fading, we must reassess our traditional understanding of sovereignty..."
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
