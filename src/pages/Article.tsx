import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Article as ArticleType, mockArticles } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Share2, Clock, Calendar, User, Newspaper, Tag, Copy, Check, Volume2, Type, Image as ImageIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import AudioPlayer from '../components/article/AudioPlayer';
import ShareCard from '../components/article/ShareCard';

const Article: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const [article, setArticle] = useState<ArticleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Feature States
    const [showShareCard, setShowShareCard] = useState(false);
    const [fontSize, setFontSize] = useState(18); // Default 18px (lg)

    const isRtl = i18n.dir() === 'rtl';

    useEffect(() => {
        setLoading(true);
        // Simulate fetch delay for smoothness
        setTimeout(() => {
            const foundArticle = mockArticles.find(a => a.id === id) || mockArticles[0];
            setArticle(foundArticle);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen pt-32 container max-w-4xl mx-auto px-4">
                    <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-8" />
                    <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mb-8" />
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                </div>
            </Layout>
        );
    }

    if (!article) return null;

    // Generate expanded summary logic reusing translations
    const getSummary = () => {
        const categoryKey = article.category.toLowerCase() as 'politics' | 'economy' | 'technology' | 'sports' | 'culture';
        const contextPoints = t(`article.context.${categoryKey}`, { returnObjects: true });
        const points = Array.isArray(contextPoints) ? contextPoints : [];
        return [article.excerpt, ...points];
    };

    const summaryPoints = getSummary();

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Layout>
            <SEO
                title={article.title}
                description={article.excerpt}
                image={article.imageUrl}
                schemaType="article"
                articleData={{ publishedAt: new Date().toISOString(), author: article.author }}
            />

            <article className="min-h-screen pb-20 relative overflow-hidden">
                {/* Immersive Background Blur */}
                <div className="fixed top-0 left-0 w-full h-[60vh] -z-10">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-20 blur-2xl dark:opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
                </div>

                <div className="container max-w-4xl mx-auto px-4 pt-32">
                    {/* Header Badge */}
                    <div className="flex justify-center mb-8 animate-float">
                        <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                            <Tag size={12} />
                            {t(`nav.${article.category.toLowerCase()}`, { defaultValue: article.category })}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-center mb-8 leading-tight text-glow">
                        {article.title}
                    </h1>

                    {/* Meta Data Pill */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted mb-12">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 bg-white/50 dark:bg-slate-900/50">
                            <User size={14} className="text-indigo-500" />
                            <span>{article.author}</span>
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 bg-white/50 dark:bg-slate-900/50">
                            <Calendar size={14} className="text-indigo-500" />
                            <span>{article.date}</span>
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 bg-white/50 dark:bg-slate-900/50">
                            <Clock size={14} className="text-indigo-500" />
                            <span>3 min read</span>
                        </div>
                    </div>

                    {/* Main Image 3D */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16 group perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105 transform group-hover:rotate-x-1"
                        />
                        {article.source && (
                            <div className="absolute bottom-6 right-6 z-20 glass-panel px-4 py-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    Source: {article.source}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Container */}
                    <div className="glass-panel p-8 md:p-12 relative">
                        {/* AI Summary Box */}
                        <div className="mb-12 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-6 border-l-4 border-indigo-500">
                            <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                                    <Newspaper size={18} />
                                </div>
                                {t('article.summary_title', 'Smart Summary')}
                            </h2>
                            <ul className="space-y-3">
                                {summaryPoints.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-lg">
                                        <span className="text-indigo-500 font-bold">•</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Body Text */}
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none font-sans leading-loose text-slate-800 dark:text-slate-300 transition-all duration-300"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-500 first-letter:float-left first-letter:mr-3">
                                {article.excerpt}
                            </p>
                            <p>
                                {t('article.body_placeholder', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')}
                            </p>
                            <p>
                                {t('article.body_placeholder_2', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider group"
                                >
                                    {copied ? <Check size={18} /> : <Share2 size={18} />}
                                    {copied ? t('article.copied', 'Copied!') : t('article.share', 'Share Article')}
                                </button>
                            </div>

                            <a
                                href={article.sourceUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-3d flex items-center gap-3 px-8 py-4 text-lg w-full md:w-auto justify-center"
                            >
                                {t('article.read_full', 'Read Full Story')}
                                {isRtl ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                            </a>
                        </div>
                    </div>
                </div>
            </article>

            {/* Sticky Audio Player */}
            <AudioPlayer
                text={article.excerpt + " " + t('article.body_placeholder')}
                title={article.title}
                lang={i18n.language}
            />

            {/* Viral Share Modal */}
            {showShareCard && (
                <ShareCard
                    title={article.title}
                    category={article.category}
                    author={article.author}
                    excerpt={article.excerpt}
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </Layout>
    );
};

export default Article;
