import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { mockArticles, Article } from '../data/mockData';
import { Calendar, User, Clock, Share2, ArrowRight, ArrowLeft, ExternalLink, Newspaper, TrendingUp, Globe } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useTranslation } from 'react-i18next';
import NewsCard from '../components/news/NewsCard';

const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isRtl = i18n.language === 'ar';

    const stateArticle = (location.state as { article?: Article })?.article;
    const article = stateArticle || mockArticles.find(a => a.id === id);

    if (!article) {
        return (
            <Layout>
                <SEO title={t('common.not_found')} />
                <div className="container px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('common.not_found')}</h2>
                    <Link to="/" className="text-primary mt-4 inline-block hover:underline">
                        {isRtl ? '← العودة للرئيسية' : '← Back to Home'}
                    </Link>
                </div>
            </Layout>
        );
    }

    const isExternalArticle = article.sourceUrl && article.sourceUrl !== '#' && article.sourceUrl.startsWith('http');

    // Generate expanded summary based on excerpt
    const generateExpandedSummary = (excerpt: string): string[] => {
        const basePoints = [
            excerpt,
        ];

        // Add category-specific context using translations
        const categoryKey = article.category.toLowerCase() as 'politics' | 'economy' | 'technology' | 'sports' | 'culture';
        // Fallback to technology if key doesn't exist (simplification)
        const contextPoints = t(`article.context.${categoryKey}`, { returnObjects: true }) as string[];

        // Check if contextPoints is actually an array (it should be if key exists)
        if (Array.isArray(contextPoints)) {
            return [...basePoints, ...contextPoints];
        }

        return basePoints;
    };

    const summaryPoints = generateExpandedSummary(article.excerpt);

    const relatedArticles = mockArticles
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 4);

    return (
        <Layout>
            <SEO
                title={article.title}
                description={article.excerpt}
                image={article.imageUrl}
                type="article"
                keywords={`${article.category}, ${article.source || 'Global Pulse'}, أخبار, news`}
                schemaType="article"
                articleData={{
                    publishedAt: article.date,
                    author: article.author,
                    modifiedAt: article.date
                }}
            />
            <article className={`container px-4 pb-16 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`}>
                {/* Article Header */}
                <header className={`my-8 md:mb-12 max-w-4xl mx-auto ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="flex items-center gap-3 flex-wrap mb-6">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 px-3 py-1 rounded-full">
                            {t(`nav.${article.category.toLowerCase()}`, { defaultValue: article.category })}
                        </span>
                        {article.source && (
                            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                <Globe size={12} />
                                {article.source}
                            </span>
                        )}
                        {article.isBreaking && (
                            <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                                {t('common.breaking')}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-secondary dark:text-white font-serif">
                        {article.title}
                    </h1>

                    <div className={`flex flex-wrap ${isRtl ? 'justify-end' : 'justify-start'} gap-6 mt-6 text-slate-500 text-sm border-b border-border pb-6`}>
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{t('common.min_read', { count: 3 })}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="rounded-xl overflow-hidden max-h-[500px] mb-12 shadow-2xl relative group max-w-4xl mx-auto">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Article Summary & Content */}
                <div className="max-w-3xl mx-auto">

                    {/* ENHANCED Executive Summary */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-10 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary/20 p-3 rounded-xl">
                                <Newspaper className="text-primary" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-primary">
                                    {t('article.summary_title')}
                                </h2>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">
                                    {t('article.summary_subtitle')}
                                </p>
                            </div>
                        </div>

                        {/* Main Summary */}
                        <div className="space-y-4">
                            {summaryPoints.map((point, index) => (
                                <div key={index} className={`flex gap-3 ${index === 0 ? 'text-xl md:text-2xl font-serif leading-relaxed text-slate-800 dark:text-slate-200' : 'text-base text-slate-600 dark:text-slate-400'}`}>
                                    {index > 0 && (
                                        <span className="text-primary mt-1">
                                            <TrendingUp size={16} />
                                        </span>
                                    )}
                                    <p>{point}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quick Facts */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{t(`nav.${article.category.toLowerCase()}`, { defaultValue: article.category })}</p>
                                <p className="text-xs text-slate-500 uppercase">{t('article.category_label')}</p>
                            </div>
                            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{article.source || 'Global Pulse'}</p>
                                <p className="text-xs text-slate-500 uppercase">{t('article.source_label')}</p>
                            </div>
                            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg col-span-2 md:col-span-1">
                                <p className="text-2xl font-bold text-primary">{article.date}</p>
                                <p className="text-xs text-slate-500 uppercase">{t('article.date_label')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Full Article Content (if available) */}
                    {article.content && (
                        <div className="prose dark:prose-invert prose-xl font-serif mb-10">
                            <div
                                className="text-slate-700 dark:text-slate-300 space-y-6 article-body text-lg leading-loose"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    )}

                    {/* Read Full Article Button (for external sources) */}
                    {isExternalArticle && (
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl p-6 md:p-8 text-center mb-10">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/20 p-4 rounded-full">
                                    <ExternalLink className="text-primary" size={32} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {t('article.external_link_title')}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {isRtl
                                    ? `اقرأ المقال الكامل من المصدر الأصلي: ${article.source}`
                                    : `Read the complete article from the original source: ${article.source}`
                                }
                            </p>
                            <a
                                href={article.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold px-10 py-5 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <Newspaper size={22} />
                                {t('article.read_full')}
                                {!isRtl && <ArrowRight size={22} />}
                                {isRtl && <ArrowLeft size={22} />}
                            </a>
                        </div>
                    )}

                    {/* Share Actions */}
                    <div className={`mt-10 pt-8 border-t border-border flex flex-wrap items-center gap-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-sm font-bold uppercase tracking-widest text-muted">{t('common.share')}:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const url = article.sourceUrl || window.location.href;
                                    navigator.clipboard.writeText(url);
                                    alert(t('article.copied'));
                                }}
                                className="p-3 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                    <section className="mt-24 border-t border-border pt-16">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-serif font-black uppercase tracking-tighter">
                                {t('common.related_articles')}
                            </h2>
                            <Link to={`/category/${article.category.toLowerCase()}`} className="group flex items-center gap-2 text-primary-accent font-bold text-sm uppercase tracking-widest hover:underline">
                                {t('common.view_all')}
                                {isRtl ? <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedArticles.map(relatedArticle => (
                                <NewsCard key={relatedArticle.id} article={relatedArticle} />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </Layout>
    );
};

export default ArticlePage;
