import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import NewsCard from '../components/news/NewsCard';
import { fetchNewsByCategory } from '../services/newsFeedService';
import { Article } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (category) {
                // Fetch REAL news from RSS feeds for this category
                const realNews = await fetchNewsByCategory(category);
                setArticles(realNews);
            }
            setLoading(false);
        };

        loadData();
    }, [category]);

    const displayTitle = t(`nav.${category?.toLowerCase() || 'home'}`);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen bg-background">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO title={displayTitle} />
            <div className="container px-4 pb-12">
                <div className="my-8 py-12 text-center bg-slate-50 dark:bg-slate-900 rounded-xl transition-colors">
                    <h1 className="text-4xl font-bold text-secondary dark:text-primary mb-2">
                        {displayTitle}
                    </h1>
                    <p className="text-slate-500">
                        {i18n.language === 'ar'
                            ? `تحديثات مباشرة من قسم ${displayTitle} - مدعوم من وكالات الأنباء العالمية`
                            : `Live updates from ${category} - Powered by global news agencies`}
                    </p>
                </div>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10 rtl:divide-x-reverse">
                        {articles.map((article, index) => (
                            <div key={`${article.id}-${index}`} className="pl-4 first:pl-0">
                                <NewsCard article={article} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500">
                        <p>Loading live news from global sources...</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CategoryPage;
